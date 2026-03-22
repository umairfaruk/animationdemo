const projects = [
  {
    tag: 'Brand Strategy · Digital',
    title: 'NovaPulse Rebrand',
    result: '+340% brand awareness in 6 months',
    color: 'from-violet-900/40 to-black',
    accent: 'bg-violet-400',
  },
  {
    tag: 'Performance · Media',
    title: 'Arcline Launch Campaign',
    result: '$80M revenue in Year 1',
    color: 'from-emerald-900/40 to-black',
    accent: 'bg-emerald-400',
  },
  {
    tag: 'Creative · PR',
    title: 'Luxe & Co. Global Push',
    result: '1.2B impressions, 14 markets',
    color: 'from-rose-900/40 to-black',
    accent: 'bg-rose-400',
  },
  {
    tag: 'Growth · Analytics',
    title: 'TerraScale Expansion',
    result: '5x customer acquisition rate',
    color: 'from-amber-900/40 to-black',
    accent: 'bg-amber-400',
  },
]

export default function Work() {
  return (
    <section id="work" className="bg-zinc-950 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold tracking-[0.3em] uppercase">
              Case Studies
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Work That
            <br />
            <span className="text-white/30">Speaks Louder.</span>
          </h2>
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl bg-gradient-to-br ${p.color} border border-white/5 p-10 group cursor-pointer overflow-hidden hover:border-white/10 transition-all hover:-translate-y-1`}
            >
              {/* Accent dot */}
              <div className={`w-2 h-2 rounded-full ${p.accent} mb-8`} />

              <div className="text-xs text-white/40 tracking-widest uppercase mb-4">{p.tag}</div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6">{p.title}</h3>

              <div className="flex items-center gap-3">
                <div className={`w-8 h-0.5 ${p.accent}`} />
                <span className="text-sm text-white/60">{p.result}</span>
              </div>

              {/* Arrow */}
              <div className="absolute top-10 right-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-4 border border-white/15 text-white/70 text-sm font-medium rounded-full hover:bg-white/5 transition-colors">
            View All Case Studies →
          </button>
        </div>
      </div>
    </section>
  )
}
