import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsultancyService } from '../types.ts';
import { SERVICES_DATA } from '../data/mockData.ts';
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  FileText, 
  X,
  Compass,
  Award,
  BookOpen
} from 'lucide-react';

interface ServicesProps {
  onNavigate?: (page: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate: customNavigate }) => {
  const routerNavigate = useNavigate();
  const onNavigate = (page: string) => {
    if (customNavigate) customNavigate(page);
    else routerNavigate(page === 'home' ? '/' : `/${page}`);
  };

  const [selectedService, setSelectedService] = useState<ConsultancyService | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
          <span>Advisory Capabilities</span>
          <span aria-hidden="true">·</span>
          <span>End-to-End Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Comprehensive Student Placement & Immigration Services
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          From institutional program matching to certified visa filing and pre-landing 
          settlement, our licensed counselors ensure flawless execution across all touchpoints.
        </p>
      </div>

      {/* Services Grid (6 services in clean layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((service, index) => (
          <div
            key={service.id}
            className="bg-white border border-slate-200 rounded p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>0{index + 1}. SERVICE</span>
                <span className="text-sky-700 font-medium">{service.intakeTimeline}</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {service.title}
                </h2>
                <p className="text-xs font-medium text-sky-800 mt-1">
                  {service.tagline}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              {/* Key Deliverables bullets */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Core Inclusions
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {service.keyDeliverables.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedService(service)}
                className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('apply')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors cursor-pointer"
              >
                Inquire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Standards Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>Fiduciary Responsibility</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All partner university admissions are managed with zero commission surcharges or hidden administrative retainers.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock className="w-4 h-4 text-sky-700" />
            <span>48-Hour Assessment Turnaround</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upon receipt of transcripts and ID documents, prospective applicants receive a structured eligibility verdict within 2 business days.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Award className="w-4 h-4 text-sky-700" />
            <span>Dedicated Caseworker Guarantee</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are assigned a named, credentialed counselor who oversees your file from initial consultation to campus check-in.
          </p>
        </div>
      </div>

      {/* Interactive Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                  Service Specification
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {selectedService.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedService.tagline}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Scope of Service
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded border border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 uppercase">Turnaround Cadence:</span>
                  <p className="text-slate-900 font-medium mt-0.5">{selectedService.intakeTimeline}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase">Applicable Degrees:</span>
                  <p className="text-slate-900 font-medium mt-0.5">{selectedService.eligibleLevels}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  All Included Deliverables
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {selectedService.keyDeliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Student Verification Requirements
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedService.deliverablesChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  onNavigate('apply');
                }}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Book This Service Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
