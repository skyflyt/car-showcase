export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin mb-4" />
        <p className="text-white/30 text-sm tracking-wider">Loading</p>
      </div>
    </div>
  );
}
