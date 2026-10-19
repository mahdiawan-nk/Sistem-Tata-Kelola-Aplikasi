import React, { useState, useEffect } from 'react';
import { AuditLog } from '../types';
import { api } from '../services/api';
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getLogs({
        action: actionFilter !== 'all' ? actionFilter : undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: search.trim() || undefined,
      });
      setLogs(data);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 border border-emerald-200">CREATE</span>;
      case 'UPDATE':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-indigo-700 bg-indigo-50 border border-indigo-200">UPDATE</span>;
      case 'STATUS_CHANGE':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-amber-700 bg-amber-50 border border-amber-200">STATUS</span>;
      case 'DELETE':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-red-700 bg-red-50 border border-red-200">DELETE</span>;
      case 'LOGIN':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-slate-700 bg-slate-100 border border-slate-200">AUTH</span>;
      case 'RESTORE':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-purple-700 bg-purple-50 border border-purple-200">RESTORE</span>;
      default:
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-slate-600 bg-slate-50">{action}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Audit Trail & Akuntabilitas</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Log Perubahan Data Sistem Informasi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekaman riwayat lengkap seluruh aktivitas modifikasi data, penambahan sistem, dan login oleh setiap pengguna
            </p>
          </div>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan Log</span>
          </button>
        </div>

        {/* Filter controls */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user, sistem, atau isi perubahan..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Tipe Aksi</option>
              <option value="CREATE">CREATE (Tambah Sistem)</option>
              <option value="UPDATE">UPDATE (Edit Sistem)</option>
              <option value="STATUS_CHANGE">STATUS_CHANGE (Ubah Status)</option>
              <option value="DELETE">DELETE (Hapus Sistem)</option>
              <option value="LOGIN">LOGIN (Masuk Akun)</option>
              <option value="RESTORE">RESTORE (Pemulihan Data)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Peran User</option>
              <option value="admin">Administrator</option>
              <option value="staff">Staff Pengembang</option>
              <option value="viewer">Viewer / Manajemen</option>
            </select>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-44">Waktu (WIB)</th>
                <th className="py-3 px-4 w-24">Aksi</th>
                <th className="py-3 px-4 w-48">Pengguna (User)</th>
                <th className="py-3 px-4 w-48">Target Sistem</th>
                <th className="py-3 px-4">Deskripsi Perubahan & Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat log aktivitas...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                    Tidak ada catatan log aktivitas yang sesuai kriteria filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        <div>{dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="text-slate-400">{dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{log.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono capitalize">
                          Peran: {log.userRole}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {log.targetSystemName ? (
                          <div>
                            <span className="font-semibold text-slate-900 line-clamp-1">
                              {log.targetSystemName}
                            </span>
                            {log.targetSystemId && (
                              <span className="text-[10px] font-mono text-slate-400">
                                {log.targetSystemId}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sistem Umum</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {log.details}
                        </p>

                        {/* Diff changes if available */}
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {log.changes.map((c, i) => (
                              <div
                                key={i}
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded mr-2 mb-1"
                              >
                                <span className="font-semibold">{c.field}:</span>
                                <span className="line-through text-red-600">{String(c.oldValue ?? '-')}</span>
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                <span className="font-bold text-emerald-700">{String(c.newValue ?? '-')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
