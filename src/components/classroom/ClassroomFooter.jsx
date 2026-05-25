export default function ClassroomFooter({ t }) {
  return (
    <footer className="py-10 bg-ink">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-[11px] text-white/28 text-center sm:text-left leading-relaxed">
          {t.footer.line}
        </p>
        <div className="flex gap-5">
          {t.footer.links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="font-sans text-[11px] text-white/28 hover:text-white/55 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
