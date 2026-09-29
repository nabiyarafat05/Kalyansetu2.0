import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Landmark, User, ArrowRight, ArrowLeft, RefreshCw, FileText, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Scheme } from '../types';

export const ApplicationWizardModal: React.FC = () => {
  const {
    isWizardOpen,
    setWizardOpen,
    selectedSchemeForWizard,
    currentStudent,
    digiLockerDocs,
    submitNewApplication,
    isOnline,
    t,
    language,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppNum, setSubmittedAppNum] = useState<string | null>(null);

  // Form fields (pre-filled from student profile)
  const [studentName, setStudentName] = useState(currentStudent?.name || 'Ramesh Soren');
  const [mobile, setMobile] = useState(currentStudent?.mobile || '9876543210');
  const [subTribe, setSubTribe] = useState(currentStudent?.subTribe || 'Santhal');
  const [institution, setInstitution] = useState(currentStudent?.institution || 'Sido Kanhu Murmu University, Dumka');
  const [course, setCourse] = useState(currentStudent?.course || 'B.Sc. Computer Science (2nd Year)');
  const [annualIncome, setAnnualIncome] = useState(String(currentStudent?.familyAnnualIncome || 120000));

  if (!isWizardOpen) return null;

  const scheme: Scheme = selectedSchemeForWizard || {
    id: 'scheme-post-matric',
    code: 'PMS-ST-2026',
    name: 'Post-Matric Scholarship for ST Students (PMS-ST)',
    nameHi: 'अनुसूचित जनजाति के विद्यार्थियों हेतु पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    category: 'post-matric',
    categoryLabel: 'Post-Matric',
    categoryLabelHi: 'पोस्ट-मैट्रिक',
    ministry: 'Ministry of Tribal Affairs',
    ministryHi: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    amount: '₹48,000 to ₹1,20,000 / year',
    amountHi: '₹48,000 से ₹1,20,000 / वर्ष',
    numericAmount: 75000,
    deadline: '31 October 2026',
    deadlineHi: '31 अक्टूबर 2026',
    description: '',
    descriptionHi: '',
    eligibilityCriteria: {
      maxIncome: 250000,
      targetTribes: ['ST', 'PVTG'],
      educationLevel: '',
      educationLevelHi: '',
    },
    benefits: [],
    benefitsHi: [],
    documentsRequired: [],
    documentsRequiredHi: [],
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const app = await submitNewApplication({
        studentId: currentStudent?.id || 'stu-santhal-01',
        studentName,
        studentMobile: mobile,
        schemeId: scheme.id,
        schemeName: scheme.name,
        schemeNameHi: scheme.nameHi,
        grantAmount: scheme.amount,
        verifiedDocs: {
          aadhaarRef: 'UIDAI-XXXX-XXXX-4912',
          casteCertRef: 'JK/ST/2024/991204',
          incomeCertRef: 'REV/INC/2025/1102',
          marksheetRef: 'CBSE/2024/774190',
        },
      });
      setSubmittedAppNum(app.applicationNumber);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setWizardOpen(false);
    setCurrentStep(1);
    setSubmittedAppNum(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Wizard Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-200">
                {t('wizardTitle')}
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                Step {currentStep} of 4
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-white mt-0.5 leading-snug">
              {language === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name}
            </h3>
          </div>

          <button onClick={handleClose} className="p-1.5 text-white/80 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 shrink-0">
          <div
            className={`py-2 text-center border-r border-slate-200 ${
              currentStep >= 1 ? 'text-amber-700 font-bold bg-amber-50/60' : ''
            }`}
          >
            {t('stepPersonal')}
          </div>
          <div
            className={`py-2 text-center border-r border-slate-200 ${
              currentStep >= 2 ? 'text-amber-700 font-bold bg-amber-50/60' : ''
            }`}
          >
            {t('stepDigiLocker')}
          </div>
          <div
            className={`py-2 text-center border-r border-slate-200 ${
              currentStep >= 3 ? 'text-amber-700 font-bold bg-amber-50/60' : ''
            }`}
          >
            {t('stepBank')}
          </div>
          <div
            className={`py-2 text-center ${currentStep >= 4 ? 'text-amber-700 font-bold bg-amber-50/60' : ''}`}
          >
            {t('stepReview')}
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {submittedAppNum ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">{t('submissionSuccess')}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'आपका आवेदन जनजातीय कार्य मंत्रालय के सत्यापन पोर्टल पर सफलतापूर्वक दर्ज हो गया है।'
                    : 'Your application has been registered with Ministry of Tribal Affairs.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto">
                <span className="text-xs text-slate-400 block">{t('applicationId')}</span>
                <span className="font-mono text-base font-extrabold text-amber-700 mt-0.5 block">
                  {submittedAppNum}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isOnline
                    ? language === 'hi'
                      ? 'डीबीटी ट्रैकर सक्रिय है'
                      : 'Live DBT Tracker Active'
                    : t('offlineDraftSaved')}
                </span>
              </div>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition shadow-xs"
              >
                {t('close')}
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    {language === 'hi'
                      ? 'आपके ई-केवाईसी विवरण पूर्व-भरे गए हैं। कृपया सटीकता की पुष्टि करें।'
                      : 'Your personal particulars are pre-filled from UIDAI e-KYC.'}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (Aadhaar Linked)</label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tribe / Sub-Tribe Category</label>
                      <input
                        type="text"
                        value={subTribe}
                        onChange={(e) => setSubTribe(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Family Income (₹)</label>
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution / University</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Course & Academic Year</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: DigiLocker Docs */}
              {currentStep === 2 && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {language === 'hi'
                        ? 'डिजीलॉकर पार्टनर सैंडबॉक्स द्वारा 4 आधिकारिक प्रमाण पत्र सत्यापित हैं।'
                        : '4 digital certificates have been auto-verified via DigiLocker Partner API.'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-semibold text-slate-800 block">UIDAI Aadhaar Card (e-KYC)</span>
                          <span className="text-[11px] text-slate-500">Ref: UIDAI-XXXX-XXXX-4912</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md">
                        VERIFIED
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-semibold text-slate-800 block">ST Caste Certificate (Santhal)</span>
                          <span className="text-[11px] text-slate-500">Ref: JK/ST/2024/991204</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md">
                        VERIFIED
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-semibold text-slate-800 block">Annual Income Certificate</span>
                          <span className="text-[11px] text-slate-500">Ref: REV/INC/2025/1102 (₹1,20,000)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md">
                        VERIFIED
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-semibold text-slate-800 block">Senior Secondary Marksheet</span>
                          <span className="text-[11px] text-slate-500">Ref: CBSE/2024/774190 (78.4%)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Bank Account */}
              {currentStep === 3 && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {language === 'hi'
                        ? 'छात्रवृत्ति अनुदान का अंतरण केवल आधार-सीडेड बैंक खाते में डीबीटी द्वारा किया जाएगा।'
                        : 'Scholarship grants are disbursed exclusively via NPCI Aadhaar Payment Bridge.'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Beneficiary Name</span>
                      <span className="font-semibold text-slate-900">{studentName} (Matches Aadhaar)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Bank Name</span>
                      <span className="font-semibold text-slate-900">State Bank of India</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Masked Account</span>
                      <span className="font-mono font-semibold text-slate-900">••••4821</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">IFSC Code</span>
                      <span className="font-mono font-semibold text-slate-900">SBIN0001234</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">NPCI Aadhaar Seeding</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE_SEEDED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    {language === 'hi'
                      ? 'कृपया जमा करने से पूर्व सभी विवरणों की अंतिम समीक्षा करें।'
                      : 'Please review all particulars before final submission.'}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scholarship Scheme</span>
                      <span className="font-bold text-slate-900 text-right">{scheme.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Grant Estimate</span>
                      <span className="font-mono font-bold text-amber-700">{scheme.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student & Tribe</span>
                      <span className="font-semibold text-slate-800">
                        {studentName} ({subTribe} ST)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">College</span>
                      <span className="font-medium text-slate-800">{institution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DigiLocker Verification</span>
                      <span className="text-emerald-700 font-semibold">4 Documents Linked</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DBT Bank Account</span>
                      <span className="font-mono text-slate-800">SBI ••••4821 (Aadhaar Seeded)</span>
                    </div>
                  </div>

                  {!isOnline && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      ℹ️ {t('offlineDraftSaved')}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('prevStep')}</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{t('nextStep')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                  >
                    {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submitting ? t('submitting') : t('submitApplication')}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
