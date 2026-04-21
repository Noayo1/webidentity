// Main App
const { useState, useEffect, useMemo, useRef } = React;

const STORAGE_KEY = 'website_spec_form_v1';

function App() {
  const sections = window.FORM_SECTIONS;
  const allQuestions = useMemo(
    () => sections.flatMap((s) => s.questions.map((q) => ({ ...q, _section: s.id }))),
    [sections]
  );

  // Load from localStorage
  const [answers, setAnswers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [savedAt, setSavedAt] = useState('');
  const [activeId, setActiveId] = useState(sections[0].id);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [layout, setLayout] = useState('single'); // 'single' | 'wizard' | 'convo'
  const [wizardStep, setWizardStep] = useState(0);
  const [convoStep, setConvoStep] = useState(0);

  // Auto-save
  const saveTimer = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setSavedAt(`${hh}:${mm}`);
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [answers]);

  const setAnswer = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

  // Scrollspy for single mode
  useEffect(() => {
    if (layout !== 'single') return;
    const handler = () => {
      const sects = sections.map((s) => document.getElementById(`section-${s.id}`)).filter(Boolean);
      let current = sections[0].id;
      for (const el of sects) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 160) current = el.id.replace('section-', '');
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [layout, sections]);

  const navTo = (id) => {
    setActiveId(id);
    if (layout === 'single') {
      document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (layout === 'wizard') {
      const i = sections.findIndex((s) => s.id === id);
      if (i >= 0) setWizardStep(i);
    } else if (layout === 'convo') {
      const firstQIdx = allQuestions.findIndex((q) => q._section === id);
      if (firstQIdx >= 0) setConvoStep(firstQIdx);
    }
  };

  // Progress stats
  const totalAnswered = useMemo(() => {
    return Object.keys(answers).filter((k) => {
      const v = answers[k];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'string') return v.trim().length > 0;
      return !!v;
    }).length;
  }, [answers]);
  const totalQs = allQuestions.length;

  // Reset / clear
  const clearAll = () => {
    if (confirm('לאפס את כל התשובות?')) {
      setAnswers({});
      localStorage.removeItem(STORAGE_KEY);
      setWizardStep(0);
      setConvoStep(0);
    }
  };

  return (
    <>
      <div className="marquee">
        <div className="marquee-track">
          <span>Website Specification — 2026</span>
          <span>אפיון אתר תדמית</span>
          <span>Tell Us Your Story</span>
          <span>ספרו לנו את הסיפור שלכם</span>
          <span>Website Specification — 2026</span>
          <span>אפיון אתר תדמית</span>
          <span>Tell Us Your Story</span>
          <span>ספרו לנו את הסיפור שלכם</span>
        </div>
      </div>
      <div className="app" data-layout={layout}>
        <Sidebar
          sections={sections}
          activeId={activeId}
          onNav={navTo}
          progress={answers}
          savedAt={savedAt}
        />

        <main className="main">
          {layout === 'single' && (
            <SinglePage
              sections={sections}
              answers={answers}
              setAnswer={setAnswer}
              totalAnswered={totalAnswered}
              totalQs={totalQs}
            />
          )}
          {layout === 'wizard' && (
            <WizardPage
              sections={sections}
              step={wizardStep}
              setStep={setWizardStep}
              answers={answers}
              setAnswer={setAnswer}
              setActiveId={setActiveId}
            />
          )}
          {layout === 'convo' && (
            <ConvoPage
              questions={allQuestions}
              sections={sections}
              step={convoStep}
              setStep={setConvoStep}
              answers={answers}
              setAnswer={setAnswer}
              setActiveId={setActiveId}
            />
          )}
        </main>
      </div>

      <button
        className="preview-toggle"
        onClick={() => setPreviewOpen(true)}
        aria-label="תצוגה מקדימה"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="preview-toggle-label">תצוגה מקדימה</span>
      </button>

      <PreviewPanel
        sections={sections}
        answers={answers}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

    </>
  );
}

// ===== Submit via mailto =====
function buildEmailBody(sections, answers) {
  const lines = [];
  lines.push('מסמך אפיון אתר תדמית');
  lines.push('='.repeat(40));
  lines.push('');
  sections.forEach((s) => {
    const hasAny = s.questions.some((q) => {
      const v = answers[q.id];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'string') return v.trim().length > 0;
      return !!v;
    });
    if (!hasAny) return;
    lines.push(`[${s.num}] ${s.title}`);
    lines.push('-'.repeat(40));
    s.questions.forEach((q) => {
      const v = answers[q.id];
      const has = Array.isArray(v) ? v.length > 0 : (typeof v === 'string' ? v.trim().length > 0 : !!v);
      if (!has) return;
      lines.push(`• ${q.label}`);
      if (q.type === 'mood') {
        const titles = q.options.filter((o) => v.includes(o.id)).map((o) => o.title);
        lines.push(`  ${titles.join(' | ')}`);
      } else if (q.type === 'upload') {
        lines.push(`  ${v.length} קבצים: ${v.map(f => f.name).join(', ')}`);
      } else if (Array.isArray(v)) {
        lines.push(`  ${v.join(' | ')}`);
      } else {
        lines.push(`  ${v}`);
      }
      lines.push('');
    });
    lines.push('');
  });
  return lines.join('\n');
}

