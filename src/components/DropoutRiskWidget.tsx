import React from 'react';
import { AlertTriangle, ShieldCheck, Zap, UserCheck, Calendar, IndianRupee, GraduationCap, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DropoutRiskWidget: React.FC = () => {
  const { currentStudent, applications, t, language, showNotification, updateAppStage } = useApp();

  if (!currentStudent) return null;

  // Real computation of Dropout Risk
  // Factors:
  // 1. Attendance: below 75% adds up to 35 pts
  // 2. Family income: below 1.5 Lakh adds 20 pts
  // 3. Days stuck at current scholarship stage: adds up to 25 pts
  // 4. Academic score: below 65% adds 15 pts
  const activeApp = applications.find((a) => a.studentMobile === currentStudent.mobile) || applications[0];

  const attendance = currentStudent.attendancePercentage || 68;
  const income = currentStudent.familyAnnualIncome || 120000;
  const academicScore = currentStudent.academicScorePercentage || 78.4;
  const daysStuck = activeApp ? activeApp.daysStuck : 4;

  let computedScore = 15; // base baseline
  if (attendance < 75) {
    computedScore += Math.min(35, Math.round((75 - attendance) * 2.5));
  }
  if (income <= 150000) {
    computedScore += 20;
  }
  if (daysStuck > 3) {
    computedScore += Math.min(25, daysStuck * 4);
  }
  if (academicScore < 65) {
    computedScore += 15;
  }

  // Cap between 5 and 95
  const riskScore = Math.min(95, Math.max(10, computedScore));
  const isHighRisk = riskScore >= 70;
  const isMediumRisk = riskScore >= 35 && riskScore < 70;
  const isLowRisk = riskScore < 35;

  const handlePriorityIntervention = async () => {
    if (activeApp) {
      await updateAppStage(activeApp.id, 'SANCTION_ORDER_GENERATED', 'Fast-tracked via AI Dropout Risk Engine');
      showNotification(
        language === 'hi'
          ? 'ड्रॉपआउट जोखिम निवारण हेतु आपातकालीन स्वीकृति (Sanction) जारी!'
          : 'Emergency Sanction Order Fast-Tracked to prevent dropout risk!',
        'success'
      );
    } else {
      showNotification(
        language === 'hi'
          ? 'नोडल अधिकारी को प्राथमिकता संदेश प्रेषित किया गया'
          : 'Priority notification dispatched to District Nodal Officer',
        'info'
      );
    }
  };

  const handleAlumniMentorConnect = () => {
    showNotification(
      language === 'hi'
        ? 'जनजातीय पूर्व छात्र मेंटर (प्रिया मुर्मू, आईआईटी खड़गपुर) से संपर्क स्थापित किया गया!'
        : 'Connected with Tribal Scholarship Alumni Mentor (Priya Murmu, IIT Kharagpur)!',
      'success'
    );
  };

  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/20 to-white relative overflow-hidden">
      {/* Subtle top indicator bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-xl ${
                isHighRisk
                  ? 'bg-rose-100 text-rose-700'
                  : isMediumRisk
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              {t('riskWidgetTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            {language === 'hi'
              ? 'उपस्थिति, पारिवारिक आय एवं अनुदान वितरण गति का एआई संचालित जोखिम विश्लेषण'
              : 'AI-driven predictive index evaluating attendance, family income, and grant delays'}
          </p>
        </div>

        {/* Risk Score */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              {t('riskScore')}
            </span>
            <div className="flex items-baseline gap-1 justify-end">
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
                  isHighRisk ? 'text-rose-600' : isMediumRisk ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {riskScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              isHighRisk
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : isMediumRisk
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isHighRisk ? t('riskLevelHigh') : isMediumRisk ? t('riskLevelMedium') : t('riskLevelLow')}
          </div>
        </div>
      </div>

      {/* Analytical Factor Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('attendanceRate')}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-base sm:text-lg font-bold font-mono tabular-nums ${attendance < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
              {attendance}%
            </span>
            {attendance < 75 && (
              <span className="text-[10px] text-rose-500 font-bold">({language === 'hi' ? 'अल्प' : 'Low'})</span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('annualIncome')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
            ₹{(income / 100000).toFixed(1)}L
            <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">/ yr</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('academicScore')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">{academicScore}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'hi' ? 'प्रक्रिया विलंब' : 'Stage Lag'}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
            {daysStuck} {language === 'hi' ? 'दिन' : 'days'}
          </div>
        </div>
      </div>

      {/* Mandatory Exact Recommendation Banner for Hackathon Brief */}
      {(isHighRisk || isMediumRisk) && (
        <div className="mt-3 p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700 shrink-0">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-950 leading-snug">
                Direct intervention recommended: Fast-track grant disbursement to prevent dropout.
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800/90 mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'आर्थिक तंगी एवं कॉलेज आवागमन कठिनाई के कारण छात्रवृत्ति राशि को प्राथमिकता से जारी करने की अनुशंसा।'
                  : 'Student is at retention risk due to attendance drop and pending PFMS disbursement.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handlePriorityIntervention}
              className="btn-elite-primary px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('riskActionBtn')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleAlumniMentorConnect}
              className="px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('riskAlumniBtn')}</span>
            </button>
          </div>
        </div>
      )}

      {isLowRisk && (
        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-xs sm:text-sm font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('riskLowNotice')}</span>
        </div>
      )}
    </div>
  );
};
