"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/10 text-[80px] font-bold leading-none">Error</p>
        <h1 className="text-xl font-light tracking-tight mt-4 mb-2">
          Something went wrong
        </h1>
        <p className="text-white/30 text-sm mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="admin-btn admin-btn-primary text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
