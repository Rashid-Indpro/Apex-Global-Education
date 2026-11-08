import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.tsx';
import { useToast } from './ToastContext.tsx';
import { ASSET_PATHS } from '../data/mockData.ts';

export interface HomepageContent {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  statStudentsCount: string;
  statStudentsLabel: string;
  statVisaRate: string;
  statVisaLabel: string;
  statPartnersCount: string;
  statPartnersLabel: string;
  statScholarships: string;
  statScholarshipsLabel: string;
  advisoryTitle: string;
  advisorySubtitle: string;
  advisoryImage: string;
  caseStudyQuote: string;
  caseStudyAuthor: string;
}

export interface AnnouncementsContent {
  cycle: string;
  headline: string;
  body: string;
  isActive: boolean;
}

export interface SiteContent {
  homepage: HomepageContent;
  announcements: AnnouncementsContent;
}

const DEFAULT_CONTENT: SiteContent = {
  homepage: {
    heroKicker: 'Certified Education Counsel · British Council & PIER Accredited · 180+ Global University Partners',
    heroTitle: 'Your Pathway to World-Class Higher Education.',
    heroSubtitle: 'We guide ambitious international students from university shortlisting and merit scholarship acquisition to student visa grant and pre-departure settlement.',
    heroImage: ASSET_PATHS.heroCampus,
    ctaPrimaryText: 'Apply Now for 2026/2027',
    ctaSecondaryText: 'Download Intake Dossier',
    statStudentsCount: '12,500+',
    statStudentsLabel: 'International Students Placed',
    statVisaRate: '98.4%',
    statVisaLabel: 'First-Time Visa Approval Rate',
    statPartnersCount: '180+',
    statPartnersLabel: 'Direct University Partnerships',
    statScholarships: '$4.2M+',
    statScholarshipsLabel: 'Tuition Scholarships Secured in 2025/26',
    advisoryTitle: 'Why Choose Apex Global Education',
    advisorySubtitle: 'International education is a high-stakes investment. We replace generic guesswork with certified legal counselors, institutional tie-ups, and ethical accountability.',
    advisoryImage: ASSET_PATHS.consultation,
    caseStudyQuote: 'Apex Global resolved our complex 28-day UK bank solvency audit and helped me secure a £5,000 Vice-Chancellor Scholarship at the University of Birmingham. The visa arrived in 9 days.',
    caseStudyAuthor: 'Tariq Al-Mansoor · MSc Advanced Computer Science · Birmingham, UK',
  },
  announcements: {
    cycle: '2026/2027',
    headline: 'UK Autumn 2026 CAS Allocation Window Opened for Russell Group Institutions',
    body: 'Partner universities have commenced issuing Confirmation of Acceptance for Studies (CAS). Prospective applicants must ensure their 28-day bank maintenance certificates are dated within 31 days of application.',
    isActive: true,
  },
};

interface ContentContextType {
  content: SiteContent;
  isLoading: boolean;
  refreshContent: () => Promise<void>;
  updateSection: (section: keyof SiteContent, data: Partial<any>) => Promise<boolean>;
  resetSection: (section: keyof SiteContent) => Promise<boolean>;
  uploadMedia: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAuth();
  const { showToast } = useToast();

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setContent((prev) => ({
            ...prev,
            ...json.data,
          }));
        }
      }
    } catch (err) {
      console.warn('Using client fallback content store:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateSection = async (section: keyof SiteContent, data: Partial<any>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setContent((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            ...json.data,
          },
        }));
        showToast({
          type: 'success',
          title: 'Content Saved',
          message: `The "${section}" section has been updated and published to the public website.`,
        });
        return true;
      } else {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: json.error || 'Server rejected content update.',
        });
        return false;
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to CMS endpoint. Verify server is running.',
      });
      return false;
    }
  };

  const resetSection = async (section: keyof SiteContent): Promise<boolean> => {
    try {
      const res = await fetch(`/api/content/${section}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setContent((prev) => ({
          ...prev,
          [section]: {
            ...DEFAULT_CONTENT[section],
            ...json.data,
          },
        }));
        showToast({
          type: 'info',
          title: 'Defaults Restored',
          message: `The "${section}" section has been reset to original defaults.`,
        });
        return true;
      } else {
        showToast({
          type: 'error',
          title: 'Reset Failed',
          message: json.error || 'Could not reset section.',
        });
        return false;
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to contact reset endpoint.',
      });
      return false;
    }
  };

  const uploadMedia = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Media Uploaded',
          message: `Asset "${file.name}" saved to secure storage.`,
        });
        return { success: true, url: json.url };
      } else {
        const error = json.error || 'Upload failed.';
        showToast({
          type: 'error',
          title: 'Upload Rejected',
          message: error,
        });
        return { success: false, error };
      }
    } catch (err) {
      const error = 'Failed to upload media asset to server.';
      showToast({
        type: 'error',
        title: 'Upload Error',
        message: error,
      });
      return { success: false, error };
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        refreshContent: fetchContent,
        updateSection,
        resetSection,
        uploadMedia,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
