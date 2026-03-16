export default function StatCard({ title, value, icon, color = "indigo" }) {
  const themes = {
    indigo: {
      card: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-200",
      iconBg: "bg-white/20",
    },
    green: {
      card: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-200",
      iconBg: "bg-white/20",
    },
    yellow: {
      card: "from-amber-400 to-amber-500",
      shadow: "shadow-amber-200",
      iconBg: "bg-white/20",
    },
    red: {
      card: "from-rose-500 to-rose-600",
      shadow: "shadow-rose-200",
      iconBg: "bg-white/20",
    },
    blue: {
      card: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-200",
      iconBg: "bg-white/20",
    },
  };
  const t = themes[color] || themes.indigo;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.card} p-5 text-white shadow-lg ${t.shadow} transition-transform duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
        </div>
        <div className={`w-12 h-12 ${t.iconBg} backdrop-blur-sm rounded-xl flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -right-2 -bottom-8 w-16 h-16 bg-white/5 rounded-full" />
    </div>
  );
}
