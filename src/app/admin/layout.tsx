import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-light tracking-tight"
            >
              The <span className="font-semibold">Garage</span>
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
            {session?.user && (
              <>
                <span className="text-white/30 text-xs">
                  {session.user.name || session.user.email}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="text-white/20 hover:text-white/50 transition-colors text-xs"
                  >
                    Sign out
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
    </div>
  );
}