function submitViaEmail(sections, answers) {
  const body = buildEmailBody(sections, answers);
  const subject = 'אפיון אתר תדמית חדש';
  const mailto = `mailto:nyo1254@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

// ===== Single scrolling page =====
function SinglePage({ sections, answers, setAnswer, totalAnswered, totalQs }) {
  const intro = window.FORM_INTRO;
  const outro = window.FORM_OUTRO;
  return (
    <>
      <header className="intro">
        <div className="intro-meta">
          <span>מסמך / 2026</span>
          <span className="intro-meta-right">◆ טופס חי</span>
        </div>
        <h1 className="intro-title">
          <span className="decor">/ </span>אפיון<br/>אתר תדמית.
        </h1>
        <p className="intro-subtitle">{intro.subtitle}</p>
        <div className="intro-stats">
          <div className="intro-stat">
            <span className="intro-stat-val">{totalQs}</span>
            <span className="intro-stat-label">שאלות</span>
          </div>
          <div className="intro-stat">
            <span className="intro-stat-val">~8 דק'</span>
            <span className="intro-stat-label">זמן משוער</span>
          </div>
          <div className="intro-stat">
            <span className="intro-stat-val">∞</span>
            <span className="intro-stat-label">שמירה אוטומטית</span>
          </div>
        </div>
      </header>

      {sections.map((s) => (
        <section key={s.id} id={`section-${s.id}`} data-id={s.id} className="section" data-screen-label={`${s.num} ${s.title}`}>
          <div className="section-head">
            <span className="section-num">{s.num}</span>
            <div className="section-title-wrap">
              <div className="section-eyebrow">פרק {s.num}</div>
              <h2 className="section-title">{s.title}</h2>
              <p className="section-subtitle">{s.subtitle}</p>
            </div>
          </div>
          {s.questions.map((q, i) => (
            <QuestionField
              key={q.id}
              q={q}
              num={`${s.num}.${String(i + 1).padStart(2, '0')}`}
              value={answers[q.id]}
              onChange={(v) => setAnswer(q.id, v)}
            />
          ))}
        </section>
      ))}

      <section className="outro">
        <div className="outro-divider">
          <div className="outro-divider-line" />
          <div className="outro-divider-text">◆ מה קורה עכשיו ◆</div>
          <div className="outro-divider-line" />
        </div>
        <div className="outro-card">
          <div className="outro-eyebrow">שלב הבא</div>
          <h3 className="outro-title">{outro.pricing.title}</h3>
          <p className="outro-body">{outro.pricing.body}</p>
          <div className="outro-range">{outro.pricing.range}</div>
        </div>
        <div className="expect-block">
          <div className="expect-head">
            <div className="outro-eyebrow">לתשומת לבכם</div>
            <h3 className="expect-title">{outro.expectations.title}</h3>
            <p className="expect-intro">{outro.expectations.intro}</p>
          </div>
          <ol className="expect-steps">
            {outro.expectations.steps.map((st, i) => (
              <li key={st.num} className="expect-step" style={{ '--i': i }}>
                <div className="expect-step-num">{st.num}</div>
                <div className="expect-step-body">
                  <div className="expect-step-title">{st.title}</div>
                  <div className="expect-step-desc">{st.desc}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="expect-note">
            <span className="expect-note-icon">◆</span>
            <span>{outro.expectations.note}</span>
          </div>
        </div>

        <div className="submit-row">
          <span className="submit-hint">בלחיצה על שליחה, ייפתח חלון אימייל עם כל התשובות מוכנות לשליחה אל הצוות</span>
          <button className="submit-btn" onClick={() => submitViaEmail(sections, answers)}>
            שליחת האפיון
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
        </div>
      </section>
    </>
  );
}

// ===== Wizard (section at a time) =====
function WizardPage({ sections, step, setStep, answers, setAnswer, setActiveId }) {
  const s = sections[step];
  useEffect(() => { setActiveId(s.id); }, [s.id]);
  const isLast = step === sections.length - 1;
  return (
    <div data-screen-label={`${s.num} ${s.title}`}>
      <header className="intro" style={{ marginBottom: 32, paddingBottom: 20 }}>
        <div className="intro-eyebrow">שלב {step + 1} מתוך {sections.length}</div>
        <h1 className="intro-title" style={{ fontSize: 36 }}>{s.title}</h1>
        <p className="intro-subtitle" style={{ fontSize: 15 }}>{s.subtitle}</p>
      </header>
      {s.questions.map((q, i) => (
        <QuestionField
          key={q.id}
          q={q}
          num={`${s.num}.${String(i + 1).padStart(2, '0')}`}
          value={answers[q.id]}
          onChange={(v) => setAnswer(q.id, v)}
        />
      ))}
      <div className="wizard-bar">
        <button className="wizard-btn" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: 'scaleX(-1)'}}><path d="M9 18l6-6-6-6" /></svg>
          שלב קודם
        </button>
        {isLast ? (
          <button className="wizard-btn primary" onClick={() => submitViaEmail(sections, answers)}>
            שליחת האפיון
          </button>
        ) : (
          <button className="wizard-btn primary" onClick={() => { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            שלב הבא
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ===== Conversational (one question at a time) =====
function ConvoPage({ questions, sections, step, setStep, answers, setAnswer, setActiveId }) {
  const q = questions[step];
  useEffect(() => { setActiveId(q._section); }, [q._section]);
  const section = sections.find((s) => s.id === q._section);
  const isLast = step === questions.length - 1;
  const qIdxInSection = section.questions.findIndex((qq) => qq.id === q.id);
  return (
    <div className="convo" data-screen-label={`${section.num} ${q.label}`}>
      <div className="convo-step">
        {section.num} · {section.title} — שאלה {step + 1} מתוך {questions.length}
      </div>
      <div className="convo-q">
        <QuestionField
          q={q}
          num={`${section.num}.${String(qIdxInSection + 1).padStart(2, '0')}`}
          value={answers[q.id]}
          onChange={(v) => setAnswer(q.id, v)}
        />
      </div>
      <div className="wizard-bar">
        <button className="wizard-btn" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: 'scaleX(-1)'}}><path d="M9 18l6-6-6-6" /></svg>
          הקודם
        </button>
        {isLast ? (
          <button className="wizard-btn primary" onClick={() => submitViaEmail(sections, answers)}>שליחת האפיון</button>
        ) : (
          <button className="wizard-btn primary" onClick={() => setStep(step + 1)}>
            הבא
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
