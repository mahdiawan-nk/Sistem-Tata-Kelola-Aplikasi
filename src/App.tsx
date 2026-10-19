import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardStats, SystemCategory, SystemItem } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { SystemsListView } from './components/SystemsListView';
import { SystemDetailModal } from './components/SystemDetailModal';
import { SystemFormModal } from './components/SystemFormModal';
import { AuditLogView } from './components/AuditLogView';
import { DataManagementView } from './components/DataManagementView';
import { AlertCircle, CheckCircle2, Shield, Lock, ArrowRight } from 'lucide-react';

function MainApp() {
  const { user, isLoggedIn, isLoginModalOpen, setIsLoginModalOpen, canEdit, canDelete } = useAuth();

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'systems' | 'logs' | 'data'>('dashboard');
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedSystem, setSelectedSystem] = useState<SystemItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemItem | null>(null);

  // Filter state passed from dashboard to systems list
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<SystemCategory | 'all'>('all');

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [systemsRes, statsRes] = await Promise.all([api.getSystems(), api.getStats()]);
      setSystems(systemsRes.data);
      setStats(statsRes);
    } catch (err: any) {
      console.error('Failed to load systems data:', err);
      showNotification('Gagal memuat data dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isLoggedIn]);

  // Handlers
  const handleOpenDetail = (system: SystemItem) => {
    setSelectedSystem(system);
    setIsDetailModalOpen(true);
  };

  const handleOpenCreate = () => {
    if (!canEdit) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingSystem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (system: SystemItem) => {
    if (!canEdit) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingSystem(system);
    setIsFormModalOpen(true);
  };

  const handleDeleteSystem = async (id: string, name: string) => {
    if (!canDelete) {
      showNotification('Hanya admin yang memiliki izin menghapus sistem.', 'error');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus sistem "${name}" dari portofolio? Tindakan ini akan dicatat dalam audit log.`)) {
      try {
        await api.deleteSystem(id);
        showNotification(`Sistem "${name}" berhasil dihapus.`);
        loadData();
      } catch (err: any) {
        showNotification(err.message || 'Gagal menghapus sistem.', 'error');
      }
    }
  };

  const handleFormSubmit = async (data: Partial<SystemItem>) => {
    if (editingSystem) {
      await api.updateSystem(editingSystem.id, data);
      showNotification(`Data sistem "${data.name}" berhasil diperbarui.`);
    } else {
      await api.createSystem(data);
      showNotification(`Sistem baru "${data.name}" berhasil ditambahkan.`);
    }
    loadData();
  };

  const handleFilterCategoryFromDashboard = (cat: SystemCategory) => {
    setActiveCategoryFilter(cat);
    setCurrentTab('systems');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : 'bg-red-900 text-white border-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Unauthenticated Quick Welcome Banner (if not logged in) */}
      {!isLoggedIn && (
        <div className="bg-indigo-900 text-white py-2.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-200">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Anda sedang melihat ringkasan publik. Masuk dengan akun <strong>Admin</strong>, <strong>Staff Pengembang</strong>, atau <strong>Viewer</strong> untuk akses penuh.
              </span>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold rounded-md transition-colors text-xs shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Buka Modal Login RBAC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            systems={systems}
            loading={loading}
            onOpenSystemDetail={handleOpenDetail}
            onOpenNewSystemModal={handleOpenCreate}
            onFilterCategory={handleFilterCategoryFromDashboard}
            onGoToSystemsList={() => {
              setActiveCategoryFilter('all');
              setCurrentTab('systems');
            }}
            onGoToLogs={() => setCurrentTab('logs')}
          />
        )}

        {currentTab === 'systems' && (
          <SystemsListView
            systems={systems}
            loading={loading}
            onOpenSystemDetail={handleOpenDetail}
            onOpenNewSystemModal={handleOpenCreate}
            onOpenEditSystemModal={handleOpenEdit}
            onDeleteSystem={handleDeleteSystem}
            initialCategory={activeCategoryFilter}
          />
        )}

        {currentTab === 'logs' && <AuditLogView />}

        {currentTab === 'data' && (
          <DataManagementView
            onRefreshAll={() => {
              loadData();
              showNotification('Database diperbarui.');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>SIM-Portofolio IT & Tata Kelola Sistem Informasi Institusi</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="font-mono">JSON Persistence Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Role-Based Access Control</span>
            <span aria-hidden="true">·</span>
            <span>Audit Trail Log</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          showNotification('Berhasil masuk akun.');
          loadData();
          setCurrentTab('dashboard');
        }}
      />

      <SystemDetailModal
        system={selectedSystem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(system) => {
          setIsDetailModalOpen(false);
          handleOpenEdit(system);
        }}
        onDelete={(id, name) => {
          setIsDetailModalOpen(false);
          handleDeleteSystem(id, name);
        }}
      />

      <SystemFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSystem}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
