import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/Button.tsx';
import { Input } from './ui/Input.tsx';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Send,
  Copy,
  FileDown,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ApplyNow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<{
    applicationNo: string;
    applicantName: string;
    email: string;
    contactNumber: string;
    country: string;
    passportOrNin: string;
    targetDestination: string;
    intendedDegree: string;
    intakeTerm: string;
    counselor: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Core Required Fields
    fullName: '',
    country: 'United Kingdom',
    passportOrNin: '',
    email: '',
    contactNumber: '',

    // Step 2: Academic & Target
    currentQualification: 'Bachelor of Science (4-Year)',
    currentGpa: '3.65 / 4.00',
    targetDestination: 'United Kingdom',
    intendedDegree: 'MSc Data Science & AI',
    intakeTerm: 'Autumn 2026',

    // Step 3: Readiness & Declarations
    englishTestStatus: 'IELTS Academic (Score 7.5)',
    notes: '',
    acceptTerms: true,
  });

  const countriesList = [
    'Australia', 'Bangladesh', 'Brazil', 'Canada', 'China', 'Colombia',
    'Egypt', 'Germany', 'Ghana', 'India', 'Indonesia', 'Iran', 'Ireland',
    'Jamaica', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Nepal', 'Nigeria',
    'Pakistan', 'Philippines', 'Saudi Arabia', 'Senegal', 'Serbia',
    'South Africa', 'South Korea', 'Sri Lanka', 'Taiwan', 'Turkey',
    'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam',
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.passportOrNin) {
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // POST /api/applications (Public student submission endpoint)
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          country: formData.country,
          passportOrNin: formData.passportOrNin,
          email: formData.email,
          contactNumber: formData.contactNumber,
          currentQualification: formData.currentQualification,
          intendedDegree: formData.intendedDegree,
          targetDestination: formData.targetDestination,
          intakeTerm: formData.intakeTerm,
          notes: formData.notes,
        }),
      });

      const json = await res.json();
      setIsSubmitting(false);

      if (res.ok && json.success) {
        setSubmittedApp({
          applicationNo: json.applicationNo,
          applicantName: json.data.applicantName,
          email: json.data.email,
          contactNumber: json.data.contactNumber,
          country: json.data.country,
          passportOrNin: json.data.passportOrNin,
          targetDestination: json.data.targetDestination,
          intendedDegree: json.data.intendedDegree,
          intakeTerm: json.data.intakeTerm,
          counselor: json.data.counselor,
        });
      } else {
        setSubmitError(json.error || 'Failed to lodge application. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError('Network failure: Unable to contact application gateway.');
    }
  };

  const copyTrackingId = () => {
    if (submittedApp) {
      navigator.clipboard.writeText(submittedApp.applicationNo);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
          <span>Student Onboarding Portal</span>
          <span aria-hidden="true">·</span>
          <span>Intake Cycles 2026 / 2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Direct International Student Application
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          Submit your official candidate profile to initiate direct university admission and visa compliance review.
        </p>
      </div>

      {submittedApp ? (
        /* Submission Success Screen */
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Application Successfully Lodged
            </h2>
            <p className="text-sm text-slate-600">
              Thank you, <span className="font-semibold text-slate-900">{submittedApp.applicantName}</span>. Your international student application has been recorded in our central intake database.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Official Application No
                </span>
                <p className="text-2xl font-bold font-mono text-sky-900 tabular-nums">
                  {submittedApp.applicationNo}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyTrackingId}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                {copiedId ? 'Copied to Clipboard' : 'Copy Application No'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Assigned Counselor:</span>
                <p className="text-slate-900 font-semibold mt-0.5">{submittedApp.counselor}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Target Destination:</span>
                <p className="text-slate-900 font-semibold mt-0.5">{submittedApp.targetDestination}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Program & Intake:</span>
                <p className="text-slate-900 font-semibold mt-0.5">{submittedApp.intendedDegree} ({submittedApp.intakeTerm})</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg space-y-2 text-xs text-sky-950">
            <div className="font-bold flex items-center gap-1.5 text-sky-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Next Steps & Counselor Contact Guarantee:</span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-sky-900">
              <li>
                A confirmation has been dispatched to <strong>{submittedApp.email}</strong> with your application reference.
              </li>
              <li>
                Your designated caseworker, <strong>{submittedApp.counselor}</strong>, will review your file and contact you via phone/WhatsApp at <strong>{submittedApp.contactNumber}</strong> within <strong>24 to 48 business hours</strong>.
              </li>
              <li>
                Once verified, your counselor will issue an authorized <strong>Access Code</strong> allowing you to download your certified PDF intake pack on the <Link to="/download" className="font-semibold underline">Download Form</Link> page.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-4">
            <Link
              to="/download"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-2xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Go to Download Form Page</span>
            </Link>

            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setSubmittedApp(null);
                setCurrentStep(1);
              }}
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      ) : (
        /* Multi-Step Form Container */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          
          {/* Step Indicator Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 1 ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  1
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  currentStep === 1 ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  Personal Details
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-3 ${currentStep >= 2 ? 'bg-sky-700' : 'bg-slate-200'}`} />

              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 2 ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  2
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  currentStep === 2 ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  Academics & Target
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-3 ${currentStep === 3 ? 'bg-sky-700' : 'bg-slate-200'}`} />

              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 3 ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  3
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  currentStep === 3 ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  Review & Lodge
                </span>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8">
            
            {submitError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* STEP 1: Personal Details */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Step 1: Personal Identification & Contact
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official candidate details as recorded on your passport or identity card.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Legal Name"
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Country of Citizenship / Residence <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                      >
                        {countriesList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Passport Number / National ID (NIN)"
                      type="text"
                      required
                      placeholder="e.g. A9823104 or NIN-098231"
                      value={formData.passportOrNin}
                      onChange={(e) => setFormData({ ...formData, passportOrNin: e.target.value })}
                      className="font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="candidate@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Input
                      label="Contact Phone / WhatsApp"
                      type="tel"
                      required
                      placeholder="+44 7700 900481"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Academic Target
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: Academic & Program */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Step 2: Educational Background & Target Degree
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specify current credentials and intended university destination.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Current Qualification Level <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.currentQualification}
                        onChange={(e) => setFormData({ ...formData, currentQualification: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                      >
                        <option value="High School / A-Levels / IB">High School / A-Levels / IB</option>
                        <option value="Bachelor of Science (4-Year)">Bachelor of Science (4-Year)</option>
                        <option value="Bachelor of Arts / Business">Bachelor of Arts / Business</option>
                        <option value="Master’s Degree">Master’s Degree</option>
                        <option value="Polytechnic / Higher Diploma">Polytechnic / Higher Diploma</option>
                      </select>
                    </div>

                    <Input
                      label="GPA / Grade Percentage"
                      type="text"
                      required
                      placeholder="e.g. 3.65 / 4.00 or 78%"
                      value={formData.currentGpa}
                      onChange={(e) => setFormData({ ...formData, currentGpa: e.target.value })}
                      className="font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Target Country <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.targetDestination}
                        onChange={(e) => setFormData({ ...formData, targetDestination: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="United States">United States</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ireland">Ireland</option>
                      </select>
                    </div>

                    <Input
                      label="Intended Major / Degree"
                      type="text"
                      required
                      placeholder="e.g. MSc Data Science"
                      value={formData.intendedDegree}
                      onChange={(e) => setFormData({ ...formData, intendedDegree: e.target.value })}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Intake
                      </label>
                      <select
                        value={formData.intakeTerm}
                        onChange={(e) => setFormData({ ...formData, intakeTerm: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                      >
                        <option value="Autumn 2026">Autumn 2026 (Sep/Oct)</option>
                        <option value="Spring 2027">Spring 2027 (Jan/Feb)</option>
                        <option value="Summer 2027">Summer 2027 (May/Jun)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  >
                    Back to Personal Details
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Review
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: Review & Submit */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Step 3: Verification & Submission
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review your candidate summary before official lodgment with our central admissions desk.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                  <div className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                    Summary Overview
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-500">Applicant:</span>
                      <p className="font-bold text-slate-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Citizenship:</span>
                      <p className="font-bold text-slate-900">{formData.country}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Passport / NIN:</span>
                      <p className="font-bold text-slate-900 font-mono">{formData.passportOrNin}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Destination:</span>
                      <p className="font-bold text-slate-900">{formData.targetDestination}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <p className="font-medium text-slate-900">{formData.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone:</span>
                      <p className="font-medium text-slate-900">{formData.contactNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Additional Notes or Special Circumstances (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Previous study gaps, scholarship requirements, family dependent travel..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                        className="mt-0.5 rounded text-sky-700 focus:ring-sky-600"
                      />
                      <span>
                        I certify that all identification and academic data provided above are genuine and accurate. I authorize Apex Global Education to review my profile for international placement.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  >
                    Back to Academics
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={!formData.acceptTerms}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Application (POST /api/applications)
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
