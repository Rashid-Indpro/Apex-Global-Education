import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { generateQrCodeDataUrl, downloadDataUrlAsFile } from '../../../utils/qrCode.ts';
import { 
  ShieldCheck, 
  Users, 
  Plus, 
  Search, 
  RefreshCw, 
  QrCode, 
  Download, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Award, 
  X, 
  CheckCircle2, 
  ExternalLink,
  Upload,
  UserCheck,
  Building,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StaffMemberRecord {
  id: string;
  workerId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  designation: string;
  department: string;
  photoUrl: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  joiningDate: string;
  specialization?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export const StaffPage: React.FC = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [staffList, setStaffList] = useState<StaffMemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');

  // Register Modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regContactNumber, setRegContactNumber] = useState('');
  const [regDesignation, setRegDesignation] = useState('Senior Admissions Counselor');
  const [regDepartment, setRegDepartment] = useState('International Admissions');
  const [regStatus, setRegStatus] = useState<'Active' | 'On Leave' | 'Suspended'>('Active');
  const [regJoiningDate, setRegJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [regSpecialization, setRegSpecialization] = useState('UK Tier 4 & Commonwealth Direct Intake');
  const [regPhotoUrl, setRegPhotoUrl] = useState('/src/assets/images/staff_counselor_female_1794140015435.jpg');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Edit Modal state
  const [editingStaff, setEditingStaff] = useState<StaffMemberRecord | null>(null);
  const [isUpdatingStaff, setIsUpdatingStaff] = useState(false);

  // QR Modal state
  const [activeQrStaff, setActiveQrStaff] = useState<StaffMemberRecord | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // Fetch staff directory
  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/staff', { headers });
      const json = await res.json();

      if (res.ok && json.success) {
        setStaffList(json.data);
      } else {
        showToast({
          type: 'error',
          title: 'Failed to Load Staff',
          message: json.error || 'Server rejected staff request.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to staff directory database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [token]);

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploadingPhoto(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const json = await res.json();
      setIsUploadingPhoto(false);

      if (res.ok && json.success && json.url) {
        setRegPhotoUrl(json.url);
        if (editingStaff) {
          setEditingStaff({ ...editingStaff, photoUrl: json.url });
        }
        showToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Staff avatar stored successfully.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Upload Error',
          message: json.error || 'Could not upload photo asset.',
        });
      }
    } catch {
      setIsUploadingPhoto(false);
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Network error occurred during photo upload.',
      });
    }
  };

  // Handle Register Staff Submission
  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regContactNumber.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Full Name, Email, and Contact Number are required.',
      });
      return;
    }

    setIsSubmittingStaff(true);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          email: regEmail.trim(),
          contactNumber: regContactNumber.trim(),
          designation: regDesignation.trim(),
          department: regDepartment.trim(),
          status: regStatus,
          joiningDate: regJoiningDate,
          specialization: regSpecialization.trim(),
          photoUrl: regPhotoUrl,
        }),
      });

      const json = await res.json();
      setIsSubmittingStaff(false);

      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Staff Registered',
          message: `Employee ${json.data.fullName} registered with ID ${json.data.workerId}.`,
        });
        setIsRegisterModalOpen(false);
        // Reset form
        setRegFullName('');
        setRegEmail('');
        setRegContactNumber('');
        fetchStaff();
      } else {
        showToast({
          type: 'error',
          title: 'Registration Error',
          message: json.error || 'Could not register staff member.',
        });
      }
    } catch {
      setIsSubmittingStaff(false);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to communicate with staff management service.',
      });
    }
  };

  // Handle Edit Staff Submission
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setIsUpdatingStaff(true);
    try {
      const res = await fetch(`/api/staff/${editingStaff.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editingStaff),
      });

      const json = await res.json();
      setIsUpdatingStaff(false);

      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Staff Profile Updated',
          message: `Updated profile for ${editingStaff.fullName}.`,
        });
        setEditingStaff(null);
        fetchStaff();
      } else {
        showToast({
          type: 'error',
          title: 'Update Error',
          message: json.error || 'Failed to update employee details.',
        });
      }
    } catch {
      setIsUpdatingStaff(false);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to communicate with staff service.',
      });
    }
  };

  // Handle Delete Staff
  const handleDeleteStaff = async (staff: StaffMemberRecord) => {
    if (!window.confirm(`Are you sure you want to remove ${staff.fullName} (${staff.workerId}) from active staff?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/staff/${staff.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast({
          type: 'success',
          title: 'Staff Member Deleted',
          message: `${staff.fullName} has been removed from the registry.`,
        });
        fetchStaff();
      } else {
        showToast({
          type: 'error',
          title: 'Delete Failed',
          message: json.error || 'Could not delete staff member.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Server failed to delete staff record.',
      });
    }
  };

  // Handle Open QR Modal
  const handleOpenQrModal = async (staff: StaffMemberRecord) => {
    setActiveQrStaff(staff);
    setIsGeneratingQr(true);
    setQrCodeDataUrl(null);

    try {
      const verificationUrl = `${window.location.origin}/verify/${encodeURIComponent(staff.workerId)}`;
      const dataUrl = await generateQrCodeDataUrl(verificationUrl);
      setQrCodeDataUrl(dataUrl);
    } catch {
      showToast({
        type: 'error',
        title: 'QR Code Error',
        message: 'Could not generate QR verification token.',
      });
    } finally {
      setIsGeneratingQr(false);
    }
  };

  // Handle Download QR Code
  const handleDownloadQr = () => {
    if (!activeQrStaff || !qrCodeDataUrl) return;
    const filename = `Apex-Staff-QR-${activeQrStaff.workerId}.png`;
    downloadDataUrlAsFile(qrCodeDataUrl, filename);
    showToast({
      type: 'success',
      title: 'QR Code Downloaded',
      message: `Saved ${filename} for employee badge printing.`,
    });
  };

  // Filtered staff list
  const filteredStaff = staffList.filter((s) => {
    const matchesDept = filterDepartment === 'All' || s.department === filterDepartment;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      s.fullName.toLowerCase().includes(q) ||
      s.workerId.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.designation.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);

    return matchesDept && matchesSearch;
  });

  const departmentsList = Array.from(
    new Set(staffList.map((s) => s.department).filter(Boolean))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Super Admin Restricted · Personnel Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Staff Directory & QR Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage certified educational counselors, auto-generate Worker IDs, and issue verifiable digital QR badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStaff}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register Employee
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Registered Staff
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {staffList.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Certified counselors, solicitors & managers
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Accredited Caseworkers</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800">
            {staffList.filter((s) => s.status === 'Active').length}
          </div>
          <div className="text-[11px] text-slate-400">
            Clearing British Council & PIER student petitions
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Public QR Badges Enabled
          </div>
          <div className="text-2xl font-bold font-mono text-sky-800">
            100%
          </div>
          <div className="text-[11px] text-slate-400">
            Encodes direct <code>/verify/:workerId</code> credentials
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search by name, worker ID, email, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Department:</span>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-700"
          >
            <option value="All">All Departments</option>
            {departmentsList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Employee & ID</th>
                <th className="py-3 px-4">Designation & Department</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-center">QR Badge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-600" />
                    <span>Loading staff directory from database...</span>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600">No staff members match your search criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &quot;Register Employee&quot; to onboard a new team member.</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Employee & Worker ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={staff.photoUrl}
                            alt={staff.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                '/src/assets/images/staff_counselor_female_1794140015435.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {staff.fullName}
                          </div>
                          <div className="font-mono text-sky-800 text-[11px] font-bold">
                            {staff.workerId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Department */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {staff.designation}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {staff.department}
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{staff.contactNumber}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        staff.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : staff.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          staff.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <span>{staff.status}</span>
                      </span>
                    </td>

                    {/* Joining Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {staff.joiningDate}
                    </td>

                    {/* QR Code Action Button */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenQrModal(staff)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                        title="Generate and view QR badge"
                      >
                        <QrCode className="w-3.5 h-3.5 text-sky-700" />
                        <span>QR Badge</span>
                      </button>
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingStaff(staff)}
                          className="p-1.5 text-slate-500 hover:text-sky-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Edit Employee"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(staff)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: REGISTER EMPLOYEE ================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150 max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Register New Staff Counselor</h3>
                  <p className="text-[11px] text-slate-500">Auto-assigns Worker ID and provisions credential profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStaff} className="p-6 space-y-4 text-xs overflow-y-auto">
              
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Miriam K. Al-Hassan"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="m.alhassan@apexglobaledu.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+44 20 7946 0991"
                    value={regContactNumber}
                    onChange={(e) => setRegContactNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">
                    Official Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior UK & Ireland Advisor"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Department</label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    <option value="International Admissions">International Admissions</option>
                    <option value="Immigration & Compliance">Immigration & Compliance</option>
                    <option value="Pacific Regional Desk">Pacific Regional Desk</option>
                    <option value="Continental Europe Desk">Continental Europe Desk</option>
                    <option value="Student Services & Relocation">Student Services & Relocation</option>
                    <option value="Executive Governance">Executive Governance</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Row */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block font-semibold text-slate-700">
                  Counselor Photo (Headshot Portrait)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={regPhotoUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs transition-colors cursor-pointer border border-slate-300">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                      />
                    </label>
                    <span className="text-[10px] text-slate-400 block">
                      JPEG, PNG, WebP up to 5MB. Stored on secure agency media host.
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Status</label>
                  <select
                    value={regStatus}
                    onChange={(e) => setRegStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={regJoiningDate}
                    onChange={(e) => setRegJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Casework Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Australia Subclass 500 & New Zealand Student Permits"
                  value={regSpecialization}
                  onChange={(e) => setRegSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-sky-50 border border-sky-100 rounded text-[11px] text-sky-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-800 shrink-0 mt-0.5" />
                <span>
                  The next available Worker ID will be automatically assigned. A cryptographic QR badge will be generated for student scanning.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegisterModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingStaff}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Confirm & Register
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT EMPLOYEE ================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150 max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Staff Profile: {editingStaff.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500">Worker ID: {editingStaff.workerId}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="p-6 space-y-4 text-xs overflow-y-auto">
              
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStaff.fullName}
                  onChange={(e) => setEditingStaff({ ...editingStaff, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={editingStaff.contactNumber}
                    onChange={(e) => setEditingStaff({ ...editingStaff, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.designation}
                    onChange={(e) => setEditingStaff({ ...editingStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Status</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Specialization</label>
                <input
                  type="text"
                  value={editingStaff.specialization || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingStaff(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUpdatingStaff}
                >
                  Save Changes
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: QR CODE VERIFICATION BADGE ================= */}
      {activeQrStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in duration-150">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-sky-400" />
                <span>Employee QR Verification Card</span>
              </span>
              <button
                onClick={() => setActiveQrStaff(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge Content */}
            <div className="p-6 text-center space-y-4">
              
              <div className="space-y-1">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-sky-600 mx-auto">
                  <img
                    src={activeQrStaff.photoUrl}
                    alt={activeQrStaff.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/src/assets/images/staff_counselor_female_1794140015435.jpg';
                    }}
                  />
                </div>
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  {activeQrStaff.fullName}
                </h3>
                <p className="text-xs text-sky-800 font-semibold">
                  {activeQrStaff.designation}
                </p>
                <p className="text-[11px] font-mono text-slate-500 font-bold">
                  Worker ID: {activeQrStaff.workerId}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg inline-block shadow-inner mx-auto">
                {isGeneratingQr ? (
                  <div className="w-56 h-56 flex flex-col items-center justify-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-sky-600 mb-2" />
                    <span className="text-xs">Generating QR...</span>
                  </div>
                ) : qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt={`QR Code for ${activeQrStaff.workerId}`}
                    className="w-56 h-56 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-rose-500 text-xs">
                    Failed to load QR code.
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Encodes Public Verification URL:</p>
                <p className="font-mono text-[10px] text-sky-700 truncate px-2 select-all">
                  {window.location.origin}/verify/{activeQrStaff.workerId}
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadQr}
                  disabled={!qrCodeDataUrl}
                  leftIcon={<Download className="w-4 h-4" />}
                  className="w-full"
                >
                  Download QR Code (PNG)
                </Button>

                <Link
                  to={`/verify/${encodeURIComponent(activeQrStaff.workerId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  <span>Open Public Verification Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
