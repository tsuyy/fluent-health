document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll fade-in ───────────────────────────────────────
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ============================================================
   VO2 MAX CHART 
============================================================ */

/* ============================================================
   VO2 MAX CHART v2 — quarterly avg → monthly avg
   Replaces the existing vo2_chart.js block in main.js wholesale.

   Same two-layer structure as before: a line of monthly averages,
   plus three highlighted points for your real peak/trough/current
   single-day readings, sitting ON the line at their month's average
   (the specific number lives in the tooltip, not the dot's position).

   This also resolves the open Q3-vs-Q4 question from the quarterly
   version — Oct 20, 2023 is unambiguously month key '2023-10' now,
   no boundary judgment call needed.

   57 months of data makes a label for every point unreadable, so the
   x-axis only prints Jan/Apr/Jul/Oct (year at Jan, bare month
   otherwise) — same declutter logic as the old year-at-Q1 approach,
   just quarterly ticks over monthly data instead of monthly ticks
   over quarterly data.
============================================================ */

const vo2Canvas = document.getElementById('vo2Chart');
if (vo2Canvas && window.Chart) {
  const VO2_MONTHLY = [
    { month: '2022-01', avg: 33.83 }, { month: '2022-02', avg: 36.73 }, { month: '2022-03', avg: 37.96 },
    { month: '2022-04', avg: 36.78 }, { month: '2022-05', avg: 36.48 }, { month: '2022-06', avg: 36.68 },
    { month: '2022-07', avg: 35.53 }, { month: '2022-08', avg: 33.98 }, { month: '2022-09', avg: 34.98 },
    { month: '2022-10', avg: 33.08 }, { month: '2022-11', avg: 32.12 }, { month: '2022-12', avg: 31.32 },
    { month: '2023-01', avg: 32.15 }, { month: '2023-02', avg: 32.73 }, { month: '2023-03', avg: 31.85 },
    { month: '2023-04', avg: 32.38 }, { month: '2023-05', avg: 31.88 }, { month: '2023-06', avg: 31.74 },
    { month: '2023-07', avg: 30.55 }, { month: '2023-08', avg: 31.43 }, { month: '2023-09', avg: 31.40 },
    { month: '2023-10', avg: 31.79 }, { month: '2023-11', avg: 31.56 }, { month: '2023-12', avg: 31.67 },
    { month: '2024-01', avg: 31.93 }, { month: '2024-02', avg: 32.61 }, { month: '2024-03', avg: 32.48 },
    { month: '2024-04', avg: 32.11 }, { month: '2024-05', avg: 32.31 }, { month: '2024-06', avg: 33.62 },
    { month: '2024-07', avg: 34.62 }, { month: '2024-08', avg: 34.53 }, { month: '2024-09', avg: 34.55 },
    { month: '2024-10', avg: 35.30 }, { month: '2024-11', avg: 35.58 }, { month: '2024-12', avg: 35.81 },
    { month: '2025-01', avg: 35.75 }, { month: '2025-02', avg: 36.35 }, { month: '2025-03', avg: 36.52 },
    { month: '2025-04', avg: 37.84 }, { month: '2025-05', avg: 37.61 }, { month: '2025-06', avg: 38.45 },
    { month: '2025-07', avg: 37.98 }, { month: '2025-08', avg: 37.62 }, { month: '2025-09', avg: 37.80 },
    { month: '2025-10', avg: 38.42 }, { month: '2025-11', avg: 37.58 }, { month: '2025-12', avg: 37.42 },
    { month: '2026-01', avg: 37.49 }, { month: '2026-02', avg: 37.57 }, { month: '2026-03', avg: 36.92 },
    { month: '2026-04', avg: 37.67 }, { month: '2026-05', avg: 38.46 }, { month: '2026-06', avg: 39.35 },
    { month: '2026-07', avg: 39.04 }, { month: '2026-08', avg: 39.30 }, { month: '2026-09', avg: 39.60 },
  ];

  // Specific single-day readings — real test values, not monthly averages.
  const POINT_ANNOTATIONS = {
    '2022-03': { value: 40.23, date: 'Mar 4, 2022', note: 'All-time high — XC skiing with a dog' },
    '2023-10': { value: 29.61, date: 'Oct 20, 2023', note: 'All-time low — base-building dip' },
    '2026-09': { value: 39.32, date: 'Sep 27, 2026', note: 'Current — nearly back to peak, different training' },
  };

  const labels = VO2_MONTHLY.map((d) => d.month);
  const lineData = VO2_MONTHLY.map((d) => d.avg);

  const pointRadii = labels.map((m) => (POINT_ANNOTATIONS[m] ? 0 : 1.5));
  const pointColors = labels.map(() => '#444441');

  // Annotation dots sit ON the line, at the month's actual average —
  // the specific single-day number lives in the tooltip instead.
  const annotationPoints = labels.map((m, i) =>
    POINT_ANNOTATIONS[m] ? lineData[i] : null
  );

  const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const TICK_MONTHS = new Set(['01', '04', '07', '10']); // quarterly ticks over monthly data

  new Chart(vo2Canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Monthly average',
          data: lineData,
          borderColor: '#5a5a5f',
          borderWidth: 2,
          pointBackgroundColor: pointColors,
          pointRadius: pointRadii,
          tension: 0.35,
          fill: false,
        },
        {
          label: 'Specific test readings',
          data: annotationPoints,
          showLine: false,
          pointBackgroundColor: '#0681fc',
          pointBorderColor: '#0A0A09',
          pointBorderWidth: 2,
          pointRadius: labels.map((m) => (POINT_ANNOTATIONS[m] ? 7 : 0)),
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#151516',
          borderColor: '#2a2a2c',
          borderWidth: 1,
          titleColor: '#F1EFE8',
          bodyColor: '#B5B4AC',
          filter: (item) => {
            if (item.datasetIndex !== 1) return true;
            return Boolean(POINT_ANNOTATIONS[labels[item.dataIndex]]);
          },
          callbacks: {
            title: (items) => {
              const [y, m] = labels[items[0].dataIndex].split('-');
              return `${MONTH_ABBR[Number(m) - 1]} ${y}`;
            },
            label: (item) => {
              if (item.datasetIndex === 1) {
                const m = labels[item.dataIndex];
                const a = POINT_ANNOTATIONS[m];
                return a ? `Actual reading: ${a.value} mL/min·kg — ${a.date}` : '';
              }
              return `Month average: ${item.formattedValue} mL/min·kg`;
            },
            afterLabel: (item) => {
              if (item.datasetIndex !== 1) return '';
              const m = labels[item.dataIndex];
              const a = POINT_ANNOTATIONS[m];
              return a ? a.note : '';
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#5b5a5f',
            font: { size: 13 },
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
            callback: (value, index) => {
              const [year, m] = labels[index].split('-');
              if (!TICK_MONTHS.has(m)) return '';
              return m === '01' ? year : MONTH_ABBR[Number(m) - 1];
            },
          },
        },
        y: {
          min: 28,
          max: 42,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#A3A29A', font: { size: 13 } },
          title: { display: true, text: 'mL/min·kg', color: '#A3A29A', font: { size: 12 } },
        },
      },
    },
  });
}

