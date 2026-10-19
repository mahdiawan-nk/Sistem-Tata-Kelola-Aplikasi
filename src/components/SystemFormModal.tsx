import React, { useEffect, useState } from 'react';
import {
  DevType,
  SystemCategory,
  SystemItem,
  SystemStatus,
  SYSTEM_CATEGORIES,
  SYSTEM_STATUSES,
  TechStack,
} from '../types';
import { X, Check, AlertCircle, Plus } from 'lucide-react';

interface SystemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SystemItem>) => Promise<void>;
  initialData?: SystemItem | null;
}

export const SystemFormModal: React.FC<SystemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<SystemCategory>('Pendidikan');
  const [status, setStatus] = useState<SystemStatus>('publish');
  const [progress, setProgress] = useState<number>(100);
  const [devType, setDevType] = useState<DevType>('mandiri');
  const [vendorName, setVendorName] = useState('');
  const [unitPengelola, setUnitPengelola] = useState('');
  const [picName, setPicName] = useState('');
  const [picRole, setPicRole] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [documentationUrl, setDocumentationUrl] = useState('');
  const [targetLaunchDate, setTargetLaunchDate] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [description, setDescription] = useState('');

  // Tech stack string inputs
  const [frontendInput, setFrontendInput] = useState('');
  const [backendInput, setBackendInput] = useState('');
  const [databaseInput, setDatabaseInput] = useState('');
  const [infraInput, setInfraInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setCategory(initialData.category || 'Pendidikan');
      setStatus(initialData.status || 'publish');
      setProgress(initialData.progress ?? 100);
      setDevType(initialData.devType || 'mandiri');
      setVendorName(initialData.vendorName || '');
      setUnitPengelola(initialData.unitPengelola || '');
      setPicName(initialData.picName || '');
      setPicRole(initialData.picRole || '');
      setPicEmail(initialData.picEmail || '');
      setPicPhone(initialData.picPhone || '');
      setLiveUrl(initialData.liveUrl || '');
      setDocumentationUrl(initialData.documentationUrl || '');
      setTargetLaunchDate(initialData.targetLaunchDate || '');
      setVersion(initialData.version || 'v1.0.0');
      setDescription(initialData.description || '');

      setFrontendInput((initialData.techStack?.frontend || []).join(', '));
      setBackendInput((initialData.techStack?.backend || []).join(', '));
      setDatabaseInput((initialData.techStack?.database || []).join(', '));
      setInfraInput((initialData.techStack?.infra || []).join(', '));
    } else {
      setName('');
      setCode('');
      setCategory('Pendidikan');
      setStatus('development');
      setProgress(50);
      setDevType('mandiri');
      setVendorName('');
      setUnitPengelola('');
      setPicName('');
      setPicRole('');
      setPicEmail('');
      setPicPhone('');
      setLiveUrl('');
      setDocumentationUrl('');
      setTargetLaunchDate('');
      setVersion('v1.0.0');
      setDescription('');
      setFrontendInput('React, Tailwind CSS');
      setBackendInput('Node.js, Express');
      setDatabaseInput('PostgreSQL');
      setInfraInput('Docker');
    }
    setError(null);
  }, [initialData, isOpen]);

  // Adjust progress automatically when status changes
  const handleStatusChange = (newStatus: SystemStatus) => {
    setStatus(newStatus);
    if (newStatus === 'publish') {
      setProgress(100);
    } else if (newStatus === 'planing' && progress > 30) {
      setProgress(15);
    } else if (newStatus === 'development' && progress === 100) {
      setProgress(50);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !code.trim() || !unitPengelola.trim() || !picName.trim()) {
      setError('Nama sistem, kode, unit pengelola, dan PIC wajib diisi.');
      return;
    }

    if (devType === 'vendor' && !vendorName.trim()) {
      setError('Nama vendor pihak ketiga wajib diisi untuk pengembangan tipe vendor.');
      return;
    }

    setLoading(true);

    const parseTags = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const techStack: TechStack = {
      frontend: parseTags(frontendInput),
      backend: parseTags(backendInput),
      database: parseTags(databaseInput),
      infra: parseTags(infraInput),
    };

    const payload: Partial<SystemItem> = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      category,
      status,
      progress: status === 'publish' ? 100 : Number(progress),
      devType,
      vendorName: devType === 'vendor' ? vendorName.trim() : 'In-House Internal',
      unitPengelola: unitPengelola.trim(),
      picName: picName.trim(),
      picRole: picRole.trim(),
      picEmail: picEmail.trim(),
      picPhone: picPhone.trim(),
      liveUrl: liveUrl.trim() || undefined,
      documentationUrl: documentationUrl.trim() || undefined,
      targetLaunchDate: targetLaunchDate || undefined,
      version: version.trim() || 'v1.0.0',
      description: description.trim(),
      techStack,
    };

    try {
      await onSubmit(payload);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Gagal menyimpan data sistem.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {initialData ? 'Perbarui Sistem Informasi' : 'Tambah Sistem Informasi Baru'}
            </h2>
            <p className="text-xs text-slate-500">
              Isi data arsitektur sistem, tata kelola, dan akuntabilitas penanggung jawab
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              1. Identitas Sistem & Tata Kelola
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Sistem Informasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: SIAKAD One - Sistem Informasi Akademik"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Sistem <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: SIAKAD"
                  className="w-full px-3 py-2 text-xs font-mono font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Tata Kelola <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SystemCategory)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                >
                  {SYSTEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Aplikasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as SystemStatus)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                >
                  {SYSTEM_STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label} ({st.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Versi Aplikasi
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.0"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Progress Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                <span className="font-semibold">Progres Pengembangan: {progress}%</span>
                {status === 'publish' && (
                  <span className="text-[11px] text-emerald-600 font-medium">(Otomatis 100% untuk sistem publish)</span>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={status === 'publish'}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi & Fungsi Sistem
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan peran, cakupan pengguna, dan fungsi utama sistem informasi ini..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Ownership & PIC */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              2. Unit Pengelola, Vendor & Penanggung Jawab (PIC)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipe Kepemilikan & Pengembang <span className="text-red-500">*</span>
                </label>
                <select
                  value={devType}
                  onChange={(e) => setDevType(e.target.value as DevType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="mandiri">Milik Institusi (Development Mandiri / In-House)</option>
                  <option value="vendor">Vendor Pihak Ketiga</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {devType === 'vendor' ? 'Nama Vendor Pihak Ketiga *' : 'Tim Internal'}
                </label>
                <input
                  type="text"
                  required={devType === 'vendor'}
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder={devType === 'vendor' ? 'PT Solusi Teknologi Nusantara' : 'UPT TIK Internal'}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit Pengelola Kampus / Biro / Lembaga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={unitPengelola}
                onChange={(e) => setUnitPengelola(e.target.value)}
                placeholder="Contoh: Biro Administrasi Akademik & Kemahasiswaan (BAAK)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama PIC (Penanggung Jawab Sistem) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="Ir. Rahmat Hidayat, M.Kom"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Peran PIC
                </label>
                <input
                  type="text"
                  value={picRole}
                  onChange={(e) => setPicRole(e.target.value)}
                  placeholder="Koordinator Sistem Akademik / Pranata Komputer"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email PIC
                </label>
                <input
                  type="email"
                  value={picEmail}
                  onChange={(e) => setPicEmail(e.target.value)}
                  placeholder="pic@kampus.ac.id"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp PIC
                </label>
                <input
                  type="text"
                  value={picPhone}
                  onChange={(e) => setPicPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technology Stack */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              3. Arsitektur & Teknologi Stack
            </h3>
            <p className="text-[11px] text-slate-500">
              Pisahkan beberapa teknologi dengan tanda koma (contoh: React, Tailwind CSS)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Frontend Framework & UI
                </label>
                <input
                  type="text"
                  value={frontendInput}
                  onChange={(e) => setFrontendInput(e.target.value)}
                  placeholder="React 18, Tailwind CSS, Vite"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Backend API & Framework
                </label>
                <input
                  type="text"
                  value={backendInput}
                  onChange={(e) => setBackendInput(e.target.value)}
                  placeholder="Node.js, Express, Laravel 11, FastAPI"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Database & Cache
                </label>
                <input
                  type="text"
                  value={databaseInput}
                  onChange={(e) => setDatabaseInput(e.target.value)}
                  placeholder="PostgreSQL, Redis, MySQL, MongoDB"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Server, Cloud & Infrastruktur
                </label>
                <input
                  type="text"
                  value={infraInput}
                  onChange={(e) => setInfraInput(e.target.value)}
                  placeholder="Docker, Nginx, Kubernetes, Proxmox"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: URLs & Target Date */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              4. Tautan & Rencana Rilis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Live Sistem (Jika Sudah Publish)
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://siakad.kampus.ac.id"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Dokumentasi Teknis / Repositori
                </label>
                <input
                  type="url"
                  value={documentationUrl}
                  onChange={(e) => setDocumentationUrl(e.target.value)}
                  placeholder="https://docs.kampus.ac.id/wiki"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target / Tanggal Peluncuran (Go-Live)
              </label>
              <input
                type="date"
                value={targetLaunchDate}
                onChange={(e) => setTargetLaunchDate(e.target.value)}
                className="w-full md:w-1/2 px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambahkan Sistem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
