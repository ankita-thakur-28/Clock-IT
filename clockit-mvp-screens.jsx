import { useState } from "react";

/* ─────────────────────────────────────────────
   CLOCK-IT — Design Token System (derived from splash screen)
   Display serif: Playfair Display — the wordmark & headings
   Script accent: Playfair Display Italic — taglines
   UI/body: Poppins — everything interactive
   Palette pulled directly from the uploaded splash art
───────────────────────────────────────────── */

const T = {
  bgTop: "#FCE7D4",
  bgBottom: "#F9D6DE",
  cream: "#FFFBF7",
  ink: "#3B2620",
  inkSoft: "#6B5750",
  muted: "#A6928A",
  line: "#F1DECF",
  terracotta: "#D98853",
  clockLight: "#F6C79B",
  clockDeep: "#EEA46D",
  ctaFrom: "#F5A671",
  ctaTo: "#EF7391",
  ring: "#F0728F",
};

const font = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Poppins', 'Segoe UI', sans-serif",
};

/* Small reusable clock glyph — reused across screens as the signature motif.
   Hand angle shifts per phase, so the same icon quietly tells you where
   you are in the countdown everywhere it appears. */
function ClockGlyph({ size = 96, angle = 40, ringed = true }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {ringed && (
        <div
          style={{
            position: "absolute",
            inset: -14,
            borderRadius: "50%",
            border: `1.5px dotted ${T.ring}55`,
          }}
        />
      )}
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="clockFace" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor={T.clockLight} />
            <stop offset="100%" stopColor={T.clockDeep} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#clockFace)" stroke="#C97F4E" strokeWidth="2.5" />
        {[0, 90, 180, 270].map((d) => (
          <circle
            key={d}
            cx={50 + 38 * Math.sin((d * Math.PI) / 180)}
            cy={50 - 38 * Math.cos((d * Math.PI) / 180)}
            r="2"
            fill="#C97F4E"
          />
        ))}
        <line x1="50" y1="50" x2={50 + 20 * Math.sin((angle * Math.PI) / 180)} y2={50 - 20 * Math.cos((angle * Math.PI) / 180)} stroke={T.ink} strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="50" x2={50 + 13 * Math.sin(((angle + 130) * Math.PI) / 180)} y2={50 - 13 * Math.cos(((angle + 130) * Math.PI) / 180)} stroke={T.ink} strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3.2" fill={T.ink} />
      </svg>
    </div>
  );
}

/* Small hand-drawn bow glyph — matches the thin, open ribbon-loop
   shape from the reference splash art (two soft loops + a knot),
   not a solid emoji bow. */
function BowGlyph({ size = 34 }) {
  return (
    <svg width={size} height={size * 0.42} viewBox="0 0 72 30" fill="none">
      <path
        d="M34 15c-2-6-9-10-16-8.5C12 7.8 9.5 12 12 15c2.5 3 9 3.5 14 2 2.5-.7 5.5-1 8-2"
        stroke={T.terracotta}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M38 15c2-6 9-10 16-8.5C60 7.8 62.5 12 60 15c-2.5 3-9 3.5-14 2-2.5-.7-5.5-1-8-2"
        stroke={T.terracotta}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="36" cy="15" r="3" fill={T.terracotta} />
    </svg>
  );
}

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px 0", fontFamily: font.body, fontSize: 13, color: T.inkSoft, fontWeight: 600 }}>
      <span>9:41</span>
      <span style={{ letterSpacing: 1 }}>●●● 5G 100%</span>
    </div>
  );
}

function Dots({ n, active }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 18 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 20 : 6,
            height: 6,
            borderRadius: 4,
            background: i === active ? `linear-gradient(90deg, ${T.ctaFrom}, ${T.ctaTo})` : "#F0D9CE",
            transition: "all .25s",
          }}
        />
      ))}
    </div>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        cursor: "pointer",
        padding: "9px 16px",
        borderRadius: 999,
        fontFamily: font.body,
        fontSize: 13,
        fontWeight: 600,
        background: active ? `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})` : "#FFF",
        color: active ? "#fff" : T.inkSoft,
        border: active ? "none" : `1px solid ${T.line}`,
        boxShadow: active ? "0 6px 14px -6px rgba(239,115,145,.6)" : "none",
        transition: "all .2s",
      }}
    >
      {children}
    </button>
  );
}

function CTAButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        cursor: "pointer",
        padding: "16px",
        borderRadius: 999,
        background: `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})`,
        color: "#fff",
        fontFamily: font.body,
        fontWeight: 600,
        fontSize: 15.5,
        boxShadow: "0 12px 24px -10px rgba(239,115,145,.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {children}
    </button>
  );
}

/* ───────────── SCREEN 1 — Splash / Welcome ───────────── */
function ScreenSplash({ goNext }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 30px" }}>
      <StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginBottom: 12 }}><BowGlyph size={40} /></div>
        <h1 style={{ fontFamily: font.display, fontSize: 34, color: T.ink, margin: 0, letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
          CL<span style={{ display: "inline-block", transform: "translateY(2px)" }}><ClockGlyph size={30} ringed={false} angle={50} /></span>CK-IT
        </h1>
        <p style={{ fontFamily: font.display, fontStyle: "italic", color: T.terracotta, fontSize: 15.5, margin: "8px 0 40px" }}>
          your glow, on the clock
        </p>
        <ClockGlyph size={148} angle={40} />
        <div style={{ height: 48 }} />
        <div style={{ width: "100%" }}>
          <CTAButton onClick={goNext}>Get started ✦</CTAButton>
          <p style={{ textAlign: "center", fontFamily: font.body, fontSize: 13, color: T.muted, marginTop: 16 }}>
            Already prepping? <span style={{ color: T.terracotta, fontWeight: 600, textDecoration: "underline" }}>Log in</span>
          </p>
        </div>
      </div>
      <Dots n={5} active={0} />
      <div style={{ height: 22 }} />
    </div>
  );
}

/* ───────────── SCREEN 2 — Milestone & Goal ───────────── */
function ScreenMilestone({ goNext, goBack }) {
  const [type, setType] = useState("Wedding");
  const [goal, setGoal] = useState("Tone & Sculpt");
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 24px" }}>
      <StatusBar />
      <Header goBack={goBack} title="Your milestone" step="Step 1 of 3" />
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 14, display: "flex", flexDirection: "column", gap: 26 }}>
        <div>
          <Label>What are you counting down to?</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {["Wedding", "Race", "Milestone", "Just because"].map((t) => (
              <Pill key={t} active={type === t} onClick={() => setType(t)}>{t}</Pill>
            ))}
          </div>
        </div>

        <div>
          <Label>Pick the date</Label>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ClockGlyph size={54} angle={90} ringed={false} />
              <div>
                <div style={{ fontFamily: font.display, fontSize: 22, color: T.ink }}>Jan 09, 2027</div>
                <div style={{ fontFamily: font.body, fontSize: 12.5, color: T.muted, marginTop: 3 }}>142 days from today</div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Label>What matters most to you?</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              ["Feel Stronger", "Build strength & consistency"],
              ["Tone & Sculpt", "Targeted, sustainable definition"],
              ["Maintain & Glow", "Keep steady, feel your best"],
            ].map(([title, sub]) => (
              <GoalCard key={title} title={title} sub={sub} active={goal === title} onClick={() => setGoal(title)} />
            ))}
          </div>
        </div>
        <div style={{ height: 4 }} />
      </div>
      <div style={{ padding: "16px 0 22px" }}>
        <CTAButton onClick={goNext}>Continue ✦</CTAButton>
      </div>
    </div>
  );
}

