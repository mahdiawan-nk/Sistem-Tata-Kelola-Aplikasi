import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Layers, FileText, Database, LogIn, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'systems' | 'logs' | 'data';
  onSelectTab: (tab: 'dashboard' | 'systems' | 'logs' | 'data') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { user, isLoggedIn, logout, setIsLoginModalOpen, role } = useAuth();

  const roleLabelMap: Record<string, { label: string; badgeClass: string }> = {
    admin: { label: 'Administrator', badgeClass: 'text-indigo-700 bg-indigo-50 border border-indigo-200' },
    staff: { label: 'Staff Pengembang', badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200' },
    viewer: { label: 'Viewer / Manajemen', badgeClass: 'text-slate-700 bg-slate-100 border border-slate-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              SI
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                SIM-Portofolio
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Tata Kelola Sistem Informasi
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line, clean typography) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'dashboard'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Ringkasan</span>
            </button>

            <button
              onClick={() => onSelectTab('systems')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'systems'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Daftar Sistem & Tata Kelola</span>
            </button>

            <button
              onClick={() => onSelectTab('logs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'logs'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Log Perubahan Data</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => onSelectTab('data')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  currentTab === 'data'
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Manajemen Data JSON</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Account / Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {user.name}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.2 rounded ${roleLabelMap[user.role]?.badgeClass || 'text-slate-600'}`}>
                      {roleLabelMap[user.role]?.label || user.role}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
                  {user.name.charAt(0)}
                </div>

                <button
                  onClick={logout}
                  title="Keluar dari akun"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${currentTab === 'dashboard' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-600'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('systems')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${currentTab === 'systems' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-600'}`}
          >
            Portofolio Sistem
          </button>
          <button
            onClick={() => onSelectTab('logs')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${currentTab === 'logs' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-600'}`}
          >
            Log Perubahan
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => onSelectTab('data')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${currentTab === 'data' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-600'}`}
            >
              Data JSON
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
