// Question field components
const { useState, useRef } = React;

function QuestionShell({ num, q, children, answered }) {
  return (
    <div className={`q-shell ${answered ? 'answered' : ''}`} data-qid={q.id}>
      <div className="q-head">
        <span className="q-num">{num}</span>
        <div className="q-text">
          <label className="q-label" htmlFor={q.id}>
            {q.label}
            {q.required && <span className="q-req">*</span>}
          </label>
          {q.help && <p className="q-help">{q.help}</p>}
        </div>
        {answered && <span className="q-check" aria-label="נענה">✓</span>}
      </div>
      <div className="q-body">{children}</div>
    </div>
  );
}

function TextField({ q, value, onChange }) {
  return (
    <input
      id={q.id}
      type="text"
      className="f-text"
      placeholder={q.placeholder || ''}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      dir="rtl"
    />
  );
}

function TextareaField({ q, value, onChange }) {
  return (
    <textarea
      id={q.id}
      className="f-textarea"
      placeholder={q.placeholder || ''}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      dir="rtl"
      rows={4}
    />
  );
}

function RadioField({ q, value, onChange }) {
  return (
    <div className="f-radio-group">
      {q.options.map((opt) => {
        const selected = value === opt;
        return (
          <label key={opt} className={`f-radio ${selected ? 'sel' : ''}`}>
            <input
              type="radio"
              name={q.id}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
            />
            <span className="f-radio-dot" />
            <span className="f-radio-label">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxField({ q, value, onChange }) {
  const arr = value || [];
  const toggle = (opt) => {
    if (arr.includes(opt)) onChange(arr.filter((x) => x !== opt));
    else onChange([...arr, opt]);
  };
  return (
    <div className="f-check-group">
      {q.options.map((opt) => {
        const selected = arr.includes(opt);
        return (
          <label key={opt} className={`f-check ${selected ? 'sel' : ''}`}>
            <input type="checkbox" checked={selected} onChange={() => toggle(opt)} />
            <span className="f-check-box">{selected && <span>✓</span>}</span>
            <span className="f-check-label">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function MoodField({ q, value, onChange }) {
  const arr = value || [];
  const toggle = (id) => {
    if (arr.includes(id)) onChange(arr.filter((x) => x !== id));
    else if (arr.length < 2) onChange([...arr, id]);
    else onChange([arr[1], id]);
  };
  return (
    <div className="f-mood-grid">
      {q.options.map((opt) => {
        const selected = arr.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            className={`f-mood ${selected ? 'sel' : ''}`}
            onClick={() => toggle(opt.id)}
          >
            <div className="f-mood-preview" style={{ background: opt.swatch[0] }}>
              <div className="f-mood-swatches">
                {opt.swatch.map((c, i) => (
                  <span key={i} className="f-mood-swatch" style={{ background: c }} />
                ))}
              </div>
              <div className="f-mood-typo" style={{ color: opt.swatch[1] }}>
                <span className="f-mood-big">Aa</span>
                <span className="f-mood-small">טיפוגרפיה</span>
              </div>
            </div>
            <div className="f-mood-info">
              <div className="f-mood-title">{opt.title}</div>
              <div className="f-mood-desc">{opt.desc}</div>
            </div>
            {selected && <span className="f-mood-badge">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

function UploadField({ q, value, onChange }) {
  const ref = useRef(null);
  const files = value || [];
  const onPick = (e) => {
    const picked = Array.from(e.target.files || []);
    onChange([...files, ...picked.map((f) => ({ name: f.name, size: f.size }))]);
  };
  const remove = (i) => onChange(files.filter((_, idx) => idx !== i));
  return (
    <div className="f-upload">
      <div
        className="f-upload-zone"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag'); }}
        onDragLeave={(e) => e.currentTarget.classList.remove('drag')}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('drag');
          const picked = Array.from(e.dataTransfer.files || []);
          onChange([...files, ...picked.map((f) => ({ name: f.name, size: f.size }))]);
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <div className="f-upload-text">
          <strong>לחצו להעלאה</strong> או גררו קבצים לכאן
        </div>
        <div className="f-upload-hint">PNG, JPG, PDF, SVG · עד 10MB לקובץ</div>
        <input ref={ref} type="file" multiple hidden onChange={onPick} />
      </div>
      {files.length > 0 && (
        <ul className="f-upload-list">
          {files.map((f, i) => (
            <li key={i}>
              <span className="f-upload-icon">📎</span>
              <span className="f-upload-name">{f.name}</span>
              <span className="f-upload-size">{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => remove(i)} aria-label="הסר">×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QuestionField({ q, num, value, onChange }) {
  let answered = false;
  if (Array.isArray(value)) answered = value.length > 0;
  else if (typeof value === 'string') answered = value.trim().length > 0;
  else answered = !!value;

  let field;
  if (q.type === 'text') field = <TextField q={q} value={value} onChange={onChange} />;
  else if (q.type === 'textarea') field = <TextareaField q={q} value={value} onChange={onChange} />;
  else if (q.type === 'radio') field = <RadioField q={q} value={value} onChange={onChange} />;
  else if (q.type === 'checkbox') field = <CheckboxField q={q} value={value} onChange={onChange} />;
  else if (q.type === 'mood') field = <MoodField q={q} value={value} onChange={onChange} />;
  else if (q.type === 'upload') field = <UploadField q={q} value={value} onChange={onChange} />;
  else field = <div>Unknown type: {q.type}</div>;

  return <QuestionShell num={num} q={q} answered={answered}>{field}</QuestionShell>;
}

Object.assign(window, { QuestionField, QuestionShell });
