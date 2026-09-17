import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  workerService, 
  TradePolicy, 
  Cooperative, 
  WorkerOnboardingPayload, 
  WorkerProfileData, 
  FALLBACK_TRADE_POLICIES, 
  FALLBACK_COOPERATIVES 
} from '@/services/workerService';
import { useAuth } from '@/hooks/useAuth';
import { Step1PersonalDetails } from './steps/Step1PersonalDetails';
import { Step2Cooperative } from './steps/Step2Cooperative';
import { Step3Occupation } from './steps/Step3Occupation';
import { Step4SkillsExperience } from './steps/Step4SkillsExperience';
import { Step5Verification } from './steps/Step5Verification';
import { Step6WorkPreferences } from './steps/Step6WorkPreferences';
import { Step7Portfolio } from './steps/Step7Portfolio';
import { Step8ReviewSubmit } from './steps/Step8ReviewSubmit';
import { OnboardingSuccessCard } from './steps/OnboardingSuccessCard';
import { Button } from '@/components/common/Button';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';

const STEP_TITLES = [
  'Personal Details',
  'Cooperative',
  'Occupation',
  'Experience & Skills',
  'Verification',
  'Work Preference',
  'Portfolio',
  'Review & Submit',
];

export const WorkerOnboardingWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [tradePolicies, setTradePolicies] = useState<TradePolicy[]>(FALLBACK_TRADE_POLICIES);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(FALLBACK_COOPERATIVES);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedProfile, setCompletedProfile] = useState<WorkerProfileData | null>(null);

  // Form State initialized with defaults
  const [formData, setFormData] = useState<WorkerOnboardingPayload>({
    name: user?.name || 'Ramesh Chandra Behera',
    alternate_phone: '+91 9437012345',
    gender: 'Male',
    age: 34,
    preferred_language: 'English',
    district: user?.district || 'Bhubaneswar',
    address_line: 'Plot 104, Rasulgarh Main Road, Bhubaneswar',
    profile_photo_url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',

    cooperative_id: 'coop-bbsr-01',
    cooperative_name: 'Khurda District Urban Workers Cooperative Union',

    trade: 'Master Electrician',
    trade_group: 'GROUP_A',

    experience_years: 6.0,
    bio: 'Certified industrial and residential electrician with 6 years of trade experience in circuit diagnostics, wiring, and inverter installations.',
    skills: ['Wiring & Conduit', 'Inverter & UPS Setup', 'Fault Diagnosis', '3-Phase Distribution'],

    identity_document: {
      document_type: 'AADHAAR',
      document_number: '884123456789',
      document_ref: 'REF-AADHAAR-8841',
    },
    certifications: [
      {
        certificate_name: 'National Trade Certificate (NTC) - Electrician',
        issuing_authority: 'National Council for Vocational Training (NCVT)',
        issue_year: 2018,
        document_url: 'https://karmseva.gov.in/vault/cert-sample.pdf',
      },
    ],
    is_police_cleared: true,

    preferences: {
      preferred_radius_km: 5.0,
      max_radius_km: 12.0,
      allow_outside_suggestions: true,
      preferred_shift: 'FULL_DAY',
      is_available_for_emergency: true,
    },

    portfolio: [
      {
        title: '3BHK Distribution Board Wiring',
        service_type: 'Wiring & Circuit',
        description: 'Complete MCB replacement and safety earthing setup',
        image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
        work_date: 'Jan 2024',
      },
    ],

    declaration_confirmed: true,
  });

  // Load Policies and Cooperatives on mount
  useEffect(() => {
    async function loadData() {
      const [policies, coops] = await Promise.all([
        workerService.getTradePolicies(),
        workerService.getCooperatives(),
      ]);
      setTradePolicies(policies);
      setCooperatives(coops);
    }
    loadData();
  }, []);

  const currentTradePolicy = tradePolicies.find((p) => p.trade === formData.trade) || tradePolicies[0];

  // Validation per step
  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setErrorMessage('Please enter your full official name.');
        return false;
      }
      if (!formData.address_line?.trim()) {
        setErrorMessage('Please enter your locality address.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.cooperative_id) {
        setErrorMessage('Please select a local Labour Cooperative.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.trade) {
        setErrorMessage('Please select your primary occupation.');
        return false;
      }
    } else if (currentStep === 4) {
      if (formData.skills.length === 0) {
        setErrorMessage('Please select at least 1 trade skill.');
        return false;
      }
    } else if (currentStep === 5) {
      if (!formData.identity_document.document_number.trim()) {
        setErrorMessage('Please enter your official document number.');
        return false;
      }
      if (formData.trade_group === 'GROUP_A' && formData.certifications.length === 0) {
        setErrorMessage(`Verification Policy: ${formData.trade} (Group A) requires at least one formal certificate or professional licence.`);
        return false;
      }
      if (!formData.is_police_cleared) {
        setErrorMessage('Please accept the integrity & police verification declaration.');
        return false;
      }
    } else if (currentStep === 8) {
      if (!formData.declaration_confirmed) {
        setErrorMessage('Please check the digital declaration box to complete onboarding.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const profile = await workerService.submitOnboarding(formData);
      setCompletedProfile(profile);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to submit onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already completed, show success card
  if (completedProfile) {
    return <OnboardingSuccessCard profile={completedProfile} />;
  }

  const progressPercentage = Math.round(((currentStep - 1) / 7) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Top Breadcrumb & Back to Dashboard */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/worker')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Seva Partner Dashboard</span>
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gov-muted">Step {currentStep} of 8</span>
          <span className="font-bold text-gov-green">({progressPercentage}% Completed)</span>
        </div>
      </div>

      {/* Progress Bar & Steps Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Visual Progress Line */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gov-green to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(progressPercentage, 12)}%` }}
          />
        </div>

        {/* Steps Chips Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  if (stepNum < currentStep) setCurrentStep(stepNum);
                }}
                disabled={stepNum > currentStep}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-gov-navy text-white shadow-xs ring-2 ring-gov-navy/20'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                ) : (
                  <span className="text-[10px] w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    {stepNum}
                  </span>
                )}
                <span>{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-xs font-bold text-red-900 flex items-start space-x-3 animate-in shake duration-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="block font-black">Attention Required:</span>
            <p className="font-medium text-red-800 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Active Step Content Card */}
      <div className="bg-white rounded-3xl border border-gov-border shadow-sm p-6 sm:p-8">
        {currentStep === 1 && (
          <Step1PersonalDetails
            data={formData}
            onChange={(fields) => setFormData((prev) => ({ ...prev, ...fields }))}
          />
        )}

        {currentStep === 2 && (
          <Step2Cooperative
            cooperatives={cooperatives}
            selectedCoopId={formData.cooperative_id}
            onSelect={(coop) =>
              setFormData((prev) => ({
                ...prev,
                cooperative_id: coop.id,
                cooperative_name: coop.name,
              }))
            }
          />
        )}

        {currentStep === 3 && (
          <Step3Occupation
            policies={tradePolicies}
            selectedTrade={formData.trade}
            onSelect={(p) =>
              setFormData((prev) => ({
                ...prev,
                trade: p.trade,
                trade_group: p.group,
                skills: p.suggested_skills.slice(0, 3),
              }))
            }
          />
        )}

        {currentStep === 4 && (
          <Step4SkillsExperience
            tradePolicy={currentTradePolicy}
            experienceYears={formData.experience_years}
            skills={formData.skills}
            bio={formData.bio}
            onChange={(fields) => setFormData((prev) => ({ ...prev, ...fields }))}
          />
        )}

        {currentStep === 5 && (
          <Step5Verification
            tradePolicy={currentTradePolicy}
            identityDoc={formData.identity_document}
            certifications={formData.certifications}
            isPoliceCleared={formData.is_police_cleared}
            onIdentityDocChange={(doc) =>
              setFormData((prev) => ({ ...prev, identity_document: doc }))
            }
            onCertificationsChange={(certs) =>
              setFormData((prev) => ({ ...prev, certifications: certs }))
            }
            onPoliceClearanceChange={(cleared) =>
              setFormData((prev) => ({ ...prev, is_police_cleared: cleared }))
            }
          />
        )}

        {currentStep === 6 && (
          <Step6WorkPreferences
            preferences={formData.preferences}
            onChange={(pref) =>
              setFormData((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, ...pref },
              }))
            }
          />
        )}

        {currentStep === 7 && (
          <Step7Portfolio
            portfolio={formData.portfolio}
            onChange={(items) => setFormData((prev) => ({ ...prev, portfolio: items }))}
          />
        )}

        {currentStep === 8 && (
          <Step8ReviewSubmit
            data={formData}
            declarationConfirmed={formData.declaration_confirmed}
            onDeclarationChange={(confirmed) =>
              setFormData((prev) => ({ ...prev, declaration_confirmed: confirmed }))
            }
            onJumpToStep={(step) => setCurrentStep(step)}
          />
        )}

        {/* Step Navigation Actions */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="text-xs font-bold px-5 py-2.5"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            isLoading={isSubmitting}
            className="text-xs sm:text-sm font-black px-8 py-3 shadow-md"
            rightIcon={currentStep === 8 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {currentStep === 8 ? 'Submit & Issue Digital KARM ID' : `Continue to Step ${currentStep + 1}`}
          </Button>
        </div>
      </div>

    </div>
  );
};
