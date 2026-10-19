import React, { useState, useMemo } from 'react';
import {
  DevType,
  SystemCategory,
  SystemItem,
  SystemStatus,
  SYSTEM_CATEGORIES,
  SYSTEM_STATUSES,
} from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Building,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface SystemsListViewProps {
  systems: SystemItem[];
  loading: boolean;
  onOpenSystemDetail: (system: SystemItem) => void;
  onOpenNewSystemModal: () => void;
  onOpenEditSystemModal: (system: SystemItem) => void;
  onDeleteSystem: (id: string, name: string) => void;
  initialCategory?: SystemCategory | 'all';
}

export const SystemsListView: React.FC<SystemsListViewProps> = ({
  systems,
  loading,
  onOpenSystemDetail,
  onOpenNewSystemModal,
  onOpenEditSystemModal,
  onDeleteSystem,
  initialCategory = 'all',
}) => {
  const { canEdit, canDelete, role } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SystemCategory | 'all'>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<SystemStatus | 'all'>('all');
  const [selectedDevType, setSelectedDevType] = useState<DevType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'category' | 'updatedAt'>('name');

  // Filtered and sorted systems
  const filteredSystems = useMemo(() => {
    let result = systems.filter((s) => {
      // Category filter
      if (selectedCategory !== 'all' && s.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && s.status !== selectedStatus) {
        return false;
      }
      // Dev type filter
      if (selectedDevType !== 'all' && s.devType !== selectedDevType) {
        return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const techFlat = Object.values(s.techStack || {})
          .flat()
          .join(' ')
          .toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.picName.toLowerCase().includes(q) ||
          s.unitPengelola.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.vendorName && s.vendorName.toLowerCase().includes(q)) ||
          techFlat.includes(q)
        );
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return 0;
    });

    return result;
  }, [systems, selectedCategory, selectedStatus, selectedDevType, search, sortBy]);

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Kode',
      'Nama Sistem',
      'Kategori Tata Kelola',
      'Status',
      'Progress (%)',
      'Tipe Pengembang',
      'Nama Vendor',
      'Unit Pengelola',
      'Nama PIC',
      'Email PIC',
      'Telepon PIC',
      'Versi',
      'Link Publik',
    ];

    const rows = filteredSystems.map((s) => [
      `"${s.id}"`,
      `"${s.code}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.category}"`,
      `"${s.status}"`,
      s.progress,
      `"${s.devType}"`,
      `"${s.vendorName || '-'}"`,
      `"${s.unitPengelola.replace(/"/g, '""')}"`,
      `"${s.picName.replace(/"/g, '""')}"`,
      `"${s.picEmail}"`,
      `"${s.picPhone}"`,
      `"${s.version || '-'}"`,
      `"${s.liveUrl || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portofolio_sistem_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Portofolio & Daftar Sistem Informasi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dan pantau seluruh sistem institusi lengkap dengan PIC, teknologi, dan status operasional
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              title="Unduh data dalam format CSV"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            {canEdit ? (
              <button
                onClick={onOpenNewSystemModal}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Sistem</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                Mode Viewer (Hanya Melihat)
              </span>
            )}
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama sistem, kode, PIC, unit, teknologi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 font-medium capitalize"
            >
              <option value="all">Semua Tata Kelola (10 Kategori)</option>
              {SYSTEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="publish">Publish</option>
              <option value="development">Development</option>
              <option value="planing">Planing</option>
            </select>
          </div>

          {/* Dev Type Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedDevType}
              onChange={(e) => setSelectedDevType(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Tipe Dev</option>
              <option value="mandiri">Mandiri (In-House)</option>
              <option value="vendor">Vendor Pihak Ketiga</option>
            </select>
          </div>
        </div>

        {/* View mode toggle & Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <strong className="text-slate-900 font-mono tabular-nums">{filteredSystems.length}</strong> dari{' '}
              <strong className="text-slate-900 font-mono tabular-nums">{systems.length}</strong> sistem informasi
            </span>
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || selectedDevType !== 'all' || search) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedDevType('all');
                  setSearch('');
                }}
                className="text-indigo-600 hover:text-indigo-800 underline font-medium ml-2"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Tampilan Grid Card"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Tampilan Tabel Data"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Memuat data sistem...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSystems.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Tidak ada sistem informasi yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau bersihkan filter tata kelola dan status.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedDevType('all');
              setSearch('');
            }}
            className="px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Bersihkan Semua Filter
          </button>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && filteredSystems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSystems.map((system) => {
            const isPublish = system.status === 'publish';
            const isDev = system.status === 'development';
            const isPlan = system.status === 'planing';

            return (
              <div
                key={system.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {system.code}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs font-medium text-slate-600 capitalize">
                          {system.category}
                        </span>
                      </div>
                      <h3
                        onClick={() => onOpenSystemDetail(system)}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors mt-0.5 line-clamp-1"
                      >
                        {system.name}
                      </h3>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        isPublish
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : isDev
                          ? 'text-amber-700 bg-amber-50 border border-amber-200'
                          : 'text-slate-700 bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {system.status === 'publish'
                        ? 'Publish'
                        : system.status === 'development'
                        ? 'Development'
                        : 'Planing'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 mb-3">
                    {system.description}
                  </p>

                  {/* Progress bar if not 100% or development */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-mono">
                      <span>Progres Aplikasi</span>
                      <span className="font-semibold text-slate-800 tabular-nums">{system.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isPublish ? 'bg-emerald-500' : isDev ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(system.progress, 5)}%` }}
                      />
                    </div>
                  </div>

                  {/* Unit & PIC Info Block */}
                  <div className="space-y-1.5 py-2.5 px-3 bg-slate-50 rounded-lg text-xs border border-slate-100 mb-3">
                    <div className="text-slate-700 flex items-center justify-between">
                      <span className="text-slate-400">Unit:</span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-[200px]" title={system.unitPengelola}>
                        {system.unitPengelola}
                      </span>
                    </div>
                    <div className="text-slate-700 flex items-center justify-between">
                      <span className="text-slate-400">PIC / Owner:</span>
                      <span className="font-semibold text-slate-900 text-right truncate max-w-[200px]" title={system.picName}>
                        {system.picName}
                      </span>
                    </div>
                    <div className="text-slate-700 flex items-center justify-between">
                      <span className="text-slate-400">Pengembang:</span>
                      <span className="font-medium text-slate-800 text-right">
                        {system.devType === 'mandiri' ? 'Mandiri (In-House)' : `Vendor (${system.vendorName || '3rd Party'})`}
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack Pills / Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {system.techStack?.frontend?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {t}
                      </span>
                    ))}
                    {system.techStack?.backend?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                        {t}
                      </span>
                    ))}
                    {system.techStack?.database?.slice(0, 1).map((t) => (
                      <span key={t} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenSystemDetail(system)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Detail
                    </button>

                    {isPublish && system.liveUrl && (
                      <a
                        href={system.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900"
                        title="Buka sistem live"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Akses</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => onOpenEditSystemModal(system)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Data Sistem"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => onDeleteSystem(system.id, system.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus Sistem (Khusus Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View (High-density tabular layout as per design constitution) */}
      {!loading && viewMode === 'table' && filteredSystems.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Kode & Sistem</th>
                  <th className="py-3 px-4">Tata Kelola</th>
                  <th className="py-3 px-4">Status & Progress</th>
                  <th className="py-3 px-4">Pengembang</th>
                  <th className="py-3 px-4">Unit & PIC</th>
                  <th className="py-3 px-4">Tech Stack</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSystems.map((system) => {
                  const isPublish = system.status === 'publish';
                  return (
                    <tr
                      key={system.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onOpenSystemDetail(system)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-500 text-[11px]">
                            {system.code}
                          </span>
                          <span className="font-semibold text-slate-900 group-hover:text-indigo-600">
                            {system.name}
                          </span>
                        </div>
                        {system.version && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Ver: {system.version}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 capitalize text-slate-700 font-medium">
                        {system.category}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              system.status === 'publish'
                                ? 'text-emerald-700 bg-emerald-50'
                                : system.status === 'development'
                                ? 'text-amber-700 bg-amber-50'
                                : 'text-slate-700 bg-slate-100'
                            }`}
                          >
                            {system.status}
                          </span>
                          <span className="font-mono text-slate-600 tabular-nums text-[11px]">
                            {system.progress}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        <div>
                          {system.devType === 'mandiri' ? (
                            <span className="font-medium text-slate-900">Mandiri (In-House)</span>
                          ) : (
                            <span className="font-medium text-indigo-700">Vendor</span>
                          )}
                        </div>
                        {system.vendorName && system.devType === 'vendor' && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {system.vendorName}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{system.picName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {system.unitPengelola}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {system.techStack?.backend?.slice(0, 1).map((t) => (
                            <span key={t} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                          {system.techStack?.frontend?.slice(0, 1).map((t) => (
                            <span key={t} className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isPublish && system.liveUrl && (
                            <a
                              href={system.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                              title="Buka Website Sistem"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {canEdit && (
                            <button
                              onClick={() => onOpenEditSystemModal(system)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              title="Edit Data"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => onDeleteSystem(system.id, system.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
