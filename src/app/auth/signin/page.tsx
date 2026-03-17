import { signIn } from "@/lib/auth";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-2">
            The <span className="font-semibold">Garage</span>
          </h1>
          <p className="text-white/40 text-sm">Admin access requires authentication</p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-xl px-6 py-4 transition-all group"
          >
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
              viewBox="0 0 21 21"
              fill="currentColor"
            >
              <rect x="1" y="1" width="9" height="9" />
              <rect x="11" y="1" width="9" height="9" />
              <rect x="1" y="11" width="9" height="9" />
              <rect x="11" y="11" width="9" height="9" />
            </svg>
            <span className="text-white/80 group-hover:text-white font-medium transition-colors">
              Sign in with Microsoft
            </span>
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Jacobs Entertainment &middot; Authorized personnel only
        </p>
      </div>
    </main>
  );
}