function GoalCard({ title, sub, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        border: active ? `1.5px solid ${T.ctaTo}` : `1px solid ${T.line}`,
        background: active ? "#FFF3EE" : "#FFF",
        borderRadius: 16,
        padding: "13px 16px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontFamily: font.body, fontWeight: 600, fontSize: 14.5, color: T.ink }}>{title}</div>
        <div style={{ fontFamily: font.body, fontSize: 12, color: T.muted, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${active ? T.ctaTo : T.line}`, background: active ? `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})` : "transparent" }} />
    </button>
  );
}

/* ───────────── SCREEN 3 — Profile & Tracking Preferences ───────────── */
function ScreenProfile({ goNext, goBack }) {
  const [tracking, setTracking] = useState(["Energy & mood"]);
  const toggle = (t) => setTracking((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 24px" }}>
      <StatusBar />
      <Header goBack={goBack} title="A little about you" step="Step 2 of 3" />
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 14, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <Label>Name</Label>
          <Input placeholder="Ankita" />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label>Height</Label>
            <Input placeholder="163 cm" />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Dietary needs</Label>
            <Input placeholder="Vegetarian" />
          </div>
        </div>

        <div>
          <Label>What should we track together?</Label>
          <p style={{ fontFamily: font.body, fontSize: 12, color: T.muted, margin: "-2px 0 13px", lineHeight: 1.5 }}>
            Pick what feels useful — nothing here is required to use the app.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Weight", "Measurements", "Progress photos (private)", "Energy & mood", "Just habits — skip metrics"].map((t) => (
              <CheckRow key={t} label={t} checked={tracking.includes(t)} onClick={() => toggle(t)} />
            ))}
          </div>
        </div>
        <div style={{ height: 4 }} />
      </div>
      <div style={{ padding: "16px 0 22px" }}>
        <CTAButton onClick={goNext}>Create my calendar ✦</CTAButton>
      </div>
    </div>
  );
}

function CheckRow({ label, checked, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF", border: `1px solid ${T.line}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer" }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? T.ctaTo : T.line}`, background: checked ? `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>
        {checked ? "✓" : ""}
      </div>
      <span style={{ fontFamily: font.body, fontSize: 13.5, color: T.ink }}>{label}</span>
    </button>
  );
}

function Input({ placeholder }) {
  return (
    <input
      placeholder={placeholder}
      readOnly
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 14px",
        borderRadius: 14,
        border: `1px solid ${T.line}`,
        fontFamily: font.body,
        fontSize: 14,
        color: T.ink,
        outline: "none",
        marginTop: 6,
      }}
    />
  );
}

/* ───────────── SCREEN 4 — Calendar Home ───────────── */
function DayCell({ day, isDone, isToday, onClick }) {
  // Filled ring = completed day. Ring is built with a gradient outer
  // circle + inset white circle, so the ring thickness reads clearly
  // at small sizes without needing an actual SVG stroke per cell.
  return (
    <button
      onClick={isToday ? onClick : undefined}
      style={{
        aspectRatio: "1",
        border: "none",
        background: "transparent",
        cursor: isToday ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "82%",
          height: "82%",
          borderRadius: "50%",
          padding: isDone ? 2.5 : 0,
          background: isDone ? `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})` : "transparent",
          border: !isDone ? `1.3px solid ${T.line}` : "none",
          boxShadow: isToday ? `0 0 0 2.5px ${T.ctaTo}` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.body,
            fontSize: 12,
            fontWeight: isToday ? 700 : 500,
            color: isToday ? T.ctaTo : T.ink,
          }}
        >
          {day}
        </div>
      </div>
    </button>
  );
}

function ScreenCalendar({ goNext, openDay }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const done = new Set([1, 2, 3, 4, 6, 7, 9, 10, 11, 14, 15, 18]);
  const today = 20;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 24px" }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 16px" }}>
        <span style={{ fontFamily: font.display, fontSize: 20, color: T.ink }}>Hi, Ankita ✦</span>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.clockLight}, ${T.clockDeep})` }} />
      </div>

      <Card style={{ background: `linear-gradient(135deg, #FFF6EF, #FFF0F3)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: font.body, fontSize: 11, letterSpacing: 1.5, color: T.terracotta, fontWeight: 700, textTransform: "uppercase" }}>Foundation Phase</div>
            <div style={{ fontFamily: font.display, fontSize: 28, color: T.ink, lineHeight: 1.15, marginTop: 4 }}>142 days to go</div>
            <div style={{ fontFamily: font.body, fontSize: 12, color: T.muted, marginTop: 4 }}>Building your routine, steadily</div>
          </div>
          <ProgressRing percent={62} />
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "22px 0 14px" }}>
        <span style={{ fontFamily: font.display, fontSize: 16, color: T.ink }}>August 2026</span>
        <span style={{ fontFamily: font.body, fontSize: 12, color: T.terracotta, fontWeight: 600 }}>12-day streak 🔥</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: font.body, fontSize: 10.5, color: T.muted, fontWeight: 600, paddingBottom: 4 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, flex: 1, overflowY: "auto" }}>
        {days.map((d) => (
          <DayCell key={d} day={d} isDone={done.has(d)} isToday={d === today} onClick={openDay} />
        ))}
      </div>

      <button onClick={openDay} style={{ marginTop: 16, marginBottom: 20, background: "#FFF", border: `1px solid ${T.line}`, borderRadius: 16, padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: font.body, fontSize: 12, color: T.muted }}>Today's routine</div>
          <div style={{ fontFamily: font.body, fontSize: 14, fontWeight: 600, color: T.ink, marginTop: 2 }}>3 of 5 done — keep going</div>
        </div>
        <span style={{ color: T.ctaTo, fontSize: 18 }}>→</span>
      </button>
    </div>
  );
}

