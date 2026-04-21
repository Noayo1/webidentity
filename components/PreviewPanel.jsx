// Live preview panel — shows answers as a document being built
function PreviewPanel({ sections, answers, open, onClose }) {
  const hasAny = Object.keys(answers).some((k) => {
    const v = answers[k];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim().length > 0;
    return !!v;
  });

  const renderAnswer = (q, v) => {
    if (!v || (Array.isArray(v) && v.length === 0) || (typeof v === 'string' && !v.trim())) {
      return <span className="prev-empty">— ממתין לתשובה —</span>;
    }
    if (q.type === 'mood') {
      const titles = q.options.filter((o) => v.includes(o.id)).map((o) => o.title);
      return <span>{titles.join(' · ')}</span>;
    }
    if (q.type === 'upload') {
      return <span>{v.length} קבצים הועלו</span>;
    }
    if (Array.isArray(v)) return <span>{v.join(' · ')}</span>;
    return <span>{v}</span>;
  };

  return (
    <div className={`preview-panel ${open ? 'open' : ''}`}>
      <div className="preview-head">
        <div>
          <div className="preview-eyebrow">תצוגה מקדימה</div>
          <div className="preview-title">מסמך האפיון שלכם</div>
        </div>
        <button className="preview-close" onClick={onClose} aria-label="סגור">×</button>
      </div>
      <div className="preview-body">
        {!hasAny && (
          <div className="preview-empty">
            <div className="preview-empty-icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M8 13h8M8 17h5" />
              </svg>
            </div>
            <div className="preview-empty-title">עדיין לא התחלתם למלא</div>
            <div className="preview-empty-text">התשובות שלכם יופיעו כאן בזמן אמת, ויתגבשו למסמך אפיון מלא</div>
          </div>
        )}
        {hasAny && sections.map((s) => {
          const sectionHasAny = s.questions.some((q) => {
            const v = answers[q.id];
            if (Array.isArray(v)) return v.length > 0;
            if (typeof v === 'string') return v.trim().length > 0;
            return !!v;
          });
          if (!sectionHasAny) return null;
          return (
            <div key={s.id} className="prev-section">
              <div className="prev-section-head">
                <span className="prev-section-num">{s.num}</span>
                <span className="prev-section-title">{s.title}</span>
              </div>
              <dl className="prev-list">
                {s.questions.map((q) => {
                  const v = answers[q.id];
                  const hasV = Array.isArray(v) ? v.length > 0 : (typeof v === 'string' ? v.trim().length > 0 : !!v);
                  if (!hasV) return null;
                  return (
                    <div key={q.id} className="prev-item">
                      <dt className="prev-q">{q.label}</dt>
                      <dd className="prev-a">{renderAnswer(q, v)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { PreviewPanel });
