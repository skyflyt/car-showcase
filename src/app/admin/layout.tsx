import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-light tracking-tight"
            >
              Car <span className="font-semibold">Showcase</span>
              <span className="text-white/30 ml-2 text-sm">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/cars/new"
              className="admin-btn admin-btn-primary text-sm"
            >
              + Add Car
            </Link>
            <Link
              href="/"
              className="text-white/30 hover:text-white/60 transition-colors text-sm"
            >
              View Site
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
    </div>
  );
}
