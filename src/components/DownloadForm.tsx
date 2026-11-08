import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from './ui/Button.tsx';
import { Input } from './ui/Input.tsx';
import { 
  FileDown, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ShieldCheck,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';

interface VerifiedDossier {
  code: string;
  applicationNo: string;
  applicantName: string;
  targetDestination: string;
  status: string;
  createdAt: string;
}

export const DownloadForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [accessCode, setAccessCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedDossier, setVerifiedDossier] = useState<VerifiedDossier | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Pre-fill input from query parameter if provided (Do NOT auto-download)
  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      const clean = codeParam.trim().toUpperCase();
      setAccessCode(clean);
    }
  }, [searchParams]);

  // Download PDF ONLY when user explicitly submits/clicks "Verify & Download PDF"
  const executeVerifyAndDownload = async (codeToExecute: string) => {
    if (!codeToExecute.trim()) return;

    setErrorMsg(null);
    setIsAlreadyUsed(false);
    setVerifiedDossier(null);
    setDownloadSuccess(false);
    setIsProcessing(true);

    const cleanCode = codeToExecute.trim().toUpperCase();

    try {
      // 1. Verify Code Status
      const verifyRes = await fetch('/api/access-codes/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });

      const verifyJson = await verifyRes.json();

      if (!verifyRes.ok || !verifyJson.success) {
        setIsProcessing(false);
        setErrorMsg(verifyJson.error || 'Invalid Access Code. Please check with your assigned counselor.');
        if (verifyJson.isUsed) {
          setIsAlreadyUsed(true);
        }
        return;
      }

      const dossierData: VerifiedDossier = verifyJson.data;
      setVerifiedDossier(dossierData);

      // 2. Direct PDF Download Execution
      const downloadRes = await fetch(`/api/access-codes/${encodeURIComponent(cleanCode)}/download-pdf`);
      
      if (!downloadRes.ok) {
        const text = await downloadRes.text();
        throw new Error(text || 'Failed to generate and download official PDF.');
      }

      // Stream binary blob to browser file download
      const blob = await downloadRes.blob();
      const filename = `Apex-Application-${dossierData.applicationNo}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsProcessing(false);
      setDownloadSuccess(true);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Download error encountered. Please check code and try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerifyAndDownload(accessCode);
  };

  // Only fills the input field, does NOT trigger download
  const handleApplySampleCode = (code: string) => {
    setAccessCode(code);
    setErrorMsg(null);
    setIsAlreadyUsed(false);
    setDownloadSuccess(false);
  };

  const handleReset = () => {
    setAccessCode('');
    setVerifiedDossier(null);
    setErrorMsg(null);
    setIsAlreadyUsed(false);
    setDownloadSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5 text-sky-700" />
          <span>Restricted Document Access</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Download Official Intake Dossier
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Enter your single-use Access Code below and click <strong>Verify & Download PDF</strong> to receive your certified application dossier.
        </p>
      </div>

      {/* Main Input & Action Card */}
      <div className="bg-white border border-slate-200 rounded p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ENTER AUTHORIZATION ACCESS CODE"
            type="text"
            required
            placeholder="e.g. APX-DEMO-01 or APX-K92F-77"
            value={accessCode}
            onChange={(e) => {
              setAccessCode(e.target.value.toUpperCase());
              setErrorMsg(null);
              setIsAlreadyUsed(false);
            }}
            rightIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
            className="font-mono uppercase tracking-wider text-base text-center font-semibold"
          />

          {errorMsg && (
            <div className={`p-3.5 rounded text-xs flex items-start gap-2.5 ${
              isAlreadyUsed
                ? 'bg-amber-50 border border-amber-200 text-amber-900'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {isAlreadyUsed ? (
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-semibold block">
                  {isAlreadyUsed ? 'Code Already Redeemed' : 'Authorization Error'}
                </span>
                <p className="text-[11px] leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isProcessing}
            disabled={!accessCode.trim()}
            leftIcon={<FileDown className="w-4 h-4" />}
            className="w-full cursor-pointer"
          >
            {isProcessing ? 'Verifying & Downloading PDF...' : 'Verify & Download PDF'}
          </Button>
        </form>

        {/* Pre-seeded test codes */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pre-seeded test authorization codes (click to fill input):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplySampleCode('APX-DEMO-01')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-mono text-xs font-semibold transition-colors cursor-pointer border border-emerald-200"
              title="Click to insert code into input"
            >
              APX-DEMO-01 (Unused)
            </button>
            <button
              type="button"
              onClick={() => handleApplySampleCode('APX-K92F-77')}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded font-mono text-xs font-semibold transition-colors cursor-pointer border border-sky-200"
              title="Click to insert code into input"
            >
              APX-K92F-77 (Unused)
            </button>
            <button
              type="button"
              onClick={() => handleApplySampleCode('APX-USED-99')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-mono text-xs font-medium transition-colors cursor-pointer border border-slate-200"
              title="Click to insert code into input"
            >
              APX-USED-99 (Used)
            </button>
          </div>
        </div>
      </div>

      {/* Download Confirmation Card */}
      {verifiedDossier && downloadSuccess && (
        <div className="bg-white border border-emerald-200 rounded-lg p-6 shadow-xs max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
          
          <div className="flex items-start gap-3.5 p-4 bg-emerald-50 border border-emerald-200 rounded">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm text-emerald-900 block">
                Certified PDF Successfully Downloaded
              </span>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your intake document <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">Apex-Application-{verifiedDossier.applicationNo}.pdf</code> has been downloaded to your device.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded border border-slate-200 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Applicant Name</span>
              <span className="text-slate-900 font-bold text-sm block">{verifiedDossier.applicantName}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Study Destination</span>
              <span className="text-slate-900 font-bold text-sm block">{verifiedDossier.targetDestination}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeVerifyAndDownload(verifiedDossier.code)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF Again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Enter Another Code
            </Button>
          </div>

        </div>
      )}

      {/* Support Notice */}
      <div className="p-4 bg-slate-100 rounded border border-slate-200 text-xs text-slate-600 flex items-start gap-3 max-w-xl mx-auto">
        <ShieldCheck className="w-4 h-4 text-sky-800 shrink-0 mt-0.5" />
        <p>
          Need an updated access code or requesting institutional access? 
          Contact our central admissions liaison desk at <strong>admissions@apexglobaledu.com</strong> with your application reference.
        </p>
      </div>

    </div>
  );
};