/* ============================================================
   FEVER ARC (revised: a withdrawn finding, shown with what could explain it)
   Source of truth: the deck (slide 08). Data: local-date series, Feb 8 to Mar 1.
   Labels are neutral (activities only); no private context ships in this file.
============================================================ */

const FEVER_ARC = {"meta":{"range":"2026-02-08 to 2026-03-01","baseline":"mean of the previous 30 nights (at least 14 readings), scored night excluded","wrist_after_hot_room_plus_run":{"others_median_c":0.16,"others_n":8,"feb10_occasion_c":1.46},"caption":"Baseline = mean of the previous 30 days, excluding the day scored (at least 14 readings). Median +0.2° = 8 other occasions of a 60-minute hot class followed by a run the next day. Exploratory: found after looking at the data. One person; data through the Oct 2026 export."},"bands":[{"id":"presumed","label":"Presumed deviation","from":"2026-02-11","to":"2026-02-12"},{"id":"fever","label":"Fever","from":"2026-02-24","to":"2026-02-25"}],"days":[{"date":"2026-02-08","excluded":false,"hrv_dev":-14.0,"rhr_dev":4.3,"wrist_dev":0.42,"activities":[]},{"date":"2026-02-09","excluded":false,"hrv_dev":-3.1,"rhr_dev":-2.9,"wrist_dev":0.29,"activities":[]},{"date":"2026-02-10","excluded":false,"hrv_dev":-7.4,"rhr_dev":0.9,"wrist_dev":0.38,"activities":["Hot pilates, 60 min"]},{"date":"2026-02-11","excluded":false,"hrv_dev":-10.5,"rhr_dev":-1.9,"wrist_dev":1.03,"activities":["Run, 9.0 mi"]},{"date":"2026-02-12","excluded":false,"hrv_dev":-16.8,"rhr_dev":1.1,"wrist_dev":1.46,"activities":["Hot yoga, 47 min"]},{"date":"2026-02-13","excluded":false,"hrv_dev":-17.8,"rhr_dev":-1.1,"wrist_dev":-0.12,"activities":["Strength, 55 min"]},{"date":"2026-02-14","excluded":false,"hrv_dev":2.3,"rhr_dev":2.0,"wrist_dev":null,"activities":["Cycling, 43 min","Run, 5.2 mi"]},{"date":"2026-02-15","excluded":true,"hrv_dev":null,"rhr_dev":null,"wrist_dev":null,"activities":[]},{"date":"2026-02-16","excluded":true,"hrv_dev":null,"rhr_dev":null,"wrist_dev":null,"activities":[]},{"date":"2026-02-17","excluded":false,"hrv_dev":6.6,"rhr_dev":-5.3,"wrist_dev":-0.1,"activities":["Strength, 50 min"]},{"date":"2026-02-18","excluded":false,"hrv_dev":18.4,"rhr_dev":-5.2,"wrist_dev":0.06,"activities":[]},{"date":"2026-02-19","excluded":false,"hrv_dev":7.6,"rhr_dev":-7.9,"wrist_dev":-0.09,"activities":[]},{"date":"2026-02-20","excluded":false,"hrv_dev":-6.4,"rhr_dev":-2.6,"wrist_dev":0.55,"activities":[]},{"date":"2026-02-21","excluded":false,"hrv_dev":-13.7,"rhr_dev":18.4,"wrist_dev":null,"activities":["Run, 4.0 mi"]},{"date":"2026-02-22","excluded":false,"hrv_dev":-2.4,"rhr_dev":-6.2,"wrist_dev":-0.03,"activities":["Run, 5.0 mi"]},{"date":"2026-02-23","excluded":false,"hrv_dev":6.5,"rhr_dev":21.9,"wrist_dev":-0.45,"activities":[]},{"date":"2026-02-24","excluded":false,"hrv_dev":-29.5,"rhr_dev":34.1,"wrist_dev":null,"activities":["Skiing, 226 min"]},{"date":"2026-02-25","excluded":false,"hrv_dev":-29.9,"rhr_dev":22.0,"wrist_dev":2.49,"activities":["Skiing, 193 min"]},{"date":"2026-02-26","excluded":false,"hrv_dev":-20.1,"rhr_dev":13.1,"wrist_dev":null,"activities":["Skiing, 282 min"]},{"date":"2026-02-27","excluded":false,"hrv_dev":-10.0,"rhr_dev":-1.6,"wrist_dev":-0.19,"activities":["Skiing, 284 min"]},{"date":"2026-02-28","excluded":false,"hrv_dev":-5.8,"rhr_dev":5.4,"wrist_dev":-0.24,"activities":["Skiing, 196 min"]},{"date":"2026-03-01","excluded":false,"hrv_dev":12.7,"rhr_dev":1.0,"wrist_dev":-0.71,"activities":[]}],"callouts":[{"type":"wrist","date":"2026-02-11","value":1.03,"long":true},{"type":"wrist","date":"2026-02-12","value":1.46},{"type":"wrist","date":"2026-02-13","value":-0.12},{"type":"wrist","date":"2026-02-25","value":2.49},{"type":"hrv","date":"2026-02-18","value":18.4},{"type":"hrv","date":"2026-03-01","value":12.7},{"type":"avg","from":"2026-02-11","to":"2026-02-12","value":-13.7},{"type":"avg","from":"2026-02-24","to":"2026-02-25","value":-29.7},{"type":"activity","date":"2026-02-08","label":"day after a long run"},{"type":"activity","date":"2026-02-10","label":"hot pilates"},{"type":"activity","date":"2026-02-11","label":"long run"},{"type":"activity","date":"2026-02-12","label":"hot yoga"},{"type":"note","date":"2026-02-24","label":"No overnight sleep episode recorded this night"},{"type":"excluded","from":"2026-02-15","to":"2026-02-16","label":"travel days excluded"}]};

