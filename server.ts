import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const SYSTEMS_FILE = path.join(DATA_DIR, 'systems.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'audit_logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Seed Users
const DEFAULT_USERS = [
  {
    id: 'USR-001',
    name: 'Ahmad Fauzi, M.Kom',
    email: 'admin@kampus.ac.id',
    password: 'admin123',
    role: 'admin',
    department: 'UPT Teknologi Informasi & Komunikasi',
    phone: '+62 811-2345-6789',
  },
  {
    id: 'USR-002',
    name: 'Siti Rahmawati, S.Kom',
    email: 'staff@kampus.ac.id',
    password: 'staff123',
    role: 'staff',
    department: 'Divisi Pengembangan Aplikasi & Integrasi',
    phone: '+62 812-3456-7890',
  },
  {
    id: 'USR-003',
    name: 'Prof. Dr. Ir. Gunawan Wibisono',
    email: 'manajemen@kampus.ac.id',
    password: 'viewer123',
    role: 'viewer',
    department: 'Wakil Rektor Bidang Perencanaan & Sistem Informasi',
    phone: '+62 813-4567-8901',
  },
];

// Default Seed Systems across all 10 governance categories
const DEFAULT_SYSTEMS = [
  {
    id: 'SIS-EDU-01',
    name: 'SIAKAD One - Sistem Informasi Akademik Terpadu',
    code: 'SIAKAD',
    category: 'Pendidikan',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'UPT TIK Internal',
    unitPengelola: 'Biro Administrasi Akademik & Kemahasiswaan (BAAK)',
    picName: 'Ir. Rahmat Hidayat, M.Kom',
    picEmail: 'rahmat.hidayat@kampus.ac.id',
    picPhone: '+62 812-9876-5432',
    picRole: 'Koordinator Pengembangan SIAKAD',
    techStack: {
      frontend: ['React 18', 'Tailwind CSS', 'Vite'],
      backend: ['PHP 8.2 Laravel 11', 'REST API'],
      database: ['PostgreSQL 16', 'Redis Cache'],
      infra: ['Docker', 'Nginx Reverse Proxy', 'Proxmox VE Cluster'],
    },
    liveUrl: 'https://siakad.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/siakad/v3',
    progress: 100,
    description: 'Pusat pengelolaan data akademik mahasiswa, KRS online, input nilai dosen, transkrip nilai, kurikulum MBKM, dan jadwal perkuliahan.',
    targetLaunchDate: '2024-01-15',
    version: 'v3.4.2',
    createdAt: '2023-06-10T08:00:00.000Z',
    updatedAt: '2025-02-14T10:30:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-EDU-02',
    name: 'EduSmart LMS - Learning Management System',
    code: 'EDUSMART',
    category: 'Pendidikan',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'UPT Pembelajaran Digital',
    unitPengelola: 'Pusat Pengembangan Kurikulum & Pembelajaran Daring',
    picName: 'Dr. Siti Nurhaliza, M.Pd',
    picEmail: 'siti.nurhaliza@kampus.ac.id',
    picPhone: '+62 813-1122-3344',
    picRole: 'Kepala Pusat E-Learning',
    techStack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
      backend: ['Python FastAPI', 'Node.js WebSocket'],
      database: ['PostgreSQL', 'MinIO Object Storage'],
      infra: ['Kubernetes', 'Cloudflare CDN', 'Linux VPS'],
    },
    liveUrl: 'https://lms.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/lms',
    progress: 100,
    description: 'Platform kuliah daring interaktif, upload modul materi, tugas, kuis berbasis proctoring, dan presensi kuliah sinkron/asinkron.',
    targetLaunchDate: '2024-05-20',
    version: 'v2.8.0',
    createdAt: '2023-09-01T09:15:00.000Z',
    updatedAt: '2025-01-20T14:00:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-HR-01',
    name: 'SIMPEG Terpadu - Sistem Informasi Manajemen Kepegawaian',
    code: 'SIMPEG',
    category: 'SDM',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'Divisi TI SDM Kampus',
    unitPengelola: 'Biro Kepegawaian & Sumber Daya Manusia',
    picName: 'Budi Santoso, S.Kom',
    picEmail: 'budi.santoso@kampus.ac.id',
    picPhone: '+62 856-7890-1234',
    picRole: 'Pranata Komputer Madya',
    techStack: {
      frontend: ['Vue.js 3', 'Pinia', 'Tailwind CSS'],
      backend: ['Java Spring Boot 3', 'Hibernate ORM'],
      database: ['Oracle Database 19c', 'Redis'],
      infra: ['On-Premise Server', 'HAProxy Load Balancer'],
    },
    liveUrl: 'https://simpeg.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/simpeg',
    progress: 100,
    description: 'Manajemen riwayat jabatan, kepangkatan dosen & tendik, presensi biometrik GPS, cuti pegawai, dan kenaikan jenjang akademik (JJA).',
    targetLaunchDate: '2023-11-10',
    version: 'v4.1.0',
    createdAt: '2023-04-12T07:30:00.000Z',
    updatedAt: '2025-02-01T11:20:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-HR-02',
    name: 'Remunerasi & BKD Online - Sistem Kinerja Dosen',
    code: 'REMU-BKD',
    category: 'SDM',
    status: 'development',
    devType: 'vendor',
    vendorName: 'PT Solusi Kampus Cerdas',
    unitPengelola: 'Biro Kepegawaian & Tim Asesor BKD',
    picName: 'Hendra Wijaya, M.T',
    picEmail: 'hendra.wijaya@kampus.ac.id',
    picPhone: '+62 878-3344-5566',
    picRole: 'Ketua Tim Teknis Remunerasi',
    techStack: {
      frontend: ['React 18', 'Ant Design', 'TypeScript'],
      backend: ['Go (Golang) Gin Framework', 'gRPC'],
      database: ['PostgreSQL 16'],
      infra: ['AWS EC2', 'AWS RDS', 'Docker Compose'],
    },
    documentationUrl: 'https://wiki.kampus.ac.id/proyek/remu-bkd',
    progress: 75,
    description: 'Kalkulasi otomatis poin remunerasi dosen dan tenaga kependidikan berbasis IKU (Indikator Kinerja Utama) dan Beban Kerja Dosen (BKD).',
    targetLaunchDate: '2025-06-30',
    version: 'v1.0.0-rc2',
    createdAt: '2024-06-01T10:00:00.000Z',
    updatedAt: '2025-02-18T16:45:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-FIN-01',
    name: 'SIMKEU Integrated - Sistem Informasi Keuangan & RKA',
    code: 'SIMKEU',
    category: 'Keuangan',
    status: 'publish',
    devType: 'vendor',
    vendorName: 'PT Finansial Teknologi Nusantara',
    unitPengelola: 'Biro Keuangan & Perencanaan Anggaran',
    picName: 'Dewi Kartika, S.E., M.Ak',
    picEmail: 'dewi.kartika@kampus.ac.id',
    picPhone: '+62 821-4455-6677',
    picRole: 'Kepala Bagian Akuntansi & Verifikasi',
    techStack: {
      frontend: ['Angular 17', 'Angular Material'],
      backend: ['C# .NET Core 8 Web API'],
      database: ['Microsoft SQL Server 2022'],
      infra: ['Windows Server 2022', 'IIS Cluster', 'Private Cloud'],
    },
    liveUrl: 'https://keuangan.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/simkeu',
    progress: 100,
    description: 'Penyusunan Rencana Kerja & Anggaran (RKA), pertanggungjawaban dana kas kecil, pembayaran SPJ digital, dan laporan laba-rugi/neraca.',
    targetLaunchDate: '2023-08-01',
    version: 'v3.1.5',
    createdAt: '2023-02-15T09:00:00.000Z',
    updatedAt: '2025-01-10T13:10:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-FIN-02',
    name: 'EduPay Multi-Channel Payment & Virtual Account',
    code: 'EDUPAY',
    category: 'Keuangan',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'UPT TIK Internal',
    unitPengelola: 'Biro Keuangan & BAAK',
    picName: 'Fajar Pratama, S.Kom',
    picEmail: 'fajar.pratama@kampus.ac.id',
    picPhone: '+62 819-2233-4455',
    picRole: 'Lead Backend Developer',
    techStack: {
      frontend: ['React', 'Tailwind CSS'],
      backend: ['Node.js Express', 'TypeScript'],
      database: ['PostgreSQL', 'Redis BullMQ'],
      infra: ['Multi-Bank API Gateway (Mandiri, BNI, BRI, BSI)', 'Docker'],
    },
    liveUrl: 'https://pembayaran.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/edupay/api',
    progress: 100,
    description: 'Gateway pembayaran uang kuliah tunggal (UKT), SPI, wisuda, dan tes toefl melalui transfer VA, QRIS, dan mini market secara real-time.',
    targetLaunchDate: '2024-03-01',
    version: 'v2.2.0',
    createdAt: '2023-10-05T08:20:00.000Z',
    updatedAt: '2025-02-12T09:40:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-AST-01',
    name: 'SIM-Sarpras & Aset Kampus Terpadu',
    code: 'SIM-SARPRAS',
    category: 'sarana prasana',
    status: 'development',
    devType: 'mandiri',
    vendorName: 'UPT TIK & Biro Perlengkapan',
    unitPengelola: 'Biro Umum, Sarana & Prasarana',
    picName: 'Ir. Agus Setiawan, M.Eng',
    picEmail: 'agus.setiawan@kampus.ac.id',
    picPhone: '+62 813-7788-9900',
    picRole: 'Kepala Bagian Sarana & Prasarana',
    techStack: {
      frontend: ['SvelteKit', 'Tailwind CSS'],
      backend: ['PHP Laravel 11 API'],
      database: ['MariaDB 11.2'],
      infra: ['Docker Compose', 'Linux VPS', 'QR Code Generator'],
    },
    documentationUrl: 'https://docs.kampus.ac.id/sarpras/dev',
    progress: 65,
    description: 'Inventarisasi aset fisik kampus (gedung, laboratorium, kendaraan, peralatan IT) dilengkapi tagging QR Code dan pelacakan riwayat pemeliharaan.',
    targetLaunchDate: '2025-08-15',
    version: 'v1.0.0-beta',
    createdAt: '2024-05-10T11:00:00.000Z',
    updatedAt: '2025-02-17T15:20:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-AST-02',
    name: 'SmartRoom - Sistem Reservasi Ruang & Fasilitas',
    code: 'SMARTROOM',
    category: 'sarana prasana',
    status: 'planing',
    devType: 'mandiri',
    vendorName: 'In-House Developer',
    unitPengelola: 'Subbagian Rumah Tangga & Biro Sarpras',
    picName: 'Dani Firmansyah, S.T',
    picEmail: 'dani.firmansyah@kampus.ac.id',
    picPhone: '+62 822-1133-5577',
    picRole: 'Staff TI Sarana Prasarana',
    techStack: {
      frontend: ['Flutter Web', 'Material 3'],
      backend: ['NestJS TypeScript'],
      database: ['MongoDB Atlas'],
      infra: ['Google Cloud Run', 'Google Calendar API Integration'],
    },
    documentationUrl: 'https://wiki.kampus.ac.id/tor/smartroom',
    progress: 20,
    description: 'Pemesanan ruangan kuliah, aula, auditorium, dan lapangan olahraga secara transparan dilengkapi approval berjenjang pimpinan.',
    targetLaunchDate: '2025-11-30',
    version: 'v0.2.0',
    createdAt: '2024-11-15T14:30:00.000Z',
    updatedAt: '2025-01-25T10:15:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-RES-01',
    name: 'SIMLITABMAS - Sistem Penelitian & Pengabdian Masyarakat',
    code: 'SIMLIT',
    category: 'penelitian',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'Tim Pengembang LPPM',
    unitPengelola: 'Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM)',
    picName: 'Prof. Dr. Andi Kurniawan',
    picEmail: 'andi.kurniawan@kampus.ac.id',
    picPhone: '+62 811-9988-7766',
    picRole: 'Ketua LPPM',
    techStack: {
      frontend: ['React 18', 'Chakra UI', 'TypeScript'],
      backend: ['Python Django REST Framework'],
      database: ['PostgreSQL', 'Elasticsearch'],
      infra: ['DigitalOcean Droplets', 'Docker Swarm'],
    },
    liveUrl: 'https://lppm.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/lppm/panduan',
    progress: 100,
    description: 'Pengusulan proposal penelitian dosen, seleksi reviewer independen, monitoring kemajuan (monev), laporan akhir, dan publikasi jurnal terindeks Scopus/Sinta.',
    targetLaunchDate: '2023-12-01',
    version: 'v2.5.1',
    createdAt: '2023-05-20T08:45:00.000Z',
    updatedAt: '2025-01-18T16:00:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-LIB-01',
    name: 'SIPERPUS & Digital Repository Kampus',
    code: 'SIPERPUS',
    category: 'perpustakaan',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'UPT Perpustakaan & TIK',
    unitPengelola: 'UPT Perpustakaan Pusat',
    picName: 'Maya Anggraini, S.Hum., M.IP',
    picEmail: 'maya.anggraini@kampus.ac.id',
    picPhone: '+62 857-1234-5678',
    picRole: 'Pustakawan Ahli Muda & Admin Repositori',
    techStack: {
      frontend: ['Vue.js 3', 'Bootstrap 5'],
      backend: ['PHP Slim Framework', 'Koha ILS API'],
      database: ['MySQL 8.0', 'Solr Search Engine'],
      infra: ['Ubuntu Linux Server', 'Let\'s Encrypt SSL'],
    },
    liveUrl: 'https://perpustakaan.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/perpustakaan',
    progress: 100,
    description: 'Katalog Online (OPAC), peminjaman mandiri RFID, e-book library, repository skripsi/tesis/disertasi digital dengan integrasi Turnitin.',
    targetLaunchDate: '2023-05-15',
    version: 'v3.0.4',
    createdAt: '2023-01-10T10:00:00.000Z',
    updatedAt: '2024-12-22T08:30:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-PMB-01',
    name: 'Portal PMB Terpadu & CBT Online',
    code: 'PMB-ONLINE',
    category: 'PMB',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'Tim PMB & UPT TIK',
    unitPengelola: 'Panitia Penerimaan Mahasiswa Baru & BAAK',
    picName: 'Arief Wicaksono, M.Kom',
    picEmail: 'arief.wicaksono@kampus.ac.id',
    picPhone: '+62 812-4433-2211',
    picRole: 'Ketua Tim Teknologi PMB',
    techStack: {
      frontend: ['Next.js 14 (App Router)', 'Tailwind CSS'],
      backend: ['NestJS', 'Express Engine'],
      database: ['PostgreSQL 16', 'Redis Session Store'],
      infra: ['Cloudflare Enterprise DDoS Protection', 'Docker', 'Kubernetes'],
    },
    liveUrl: 'https://pmb.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/pmb',
    progress: 100,
    description: 'Pendaftaran calon mahasiswa jalur SNMPTN/SBMPTN/Mandiri, verifikasi berkas otomatis, ujian seleksi berbasis komputer (CBT), dan pengumuman kelulusan.',
    targetLaunchDate: '2024-02-01',
    version: 'v4.0.1',
    createdAt: '2023-07-15T09:30:00.000Z',
    updatedAt: '2025-02-10T11:00:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-SPM-01',
    name: 'SPMI-QMS - Sistem Penjamin Mutu Internal & Akreditasi',
    code: 'SPMI-QMS',
    category: 'sistem penjamin mutu',
    status: 'development',
    devType: 'mandiri',
    vendorName: 'UPT TIK & Lembaga Penjaminan Mutu',
    unitPengelola: 'Lembaga Penjaminan Mutu (LPM)',
    picName: 'Dr. Endah Wulandari, S.Si., M.Stat',
    picEmail: 'endah.wulandari@kampus.ac.id',
    picPhone: '+62 815-6677-8899',
    picRole: 'Sekretaris Eksekutif LPM',
    techStack: {
      frontend: ['React 18', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js Express TypeScript'],
      database: ['PostgreSQL 16', 'MinIO'],
      infra: ['Docker Container', 'Nginx Proxy Manager'],
    },
    documentationUrl: 'https://wiki.kampus.ac.id/lpm/spmi-qms',
    progress: 85,
    description: 'Siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan), audit mutu internal (AMI), matriks kesiapan akreditasi BAN-PT & LAM.',
    targetLaunchDate: '2025-05-30',
    version: 'v1.2.0-rc1',
    createdAt: '2024-03-12T13:00:00.000Z',
    updatedAt: '2025-02-16T14:40:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-DIK-01',
    name: 'PDDIKTI Feeder & Neo Feeder Sync Gateway',
    code: 'PDDIKTI-SYNC',
    category: 'pelaporan dikti',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'Tim Data PDDIKTI Kampus',
    unitPengelola: 'Subbagian Registrasi & Statistik PDDIKTI',
    picName: 'Rizky Ramadhan, S.Kom',
    picEmail: 'rizky.ramadhan@kampus.ac.id',
    picPhone: '+62 877-8899-0011',
    picRole: 'Operator Utama PDDIKTI',
    techStack: {
      frontend: ['Vue.js 3', 'Tailwind CSS'],
      backend: ['Node.js Worker Service', 'Kemendikbud Neo Feeder Web Services API'],
      database: ['PostgreSQL', 'SQLite Local Cache'],
      infra: ['Dedicated Server Data Center', 'Crontab Scheduled Sync'],
    },
    liveUrl: 'https://feeder.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/pddikti',
    progress: 100,
    description: 'Sinkronisasi dua arah otomatis antara database SIAKAD kampus dengan server Neo Feeder Ditjen Diktiristek untuk pelaporan semesteran.',
    targetLaunchDate: '2023-09-01',
    version: 'v3.2.0',
    createdAt: '2023-03-01T08:00:00.000Z',
    updatedAt: '2025-02-05T10:10:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-DIK-02',
    name: 'SISTER Kemdikbud Connector & Data Port',
    code: 'SISTER-HUB',
    category: 'pelaporan dikti',
    status: 'development',
    devType: 'vendor',
    vendorName: 'PT Mitra Edukasi Digital',
    unitPengelola: 'Biro SDM & Tim Penilai Angka Kredit',
    picName: 'Dian Permana, S.T',
    picEmail: 'dian.permana@kampus.ac.id',
    picPhone: '+62 813-2211-3344',
    picRole: 'Admin Institusi SISTER',
    techStack: {
      frontend: ['React 18', 'Tailwind CSS'],
      backend: ['Java Quarkus', 'gRPC'],
      database: ['PostgreSQL 15'],
      infra: ['Docker', 'VPN Tunnel to Kemdikbudristek'],
    },
    documentationUrl: 'https://wiki.kampus.ac.id/sister/connector',
    progress: 50,
    description: 'Modul sinkronisasi portofolio Tridharma dosen (Pengajaran, Penelitian, Pengabdian) langsung dengan platform SISTER Cloud Nasional.',
    targetLaunchDate: '2025-07-20',
    version: 'v0.8.0',
    createdAt: '2024-08-10T11:20:00.000Z',
    updatedAt: '2025-02-15T09:25:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
  {
    id: 'SIS-ALU-01',
    name: 'Tracer Study & Portal Ikatan Alumni',
    code: 'TRACER-STUDY',
    category: 'alumni',
    status: 'publish',
    devType: 'mandiri',
    vendorName: 'UPT Pengembangan Karier & Alumni',
    unitPengelola: 'Pusat Karier & Lembaga Hubungan Alumni',
    picName: 'Rina Marlina, S.Sos',
    picEmail: 'rina.marlina@kampus.ac.id',
    picPhone: '+62 821-6677-8899',
    picRole: 'Koordinator Tracer Study Kampus',
    techStack: {
      frontend: ['React 18', 'Tailwind CSS'],
      backend: ['PHP Laravel 10', 'REST API'],
      database: ['MySQL 8.0'],
      infra: ['Linode Cloud VPS', 'WhatsApp Business API Notification'],
    },
    liveUrl: 'https://alumni.kampus.ac.id',
    documentationUrl: 'https://docs.kampus.ac.id/alumni',
    progress: 100,
    description: 'Kuesioner pelacakan jejak alumni (Tracer Study IKU 1), direktori alumni lintas angkatan, kartu alumni digital, dan info reuni.',
    targetLaunchDate: '2023-10-25',
    version: 'v2.4.0',
    createdAt: '2023-04-05T14:00:00.000Z',
    updatedAt: '2025-01-30T16:30:00.000Z',
    updatedBy: 'Ahmad Fauzi, M.Kom',
  },
  {
    id: 'SIS-ALU-02',
    name: 'SmartCareer - Bursa Kerja & Magang Industri',
    code: 'SMARTCAREER',
    category: 'alumni',
    status: 'planing',
    devType: 'vendor',
    vendorName: 'PT Talenta Digital Indonesia',
    unitPengelola: 'Pusat Karier & Inkubator Bisnis',
    picName: 'Gilang Pratama, S.Psi',
    picEmail: 'gilang.pratama@kampus.ac.id',
    picPhone: '+62 859-3344-5566',
    picRole: 'Staff Hubungan Industri & Kerja Sama',
    techStack: {
      frontend: ['Vue.js 3', 'Tailwind CSS'],
      backend: ['Ruby on Rails 7 API'],
      database: ['PostgreSQL 16'],
      infra: ['AWS Elastic Beanstalk', 'SendGrid Email Delivery'],
    },
    documentationUrl: 'https://wiki.kampus.ac.id/tor/smartcareer',
    progress: 30,
    description: 'Job portal khusus lulusan kampus, pameran virtual campus hiring, tes minat bakat, dan pendaftaran program magang bersertifikat mitra BUMN/Swasta.',
    targetLaunchDate: '2025-10-15',
    version: 'v0.3.0',
    createdAt: '2024-12-01T10:00:00.000Z',
    updatedAt: '2025-02-11T13:45:00.000Z',
    updatedBy: 'Siti Rahmawati, S.Kom',
  },
];

const DEFAULT_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '2025-02-18T16:45:00.000Z',
    userId: 'USR-002',
    userName: 'Siti Rahmawati, S.Kom',
    userRole: 'staff',
    action: 'UPDATE',
    targetSystemId: 'SIS-HR-02',
    targetSystemName: 'Remunerasi & BKD Online',
    details: 'Memperbarui progress sprint pengujian integrasi BKD menjadi 75% dan rilis versi v1.0.0-rc2.',
    changes: [
      { field: 'progress', oldValue: 60, newValue: 75 },
      { field: 'version', oldValue: 'v1.0.0-rc1', newValue: 'v1.0.0-rc2' },
    ],
  },
  {
    id: 'LOG-002',
    timestamp: '2025-02-17T15:20:00.000Z',
    userId: 'USR-002',
    userName: 'Siti Rahmawati, S.Kom',
    userRole: 'staff',
    action: 'UPDATE',
    targetSystemId: 'SIS-AST-01',
    targetSystemName: 'SIM-Sarpras & Aset Kampus Terpadu',
    details: 'Menambahkan modul tagging QR code pada tech stack dan mengupdate target peluncuran Agustus 2025.',
  },
  {
    id: 'LOG-003',
    timestamp: '2025-02-16T14:40:00.000Z',
    userId: 'USR-002',
    userName: 'Siti Rahmawati, S.Kom',
    userRole: 'staff',
    action: 'UPDATE',
    targetSystemId: 'SIS-SPM-01',
    targetSystemName: 'SPMI-QMS',
    details: 'Memperbarui status progress development menjadi 85% untuk persiapan simulasi Audit Mutu Internal (AMI).',
  },
  {
    id: 'LOG-004',
    timestamp: '2025-02-14T10:30:00.000Z',
    userId: 'USR-001',
    userName: 'Ahmad Fauzi, M.Kom',
    userRole: 'admin',
    action: 'UPDATE',
    targetSystemId: 'SIS-EDU-01',
    targetSystemName: 'SIAKAD One',
    details: 'Pembaruan versi SIAKAD ke v3.4.2 setelah penyesuaian kurikulum MBKM 2025.',
  },
  {
    id: 'LOG-005',
    timestamp: '2025-02-12T09:40:00.000Z',
    userId: 'USR-002',
    userName: 'Siti Rahmawati, S.Kom',
    userRole: 'staff',
    action: 'UPDATE',
    targetSystemId: 'SIS-FIN-02',
    targetSystemName: 'EduPay Multi-Channel Payment',
    details: 'Menghubungkan integrasi pembayaran QRIS dinamis untuk wisuda periode genap.',
  },
];

