import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext.tsx';
import { 
  HOW_IT_WORKS_STEPS, 
  WHY_CHOOSE_US_PILLARS 
} from '../data/mockData.ts';
import { 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  FileDown,
  Calendar,
  Bell,
  Sparkles
} from 'lucide-react';

interface HomeProps {
  onNavigate?: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate: customNavigate }) => {
  const routerNavigate = useNavigate();
  const { content, isLoading } = useContent();
  const hp = content.homepage;
  const ann = content.announcements;

  const onNavigate = (page: string) => {
    if (customNavigate) customNavigate(page);
    else routerNavigate(page === 'home' ? '/' : `/${page}`);
  };

  const [activeDestination, setActiveDestination] = useState<'UK' | 'Canada' | 'USA' | 'Australia' | 'Germany'>('UK');

  const destinationsData = {
    UK: {
      country: 'United Kingdom',
      flag: '🇬🇧',
      headline: 'World-Leading Universities & 2-Year Graduate Visa',
      intakes: 'September & January',
      workRights: '20 hrs/week term-time, 2-Year PSW Post-Study Work Visa',
      popularPrograms: 'MSc Data Science, International Business Management, Law (LLM), Biomedical Sciences',
      partnerCount: '65+ Partner Institutions (Russell Group Included)',
      averageTuition: '£13,500 - £26,000 / year'
    },
    Canada: {
      country: 'Canada',
      flag: '🇨🇦',
      headline: 'Direct PGWP Pathways & DLI Designated Institutions',
      intakes: 'September, January & May',
      workRights: 'Off-campus work permit + Up to 3-Year Post-Grad Work Permit',
      popularPrograms: 'Applied Computing, Mechanical Engineering, Supply Chain, Healthcare Administration',
      partnerCount: '48+ Public Colleges & Universities',
      averageTuition: 'CAD $16,000 - $32,000 / year'
    },
    USA: {
      country: 'United States',
      flag: '🇺🇸',
      headline: '3-Year STEM OPT Extensions & Tier-1 Research Facilities',
      intakes: 'Fall (August) & Spring (January)',
      workRights: 'On-campus 20 hrs/week, 12 to 36 Months STEM OPT',
      popularPrograms: 'Computer Science, Electrical & AI Engineering, MBA, Biotechnology',
      partnerCount: '40+ Tier 1 & 2 Universities',
      averageTuition: 'USD $22,000 - $44,000 / year'
    },
    Australia: {
      country: 'Australia',
      flag: '🇦🇺',
      headline: 'Group of Eight Excellence & Extended Regional Work Rights',
      intakes: 'February & July',
      workRights: '48 hrs per fortnight, 2 to 4 Year Temporary Graduate Visa (Subclass 485)',
      popularPrograms: 'Professional Accounting, Nursing, IT Cybersecurity, Civil Engineering',
      partnerCount: '30+ Top Australian Universities',
      averageTuition: 'AUD $28,000 - $42,000 / year'
    },
    Germany: {
      country: 'Germany',
      flag: '🇩🇪',
      headline: 'Tuition-Free Public Universities & 18-Month Jobseeker Visa',
      intakes: 'Winter (October) & Summer (April)',
      workRights: '140 full days / 280 half days per year, 18-month job search visa',
      popularPrograms: 'Automotive Engineering, Mechatronics, Sustainable Energy, Informatics',
      partnerCount: '22+ Technical Universities & Applied Sciences',
      averageTuition: '€0 - €3,000 / year (Nominal semester fee only)'
    }
  };

  const selectedDest = destinationsData[activeDestination];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Dynamic Announcement Ribbon (Managed via Dynamic CMS) */}
      {ann.isActive && (
        <div className="bg-slate-900 text-slate-100 border-b border-slate-800 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-bold text-sky-400 bg-sky-950/80 border border-sky-800/80 px-2 py-0.5 rounded text-[10px] uppercase">
                <Bell className="w-3 h-3" />
                <span>Notice ({ann.cycle})</span>
              </span>
              <p className="font-semibold text-white truncate max-w-xl">
                {ann.headline}
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="text-sky-300 hover:text-white underline text-left sm:text-right shrink-0 font-medium cursor-pointer"
            >
              Consult Admissions Team →
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION (Dynamic Content from GET /api/content/homepage) */}
      <section className="relative pt-6 sm:pt-12 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dynamic Kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>{hp.heroKicker}</span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.08] text-balance">
                {hp.heroTitle}
              </h1>

              {/* Dynamic Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                {hp.heroSubtitle}
              </p>

              {/* Dynamic Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('apply')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                >
                  <span>{hp.ctaPrimaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('download')}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <span>{hp.ctaSecondaryText}</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-3 transition-colors cursor-pointer"
                >
                  Explore 6 Core Services →
                </button>
              </div>

              {/* Trust checkpoints */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero Consultancy Service Charge on Partner Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>98.4% Verified Visa Grant Record</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personal 1-on-1 Visa Caseworker</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset (Dynamic Image src) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 aspect-[16/11]">
                <img
                  src={hp.heroImage}
                  alt="University campus academic center"
                  className="w-full h-full object-cover transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Caption scrim */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-5 text-white">
                  <div className="text-xs font-semibold text-sky-300 tracking-wide">
                    2026/2027 GLOBAL ADMISSIONS
                  </div>
                  <p className="text-sm font-medium text-slate-100 mt-0.5">
                    180+ Partner Campuses across UK, Canada, Australia & USA
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Adjacent Dynamic Proof Counters (Tabular Figures) */}
          <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {hp.statStudentsCount}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {hp.statStudentsLabel}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {hp.statVisaRate}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {hp.statVisaLabel}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {hp.statPartnersCount}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {hp.statPartnersLabel}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {hp.statScholarships}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {hp.statScholarshipsLabel}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS (4 STEPS) */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
              Step-by-Step Procedure
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
              How It Works
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              A transparent, 4-stage advisory journey designed to minimize embassy rejection 
              risks and secure direct academic admissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div 
                key={step.stepNumber}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
              >
                <div>
                  <div className="text-3xl font-mono font-bold text-sky-800 mb-4 tabular-nums">
                    {step.stepNumber}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Advisor Supervised</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ready to review your academic transcript with an accredited counselor?
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Initial profile assessments are completed within 48 business hours with zero obligation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('apply')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Start Free Assessment
            </button>
          </div>

        </div>
      </section>

      {/* 3. DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
              Study Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
              Select Your Ideal Academic Country
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-lg">
            {(['UK', 'Canada', 'USA', 'Australia', 'Germany'] as const).map((countryKey) => (
              <button
                key={countryKey}
                onClick={() => setActiveDestination(countryKey)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeDestination === countryKey
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {countryKey}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Destination Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label={selectedDest.country}>
                  {selectedDest.flag}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedDest.country}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedDest.partnerCount}
                  </p>
                </div>
              </div>

              <p className="text-base text-slate-700 font-medium">
                {selectedDest.headline}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Primary Intakes</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {selectedDest.intakes}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                    <span>Estimated Tuition</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mt-1 font-mono tabular-nums">
                    {selectedDest.averageTuition}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Work Rights & Post-Study Visas
                </span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs sm:text-sm">
                  {selectedDest.workRights}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  High-Demand Degree Areas
                </span>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {selectedDest.popularPrograms}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('apply')}
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Apply for {selectedDest.country} Intakes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                What We Coordinate for {selectedDest.country}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct application to accredited DLI / Sponsor universities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Full Genuine Student (GS) / Statement of Intent review</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>28-day holding bank solvency auditing for embassy compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Compulsory student health cover (OSHC / NHS / UHIP) setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>On-arrival student housing verification & airport pickup</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => onNavigate('download')}
                  className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download {selectedDest.country} Visa Checklist PDF →</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US (Dynamic Title, Subtitle, Advisory Image & Case Study) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                Institutional Credibility
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
                {hp.advisoryTitle}
              </h2>
              <p className="text-slate-600 mt-2 text-base">
                {hp.advisorySubtitle}
              </p>
            </div>

            <div className="space-y-4">
              {WHY_CHOOSE_US_PILLARS.map((pillar, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-sky-700 font-mono text-sm">0{idx + 1}.</span>
                    <span>{pillar.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {/* Dynamic Advisory Photography Asset */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-[4/3]">
              <img
                src={hp.advisoryImage}
                alt="Accredited education advisor conducting counseling session"
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Dynamic Case Study Quote */}
            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
                <span>Recent Success Benchmark</span>
                <span aria-hidden="true">·</span>
                <span>Verified Admission & Visa Grant</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                “{hp.caseStudyQuote}”
              </p>
              <div className="pt-2 text-xs text-slate-400">
                <span className="text-white font-semibold">{hp.caseStudyAuthor}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-900 text-white rounded-xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-lg">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Start Your Academic Journey Today
            </h3>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Submit your preliminary details online to receive a verified eligibility audit and institutional shortlist within 48 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('apply')}
              className="px-6 py-3 bg-white hover:bg-sky-50 text-slate-900 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center"
            >
              Fill Application Form
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 bg-sky-800 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-lg border border-sky-700 transition-colors cursor-pointer text-center"
            >
              Contact Global Offices
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
