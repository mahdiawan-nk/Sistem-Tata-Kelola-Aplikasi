import { AuditLog, DashboardStats, SystemItem, User } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sim_auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal masuk.');
    }
    return data;
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Sesi tidak valid.');
    }
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('sim_auth_token');
      localStorage.removeItem('sim_auth_user');
    }
  },

  // Systems
  async getSystems(params?: {
    category?: string;
    status?: string;
    devType?: string;
    search?: string;
  }): Promise<{ data: SystemItem[]; total: number; unfilteredTotal: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.devType) query.append('devType', params.devType);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/systems?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memuat data sistem.');
    }
    return data;
  },

  async getSystem(id: string): Promise<SystemItem> {
    const res = await fetch(`${API_BASE}/systems/${id}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memuat detail sistem.');
    }
    return data.data;
  },

  async createSystem(systemData: Partial<SystemItem>): Promise<SystemItem> {
    const res = await fetch(`${API_BASE}/systems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(systemData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal membuat sistem baru.');
    }
    return data.data;
  },

  async updateSystem(id: string, updates: Partial<SystemItem>): Promise<SystemItem> {
    const res = await fetch(`${API_BASE}/systems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui data sistem.');
    }
    return data.data;
  },

  async deleteSystem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/systems/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menghapus data sistem.');
    }
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memuat ringkasan statistik.');
    }
    return data;
  },

  // Audit Logs
  async getLogs(params?: { action?: string; role?: string; search?: string }): Promise<AuditLog[]> {
    const query = new URLSearchParams();
    if (params?.action) query.append('action', params.action);
    if (params?.role) query.append('role', params.role);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/logs?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memuat log audit.');
    }
    return data.data;
  },

  // Users (admin)
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memuat daftar pengguna.');
    }
    return data.data;
  },

  // Export JSON
  exportUrl(): string {
    return `${API_BASE}/export`;
  },

  async importData(payload: { systems: any[]; logs?: any[] }): Promise<void> {
    const res = await fetch(`${API_BASE}/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memulihkan database.');
    }
  },

  async resetSeed(): Promise<void> {
    const res = await fetch(`${API_BASE}/reset-seed`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal mereset data.');
    }
  },
};
