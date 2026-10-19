/**
 * Sun & moon positions and rise/set times.
 * Trimmed TypeScript port of SunCalc (c) 2011–2015 Vladimir Agafonkin, BSD-2-Clause — https://github.com/mourner/suncalc
 */
const PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan = Math.atan2, acos = Math.acos, rad = PI / 180;
const dayMs = 86400000, J1970 = 2440588, J2000 = 2451545, e = rad * 23.4397;

const toJulian = (d: Date) => d.valueOf() / dayMs - 0.5 + J1970;
const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * dayMs);
const toDays = (d: Date) => toJulian(d) - J2000;
const rightAscension = (l: number, b: number) => atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
const declination = (l: number, b: number) => asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
const azimuth = (H: number, phi: number, dec: number) => atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
const altitude = (H: number, phi: number, dec: number) => asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
const siderealTime = (d: number, lw: number) => rad * (280.16 + 360.9856235 * d) - lw;
const astroRefraction = (h: number) => { const hh = Math.max(0, h); return 0.0002967 / Math.tan(hh + 0.00312536 / (hh + 0.08901179)); };
const solarMeanAnomaly = (d: number) => rad * (357.5291 + 0.98560028 * d);
const eclipticLongitude = (M: number) => M + rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)) + rad * 102.9372 + PI;
const sunCoords = (d: number) => { const L = eclipticLongitude(solarMeanAnomaly(d)); return { dec: declination(L, 0), ra: rightAscension(L, 0) }; };

/** Altitude & azimuth in radians. Azimuth is measured from south, positive towards west. */
export function sunPosition(date: Date, lat: number, lng: number) {
  const lw = rad * -lng, phi = rad * lat, d = toDays(date), c = sunCoords(d), H = siderealTime(d, lw) - c.ra;
  return { azimuth: azimuth(H, phi, c.dec), altitude: altitude(H, phi, c.dec) };
}

const J0 = 0.0009;
const julianCycle = (d: number, lw: number) => Math.round(d - J0 - lw / (2 * PI));
const approxTransit = (Ht: number, lw: number, n: number) => J0 + (Ht + lw) / (2 * PI) + n;
const solarTransitJ = (ds: number, M: number, L: number) => J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
const hourAngle = (h: number, phi: number, d: number) => acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));

/** Sunrise and sunset for the day containing `date`. */
export function sunTimes(date: Date, lat: number, lng: number) {
  const lw = rad * -lng, phi = rad * lat, d = toDays(date), n = julianCycle(d, lw), ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds), L = eclipticLongitude(M), dec = declination(L, 0), Jnoon = solarTransitJ(ds, M, L);
  const Jset = solarTransitJ(approxTransit(hourAngle(-0.833 * rad, phi, dec), lw, n), M, L);
  return { sunrise: fromJulian(Jnoon - (Jset - Jnoon)), sunset: fromJulian(Jset) };
}

const moonCoords = (d: number) => {
  const L = rad * (218.316 + 13.176396 * d), M = rad * (134.963 + 13.064993 * d), F = rad * (93.272 + 13.22935 * d);
  const l = L + rad * 6.289 * sin(M), b = rad * 5.128 * sin(F);
  return { ra: rightAscension(l, b), dec: declination(l, b), dist: 385001 - 20905 * cos(M) };
};

export function moonPosition(date: Date, lat: number, lng: number) {
  const lw = rad * -lng, phi = rad * lat, d = toDays(date), c = moonCoords(d), H = siderealTime(d, lw) - c.ra;
  const h = altitude(H, phi, c.dec);
  return { azimuth: azimuth(H, phi, c.dec), altitude: h + astroRefraction(h) };
}

/** fraction: 0 new → 1 full. phase: 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter. */
export function moonIllumination(date: Date) {
  const d = toDays(date), s = sunCoords(d), m = moonCoords(d), sdist = 149598000;
  const phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
  const inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
  const angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
  return { fraction: (1 + cos(inc)) / 2, phase: 0.5 + (0.5 * inc * (angle < 0 ? -1 : 1)) / PI };
}

/** Moonrise / moonset within the 24h starting at `start` (pass local midnight). */
export function moonTimes(start: Date, lat: number, lng: number) {
  const at = (h: number) => new Date(start.valueOf() + (h * dayMs) / 24);
  const hc = 0.133 * rad;
  let h0 = moonPosition(start, lat, lng).altitude - hc, rise: number | undefined, set: number | undefined;
  for (let i = 1; i <= 24; i += 2) {
    const h1 = moonPosition(at(i), lat, lng).altitude - hc, h2 = moonPosition(at(i + 1), lat, lng).altitude - hc;
    const a = (h0 + h2) / 2 - h1, b = (h2 - h0) / 2, xe = -b / (2 * a), ye = (a * xe + b) * xe + h1, dsc = b * b - 4 * a * h1;
    let roots = 0, x1 = 0, x2 = 0;
    if (dsc >= 0) { const dx = Math.sqrt(dsc) / (Math.abs(a) * 2); x1 = xe - dx; x2 = xe + dx; if (Math.abs(x1) <= 1) roots++; if (Math.abs(x2) <= 1) roots++; if (x1 < -1) x1 = x2; }
    if (roots === 1) { if (h0 < 0) rise = i + x1; else set = i + x1; }
    else if (roots === 2) { rise = i + (ye < 0 ? x2 : x1); set = i + (ye < 0 ? x1 : x2); }
    if (rise !== undefined && set !== undefined) break;
    h0 = h2;
  }
  return { rise: rise !== undefined ? at(rise) : null, set: set !== undefined ? at(set) : null };
}
