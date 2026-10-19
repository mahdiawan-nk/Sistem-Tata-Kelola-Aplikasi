import React from 'react';
import { DashboardStats, SystemCategory, SystemItem, SYSTEM_CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ExternalLink,
  Layers,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Users,
  Code2,
  Server,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Activity,
  Plus,
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  systems: SystemItem[];
  loading: boolean;
  onOpenSystemDetail: (system: SystemItem) => void;
  onOpenNewSystemModal: () => void;
  onFilterCategory: (category: SystemCategory) => void;
  onGoToSystemsList: () => void;
  onGoToLogs: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  systems,
  loading,
  onOpenSystemDetail,
  onOpenNewSystemModal,
  onFilterCategory,
  onGoToSystemsList,
  onGoToLogs,
}) => {
  const { user, canEdit } = useAuth();

  if (loading || !stats) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Memuat ringkasan statistik terkini...</span>
      </div>
    );
  }

  // Active development systems
  const devSystems = systems.filter((s) => s.status === 'development');
  const publishedSystems = systems.filter((s) => s.status === 'publish');
  const planningSystems = systems.filter((s) => s.status === 'planing');

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Welcome & Context Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <span>Portofolio Teknologi Informasi Institusi</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">Real-Time Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard Tata Kelola Sistem Informasi
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Selamat datang, <span className="font-semibold text-slate-900">{user?.name}</span>. Pantau 10 pilar tata kelola sistem, status rilis, pengembangan aplikasi mandiri vs vendor, serta akuntabilitas PIC.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canEdit && (
              <button
                onClick={onOpenNewSystemModal}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Sistem Baru</span>
              </button>
            )}
            <button
              onClick={onGoToSystemsList}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap"
            >
              Lihat Semua Portofolio
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Primary Metric Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Sistem Terdaftar</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {stats.totalSystems}
            </span>
            <span className="text-xs text-slate-500 font-medium">Aplikasi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            10 Kategori Tata Kelola
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish (Aktif)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-emerald-600 tabular-nums">
              {stats.publishCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({Math.round((stats.publishCount / (stats.totalSystems || 1)) * 100)}%)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Siap digunakan civitas
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-amber-600 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Development (Aktif)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-amber-600 tabular-nums">
              {stats.developmentCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (Rerata {stats.avgProgressDev}%)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Dalam tahap sprint & coding
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Planing (Tahap Awal)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-800 tabular-nums">
              {stats.planingCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({Math.round((stats.planingCount / (stats.totalSystems || 1)) * 100)}%)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Penyusunan TOR & RKA
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 col-span-2 lg:col-span-1">
          <div className="text-xs font-medium text-indigo-600 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Mandiri vs Vendor</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-indigo-700 tabular-nums">
              {stats.mandiriCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {stats.vendorCount} Vendor
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {Math.round((stats.mandiriCount / (stats.totalSystems || 1)) * 100)}% In-House Dev
          </div>
        </div>
      </div>

      {/* 10 Pilar Tata Kelola Sistem Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Distribusi 10 Tata Kelola Sistem Informasi
            </h2>
            <p className="text-xs text-slate-500">
              Klasifikasi portofolio berdasarkan fungsi tata kelola perguruan tinggi
            </p>
          </div>
          <span className="text-xs text-slate-500">Klik pilar untuk filter data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SYSTEM_CATEGORIES.map((category) => {
            const count = stats.categoryDistribution[category] || 0;
            const categorySystems = stats.statusByCategory[category] || { publish: 0, development: 0, planing: 0 };

            return (
              <button
                key={category}
                onClick={() => onFilterCategory(category)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 capitalize">
                    {category}
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                    {count}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="text-emerald-700" title="Publish">{categorySystems.publish} Pub</span>
                  <span className="text-amber-700" title="Development">{categorySystems.development} Dev</span>
                  <span className="text-slate-600" title="Planing">{categorySystems.planing} Plan</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Development Monitor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Progress Tracking for In-Development & Planing Systems */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Pemantauan Sistem Dalam Pengembangan & Perencanaan
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring kemajuan pengerjaan, target rilis, dan penanggung jawab teknis (PIC)
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 tabular-nums">
              {devSystems.length + planningSystems.length} Sistem Aktif
            </span>
          </div>

          <div className="space-y-4">
            {[...devSystems, ...planningSystems].map((system) => {
              const isDev = system.status === 'development';
              return (
                <div
                  key={system.id}
                  onClick={() => onOpenSystemDetail(system)}
                  className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {system.code}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                          {system.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="capitalize">{system.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{system.unitPengelola}</span>
                        <span aria-hidden="true">·</span>
                        <span>PIC: {system.picName}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isDev
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-slate-700 bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {isDev ? 'Development' : 'Planing'}
                      </span>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-1 tabular-nums">
                        {system.progress}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDev ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.max(system.progress, 5)}%` }}
                    />
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <span>
                        Tipe: {system.devType === 'mandiri' ? 'Mandiri (In-House)' : `Vendor (${system.vendorName || 'Pihak Ketiga'})`}
                      </span>
                      {system.version && (
                        <span>Versi: <strong className="font-mono text-slate-700">{system.version}</strong></span>
                      )}
                    </div>

                    {system.targetLaunchDate && (
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Target: {system.targetLaunchDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {devSystems.length === 0 && planningSystems.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                Semua sistem saat ini telah terpublikasi.
              </div>
            )}
          </div>
        </div>

        {/* Right col: Tech Stack Radar & Recent Logs */}
        <div className="space-y-6">
          {/* Tech Stack Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Teknologi Terbanyak</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Ekosistem IT</span>
            </div>

            <div className="space-y-2">
              {stats.topTechnologies.slice(0, 8).map((tech) => (
                <div key={tech.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{tech.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">({tech.category})</span>
                  </div>
                  <span className="font-mono text-slate-600 font-semibold tabular-nums">
                    {tech.count} sistem
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Log widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Aktivitas Terkini</h3>
              </div>
              <button
                onClick={onGoToLogs}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {stats.recentLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                    <span className="font-semibold text-slate-700">{log.userName}</span>
                    <span className="font-mono">{new Date(log.timestamp).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launcher: Published Applications (Direct Link) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Akses Langsung Sistem Publish (Live Applications)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tautan langsung menuju platform sistem informasi yang telah aktif dan dapat diakses publik/internal
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-700 tabular-nums">
            {publishedSystems.length} Sistem Siap Akses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {publishedSystems.map((system) => (
            <div
              key={system.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    {system.code}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Publish
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {system.name}
                </h4>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {system.description}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-medium">
                  PIC: {system.picName}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenSystemDetail(system)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Detail
                </button>

                {system.liveUrl ? (
                  <a
                    href={system.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Buka Sistem</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">URL Belum Diatur</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
