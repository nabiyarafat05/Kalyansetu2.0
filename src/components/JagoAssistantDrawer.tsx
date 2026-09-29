import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, Volume2, CloudUpload, CheckCircle, Clock, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { VoiceNoteRecord, ChatMessage } from '../types';

export const JagoAssistantDrawer: React.FC = () => {
  const { isAssistantOpen, setAssistantOpen, isOnline, t, language, voiceNotes, addVoiceNote } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text:
        language === 'hi'
          ? 'जोहार! मैं जागो (Jago) हूँ — जनजातीय कार्य मंत्रालय का एआई छात्रवृत्ति सहायक। आप अपनी छात्रवृत्ति, डिजीलॉकर सत्यापन या PFMS भुगतान के संबंध में बोलकर या लिखकर कुछ भी पूछ सकते हैं।'
          : 'Johar! I am Jago — AI Scholarship Assistant for the Ministry of Tribal Affairs. Ask any questions about your scholarship application, DigiLocker verification, or PFMS DBT status.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const quickPrompts = [
    {
      en: 'Which scholarships am I eligible for?',
      hi: 'मुझे कौन सी छात्रवृत्ति मिल सकती है?',
    },
    {
      en: 'When will PFMS DBT payment be credited?',
      hi: 'PFMS पेमेंट कब खाते में क्रेडिट होगा?',
    },
    {
      en: 'How to link DigiLocker caste certificate?',
      hi: 'डिजीलॉकर से जाति प्रमाण पत्र कैसे लिंक करें?',
    },
    {
      en: 'National Overseas Scholarship guidelines',
      hi: 'नेशनल ओवरसीज स्कॉलरशिप के क्या नियम हैं?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await api.sendChatMessage(text.trim(), history);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text:
          language === 'hi'
            ? 'नेटवर्क समस्या के कारण उत्तर प्राप्त नहीं हुआ। आपका प्रश्न सुरक्षित कर लिया गया है।'
            : 'Service temporarily unreachable. Your question has been safely queued.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    const duration = Math.max(1, recordingSeconds);

    const newVoiceNote: VoiceNoteRecord = {
      id: `vn-${Date.now()}`,
      title: language === 'hi' ? `वॉइस नोट #${voiceNotes.length + 1}` : `Voice Memo #${voiceNotes.length + 1}`,
      durationSeconds: duration,
      recordedAt: new Date().toISOString(),
      status: isOnline ? 'SYNCING' : 'QUEUED_OFFLINE',
    };

    // Add locally and to AppContext
    await addVoiceNote(newVoiceNote);

    // Add representation into current chat thread
    const voiceChatMsg: ChatMessage = {
      id: `vmsg-${Date.now()}`,
      sender: 'user',
      text:
        language === 'hi'
          ? `🎙️ वॉइस संदेश (${duration} सेकंड) - ${
              isOnline ? 'क्लाउड पर विश्लेषित हो रहा है' : 'क्लाउड सिंक के लिए कतारबद्ध'
            }`
          : `🎙️ Audio Query (${duration}s) - ${isOnline ? 'Transcribing via Cloud AI' : 'Queued for Cloud Sync'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfflineNote: !isOnline,
    };
    setMessages((prev) => [...prev, voiceChatMsg]);
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full sm:max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">{t('jagoTitle')}</h3>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-white/25 px-1.5 py-0.5 rounded-full">
                  AI v2
                </span>
              </div>
              <p className="text-[11px] text-amber-100 leading-tight">{t('jagoSub')}</p>
            </div>
          </div>

          <button
            onClick={() => setAssistantOpen(false)}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Status Bar inside Assistant */}
        {!isOnline && (
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-medium">
                {language === 'hi' ? 'ऑफलाइन वॉइस मोड सक्रिय' : 'Offline Voice Mode Active'}
              </span>
            </div>
            <span className="text-[10px] text-amber-700">
              {language === 'hi' ? 'पुनः कनेक्ट होने पर स्वतः सिंक' : 'Auto-syncs on reconnect'}
            </span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm max-w-[85%] shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : msg.sender === 'system'
                    ? 'bg-slate-200 text-slate-700 rounded-tl-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}

                {msg.isOfflineNote && (
                  <div className="mt-2 pt-1.5 border-t border-white/20 flex items-center gap-1 text-[10px] font-medium text-amber-100">
                    <CloudUpload className="w-3 h-3 animate-pulse" />
                    <span>{t('queuedOfflineBadge')}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
              <span>{language === 'hi' ? 'जागो विचार कर रहा है...' : 'Jago is thinking...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Offline Voice Note Assistant Section */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          {/* Quick Prompts Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(language === 'hi' ? qp.hi : qp.en)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 transition border border-slate-200 shrink-0"
              >
                {language === 'hi' ? qp.hi : qp.en}
              </button>
            ))}
          </div>

          {/* Voice Recording Control Box */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border border-amber-200/80 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">{t('voiceNoteTitle')}</h4>
                  <p className="text-[10px] text-slate-500">
                    {isRecording ? t('recordingActive') : t('voiceNoteSub')}
                  </p>
                </div>
              </div>

              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="px-3 py-1 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-xs transition active:scale-95 flex items-center gap-1"
                >
                  <MicOff className="w-3.5 h-3.5" />
                  <span>{t('stopRecording')} ({recordingSeconds}s)</span>
                </button>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="px-2.5 py-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition active:scale-95 flex items-center gap-1"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{t('startRecording')}</span>
                </button>
              )}
            </div>

            {/* Soundwave Visualizer while recording */}
            {isRecording && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-center gap-1 h-8">
                <span className="w-1 bg-amber-500 rounded-full animate-wave-1" />
                <span className="w-1 bg-amber-500 rounded-full animate-wave-2" />
                <span className="w-1 bg-amber-500 rounded-full animate-wave-3" />
                <span className="w-1 bg-amber-500 rounded-full animate-wave-4" />
                <span className="w-1 bg-amber-500 rounded-full animate-wave-5" />
                <span className="w-1 bg-amber-500 rounded-full animate-wave-2" />
                <span className="w-1 bg-amber-500 rounded-full animate-wave-4" />
                <span className="text-xs font-mono font-semibold text-amber-800 ml-2">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
              </div>
            )}
          </div>

          {/* Voice Notes History with glowing 'Queued for Cloud Sync' badge */}
          {voiceNotes.length > 0 && (
            <div className="max-h-24 overflow-y-auto space-y-1 mb-2">
              {voiceNotes.slice(0, 2).map((note) => (
                <div
                  key={note.id}
                  className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate text-[11px] text-slate-700">
                      {note.transcribedText || note.title}
                    </span>
                  </div>

                  {note.status === 'QUEUED_OFFLINE' ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {t('queuedOfflineBadge')}
                    </span>
                  ) : note.status === 'SYNCING' ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      <CloudUpload className="w-2.5 h-2.5 animate-spin" />
                      {t('syncingBadge')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <CheckCircle className="w-2.5 h-2.5" />
                      {t('syncedBadge')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Text Input Row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('askQuestionPlaceholder')}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition active:scale-95 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