// Helper functions for reading and writing JSON files
function readJSON<T>(filePath: string, defaultData: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultData;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Initialize seed data if not present
function initializeData() {
  if (!fs.existsSync(USERS_FILE)) {
    writeJSON(USERS_FILE, DEFAULT_USERS);
  }
  if (!fs.existsSync(SYSTEMS_FILE)) {
    writeJSON(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  }
  if (!fs.existsSync(LOGS_FILE)) {
    writeJSON(LOGS_FILE, DEFAULT_LOGS);
  }
}

initializeData();

// Create Express app
const app = express();
app.use(express.json({ limit: '10mb' }));

// Auth Token Helper (Simple secure in-memory token store mapped to users)
const activeSessions = new Map<string, any>();

function getSessionUser(req: express.Request): any | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  return session.user;
}

// Audit Log recording helper
function recordAuditLog(
  user: any,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'RESTORE' | 'STATUS_CHANGE',
  details: string,
  targetSystemId?: string,
  targetSystemName?: string,
  changes?: Array<{ field: string; oldValue: any; newValue: any }>
) {
  try {
    const logs = readJSON<any[]>(LOGS_FILE, DEFAULT_LOGS);
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'ANONYMOUS',
      userName: user?.name || 'Sistem',
      userRole: user?.role || 'viewer',
      action,
      targetSystemId,
      targetSystemName,
      details,
      changes,
    };
    logs.unshift(newLog);
    // Keep max 500 logs
    if (logs.length > 500) logs.splice(500);
    writeJSON(LOGS_FILE, logs);
    return newLog;
  } catch (err) {
    console.error('Failed to write audit log:', err);
    return null;
  }
}

