export type SystemCategory =
  | 'Pendidikan'
  | 'SDM'
  | 'Keuangan'
  | 'sarana prasana'
  | 'penelitian'
  | 'perpustakaan'
  | 'PMB'
  | 'sistem penjamin mutu'
  | 'pelaporan dikti'
  | 'alumni';

export const SYSTEM_CATEGORIES: SystemCategory[] = [
  'Pendidikan',
  'SDM',
  'Keuangan',
  'sarana prasana',
  'penelitian',
  'perpustakaan',
  'PMB',
  'sistem penjamin mutu',
  'pelaporan dikti',
  'alumni',
];

export type SystemStatus = 'publish' | 'development' | 'planing';

export const SYSTEM_STATUSES: { value: SystemStatus; label: string; desc: string }[] = [
  { value: 'publish', label: 'Publish', desc: 'Sistem aktif beroperasi dan dapat diakses pengguna' },
  { value: 'development', label: 'Development', desc: 'Dalam tahap aktif pengodean, pengujian, atau implementasi' },
  { value: 'planing', label: 'Planing', desc: 'Tahap perencanaan, TOR/RAB, analisis kebutuhan & persetujuan' },
];

export type DevType = 'mandiri' | 'vendor';

export type UserRole = 'admin' | 'staff' | 'viewer';

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  infra: string[];
}

export interface SystemItem {
  id: string;
  name: string;
  code: string;
  category: SystemCategory;
  status: SystemStatus;
  devType: DevType;
  vendorName?: string;
  unitPengelola: string;
  picName: string;
  picEmail: string;
  picPhone: string;
  picRole: string;
  techStack: TechStack;
  liveUrl?: string;
  documentationUrl?: string;
  progress: number; // 0 to 100
  description: string;
  targetLaunchDate?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'RESTORE' | 'STATUS_CHANGE';
  targetSystemId?: string;
  targetSystemName?: string;
  details: string;
  changes?: Array<{ field: string; oldValue: any; newValue: any }>;
}

export interface DashboardStats {
  totalSystems: number;
  publishCount: number;
  developmentCount: number;
  planingCount: number;
  mandiriCount: number;
  vendorCount: number;
  avgProgressDev: number;
  categoryDistribution: Record<SystemCategory, number>;
  statusByCategory: Record<SystemCategory, Record<SystemStatus, number>>;
  devTypeByCategory: Record<SystemCategory, Record<DevType, number>>;
  recentLogs: AuditLog[];
  topTechnologies: { name: string; count: number; category: 'frontend' | 'backend' | 'database' | 'infra' }[];
}