/* ───────────── SCREEN 5 — Day Detail Checklist ───────────── */
function ScreenDayDetail({ goBack }) {
  const [checks, setChecks] = useState({ am: true, pm: false, body: true, move: false });
  const toggle = (k) => setChecks((c) => ({ ...c, [k]: !c[k] }));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 24px" }}>
      <StatusBar />
      <Header goBack={goBack} title="" step="" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 20px" }}>
        <span style={{ fontFamily: font.body, color: T.muted, fontSize: 18 }}>‹</span>
        <span style={{ fontFamily: font.display, fontSize: 17, color: T.ink }}>Today, Aug 20</span>
        <span style={{ fontFamily: font.body, color: T.muted, fontSize: 18 }}>›</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 6 }}>
        <ModuleCard title="How's your energy?" icon="✦">
          <div style={{ display: "flex", gap: 8 }}>
            {["Low", "Okay", "Good", "Great"].map((e) => (
              <Pill key={e} active={e === "Good"}>{e}</Pill>
            ))}
          </div>
        </ModuleCard>

        <ModuleCard title="Skincare" icon="🌸">
          <ToggleRow label="Morning ritual — cleanse, vitamin C, SPF" checked={checks.am} onClick={() => toggle("am")} />
          <ToggleRow label="Evening ritual — double cleanse, retinol" checked={checks.pm} onClick={() => toggle("pm")} />
        </ModuleCard>

        <ModuleCard title="Body & hair" icon="🤍">
          <ToggleRow label="Body scrub & lotion" checked={checks.body} onClick={() => toggle("body")} />
        </ModuleCard>

        <ModuleCard title="Today's movement" icon="⚡" badge="Foundation">
          <div style={{ fontFamily: font.body, fontSize: 13, color: T.inkSoft, marginBottom: 8 }}>Full Body — 4 exercises · ~35 min</div>
          <ToggleRow label="Mark workout complete" checked={checks.move} onClick={() => toggle("move")} />
        </ModuleCard>

        <ModuleCard title="Weight log" icon="○" muted subtitle="Optional — you turned this on in setup">
          <div style={{ display: "flex", gap: 10 }}>
            <Input placeholder="AM weight" />
            <Input placeholder="PM weight" />
          </div>
        </ModuleCard>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", padding: "7px 0", cursor: "pointer" }}>
      <span style={{ fontFamily: font.body, fontSize: 13, color: T.ink, textAlign: "left" }}>{label}</span>
      <div style={{ width: 38, height: 22, borderRadius: 999, background: checked ? `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})` : "#EFE4DC", position: "relative", flexShrink: 0, marginLeft: 10 }}>
        <div style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
      </div>
    </button>
  );
}

function ModuleCard({ title, icon, children, badge, muted, subtitle }) {
  return (
    <div style={{ background: muted ? "#FFF9F4" : "#FFF", border: `1px solid ${T.line}`, borderRadius: 18, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: subtitle ? 3 : 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{icon}</span>
          <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 14, color: T.ink }}>{title}</span>
        </div>
        {badge && (
          <span style={{ fontFamily: font.body, fontSize: 10, fontWeight: 700, color: T.terracotta, background: "#FFF0E6", padding: "3px 9px", borderRadius: 999 }}>{badge}</span>
        )}
      </div>
      {subtitle && <div style={{ fontFamily: font.body, fontSize: 11, color: T.muted, marginBottom: 8 }}>{subtitle}</div>}
      {children}
    </div>
  );
}

