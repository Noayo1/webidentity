// Form schema — Hebrew specification form for showcase websites
// Based on the client's spec document
window.FORM_INTRO = {
  title: 'אפיון אתר תדמית',
  subtitle: 'מסמך זה יעזור לנו להבין את הצרכים של האתר שלכם. האפיון ישפיע על סידורו ההיררכי של האתר, עיצובו ומורכבות הפיתוח.',
};

window.FORM_OUTRO = {
  pricing: {
    title: 'הצעת מחיר',
    body: 'לאחר קבלת מסמך האפיון ובחינת צרכי הפרויקט, תישלח הצעת מחיר מותאמת אישית.',
    range: 'טווח המחירים לבניית אתר תדמית נע בין ₪4,000 ל־₪18,000, בהתאם להיקף האתר, רמת העיצוב, הפונקציונליות הנדרשת והיקף התוכן.',
  },
  expectations: {
    title: 'תיאום ציפיות',
    intro: 'בניית אתר היא תהליך משותף. ככל שנקבל מכם יותר חומרים איכותיים מוקדם, כך נתקדם מהר יותר ונבנה אתר שמרגיש בדיוק כמוכם.',
    steps: [
      { num: '01', title: 'שליחת המסמך', desc: 'אתם ממלאים את הטופס ושולחים את כל החומרים בבת אחת — תוכן, לוגו, תמונות.' },
      { num: '02', title: 'אפיון מעמיק', desc: 'נקיים פגישת אפיון קצרה להשלמת פערים ולסיכום הסקופ הסופי.' },
      { num: '03', title: 'שלד ראשוני', desc: 'תוך 21 ימי עבודה תקבלו שלד ראשוני של האתר לבחינה ומשוב.' },
      { num: '04', title: 'עיצוב ופיתוח', desc: 'מעברים יחד על סבבי משוב ומפתחים את הגרסה הסופית.' },
    ],
    note: 'זכרו: איכות החומרים שתשלחו משפיעה ישירות על איכות התוצר הסופי.',
  },
};