// --- API ROUTES ---

// 1. Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
  }

  const users = readJSON<any[]>(USERS_FILE, DEFAULT_USERS);
  const foundUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ error: 'Email atau kata sandi tidak valid.' });
  }

  const token = `tok_${foundUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const { password: _, ...safeUser } = foundUser;

  activeSessions.set(token, { user: safeUser, createdAt: Date.now() });

  recordAuditLog(
    safeUser,
    'LOGIN',
    `User ${safeUser.name} (${safeUser.role}) berhasil masuk ke dalam sistem portofolio.`
  );

  return res.json({
    token,
    user: safeUser,
    message: 'Login berhasil.',
  });
});

app.get('/api/auth/me', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Sesi login tidak ditemukan atau telah kedaluwarsa.' });
  }
  return res.json({ user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logout berhasil.' });
});

// 2. Systems CRUD routes
app.get('/api/systems', (req, res) => {
  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  const { category, status, devType, search } = req.query;

  let filtered = [...systems];

  if (category && category !== 'all') {
    filtered = filtered.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((s) => s.status.toLowerCase() === String(status).toLowerCase());
  }
  if (devType && devType !== 'all') {
    filtered = filtered.filter((s) => s.devType.toLowerCase() === String(devType).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.picName.toLowerCase().includes(q) ||
        s.unitPengelola.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.vendorName && s.vendorName.toLowerCase().includes(q)) ||
        Object.values(s.techStack || {})
          .flat()
          .some((t: any) => String(t).toLowerCase().includes(q))
    );
  }

  return res.json({
    data: filtered,
    total: filtered.length,
    unfilteredTotal: systems.length,
  });
});

app.get('/api/systems/:id', (req, res) => {
  const { id } = req.params;
  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  const found = systems.find((s) => s.id === id);
  if (!found) {
    return res.status(404).json({ error: 'Sistem informasi tidak ditemukan.' });
  }
  return res.json({ data: found });
});

// Add new system (admin and staff only)
app.post('/api/systems', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Harap login terlebih dahulu.' });
  }
  if (user.role === 'viewer') {
    return res.status(403).json({ error: 'Hak akses viewer tidak diperbolehkan menambah sistem informasi.' });
  }

  const body = req.body;
  if (!body.name || !body.category || !body.status || !body.unitPengelola || !body.picName) {
    return res.status(400).json({ error: 'Nama sistem, kategori, status, unit pengelola, dan PIC wajib diisi.' });
  }

  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);

  // Generate ID if not provided
  const categoryPrefixMap: Record<string, string> = {
    Pendidikan: 'EDU',
    SDM: 'HR',
    Keuangan: 'FIN',
    'sarana prasana': 'AST',
    penelitian: 'RES',
    perpustakaan: 'LIB',
    PMB: 'PMB',
    'sistem penjamin mutu': 'SPM',
    'pelaporan dikti': 'DIK',
    alumni: 'ALU',
  };

  const prefix = categoryPrefixMap[body.category] || 'SYS';
  const newId = body.id || `SIS-${prefix}-${String(systems.length + 1).padStart(2, '0')}`;

  const newSystem = {
    ...body,
    id: newId,
    progress: body.status === 'publish' ? 100 : Number(body.progress || 0),
    techStack: body.techStack || { frontend: [], backend: [], database: [], infra: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: user.name,
  };

  systems.unshift(newSystem);
  writeJSON(SYSTEMS_FILE, systems);

  recordAuditLog(
    user,
    'CREATE',
    `Menambahkan sistem informasi baru "${newSystem.name}" (${newSystem.category}, Status: ${newSystem.status}).`,
    newSystem.id,
    newSystem.name
  );

  return res.status(201).json({ data: newSystem, message: 'Sistem informasi berhasil ditambahkan.' });
});

// Update system (admin and staff only)
app.put('/api/systems/:id', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Harap login terlebih dahulu.' });
  }
  if (user.role === 'viewer') {
    return res.status(403).json({ error: 'Hak akses viewer tidak diperbolehkan mengedit data sistem.' });
  }

  const { id } = req.params;
  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  const index = systems.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Sistem informasi tidak ditemukan.' });
  }

  const existing = systems[index];
  const updates = req.body;

  // Track field changes for audit log
  const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];
  const trackedFields = [
    'name',
    'status',
    'progress',
    'devType',
    'vendorName',
    'unitPengelola',
    'picName',
    'picEmail',
    'liveUrl',
    'version',
  ];

  for (const field of trackedFields) {
    if (updates[field] !== undefined && updates[field] !== existing[field]) {
      changes.push({
        field,
        oldValue: existing[field],
        newValue: updates[field],
      });
    }
  }

  const isStatusChange = updates.status && updates.status !== existing.status;

  const updatedSystem = {
    ...existing,
    ...updates,
    id: existing.id, // prevent id modification
    progress: updates.status === 'publish' ? 100 : Number(updates.progress ?? existing.progress),
    updatedAt: new Date().toISOString(),
    updatedBy: user.name,
  };

  systems[index] = updatedSystem;
  writeJSON(SYSTEMS_FILE, systems);

  const actionType = isStatusChange ? 'STATUS_CHANGE' : 'UPDATE';
  const detailText = isStatusChange
    ? `Mengubah status sistem "${existing.name}" dari '${existing.status}' menjadi '${updates.status}'.`
    : `Memperbarui data sistem "${existing.name}" (${changes.map((c) => c.field).join(', ') || 'detail teknis'}).`;

  recordAuditLog(user, actionType, detailText, existing.id, existing.name, changes);

  return res.json({ data: updatedSystem, message: 'Data sistem berhasil diperbarui.' });
});

// Delete system (admin only)
app.delete('/api/systems/:id', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Harap login terlebih dahulu.' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya administrator yang memiliki wewenang menghapus sistem informasi.' });
  }

  const { id } = req.params;
  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  const found = systems.find((s) => s.id === id);

  if (!found) {
    return res.status(404).json({ error: 'Sistem informasi tidak ditemukan.' });
  }

  const remaining = systems.filter((s) => s.id !== id);
  writeJSON(SYSTEMS_FILE, remaining);

  recordAuditLog(
    user,
    'DELETE',
    `Menghapus sistem informasi "${found.name}" (${found.id}) dari portofolio institusi.`,
    found.id,
    found.name
  );

  return res.json({ success: true, message: `Sistem ${found.name} berhasil dihapus.` });
});

// 3. Stats & Dashboard Aggregates
app.get('/api/stats', (req, res) => {
  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  const logs = readJSON<any[]>(LOGS_FILE, DEFAULT_LOGS);

  const categories = [
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

  const categoryDistribution: Record<string, number> = {};
  const statusByCategory: Record<string, Record<string, number>> = {};
  const devTypeByCategory: Record<string, Record<string, number>> = {};

  categories.forEach((cat) => {
    categoryDistribution[cat] = 0;
    statusByCategory[cat] = { publish: 0, development: 0, planing: 0 };
    devTypeByCategory[cat] = { mandiri: 0, vendor: 0 };
  });

  let publishCount = 0;
  let devCount = 0;
  let planCount = 0;
  let mandiriCount = 0;
  let vendorCount = 0;
  let devProgressSum = 0;

  const techCountMap: Record<string, { count: number; category: 'frontend' | 'backend' | 'database' | 'infra' }> = {};

  systems.forEach((s) => {
    // Categories
    if (categoryDistribution[s.category] !== undefined) {
      categoryDistribution[s.category] += 1;
    } else {
      categoryDistribution[s.category] = 1;
    }

    // Statuses
    if (s.status === 'publish') publishCount++;
    else if (s.status === 'development') {
      devCount++;
      devProgressSum += Number(s.progress || 0);
    } else if (s.status === 'planing') planCount++;

    if (statusByCategory[s.category] && statusByCategory[s.category][s.status] !== undefined) {
      statusByCategory[s.category][s.status] += 1;
    }

    // Dev Types
    if (s.devType === 'mandiri') mandiriCount++;
    else if (s.devType === 'vendor') vendorCount++;

    if (devTypeByCategory[s.category] && devTypeByCategory[s.category][s.devType] !== undefined) {
      devTypeByCategory[s.category][s.devType] += 1;
    }

    // Tech stack aggregation
    if (s.techStack) {
      (['frontend', 'backend', 'database', 'infra'] as const).forEach((group) => {
        const items = s.techStack[group] || [];
        items.forEach((item: string) => {
          const clean = item.trim();
          if (!clean) return;
          if (!techCountMap[clean]) {
            techCountMap[clean] = { count: 1, category: group };
          } else {
            techCountMap[clean].count += 1;
          }
        });
      });
    }
  });

  const topTechnologies = Object.entries(techCountMap)
    .map(([name, val]) => ({ name, count: val.count, category: val.category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const avgProgressDev = devCount > 0 ? Math.round(devProgressSum / devCount) : 0;

  return res.json({
    totalSystems: systems.length,
    publishCount,
    developmentCount: devCount,
    planingCount: planCount,
    mandiriCount,
    vendorCount,
    avgProgressDev,
    categoryDistribution,
    statusByCategory,
    devTypeByCategory,
    recentLogs: logs.slice(0, 10),
    topTechnologies,
  });
});

// 4. Audit Logs routes
app.get('/api/logs', (req, res) => {
  const logs = readJSON<any[]>(LOGS_FILE, DEFAULT_LOGS);
  const { action, role, search } = req.query;

  let filtered = [...logs];
  if (action && action !== 'all') {
    filtered = filtered.filter((l) => l.action === action);
  }
  if (role && role !== 'all') {
    filtered = filtered.filter((l) => l.userRole === role);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        (l.targetSystemName && l.targetSystemName.toLowerCase().includes(q))
    );
  }

  return res.json({ data: filtered, total: filtered.length });
});

// 5. User Management (Admin only)
app.get('/api/users', (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat melihat daftar pengguna.' });
  }
  const users = readJSON<any[]>(USERS_FILE, DEFAULT_USERS).map(({ password, ...u }) => u);
  return res.json({ data: users });
});

// 6. Export and Backup/Restore routes (Persistence in JSON format as required)
app.get('/api/export', (req, res) => {
  const systems = readJSON<any[]>(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  const logs = readJSON<any[]>(LOGS_FILE, DEFAULT_LOGS);
  const users = readJSON<any[]>(USERS_FILE, DEFAULT_USERS).map(({ password, ...u }) => u);

  const exportPayload = {
    appName: 'SIM-Portofolio & Tata Kelola Sistem Informasi',
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    data: {
      systems,
      logs,
      users,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="sim_portofolio_backup_${new Date().toISOString().split('T')[0]}.json"`
  );
  return res.send(JSON.stringify(exportPayload, null, 2));
});

