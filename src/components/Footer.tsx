import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center text-white font-bold text-base">
                AG
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
                Apex Global Education
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Accredited international student advisory bridging ambitious scholars with 
              leading universities across the United Kingdom, Canada, United States, and Australia.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>British Council Certified Agency #BC-UK-9041</p>
              <p>PIER Qualified Education Agent Counselor (QEAC M412)</p>
              <p>ICEF Formal Institutional Partner #5419</p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  Consultancy Services
                </Link>
              </li>
              <li>
                <Link to="/apply" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  Direct Application Form
                </Link>
              </li>
              <li>
                <Link to="/download" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  Download Intake Dossier
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  Office Hubs & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Global Hubs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Key Liaison Hubs
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <Link to="/contact#offices" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="text-slate-200 font-medium hover:text-white">London, UK</Link>
                  <p>88 Leadenhall Street, EC3A 3BP</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <Link to="/contact#offices" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="text-slate-200 font-medium hover:text-white">Toronto, Canada</Link>
                  <p>200 Bay Street, Suite 1400</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <Link to="/contact#offices" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className="text-slate-200 font-medium hover:text-white">Dhaka, South Asia</Link>
                  <p>Gulshan-2 Circle, Bay’s Galleria</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Contact & Staff Access */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a
                href="tel:+442079460912"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                <span>+44 20 7946 0912</span>
              </a>
              <a
                href="mailto:admissions@apexglobaledu.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span>admissions@apexglobaledu.com</span>
              </a>
              <div className="pt-3">
                <Link
                  to="/dashboard"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-medium flex items-center justify-between transition-colors border border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Staff Portal Gateway</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Apex Global Education Advisory Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Representation</span>
            <span className="hover:text-slate-400 cursor-pointer">Student Code of Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