/* ───────────── shared bits ───────────── */
function Header({ goBack, title, step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 4px" }}>
      <button onClick={goBack} style={{ background: "#FFF", border: `1px solid ${T.line}`, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", color: T.inkSoft, fontSize: 15 }}>‹</button>
      {title && <span style={{ fontFamily: font.display, fontSize: 17, color: T.ink }}>{title}</span>}
      {step && <span style={{ fontFamily: font.body, fontSize: 11, color: T.muted }}>{step}</span>}
    </div>
  );
}

function Label({ children, style }) {
  return <div style={{ fontFamily: font.body, fontSize: 12.5, fontWeight: 600, color: T.inkSoft, marginBottom: 8, ...style }}>{children}</div>;
}

function ProgressRing({ percent = 50, size = 56 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${T.line}`} strokeWidth="5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={T.ctaFrom} />
          <stop offset="100%" stopColor={T.ctaTo} />
        </linearGradient>
      </defs>
      <text x="50%" y="53%" textAnchor="middle" fontFamily={font.body} fontSize="13" fontWeight="700" fill={T.ink}>
        {percent}%
      </text>
    </svg>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#FFF", border: `1px solid ${T.line}`, borderRadius: 18, padding: "16px", ...style }}>
      {children}
    </div>
  );
}

/* ───────────── Phone frame + app shell ───────────── */
const SCREENS = ["Splash", "Milestone & Goal", "Profile & Preferences", "Calendar Home", "Day Detail"];

export default function ClockItMockup() {
  const [screen, setScreen] = useState(0);
  const go = (n) => setScreen(Math.max(0, Math.min(SCREENS.length - 1, n)));

  const renderScreen = () => {
    switch (screen) {
      case 0: return <ScreenSplash goNext={() => go(1)} />;
      case 1: return <ScreenMilestone goNext={() => go(2)} goBack={() => go(0)} />;
      case 2: return <ScreenProfile goNext={() => go(3)} goBack={() => go(1)} />;
      case 3: return <ScreenCalendar goNext={() => go(4)} openDay={() => go(4)} />;
      case 4: return <ScreenDayDetail goBack={() => go(3)} />;
      default: return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${T.bgTop}, #FFF 45%, ${T.bgBottom})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: font.body,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontFamily: font.display, fontSize: 22, color: T.ink, fontWeight: 700 }}>CLOCK-IT — MVP 0–2 Screen Flow</div>
        <div style={{ fontFamily: font.body, fontSize: 13, color: T.muted, marginTop: 4 }}>Splash → Milestone & Goal → Profile → Calendar Home → Day Detail</div>
      </div>

      {/* phone frame */}
      <div
        style={{
          width: 340,
          height: 700,
          borderRadius: 42,
          background: `linear-gradient(160deg, ${T.bgTop}, #FFF 40%, ${T.bgBottom})`,
          border: "10px solid #fff",
          boxShadow: "0 40px 80px -30px rgba(59,38,32,.35), 0 0 0 1px #f0d9ce",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {renderScreen()}
      </div>

      {/* nav controls for reviewing */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
        <button onClick={() => go(screen - 1)} disabled={screen === 0} style={navBtn(screen === 0)}>← Prev</button>
        <div style={{ display: "flex", gap: 6 }}>
          {SCREENS.map((s, i) => (
            <button
              key={s}
              onClick={() => go(i)}
              title={s}
              style={{
                width: 9, height: 9, borderRadius: "50%", border: "none", cursor: "pointer",
                background: i === screen ? `linear-gradient(135deg, ${T.ctaFrom}, ${T.ctaTo})` : "#F0D9CE",
              }}
            />
          ))}
        </div>
        <button onClick={() => go(screen + 1)} disabled={screen === SCREENS.length - 1} style={navBtn(screen === SCREENS.length - 1)}>Next →</button>
      </div>
      <div style={{ fontFamily: font.body, fontSize: 12.5, color: T.inkSoft, marginTop: 10, fontWeight: 600 }}>
        {screen + 1}. {SCREENS[screen]}
      </div>
    </div>
  );
}

function navBtn(disabled) {
  return {
    padding: "9px 16px",
    borderRadius: 999,
    border: `1px solid ${T.line}`,
    background: "#fff",
    color: disabled ? "#D8C7BE" : T.inkSoft,
    fontFamily: font.body,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
}