app.post('/api/restore', (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang memiliki izin memulihkan database dari berkas JSON.' });
  }

  const { systems, logs } = req.body;
  if (!Array.isArray(systems)) {
    return res.status(400).json({ error: 'Format berkas JSON tidak valid. Kolom "systems" harus berupa array.' });
  }

  writeJSON(SYSTEMS_FILE, systems);
  if (Array.isArray(logs)) {
    writeJSON(LOGS_FILE, logs);
  }

  recordAuditLog(
    user,
    'RESTORE',
    `Memulihkan ${systems.length} data sistem informasi dari berkas backup JSON.`
  );

  return res.json({
    success: true,
    message: `Berhasil memulihkan ${systems.length} data sistem informasi.`,
  });
});

app.post('/api/reset-seed', (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat mereset data awal.' });
  }

  writeJSON(SYSTEMS_FILE, DEFAULT_SYSTEMS);
  writeJSON(LOGS_FILE, DEFAULT_LOGS);
  writeJSON(USERS_FILE, DEFAULT_USERS);

  recordAuditLog(user, 'RESTORE', 'Mereset seluruh data sistem informasi kembali ke seed awal instansi.');

  return res.json({ success: true, message: 'Data berhasil direset ke standar institusi.' });
});

// Setup Vite or static serving
async function startServer() {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SIM-Portofolio server running on http://0.0.0.0:${port}`);
  });
}

startServer();
