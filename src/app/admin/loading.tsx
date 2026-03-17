export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="inline-block w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin mb-3" />
        <p className="text-white/20 text-xs tracking-wider">Loading</p>
      </div>
    </div>
  );
}
