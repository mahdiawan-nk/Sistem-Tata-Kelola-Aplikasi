import React, { useEffect, useState } from 'react';
import { AuditLog, SystemItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  X,
  ExternalLink,
  BookOpen,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  Layers,
  Code2,
  Server,
  Database,
  Globe,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  History,
} from 'lucide-react';

interface SystemDetailModalProps {
  system: SystemItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (system: SystemItem) => void;
  onDelete: (id: string, name: string) => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({
  system,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { canEdit, canDelete } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (system && isOpen) {
      setLoadingLogs(true);
      api
        .getLogs({ search: system.name })
        .then((data) => {
          setLogs(data.slice(0, 5));
          setLoadingLogs(false);
        })
        .catch(() => {
          setLoadingLogs(false);
        });
    }
  }, [system, isOpen]);

  if (!isOpen || !system) return null;

  const isPublish = system.status === 'publish';
  const isDev = system.status === 'development';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <span className="font-mono text-indigo-600 font-bold">{system.code}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{system.category}</span>
              <span aria-hidden="true">·</span>
              <span>Versi {system.version || 'v1.0'}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{system.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & Progress Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                    isPublish
                      ? 'text-emerald-700 bg-emerald-100 border border-emerald-200'
                      : isDev
                      ? 'text-amber-700 bg-amber-100 border border-amber-200'
                      : 'text-slate-700 bg-slate-200 border border-slate-300'
                  }`}
                >
                  Status: {system.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Progres: <strong className="text-slate-800">{system.progress}%</strong>
                </span>
              </div>

              {system.targetLaunchDate && (
                <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target: {system.targetLaunchDate}</span>
                </div>
              )}
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isPublish ? 'bg-emerald-500' : isDev ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.max(system.progress, 5)}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Deskripsi & Tujuan Sistem
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
              {system.description}
            </p>
          </div>

          {/* PIC (Owner) & Unit Pengelola */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Akuntabilitas & Kontak Penanggung Jawab (PIC)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="text-xs text-slate-500 font-medium">Penanggung Jawab Sistem (PIC)</div>
                <div className="text-sm font-bold text-slate-900">{system.picName}</div>
                <div className="text-xs text-slate-600">{system.picRole}</div>
                <div className="pt-2 flex flex-col gap-1 text-xs">
                  <a
                    href={`mailto:${system.picEmail}`}
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{system.picEmail}</span>
                  </a>
                  <a
                    href={`tel:${system.picPhone}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{system.picPhone}</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="text-xs text-slate-500 font-medium">Unit Pengelola & Pengembang</div>
                <div className="text-sm font-bold text-slate-900">{system.unitPengelola}</div>
                <div className="text-xs text-slate-600">
                  Kepemilikan:{' '}
                  <strong className="text-slate-900">
                    {system.devType === 'mandiri' ? 'Milik Institusi (Mandiri)' : 'Vendor Pihak Ketiga'}
                  </strong>
                </div>
                {system.devType === 'vendor' && system.vendorName && (
                  <div className="text-xs text-indigo-700 font-medium pt-1">
                    Mitra: {system.vendorName}
                  </div>
                )}
                <div className="text-[11px] text-slate-400 pt-2 font-mono">
                  Terakhir update: {new Date(system.updatedAt).toLocaleDateString('id-ID')} oleh {system.updatedBy}
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack Grid */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Teknologi Stack Platform
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Frontend</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {system.techStack?.frontend?.length > 0 ? (
                    system.techStack.frontend.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Backend</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {system.techStack?.backend?.length > 0 ? (
                    system.techStack.backend.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Database</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {system.techStack?.database?.length > 0 ? (
                    system.techStack.database.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                  <Server className="w-3.5 h-3.5 text-amber-600" />
                  <span>Infrastruktur</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {system.techStack?.infra?.length > 0 ? (
                    system.techStack.infra.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* System Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {system.liveUrl && (
              <a
                href={system.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Aplikasi Sistem ({system.liveUrl})</span>
              </a>
            )}

            {system.documentationUrl && (
              <a
                href={system.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Dokumentasi Teknis & Panduan</span>
              </a>
            )}
          </div>

          {/* Recent Audit History for this System */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
              <History className="w-4 h-4" />
              <span>Riwayat Perubahan Data Aplikasi Ini</span>
            </div>

            {loadingLogs ? (
              <div className="text-xs text-slate-400 py-2">Memuat riwayat log...</div>
            ) : logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                      <span className="font-semibold text-slate-800">{log.userName}</span>
                      <span className="font-mono">{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-slate-700">{log.details}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-1">Belum ada riwayat aktivitas untuk aplikasi ini.</div>
            )}
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(system);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Sistem</span>
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(system.id, system.name);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Sistem</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