window.FORM_SECTIONS = [
  {
    id: 'business',
    num: '01',
    title: 'פרטי העסק',
    subtitle: 'נתחיל מהיסודות — ספרו לנו על העסק שלכם',
    questions: [
      { id: 'biz_name', type: 'text', label: 'מהו שם העסק?', placeholder: 'לדוגמה: מאפיית הלחם של דנה', required: true },
      { id: 'biz_services', type: 'textarea', label: 'אילו שירותים או מוצרים העסק מציע?', placeholder: 'רשמו את השירותים או המוצרים המרכזיים שלכם' },
      { id: 'biz_unique', type: 'textarea', label: 'מה מייחד את העסק שלך לעומת המתחרים?', help: 'יתרון בולט, בידול, ערך מוסף', placeholder: 'מה גורם ללקוחות לבחור בכם?' },
      { id: 'biz_location', type: 'text', label: 'היכן העסק פועל?', help: 'מיקום פיזי או אזורי פעילות', placeholder: 'לדוגמה: תל אביב, אזור המרכז, ארצי, אונליין' },
      { id: 'biz_audience', type: 'textarea', label: 'מי קהל היעד שלך?', help: 'גילאים, תחומי עניין, אזור גיאוגרפי וכו׳', placeholder: 'תארו את הלקוח האידיאלי שלכם' },
      { id: 'biz_extra', type: 'textarea', label: 'האם יש מידע נוסף שחשוב לנו לדעת על העסק או על המותג?', placeholder: 'אופציונלי — כל מה שיעזור לנו להבין אתכם טוב יותר' },
    ],
  },
  {
    id: 'domain',
    num: '02',
    title: 'דומיין ואחסון',
    subtitle: 'הצד הטכני — איפה האתר יחיה',
    questions: [
      { id: 'dom_has', type: 'radio', label: 'האם קיים דומיין לעסק?', options: ['כן, יש לי דומיין', 'לא, עדיין לא רכשתי'] },
      { id: 'dom_name', type: 'text', label: 'מהו הדומיין? או שם מועדף לדומיין חדש', placeholder: 'www.yourbusiness.co.il' },
      { id: 'dom_host', type: 'radio', label: 'האם יש ברשותך שירות אחסון (Hosting)?', options: ['כן', 'לא'] },
    ],
  },
  {
    id: 'pages',
    num: '03',
    title: 'מבנה האתר',
    subtitle: 'כמה עמודים ואילו עמודים תרצו באתר',
    questions: [
      { id: 'pag_count', type: 'radio', label: 'כמה עמודים האתר אמור לכלול?', options: ['עמוד אחד (Landing)', '3–5 עמודים', '5–10 עמודים', 'יותר מ־10'] },
      { id: 'pag_required', type: 'checkbox', label: 'אילו עמודים נדרשים?', options: ['דף הבית', 'עמודי שירותי העסק', 'אודות', 'צור קשר'] },
      { id: 'pag_extra', type: 'textarea', label: 'האם יש עמודים נוספים שהיית רוצה שיופיעו באתר?', help: 'לדוגמה: בלוג ומאמרים, קטגוריות ומוצרים, גלריה, עמוד המלצות וכו׳', placeholder: 'פרטו כל עמוד נוסף שחשוב לכם' },
    ],
  },
  {
    id: 'branding',
    num: '04',
    title: 'מיתוג וחומרים קיימים',
    subtitle: 'מה כבר יש לכם בארגז הכלים',
    questions: [
      { id: 'brd_done', type: 'radio', label: 'האם העסק עבר תהליך מיתוג בעבר?', options: ['כן', 'לא'] },
      { id: 'brd_assets', type: 'checkbox', label: 'אילו נכסים קיימים ברשותך?', help: 'סמנו את כל מה שיש לכם', options: ['לוגו', 'שפה גרפית / צבעי מותג', 'תמונות / חומרי צילום', 'פונטים'] },
    ],
  },
  {
    id: 'content',
    num: '05',
    title: 'תוכן וקופירייטינג',
    subtitle: 'הטקסטים שיופיעו באתר',
    questions: [
      { id: 'cnt_ready', type: 'radio', label: 'האם קיימים טקסטים מוכנים לאתר?', options: ['כן, יש לנו טקסטים מוכנים', 'לא, אין לנו טקסטים'] },
      { id: 'cnt_existing', type: 'textarea', label: 'אם כן, אילו תכנים קיימים?', help: 'עמוד בית, אודות, שירותים וכו׳', placeholder: 'פרטו אילו טקסטים מוכנים ברשותכם' },
      { id: 'cnt_copy', type: 'radio', label: 'במידה ואין תכנים — מי אחראי על כתיבת הקופירייטינג?', options: ['הלקוח (אנחנו נכתוב)', 'אתם (הסטודיו)', 'בשיתוף פעולה'] },
    ],
  },
  {
    id: 'design',
    num: '06',
    title: 'כיוון עיצובי',
    subtitle: 'איך האתר צריך להיראות ולהרגיש',
    questions: [
      { id: 'des_style', type: 'mood', label: 'איזה סגנון עיצובי היית רוצה לראות באתר?', help: 'ניתן לבחור כמה אפשרויות', options: [
        { id: 'minimal', title: 'נקי ומינימליסטי', desc: 'הרבה חלל לבן, טיפוגרפיה נקייה', swatch: ['#FAF7F2', '#1A1A1A', '#8B8378'] },
        { id: 'young', title: 'צעיר ודינמי', desc: 'אנרגטי, צבעוני, בועט', swatch: ['#FFE066', '#1A1A1A', '#FF6B6B'] },
        { id: 'luxury', title: 'יוקרתי ואלגנטי', desc: 'מהודר, שקט, מכובד', swatch: ['#0F0F0F', '#C9A961', '#F5F0E8'] },
        { id: 'tech', title: 'חדשני וטכנולוגי', desc: 'גאומטרי, מדויק, עתידני', swatch: ['#0A1628', '#3B82F6', '#E8F0FE'] },
      ]},
      { id: 'des_refs', type: 'textarea', label: 'נשמח שתשתף אותנו באתרים שאהבת מבחינת עיצוב או חוויית משתמש', placeholder: 'קישור 1:\nקישור 2:\nקישור 3:', help: 'הדביקו עד 3 קישורים לאתרים שאתם אוהבים' },
      { id: 'des_elements', type: 'textarea', label: 'האם יש אלמנטים ספציפיים שאהבת?', help: 'צבעים, טיפוגרפיה, אנימציות, מבנה וכו׳', placeholder: 'פרטו מה בדיוק תפס את העין שלכם' },
    ],
  },
  {
    id: 'functionality',
    num: '07',
    title: 'פונקציונליות האתר',
    subtitle: 'מה האתר צריך לדעת לעשות',
    questions: [
      { id: 'fun_legal', type: 'checkbox', label: 'האם יש הסדר מבחינה משפטית שצריך להוסיף לאתר?', options: ['תקנון אתר', 'מדיניות פרטיות', 'תנאי שימוש'] },
      { id: 'fun_lang', type: 'radio', label: 'האם האתר יהיה בשפה נוספת?', options: ['לא, עברית בלבד', 'כן, אנגלית', 'כן, שפה אחרת'] },
      { id: 'fun_lang_other', type: 'text', label: 'אם בחרתם שפה אחרת, איזו?', placeholder: 'לדוגמה: רוסית, ערבית, צרפתית' },
    ],
  },
  {
    id: 'maintenance',
    num: '08',
    title: 'תחזוקה וניהול',
    subtitle: 'אחרי שהאתר עולה לאוויר',
    questions: [
      { id: 'mnt_self', type: 'radio', label: 'האם תרצו לנהל את האתר לבד לאחר ההקמה?', options: ['כן, נרצה לנהל לבד', 'לא, נעדיף שתנהלו אתם', 'עדיין לא בטוח'] },
      { id: 'mnt_updates', type: 'radio', label: 'האם נדרש עדכון שוטף של תוכן?', options: ['כן, באופן קבוע', 'מדי פעם', 'לא, התוכן סטטי'] },
    ],
  },
  {
    id: 'contact',
    num: '09',
    title: 'פרטי קשר',
    subtitle: 'כמעט סיימנו — איך נוכל לחזור אליכם',
    questions: [
      { id: 'con_name', type: 'text', label: 'שם מלא', placeholder: 'השם שלכם', required: true },
      { id: 'con_phone', type: 'text', label: 'טלפון', placeholder: '050-0000000', required: true },
      { id: 'con_email', type: 'text', label: 'אימייל', placeholder: 'name@business.co.il', required: true },
    ],
  },
];
