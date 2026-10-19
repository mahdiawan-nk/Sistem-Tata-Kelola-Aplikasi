import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Server,
  FileJson,
} from 'lucide-react';

interface DataManagementViewProps {
  onRefreshAll: () => void;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({ onRefreshAll }) => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Akses Terbatas</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Fitur manajemen berkas database JSON hanya dapat diakses oleh akun dengan peran Administrator.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    window.location.href = api.exportUrl();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        const systems = parsed.data?.systems || parsed.systems;
        const logs = parsed.data?.logs || parsed.logs;

        if (!Array.isArray(systems)) {
          throw new Error('Format JSON tidak sesuai: data array "systems" tidak ditemukan.');
        }

        await api.importData({ systems, logs });
        setSuccessMessage(`Berhasil memulihkan ${systems.length} sistem dari berkas ${file.name}.`);
        onRefreshAll();
      } catch (err: any) {
        setErrorMessage(err.message || 'Gagal memproses berkas JSON.');
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeed = async () => {
    if (
      !window.confirm(
        'Apakah Anda yakin ingin mereset seluruh database sistem informasi kembali ke seed awal standar institusi? Semua modifikasi manual akan dikembalikan ke data default.'
      )
    ) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await api.resetSeed();
      setSuccessMessage('Database berhasil direset kembali ke seed institusi awal (16 sistem lengkap).');
      onRefreshAll();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mereset data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          <span>Persistensi Berkas JSON</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Penyimpanan & Manajemen Data JSON
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Seluruh data portofolio sistem, akun pengguna, dan riwayat audit disimpan dalam format JSON untuk persistensi yang ringan dan integrasi mudah
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Export JSON */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Unduh Cadangan JSON</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ekspor seluruh database portofolio sistem informasi, riwayat log perubahan, dan metadata akun ke dalam satu berkas .json utuh.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas JSON</span>
          </button>
        </div>

        {/* Card 2: Restore / Import JSON */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pulihkan dari Berkas JSON</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Unggah berkas cadangan JSON yang sebelumnya diunduh untuk memulihkan atau menyinkronkan data antar lingkungan.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? 'Memproses...' : 'Pilih Berkas JSON'}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Reset to Standard Seed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset Data Awal Institusi</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Kembalikan kumpulan data ke standar awal dengan 16 sistem informasi komprehensif di 10 kategori tata kelola pendidikan tinggi.
            </p>
          </div>

          <button
            onClick={handleResetSeed}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Seed Awal</span>
          </button>
        </div>
      </div>

      {/* Storage Architecture Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Spesifikasi Struktur Berkas JSON</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <FileJson className="w-4 h-4 text-indigo-600" />
              <span>data/systems.json</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Menyimpan seluruh portofolio sistem informasi, kategori tata kelola, status rilis, progress, vendor, PIC, dan teknologi stack.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <FileJson className="w-4 h-4 text-emerald-600" />
              <span>data/audit_logs.json</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Menyimpan jejak audit tak-terhapus mengenai setiap aktivitas pengguna, pembaruan status aplikasi, dan detail rekaman perubahan.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <FileJson className="w-4 h-4 text-amber-600" />
              <span>data/users.json</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Menyimpan kredensial otentikasi akun dan penetapan peran Role-Based Access Control (Admin, Staff, Viewer).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
