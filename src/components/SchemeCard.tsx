import React, { useState } from 'react';
import { IndianRupee, Calendar, CheckCircle2, ChevronRight, Award, FileText, Sparkles } from 'lucide-react';
import { Scheme } from '../types';
import { useApp } from '../context/AppContext';

export const SchemeCard: React.FC<{ scheme: Scheme }> = ({ scheme }) => {
  const { openWizardWithScheme, applications, currentStudent, t, language } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  const isApplied = applications.some((a) => a.schemeId === scheme.id);

  return (
    <div className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between group bg-white border border-slate-200/80">
      <div>
        {/* Editorial Subtitle / Kicker with zero-pill discipline */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-800 font-bold uppercase tracking-wider text-[11px]">
              {language === 'hi' && scheme.categoryLabelHi ? scheme.categoryLabelHi : scheme.categoryLabel}
            </span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="font-mono text-slate-400 text-[11px] font-semibold">{scheme.code}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' && scheme.deadlineHi ? scheme.deadlineHi : scheme.deadline}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-amber-700 transition-colors leading-snug tracking-tight">
          {language === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name}
        </h3>

        {/* Stately Grant Amount Display */}
        <div className="mt-3.5 p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/60 flex items-center justify-between shadow-2xs">
          <span className="text-xs font-semibold text-amber-900/90">
            {language === 'hi' ? 'वार्षिक छात्रवृत्ति अनुदान' : 'Annual Scholarship Grant'}
          </span>
          <span className="font-extrabold text-base sm:text-lg text-amber-900 font-mono tabular-nums tracking-tight">
            {language === 'hi' && scheme.amountHi ? scheme.amountHi : scheme.amount}
          </span>
        </div>

        {/* Clean Description */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {language === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description}
        </p>

        {/* Proactive Match Reason (if applicable) */}
        {scheme.autoMatchReason && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-2 text-xs text-emerald-950">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug font-medium">
              {language === 'hi' && scheme.autoMatchReasonHi ? scheme.autoMatchReasonHi : scheme.autoMatchReason}
            </span>
          </div>
        )}

        {/* Expanded Details Drawer */}
        {showDetails && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3.5 text-xs animate-in fade-in-50">
            <div>
              <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wider text-[11px]">
                {t('keyBenefits')}
              </span>
              <ul className="space-y-1.5 text-slate-600 pl-0.5">
                {(language === 'hi' && scheme.benefitsHi ? scheme.benefitsHi : scheme.benefits).map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wider text-[11px]">
                {t('requiredDocs')}
              </span>
              <div className="text-slate-600 leading-relaxed font-medium">
                {(language === 'hi' && scheme.documentsRequiredHi ? scheme.documentsRequiredHi : scheme.documentsRequired).join(' · ')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {showDetails ? (language === 'hi' ? 'संक्षिप्त विवरण' : 'Hide Details') : t('viewDetails')}
        </button>

        {isApplied ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('alreadyApplied')}
          </span>
        ) : (
          <button
            onClick={() => openWizardWithScheme(scheme)}
            className="btn-elite-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl cursor-pointer"
          >
            <span>{t('applyNow')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
