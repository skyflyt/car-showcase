import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/10 text-[120px] font-bold leading-none">404</p>
        <h1 className="text-xl font-light tracking-tight mt-4 mb-2">
          Page not found
        </h1>
        <p className="text-white/30 text-sm mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="admin-btn admin-btn-secondary inline-block text-sm"
        >
          Back to The Garage
        </Link>
      </div>
    </div>
  );
}
