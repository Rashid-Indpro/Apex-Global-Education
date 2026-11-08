import React, { useState } from 'react';
import { GLOBAL_OFFICES } from '../data/mockData.ts';
import { Button } from './ui/Button.tsx';
import { Input } from './ui/Input.tsx';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    targetCountry: 'United Kingdom',
    intendedLevel: 'Master’s Degree',
    message: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(generatedId);
      setIsSubmitting(false);
    }, 600);
  };

  const faqs = [
    {
      q: 'Do you charge prospective students for partner university applications?',
      a: 'No. Apex Global Education holds official direct representation contracts with partner institutions across the UK, Canada, Australia, and the US. Application processing for partner universities is provided with zero agency consultancy fees.'
    },
    {
      q: 'How long does student visa processing take?',
      a: 'Processing timelines vary by destination and season. Typical turnarounds: UK Student Visa (3 weeks standard / 5 days priority), Canada Study Permit SDS (4-6 weeks), Australia Subclass 500 (3-5 weeks), USA F-1 (dependent on embassy interview appointment availability).'
    },
    {
      q: 'Can I apply if my current IELTS or English score is pending?',
      a: 'Yes. We frequently submit applications to obtain conditional offer letters while students prepare for their language exams or apply for institutional Medium of Instruction (MOI) waivers.'
    },
    {
      q: 'What proof of funds are required for visa applications?',
      a: 'Depending on the host country, immigration authorities require 28-day holding bank statements, education loans, or government sponsorships covering 1 academic year of tuition plus prescribed living maintenance costs.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
          <span>Direct Inquiries</span>
          <span aria-hidden="true">·</span>
          <span>Global Liaison Network</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Connect with Our Accredited Advisors
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Schedule an in-person consultation at one of our regional hub offices, or submit an 
          online inquiry for immediate routing to our dedicated country specialists.
        </p>
      </div>

      {/* Main Grid: Form + Office Hours & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-6 sm:p-8 shadow-xs">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Submit an Inquiry
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              All inquiries receive an official response and case officer assignment within 24 business hours.
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Inquiry Ticket Registered
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>. Your consultation inquiry has been logged under reference:
                </p>
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded font-mono text-sm font-bold text-sky-800 tabular-nums">
                  Reference: {submittedTicket}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                A confirmation has been sent to <span className="font-medium text-slate-800">{formData.email}</span>. A senior counselor specializing in {formData.targetCountry} admissions will contact you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    targetCountry: 'United Kingdom',
                    intendedLevel: 'Master’s Degree',
                    message: ''
                  });
                }}
                className="mt-2 text-xs font-semibold text-sky-800 hover:text-sky-950 underline cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Contact Phone"
                  type="tel"
                  required
                  placeholder="+44 7700 900000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Country
                  </label>
                  <select
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ireland">Ireland</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Study Level
                  </label>
                  <select
                    value={formData.intendedLevel}
                    onChange={(e) => setFormData({ ...formData, intendedLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all cursor-pointer"
                  >
                    <option value="Bachelor’s Degree">Bachelor’s Degree</option>
                    <option value="Master’s Degree">Master’s Degree</option>
                    <option value="PhD / Doctorate">PhD / Doctorate</option>
                    <option value="Postgraduate Diploma">Postgraduate Diploma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Inquiry Message or Academic Background *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your current GPA, target course, language score, or specific questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-all resize-y"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Submit Consultation Request
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Office Hours & Locations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Global Offices List */}
          <div className="bg-slate-50 border border-slate-200 rounded p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Regional Hub Locations & Hours
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Walk-ins welcomed during standard office hours.
              </p>
            </div>

            <div className="space-y-4">
              {GLOBAL_OFFICES.map((office, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200/80 rounded space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {office.city}, {office.country}
                    </span>
                    {office.isHeadquarters && (
                      <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        Liaison HQ
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{office.phone}</span>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{office.operatingHours}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Profiles & Verification */}
          <div className="p-5 bg-white border border-slate-200 rounded space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Official Media Channels
            </h4>
            <p className="text-xs text-slate-600">
              Join our weekly live webinar sessions where international university admission officers answer live visa and scholarship queries.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs font-medium text-sky-800">
              <a href="#linkedin" className="hover:underline">LinkedIn: @ApexGlobalEdu</a>
              <span>·</span>
              <a href="#youtube" className="hover:underline">YouTube Admissions Channel</a>
            </div>
          </div>

        </div>

      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">
            Frequently Asked Advisory Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Transparent answers regarding admission procedures, fees, and visa requirements.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {faq.q}
                </span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
