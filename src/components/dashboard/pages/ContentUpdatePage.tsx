import React, { useState, useEffect } from 'react';
import { useContent, HomepageContent, AnnouncementsContent } from '../../../context/ContentContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { ImageUploader } from '../cms/ImageUploader.tsx';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileText, 
  BarChart3, 
  Bell, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContentUpdatePage: React.FC = () => {
  const { content, updateSection, resetSection, uploadMedia, isLoading } = useContent();

  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'advisory' | 'announcements'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Local draft state initialized from context
  const [homepageForm, setHomepageForm] = useState<HomepageContent>(content.homepage);
  const [announcementsForm, setAnnouncementsForm] = useState<AnnouncementsContent>(content.announcements);

  // Sync state if context changes externally
  useEffect(() => {
    if (!isLoading) {
      setHomepageForm(content.homepage);
      setAnnouncementsForm(content.announcements);
    }
  }, [content, isLoading]);

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSection('homepage', homepageForm);
    setIsSaving(false);
  };

  const handleSaveAnnouncements = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSection('announcements', announcementsForm);
    setIsSaving(false);
  };

  const handleResetCurrent = async () => {
    if (!confirm('Are you sure you want to reset this section to original defaults?')) return;
    setIsResetting(true);
    if (activeTab === 'announcements') {
      await resetSection('announcements');
    } else {
      await resetSection('homepage');
    }
    setIsResetting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
            <span>Dynamic CMS Engine</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Code Website Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Manage Website Content
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update frontend copy, statistics, announcements, and upload high-resolution media directly from this console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Public Home</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetCurrent}
            isLoading={isResetting}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Defaults
          </Button>
        </div>
      </div>

      {/* Segmented Section Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'hero'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Homepage Hero & CTA</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Proof Counters & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('advisory')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'advisory'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Advisory & Case Study</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Public Notice Bulletin</span>
        </button>
      </div>

      {/* Main CMS Form Canvas */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* 1. HOMEPAGE HERO SECTION */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Hero Section Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The primary visual anchor and value proposition displayed at the top of the landing page.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Kicker Metadata Subtitle"
                required
                value={homepageForm.heroKicker}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroKicker: e.target.value })}
                helperText="Displayed in small uppercase typography above the main headline."
              />

              <Input
                label="Hero Primary Headline"
                required
                value={homepageForm.heroTitle}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroTitle: e.target.value })}
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Hero Supporting Subtitle Paragraph *
                </label>
                <textarea
                  rows={3}
                  required
                  value={homepageForm.heroSubtitle}
                  onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all resize-y"
                />
              </div>

              {/* Hero Image File Uploader */}
              <div className="pt-2">
                <ImageUploader
                  label="Hero Campus Photography Asset"
                  helperText="Primary 16:9 or 16:11 visual banner displayed on the hero card."
                  currentImageUrl={homepageForm.heroImage}
                  onImageUploaded={(url) => setHomepageForm({ ...homepageForm, heroImage: url })}
                  onUploadFile={uploadMedia}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Primary CTA Button Label"
                  required
                  value={homepageForm.ctaPrimaryText}
                  onChange={(e) => setHomepageForm({ ...homepageForm, ctaPrimaryText: e.target.value })}
                />
                <Input
                  label="Secondary CTA Button Label"
                  required
                  value={homepageForm.ctaSecondaryText}
                  onChange={(e) => setHomepageForm({ ...homepageForm, ctaSecondaryText: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                All changes sync automatically to <code>GET /api/content/homepage</code>.
              </span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Hero Section
              </Button>
            </div>
          </form>
        )}

        {/* 2. STATS & METRICS SECTION */}
        {activeTab === 'stats' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Key Performance Indicators (Proof Counters)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjacent tabular metrics establishing institutional credibility and student placement records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Metric 01: Placed Students</span>
                <Input
                  label="Counter Value"
                  required
                  value={homepageForm.statStudentsCount}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statStudentsCount: e.target.value })}
                  className="font-mono text-base font-bold"
                />
                <Input
                  label="Descriptor Label"
                  required
                  value={homepageForm.statStudentsLabel}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statStudentsLabel: e.target.value })}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Metric 02: Visa Approval Rate</span>
                <Input
                  label="Counter Value"
                  required
                  value={homepageForm.statVisaRate}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statVisaRate: e.target.value })}
                  className="font-mono text-base font-bold"
                />
                <Input
                  label="Descriptor Label"
                  required
                  value={homepageForm.statVisaLabel}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statVisaLabel: e.target.value })}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Metric 03: Direct Partnerships</span>
                <Input
                  label="Counter Value"
                  required
                  value={homepageForm.statPartnersCount}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statPartnersCount: e.target.value })}
                  className="font-mono text-base font-bold"
                />
                <Input
                  label="Descriptor Label"
                  required
                  value={homepageForm.statPartnersLabel}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statPartnersLabel: e.target.value })}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Metric 04: Scholarships Secured</span>
                <Input
                  label="Counter Value"
                  required
                  value={homepageForm.statScholarships}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statScholarships: e.target.value })}
                  className="font-mono text-base font-bold"
                />
                <Input
                  label="Descriptor Label"
                  required
                  value={homepageForm.statScholarshipsLabel}
                  onChange={(e) => setHomepageForm({ ...homepageForm, statScholarshipsLabel: e.target.value })}
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                All numbers align with tabular numeral figures (<code>tabular-nums</code>).
              </span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Proof Metrics
              </Button>
            </div>
          </form>
        )}

        {/* 3. ADVISORY & CASE STUDY SECTION */}
        {activeTab === 'advisory' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Why Choose Us & Student Case Study
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the institutional advisory introduction, counseling photo asset, and real student testimonial.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Section Header Title"
                required
                value={homepageForm.advisoryTitle}
                onChange={(e) => setHomepageForm({ ...homepageForm, advisoryTitle: e.target.value })}
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Advisory Subtitle Prose *
                </label>
                <textarea
                  rows={2}
                  required
                  value={homepageForm.advisorySubtitle}
                  onChange={(e) => setHomepageForm({ ...homepageForm, advisorySubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all resize-y"
                />
              </div>

              {/* Advisory Image Uploader */}
              <div className="pt-2">
                <ImageUploader
                  label="Advisory Session Photography Asset"
                  helperText="4:3 high-resolution counseling session visual."
                  currentImageUrl={homepageForm.advisoryImage}
                  onImageUploaded={(url) => setHomepageForm({ ...homepageForm, advisoryImage: url })}
                  onUploadFile={uploadMedia}
                />
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Student Success Highlight (Case Study)
                </span>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Student Testimonial Statement *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={homepageForm.caseStudyQuote}
                    onChange={(e) => setHomepageForm({ ...homepageForm, caseStudyQuote: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all resize-y"
                  />
                </div>

                <Input
                  label="Attribution (Student Name, Program, Institution)"
                  required
                  value={homepageForm.caseStudyAuthor}
                  onChange={(e) => setHomepageForm({ ...homepageForm, caseStudyAuthor: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Uploaded images are served statically via <code>/uploads/...</code>.
              </span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Advisory Section
              </Button>
            </div>
          </form>
        )}

        {/* 4. ANNOUNCEMENTS BULLETIN SECTION */}
        {activeTab === 'announcements' && (
          <form onSubmit={handleSaveAnnouncements} className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Public Website Notice Bulletin
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Broadcast urgent embassy changes, CAS deadlines, or scholarship application alerts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Intake Academic Session"
                  required
                  value={announcementsForm.cycle}
                  onChange={(e) => setAnnouncementsForm({ ...announcementsForm, cycle: e.target.value })}
                />

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={announcementsForm.isActive}
                      onChange={(e) => setAnnouncementsForm({ ...announcementsForm, isActive: e.target.checked })}
                      className="rounded text-sky-700 focus:ring-sky-600"
                    />
                    <span>Active on Public Website Banner</span>
                  </label>
                </div>
              </div>

              <Input
                label="Announcement Headline"
                required
                value={announcementsForm.headline}
                onChange={(e) => setAnnouncementsForm({ ...announcementsForm, headline: e.target.value })}
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Announcement Prose Body *
                </label>
                <textarea
                  rows={4}
                  required
                  value={announcementsForm.body}
                  onChange={(e) => setAnnouncementsForm({ ...announcementsForm, body: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all resize-y"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Broadcasted via <code>/api/content/announcements</code>.
              </span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Announcement Bulletin
              </Button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
