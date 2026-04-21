// Sidebar navigation + progress
const { useState: useStateSidebar } = React;

function Sidebar({ sections, activeId, onNav, progress, savedAt }) {
  const total = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const answered = Object.keys(progress).filter((k) => {
    const v = progress[k];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim().length > 0;
    return !!v;
  }).length;
  const pct = Math.round((answered / total) * 100);

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">אפיון אתר</div>
            <div className="brand-sub">טופס הזמנת פרויקט</div>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-row">
            <span className="progress-label">התקדמות</span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-meta">
            <span>{answered}/{total} שאלות</span>
          </div>
        </div>

        <nav className="nav">
          {sections.map((s) => {
            const sectionAnswered = s.questions.filter((q) => {
              const v = progress[q.id];
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === 'string') return v.trim().length > 0;
              return !!v;
            }).length;
            const done = sectionAnswered === s.questions.length;
            const isActive = activeId === s.id;
            return (
              <button
                key={s.id}
                className={`nav-item ${isActive ? 'active' : ''} ${done ? 'done' : ''}`}
                onClick={() => onNav(s.id)}
              >
                <span className="nav-num">{s.num}</span>
                <span className="nav-title">{s.title}</span>
                <span className="nav-status">
                  {done ? (
                    <span className="nav-check">✓</span>
                  ) : (
                    <span className="nav-count">{sectionAnswered}/{s.questions.length}</span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <div className="foot-note">
            תשובותיכם נשמרות אוטומטית בדפדפן. תוכלו לחזור ולהשלים מאוחר יותר.
          </div>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar });
