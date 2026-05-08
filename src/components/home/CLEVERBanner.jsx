const pillars = [
  { letter: 'C', word: 'Clarity', desc: 'Clear mission, easy to understand for any audience' },
  { letter: 'L', word: 'Leadership', desc: 'Verified founder profiles and credible teams' },
  { letter: 'E', word: 'Evaluation', desc: 'Standardized data — funding, size, sector' },
  { letter: 'V', word: 'Value', desc: 'Right resource surfaced for the right user' },
  { letter: 'E', word: 'Expansion', desc: 'International-ready markers for global investors' },
  { letter: 'R', word: 'Resilience', desc: 'Active flagging keeps data current and accurate' },
];

export default function CLEVERBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="inline-block bg-foreground text-white font-manrope font-black text-sm px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
          The CLEVER Framework
        </div>
        <h2 className="font-manrope font-extrabold text-4xl text-foreground mb-3">
          Our Standard for Excellence
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Every startup and resource on this platform is evaluated against 6 rubrics that ensure quality, accuracy, and meaningful connection.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pillars.map((p, i) => (
          <div
            key={p.letter + i}
            className="group bg-white border border-border rounded-2xl p-5 text-center hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-manrope font-black text-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              {p.letter}
            </div>
            <h3 className="font-manrope font-bold text-sm text-foreground mb-1">{p.word}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}