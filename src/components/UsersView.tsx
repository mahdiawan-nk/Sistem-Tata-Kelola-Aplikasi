import React, { useMemo, useState } from "react";
import usersData from "../../data/users.json";
// type UserRole = "admin" | "staff" | "viewer";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  //   role: UserRole;
  role: "admin" | "staff" | "viewer";
  department: string;
  phone: string;
};

const users: User[] = usersData;
// const users: User[] = [
//   {
//     id: "USR-001",
//     name: "Ahmad Fauzi, M.Kom",
//     email: "admin@kampus.ac.id",
//     password: "admin123",
//     role: "admin",
//     department: "UPT Teknologi Informasi & Komunikasi",
//     phone: "+62 811-2345-6789",
//   },
//   {
//     id: "USR-002",
//     name: "Siti Rahmawati, S.Kom",
//     email: "staff@kampus.ac.id",
//     password: "staff123",
//     role: "staff",
//     department: "Divisi Pengembangan Aplikasi & Integrasi",
//     phone: "+62 812-3456-7890",
//   },
//   {
//     id: "USR-003",
//     name: "Prof. Dr. Ir. Gunawan Wibisono",
//     email: "manajemen@kampus.ac.id",
//     password: "viewer123",
//     role: "viewer",
//     department: "Wakil Rektor Bidang Perencanaan & Sistem Informasi",
//     phone: "+62 813-4567-8901",
//   },
// ];

const roleConfig: Record<
  "admin" | "staff" | "viewer",
  { label: string; className: string }
> = {
  admin: {
    label: "Administrator",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  staff: {
    label: "Staff",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  viewer: {
    label: "Viewer",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
};

const getInitials = (name: string): string =>
  name
    .replace(/,.*$/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const UsersView: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch = [
        user.id,
        user.name,
        user.email,
        user.department,
        user.phone,
      ].some((value) => value.toLowerCase().includes(keyword));

      const matchesRole = selectedRole === "all" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [search, selectedRole]);

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalNonAdmins = users.filter((user) => user.role !== "admin").length;

  const handleAddUser = (): void => {
    alert("Hubungkan ke halaman tambah pengguna.");
  };

  const handleViewUser = (user: User): void => {
    alert(`Detail pengguna: ${user.name}`);
  };

  const handleEditUser = (user: User): void => {
    alert(`Edit pengguna: ${user.id}`);
  };

  const handleDeleteUser = (user: User): void => {
    alert(`Hapus pengguna: ${user.id}`);
  };

  const handleResetFilter = (): void => {
    setSearch("");

    setSelectedRole("all");
  };

  return (
    <>
      {/* <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8"> */}
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-indigo-600">Users</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Manajemen Pengguna
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola akun pengguna, hak akses, dan informasi departemen dalam
            sistem informasi kampus.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddUser}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m7-7H5"
            />
          </svg>
          Tambah Pengguna
        </button>
      </div>

      {/* Statistics */}
      <section className="mb-8 grid grid-cols-1 gap-1 sm:grid-cols-3">
        {[
          {
            label: "Total Pengguna",
            value: users.length,
            description: "Seluruh akun terdaftar",
            icon: "users",
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Administrator",
            value: totalAdmins,
            description: "Akses pengelolaan sistem",
            icon: "shield",
            color: "bg-violet-50 text-violet-600",
          },
          {
            label: "Staff & Viewer",
            value: totalNonAdmins,
            description: "Akses operasional dan informasi",
            icon: "briefcase",
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {item.value}
                </p>
              </div>

              <div className={`rounded-xl p-3 ${item.color}`}>
                {item.icon === "users" && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    />
                  </svg>
                )}

                {item.icon === "shield" && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12 2 2 4-4"
                    />
                  </svg>
                )}

                {item.icon === "briefcase" && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <rect x="3" y="7" width="18" height="14" rx="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V4h8v3m-13 5h18m-11 0v2h4v-2"
                    />
                  </svg>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-400">{item.description}</p>
          </div>
        ))}
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daftar Pengguna</h2>
            <p className="mt-1 text-sm text-gray-500">
              Terdapat {filteredUsers.length} pengguna yang ditampilkan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <circle cx="11" cy="11" r="7" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20 20-4-4"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari pengguna..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 sm:w-64"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Administrator</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Pengguna</th>
                <th className="px-6 py-4 font-semibold">Departemen</th>
                <th className="px-6 py-4 font-semibold">Telepon</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const role = roleConfig[user.role];

                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-indigo-50/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                          {getInitials(user.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {user.id}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex max-w-xs items-start gap-2.5">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 21h18M5 21V7l8-4v18m6 0V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01M15 13v.01M15 16v.01M15 19v.01"
                          />
                        </svg>

                        <span className="leading-6 text-gray-600">
                          {user.department}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5">
                      <a
                        href={`tel:${user.phone}`}
                        className="text-gray-600 transition hover:text-indigo-600"
                      >
                        {user.phone}
                      </a>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${role.className}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {role.label}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Lihat detail"
                          onClick={() => handleViewUser(user)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12 18.25 18.75 12 18.75 2.25 12 2.25 12Z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          title="Edit pengguna"
                          onClick={() => handleEditUser(user)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 2.651 2.651M4 20l4.5-1 11.3-11.3a1.875 1.875 0 0 0-2.65-2.65L5.85 16.35 4 20Z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          title="Hapus pengguna"
                          onClick={() => handleDeleteUser(user)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 7h12m-10 0 .7 12h6.6l.7-12M9 7V4h6v3"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="font-semibold text-gray-900">
                      Pengguna tidak ditemukan
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Coba kata kunci atau filter role yang berbeda.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilter}
                      className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Reset pencarian
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-semibold text-gray-900">
              {filteredUsers.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-900">{users.length}</span>{" "}
            pengguna
          </p>

          <span className="text-xs text-gray-400">Sistem Informasi Kampus</span>
        </div>
      </section>
    </>
  );
};

export { UsersView };
