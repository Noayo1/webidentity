// Sidebar navigation + progress
const { useState: useSidebarState, useEffect: useSidebarEffect } = React;

function Sidebar({ sections, activeId, onNav, progress, savedAt, onPreview }) {
  const [mobileOpen, setMobileOpen] = useSidebarState(false);

  const total = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const answered = Object.keys(progress).filter((k) => {
    const v = progress[k];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim().length > 0;
    return !!v;
  }).length;
  const pct = total ? Math.round((answered / total) * 100) : 0;

  useSidebarEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const handleNav = (id) => {
    setMobileOpen(false);
    onNav(id);
  };

  const handlePreview = () => {
    setMobileOpen(false);
    if (onPreview) onPreview();
  };

  return (
    <>
      <div className="mobile-bar">
        <div className="mobile-bar-brand">
          <div className="mobile-bar-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
          </div>
          <div className="mobile-bar-text">
            <div className="mobile-bar-title">אפיון אתר</div>
            <div className="mobile-bar-progress">
              <span className="mobile-bar-pct">{pct}%</span>
              <span className="mobile-bar-sep">·</span>
              <span>{answered}/{total}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`mobile-menu-btn ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
          aria-expanded={mobileOpen}
          aria-controls="site-nav"
        >
          <span className="mobile-menu-bar" />
          <span className="mobile-menu-bar" />
          <span className="mobile-menu-bar" />
        </button>
      </div>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} id="site-nav">
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
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
                  onClick={() => handleNav(s.id)}
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

          <button
            type="button"
            className="sidebar-preview-btn"
            onClick={handlePreview}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            תצוגה מקדימה
          </button>

          <div className="sidebar-foot">
            <div className="foot-note">
              תשובותיכם נשמרות אוטומטית בדפדפן. תוכלו לחזור ולהשלים מאוחר יותר.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

Object.assign(window, { Sidebar });
