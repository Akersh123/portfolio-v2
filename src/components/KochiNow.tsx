import { useEffect, useMemo, useRef, useState } from "react";
import { moonIllumination, moonPosition, moonTimes, sunPosition, sunTimes } from "../lib/suncalc";

/** Live Kochi panel for the footer: local time, weather (Open-Meteo, no key), today's sun & moon times. */
const LAT = 9.9312, LNG = 76.2673, TZ = "Asia/Kolkata";
const WX_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code&timezone=Asia%2FKolkata`;
const WX_KEY = "ab-kochi-wx", WX_TTL = 15 * 60 * 1000;

type Weather = { temp: number; feels: number; humidity: number; code: number };

const fmt = (d: Date | null) => (d ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(d) : "—");
const kochiYMD = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // YYYY-MM-DD
const kochiHour = (d: Date) => { const [h, m] = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(d).split(":"); return (+h % 24) + +m / 60; };

/** WMO weather codes → plain-English label. */
function describe(code: number): { label: string } {
  if (code === 0) return { label: "clear sky" };
  if (code <= 2) return { label: "partly cloudy" };
  if (code === 3) return { label: "overcast" };
  if (code === 45 || code === 48) return { label: "foggy" };
  if (code >= 51 && code <= 57) return { label: "drizzle" };
  if (code >= 61 && code <= 67) return { label: code >= 65 ? "heavy rain" : "rain" };
  if (code >= 80 && code <= 82) return { label: "rain showers" };
  if (code >= 95) return { label: "thunderstorm" };
  return { label: "cloudy" };
}

function mood(h: number) {
  if (h < 5) return "Fast asleep. Probably dreaming about clean migrations.";
  if (h < 8) return "Morning chai on the balcony.";
  if (h < 13) return "Writing Laravel, deep in a ticket.";
  if (h < 14) return "Lunch break.";
  if (h < 18) return "Client calls and testing the release.";
  if (h < 20) return "Sunset over the backwaters. Shipping something.";
  if (h < 23) return "Probably fixing one last bug.";
  return "Should be asleep. Isn't.";
}

/** "in 2h 10m" / "3h ago" relative to now. */
function rel(d: Date | null, now: Date) {
  if (!d) return "not today";
  const mins = Math.round((d.valueOf() - now.valueOf()) / 60000), a = Math.abs(mins), h = Math.floor(a / 60), m = a % 60;
  const span = h ? `${h}h ${m}m` : `${m}m`;
  return mins >= 0 ? `in ${span}` : `${span} ago`;
}

function phaseName(phase: number) {
  const names = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"];
  return names[Math.round(phase * 8) % 8];
}

/* ---------- Sky chart: real sun & moon altitude across today, icons at the current time ---------- */
const VW = 1000, HZ = 150, TOP = 22, DEG = 180 / Math.PI;
const xAt = (f: number) => 40 + f * (VW - 80);
const yAt = (altDeg: number) => (altDeg >= 0 ? HZ - (altDeg / 90) * (HZ - TOP) : HZ - (altDeg / 90) * 60);

function SkyChart({ midnight, now, sunrise, sunset, moonRise, moonSet, fraction, phase }: {
  midnight: Date; now: Date; sunrise: Date; sunset: Date; moonRise: Date | null; moonSet: Date | null; fraction: number; phase: number;
}) {
  const wrap = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(0); // 0 -> 1: icons glide from midnight to now on first view
  const day = 86400000, nowF = Math.min(1, Math.max(0, (now.valueOf() - midnight.valueOf()) / day));

  const curves = useMemo(() => {
    const path = (fn: (d: Date) => { altitude: number }) => Array.from({ length: 97 }, (_, i) => {
      const f = i / 96;
      return `${i ? "L" : "M"}${xAt(f).toFixed(1)},${yAt(fn(new Date(midnight.valueOf() + f * day)).altitude * DEG).toFixed(1)}`;
    }).join(" ");
    return { sun: path((d) => sunPosition(d, LAT, LNG)), moon: path((d) => moonPosition(d, LAT, LNG)) };
  }, [midnight]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(1); el.classList.add("is-drawn"); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect(); el.classList.add("is-drawn");
      const t0 = performance.now();
      const step = (t: number) => { const k = Math.min(1, (t - t0) / 1800); setShown(1 - Math.pow(1 - k, 3)); if (k < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const f = nowF * shown, at = new Date(midnight.valueOf() + f * day);
  const sx = xAt(f), sy = yAt(sunPosition(at, LAT, LNG).altitude * DEG), my = yAt(moonPosition(at, LAT, LNG).altitude * DEG);
  const fx = (d: Date | null) => (d ? xAt((d.valueOf() - midnight.valueOf()) / day) : null);
  const waxing = phase <= 0.5, shift = fraction * 2 * 11 * (waxing ? -1 : 1);
  const mark = (d: Date | null, label: string, cls: string) => {
    const x = fx(d);
    return x === null || x < 40 || x > VW - 40 ? null : (
      <g className={cls}><line x1={x} x2={x} y1={HZ - 6} y2={HZ + 6} /><text x={x} y={HZ + 22} textAnchor="middle">{label} {fmt(d)}</text></g>
    );
  };

  return (
    <svg ref={wrap} className="ab-sky" viewBox={`0 0 ${VW} 220`} role="img" aria-label={`Sun and moon across today in Kochi. Sunrise ${fmt(sunrise)}, sunset ${fmt(sunset)}.`}>
      <defs>
        <clipPath id="ab-sky-above"><rect x="0" y="0" width={VW} height={HZ} /></clipPath>
        <clipPath id="ab-sky-below"><rect x="0" y={HZ} width={VW} height="80" /></clipPath>
        <clipPath id="ab-sky-moon"><circle cx={sx} cy={my} r="11" /></clipPath>
      </defs>
      {[0, 6, 12, 18, 24].map((h) => <text key={h} className="ab-sky-tick" x={xAt(h / 24)} y="214" textAnchor="middle">{String(h % 24).padStart(2, "0")}:00</text>)}
      <line className="ab-sky-hz" x1="20" x2={VW - 20} y1={HZ} y2={HZ} />
      <path className="ab-sky-moon-c below" d={curves.moon} clipPath="url(#ab-sky-below)" />
      <path className="ab-sky-moon-c" d={curves.moon} clipPath="url(#ab-sky-above)" pathLength={1} />
      <path className="ab-sky-sun-c below" d={curves.sun} clipPath="url(#ab-sky-below)" />
      <path className="ab-sky-sun-c" d={curves.sun} clipPath="url(#ab-sky-above)" pathLength={1} />
      {mark(sunrise, "sunrise", "ab-sky-mark sun")}{mark(sunset, "sunset", "ab-sky-mark sun")}
      {mark(moonRise, "moonrise", "ab-sky-mark")}{mark(moonSet, "moonset", "ab-sky-mark")}
      <g className="ab-sky-now"><line x1={sx} x2={sx} y1={TOP - 8} y2={HZ + 34} /><text x={sx} y={TOP - 12} textAnchor="middle">now</text></g>
      <g className="ab-sky-moon" style={{ opacity: my > HZ ? 0.35 : 1 }}>
        <circle cx={sx} cy={my} r="11" className="lit" />
        <circle cx={sx + shift} cy={my} r="11" className="dark" clipPath="url(#ab-sky-moon)" />
        <circle cx={sx} cy={my} r="11" className="rim" />
      </g>
      <g style={{ opacity: sy > HZ ? 0.35 : 1 }} transform={`translate(${sx} ${sy})`}>
        <g className="ab-sky-sun">
          <g className="rays">{Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1="-17" x2="0" y2="-23" transform={`rotate(${i * 45})`} />)}</g>
          <circle r="12" />
        </g>
      </g>
    </svg>
  );
}

export function KochiNow() {
  const [now, setNow] = useState(() => new Date());
  const [wx, setWx] = useState<Weather | null>(null);
  const [wxFailed, setWxFailed] = useState(false);

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); }, []);

  useEffect(() => {
    let alive = true, retried = false;
    const load = async () => {
      try {
        const cached = JSON.parse(sessionStorage.getItem(WX_KEY) || "null");
        if (cached && Date.now() - cached.at < WX_TTL) { setWx(cached.wx); return; }
      } catch { /* storage unavailable */ }
      try {
        const r = await fetch(WX_URL);
        if (!r.ok) throw new Error(String(r.status));
        const c = (await r.json()).current;
        const w: Weather = { temp: c.temperature_2m, feels: c.apparent_temperature, humidity: c.relative_humidity_2m, code: c.weather_code };
        if (!alive) return;
        setWx(w); setWxFailed(false);
        try { sessionStorage.setItem(WX_KEY, JSON.stringify({ at: Date.now(), wx: w })); } catch { /* ignore */ }
      } catch {
        if (!alive) return;
        if (!retried) { retried = true; setTimeout(load, 5000); } else setWxFailed(true); // one retry before giving up
      }
    };
    load();
    const id = setInterval(load, WX_TTL);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const day = kochiYMD(now);
  const times = useMemo(() => {
    const noon = new Date(`${day}T12:00:00+05:30`), midnight = new Date(`${day}T00:00:00+05:30`);
    return { ...sunTimes(noon, LAT, LNG), moon: moonTimes(midnight, LAT, LNG), midnight };
  }, [day]);

  const illum = moonIllumination(now);
  const w = wx ? describe(wx.code) : null;

  return (
    <section className="ab-kochi" aria-label="Kochi right now">
      <div className="ab-kochi-head">
        <div className="ab-kochi-now">
          <span className="ab-label">Kochi, India · right now</span>
          <b>{fmt(now)}<small>IST</small></b>
          <span className="ab-kochi-mood">{mood(kochiHour(now))}</span>
        </div>
        <div className="ab-kochi-wx">
          {wx && w ? (
            <>
              <b>{Math.round(wx.temp)}°C</b>
              <span>{w.label}</span>
              <span className="ab-kochi-sub">Feels like {Math.round(wx.feels)}°C</span>
            </>
          ) : <span className="ab-kochi-sub">{wxFailed ? "Weather unavailable right now" : "Checking the weather…"}</span>}
        </div>
      </div>

      <SkyChart midnight={times.midnight} now={now} sunrise={times.sunrise} sunset={times.sunset}
        moonRise={times.moon.rise} moonSet={times.moon.set} fraction={illum.fraction} phase={illum.phase} />

      <dl className="ab-kochi-grid">
        <div><dt>Sunrise</dt><dd>{fmt(times.sunrise)}</dd><span>{rel(times.sunrise, now)}</span></div>
        <div><dt>Sunset</dt><dd>{fmt(times.sunset)}</dd><span>{rel(times.sunset, now)}</span></div>
        <div><dt>Moonrise</dt><dd>{fmt(times.moon.rise)}</dd><span>{rel(times.moon.rise, now)}</span></div>
        <div><dt>Moonset</dt><dd>{fmt(times.moon.set)}</dd><span>{rel(times.moon.set, now)}</span></div>
        <div><dt>Moon</dt><dd>{Math.round(illum.fraction * 100)}%</dd><span>{phaseName(illum.phase)}</span></div>
        <div><dt>Humidity</dt><dd>{wx ? `${wx.humidity}%` : "—"}</dd><span>{wx ? (wx.humidity > 75 ? "classic Kerala" : "pleasant") : "loading"}</span></div>
      </dl>
    </section>
  );
}
