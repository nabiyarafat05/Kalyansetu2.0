import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowUpRight, IndianRupee, FileCheck, Landmark, Building2 } from 'lucide-react';
import { Application, ApplicationStage } from '../types';
import { useApp } from '../context/AppContext';

export const DisbursementTimeline: React.FC<{ application: Application }> = ({ application }) => {
  const { t, language } = useApp();

  const stages: Array<{ key: ApplicationStage; title: string; titleHi: string; icon: React.ElementType }> = [
    { key: 'APPLICATION_SUBMITTED', title: 'Submitted', titleHi: 'आवेदन प्रस्तुत', icon: FileCheck },
    { key: 'DOCUMENTS_VERIFIED', title: 'DigiLocker Verified', titleHi: 'दस्तावेज सत्यापित', icon: CheckCircle2 },
    { key: 'INSTITUTE_NODAL_VERIFIED', title: 'Institute Approved', titleHi: 'संस्थान स्वीकृत', icon: Building2 },
    { key: 'SANCTION_ORDER_GENERATED', title: 'Sanction Issued', titleHi: 'स्वीकृति जारी', icon: Landmark },
    { key: 'PFMS_PAYMENT_INITIATED', title: 'PFMS Pushed', titleHi: 'PFMS प्रेषित', icon: ArrowUpRight },
    { key: 'CREDITED_TO_BENEFICIARY', title: 'DBT Credited', titleHi: 'खाते में जमा', icon: IndianRupee },
  ];

  const stageOrder: ApplicationStage[] = [
    'APPLICATION_SUBMITTED',
    'DOCUMENTS_VERIFIED',
    'INSTITUTE_NODAL_VERIFIED',
    'SANCTION_ORDER_GENERATED',
    'PFMS_PAYMENT_INITIATED',
    'CREDITED_TO_BENEFICIARY',
  ];

  const currentIdx = stageOrder.indexOf(application.currentStage as ApplicationStage);

  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 my-3 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              {t('pfmsTimelineTitle')}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {application.applicationNumber}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 tracking-tight">
            {language === 'hi' && application.schemeNameHi ? application.schemeNameHi : application.schemeName}
          </h4>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            {language === 'hi' ? 'अनुदान राशि' : 'Direct DBT Grant'}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-emerald-800 font-mono tabular-nums tracking-tight">
            {application.grantAmount}
          </span>
        </div>
      </div>

      {/* Horizontal / Flow Progress Steps */}
      <div className="py-6 overflow-x-auto scrollbar-none">
        <div className="min-w-[580px] flex items-center justify-between relative px-4">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full -z-0" />
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-500 rounded-full transition-all duration-500 -z-0"
            style={{
              width: `${Math.max(0, Math.min(100, (currentIdx / (stages.length - 1)) * 100))}%`,
            }}
          />

          {stages.map((stg, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = stg.icon;

            return (
              <div key={stg.key} className="flex flex-col items-center text-center relative z-10 w-24">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white ring-4 ring-amber-100 shadow-md shadow-amber-500/20 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] mt-2.5 leading-snug font-medium ${
                    isCurrent ? 'text-amber-900 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {language === 'hi' ? stg.titleHi : stg.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PFMS Meta Callout Box */}
      {application.pfmsDetails && (
        <div className="mt-2 p-4 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              {t('sanctionNumber')}
            </span>
            <span className="font-mono font-semibold text-slate-800 text-xs truncate block mt-0.5">
              {application.pfmsDetails.sanctionOrderNo}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              {t('pfmsTxnId')}
            </span>
            <span className="font-mono font-semibold text-slate-800 text-xs truncate block mt-0.5">
              {application.pfmsDetails.pfmsTxnId}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              {t('utrNumber')}
            </span>
            <span className="font-mono font-bold text-emerald-700 text-xs truncate block mt-0.5">
              {application.pfmsDetails.utrNumber || 'Processing APBS'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              {t('accountNumber')}
            </span>
            <span className="font-mono font-semibold text-slate-800 text-xs block mt-0.5">
              SBI {application.pfmsDetails.accountMasked}
            </span>
          </div>
        </div>
      )}

      {/* Action / Explanation note */}
      {application.notes && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{application.notes}</span>
        </div>
      )}
    </div>
  );
};