// Shared layout for the fever-arc chart (demo React + site vanilla JS render the same primitives).
// Returns { prims, geom }. prims: [{ t:'rect'|'line'|'text'|'path', ...attrs }]
// Data shape: { days:[{date,hrv_dev,rhr_dev,wrist_dev,excluded,activities}], bands:[{id,label,from,to}], callouts:[...] }

const FV_PINK = '#c450e8'
const FV_BLUE = '#0681fc'
const FV_INK = 'rgba(255,255,255,0.86)'
const FV_QUIET = 'rgba(255,255,255,0.72)'
const FV_HAIR = 'rgba(255,255,255,0.22)'

const FV_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fvFmtDate(iso) {
  const [, m, d] = iso.split('-').map(Number)
  return `${FV_MONTHS[m - 1]} ${d}`
}
const fvSgn = (v, dp) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(dp)}`

function fvLayout({ days, bands, callouts }, { width, height, compact }) {
  const narrow = width < 560
  const full = !compact
  const m = { l: 14, r: 14, t: compact ? 10 : 50, b: compact ? 10 : 50 }
  const plotW = width - m.l - m.r
  const plotH = height - m.t - m.b
  const midY = m.t + plotH / 2
  const n = days.length
  const dayW = plotW / n
  const barW = Math.max(dayW * 0.56, 2)
  const maxAbs = 30
  const xc = (i) => m.l + dayW * i + dayW / 2
  const ix = (date) => days.findIndex((d) => d.date === date)
  const hOf = (v) => (Math.abs(v) / maxAbs) * (plotH / 2)
  const prims = []

  // ── bands ────────────────────────────────────────────────
  bands.forEach((b) => {
    const i0 = ix(b.from)
    const i1 = ix(b.to)
    if (i0 < 0 || i1 < 0) return
    const x0 = xc(i0) - dayW / 2
    const x1 = xc(i1) + dayW / 2
    const fever = b.id === 'fever'
    prims.push({
      t: 'rect', x: x0, y: m.t, w: x1 - x0, h: plotH,
      fill: fever ? 'rgba(196,80,232,0.16)' : 'rgba(255,255,255,0.045)',
      stroke: fever ? 'none' : 'rgba(255,255,255,0.4)', dash: null, rx: 2,
      key: `band-${b.id}`,
    })
    if (full) {
      prims.push({
        t: 'text', x: (x0 + x1) / 2, y: m.t - 10, anchor: 'middle', size: 12, weight: 600,
        fill: fever ? '#e0a6f3' : FV_INK, spacing: '0.06em', text: b.label.toUpperCase(), key: `bandlabel-${b.id}`,
      })
    }
  })

  // ── excluded (travel) days: small dashed boxes around the baseline ──
  days.forEach((d, i) => {
    if (!d.excluded) return
    prims.push({
      t: 'rect', x: xc(i) - dayW * 0.38, y: midY - 26, w: dayW * 0.76, h: 52,
      fill: 'none', stroke: 'rgba(255,255,255,0.35)', dash: '3 3', rx: 2, key: `ex-${d.date}`,
    })
  })

  // ── baseline ─────────────────────────────────────────────
  prims.push({ t: 'line', x1: m.l, x2: width - m.r, y1: midY, y2: midY, stroke: 'rgba(255,255,255,0.28)', sw: 1, key: 'baseline' })

  // ── HRV bars ─────────────────────────────────────────────
  days.forEach((d, i) => {
    if (d.excluded || d.hrv_dev == null) return
    const neg = d.hrv_dev < 0
    const h = hOf(d.hrv_dev)
    prims.push({
      t: 'rect', x: xc(i) - barW / 2, y: neg ? midY : midY - h, w: barW, h, rx: 1,
      fill: neg ? FV_PINK : FV_BLUE, opacity: 0.3 + (Math.abs(d.hrv_dev) / maxAbs) * 0.6, key: `bar-${d.date}`,
      bar: i,
    })
  })

  // Per-day notes for the tooltip (wrist call-outs, activity labels, windows, travel).
  const notes = days.map(() => [])
  callouts.forEach((c) => {
    if (c.type === 'activity' && ix(c.date) >= 0 && c.label && !(days[ix(c.date)].activities || []).length) notes[ix(c.date)].push(c.label.charAt(0).toUpperCase() + c.label.slice(1))
    if (c.type === 'note' && ix(c.date) >= 0) notes[ix(c.date)].push(c.label)
    if (c.type === 'avg') for (let i = ix(c.from); i <= ix(c.to); i++) if (i >= 0) notes[i].push(`Window avg ${fvSgn(c.value, 1)} ms HRV`)
  })
  bands.forEach((b) => { for (let i = ix(b.from); i <= ix(b.to); i++) if (i >= 0) notes[i].unshift(b.label) })
  const geom = { m, plotW, plotH, midY, dayW, xc, n, notes }
  if (!full) return { prims, geom }

  const text = (o) => prims.push({ t: 'text', size: 12, fill: FV_INK, ...o })

  // small marker under the plot on days that have extra detail in the tooltip
  days.forEach((d, i) => {
    const hasExtra = d.excluded || callouts.some((c) => c.date === d.date && c.type !== 'avg')
    if (hasExtra) prims.push({ t: 'rect', x: xc(i) - 2, y: m.t + plotH + 4, w: 4, h: 4, rx: 2, fill: FV_QUIET, key: `dot-${d.date}` })
  })

  // label the excluded days
  const ex = callouts.find((c) => c.type === 'excluded')
  if (ex) {
    const cx = (xc(ix(ex.from)) + xc(ix(ex.to))) / 2
    text({ x: cx, y: midY + 44, anchor: 'middle', size: 12, fill: FV_QUIET, text: narrow ? 'travel' : 'travel days', key: 'ex-l1' })
    if (!narrow) text({ x: cx, y: midY + 56, anchor: 'middle', size: 12, fill: FV_QUIET, text: 'excluded', key: 'ex-l2' })
  }

  // band averages under the plot
  callouts.filter((c) => c.type === 'avg').forEach((c) => {
    text({ x: (xc(ix(c.from)) + xc(ix(c.to))) / 2, y: m.t + plotH + 22, anchor: 'middle', text: `Avg ${fvSgn(c.value, 1)}ms`, weight: 600, key: `avg-${c.from}` })
  })

  // x axis: every day if room, else every 2nd (always the last day)
  const step = dayW >= 22 ? 1 : 2
  days.forEach((d, i) => {
    if (step === 2 && (i === n - 1 ? false : (i % 2 || i === n - 2))) return
    const [, mo, dd] = d.date.split('-').map(Number)
    const label = dd === 1 ? `${FV_MONTHS[mo - 1]} 1` : `${dd}`
    text({ x: xc(i), y: height - 8, anchor: 'middle', size: 12, fill: FV_QUIET, text: label, key: `tick-${d.date}` })
  })

  return { prims, geom }
}

const svgNS = 'http://www.w3.org/2000/svg'
function el(tag, attrs) {
  const node = document.createElementNS(svgNS, tag)
  Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v))
  return node
}

function renderChart(container) {
  container.innerHTML = ''
  const width = container.clientWidth || 700
  const height = width < 560 ? 280 : 320
  const { prims, geom } = fvLayout(FEVER_ARC, { width, height, compact: false })
  const days = FEVER_ARC.days
  const svg = el('svg', {
    width: '100%', height, viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'Daily HRV compared with baseline, Feb 8 to Mar 1, with a presumed-deviation window and a fever window',
    style: 'overflow:visible; cursor:crosshair;',
  })
  prims.forEach((p) => {
    if (p.t === 'rect') {
      const a = { x: p.x, y: p.y, width: p.w, height: p.h, rx: p.rx ?? 0, fill: p.fill }
      if (p.stroke && p.stroke !== 'none') a.stroke = p.stroke
      if (p.dash) a['stroke-dasharray'] = p.dash
      if (p.opacity != null) a.opacity = p.opacity
      svg.appendChild(el('rect', a))
    } else if (p.t === 'line') {
      svg.appendChild(el('line', { x1: p.x1, y1: p.y1, x2: p.x2, y2: p.y2, stroke: p.stroke, 'stroke-width': p.sw ?? 1 }))
    } else if (p.t === 'text' && p.text) {
      const t = el('text', { x: p.x, y: p.y, 'text-anchor': p.anchor, fill: p.fill, 'font-size': p.size })
      if (p.weight) t.setAttribute('font-weight', p.weight)
      if (p.spacing) t.setAttribute('letter-spacing', p.spacing)
      t.textContent = p.text
      svg.appendChild(t)
    }
  })
  const hover = el('rect', { y: geom.m.t, width: geom.dayW, height: geom.plotH, fill: 'rgba(255,255,255,0.06)', 'pointer-events': 'none', display: 'none' })
  svg.appendChild(hover)
  container.appendChild(svg)

  const tooltip = document.createElement('div')
  tooltip.className = 'fv-tooltip'
  tooltip.style.display = 'none'
  container.appendChild(tooltip)

  const fmt = (v, dp, u) => (v == null ? 'no reading' : `${v > 0 ? '+' : v < 0 ? '\u2212' : ''}${Math.abs(v).toFixed(dp)}${u}`)
  const onMove = (e) => {
    const r = container.getBoundingClientRect()
    const mx = e.clientX - r.left
    const idx = Math.floor((mx - geom.m.l) / geom.dayW)
    if (idx < 0 || idx >= days.length) { tooltip.style.display = 'none'; hover.setAttribute('display', 'none'); return }
    const d = days[idx]
    hover.setAttribute('x', geom.xc(idx) - geom.dayW / 2)
    hover.setAttribute('display', 'block')
    tooltip.innerHTML = d.excluded
      ? `<div class="fv-tooltip-date">${fvFmtDate(d.date)}</div><div class="fv-tooltip-context" style="border:0;margin:0;padding:0">Travel day, excluded</div>`
      : `<div class="fv-tooltip-date">${fvFmtDate(d.date)}</div>
         <div class="fv-tooltip-row"><span class="fv-tooltip-label">HRV</span><span class="fv-tooltip-val">${fmt(d.hrv_dev, 0, ' ms')}</span></div>
         <div class="fv-tooltip-row"><span class="fv-tooltip-label">Resting HR</span><span class="fv-tooltip-val">${fmt(d.rhr_dev, 1, ' bpm')}</span></div>
         <div class="fv-tooltip-row"><span class="fv-tooltip-label">Wrist temp</span><span class="fv-tooltip-val">${fmt(d.wrist_dev, 2, ' \u00b0C')}</span></div>
         ${geom.notes[idx].length ? `<div class="fv-tooltip-context">${geom.notes[idx].join('<br>')}</div>` : ''}
         ${d.activities && d.activities.length ? `<div class="fv-tooltip-context">${d.activities.join(' \u00b7 ')}</div>` : ''}`
    tooltip.style.display = 'block'
    const x = geom.xc(idx)
    const flip = x > width - 190
    tooltip.style.left = flip ? 'auto' : `${x + 12}px`
    tooltip.style.right = flip ? `${width - x + 12}px` : 'auto'
    tooltip.style.top = `${geom.m.t}px`
  }
  svg.addEventListener('mousemove', onMove)
  svg.addEventListener('click', onMove)
  svg.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; hover.setAttribute('display', 'none') })
}

function initFeverArc() {
  const wrap = document.getElementById('fvChartWrap')
  if (!wrap) return
  const cap = document.getElementById('fvCaption')
  if (cap) cap.textContent = FEVER_ARC.meta.caption
  renderChart(wrap)

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => renderChart(wrap), 150)
  })
}

// Call directly: main.js wraps everything in one outer DOMContentLoaded listener;
// a second nested listener here never fires.
initFeverArc()

});