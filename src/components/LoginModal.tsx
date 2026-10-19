import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, Eye as EyeIcon, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Gagal masuk akun. Periksa email dan kata sandi Anda.');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Lock className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Otentikasi Aman</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Masuk Sistem Informasi</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akses portofolio berbasis peran hak akses (Role-Based Access Control)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-medium">Otentikasi Ditolak</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email Institusi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kampus.ac.id"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span>Memverifikasi akun...</span>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Akun Demo Cepat (RBAC)
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@kampus.ac.id', 'admin123')}
                className="w-full text-left p-2.5 rounded-lg border border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700">
                      Admin (Semua Akses)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Ahmad Fauzi, M.Kom · UPT TIK
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                  Pilih
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff@kampus.ac.id', 'staff123')}
                className="w-full text-left p-2.5 rounded-lg border border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
                      Staff Pengembangan
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Siti Rahmawati, S.Kom · Input & Monitor
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Pilih
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manajemen@kampus.ac.id', 'viewer123')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <EyeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-slate-800">
                      Viewer (Khusus Manajemen)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Prof. Gunawan · Lihat Dashboard Saja
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                  Pilih
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
