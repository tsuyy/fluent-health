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
          bodyColor: '#888780',
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
            font: { size: 11 },
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
          ticks: { color: '#5F5E5A', font: { size: 11 } },
          title: { display: true, text: 'mL/min·kg', color: '#5a5b5f', font: { size: 10 } },
        },
      },
    },
  });
}

 /* ============================================================
   FEVER ARC 
============================================================ */

const PINK = '#c450e8'
const BLUE = '#0681fc'
 
const ARC = [
  { date: '2026-02-01', hrv_dev: -12.9, rhr_dev: 4.2, wrist_dev: -0.22 },
  { date: '2026-02-02', hrv_dev: 4.4, rhr_dev: -4.5, wrist_dev: 0.74 },
  { date: '2026-02-03', hrv_dev: -3.6, rhr_dev: 2.5, wrist_dev: 0.36 },
  { date: '2026-02-04', hrv_dev: -1.7, rhr_dev: 0.5, wrist_dev: 0.15 },
  { date: '2026-02-05', hrv_dev: -2.0, rhr_dev: -0.5, wrist_dev: 0.67 },
  { date: '2026-02-06', hrv_dev: -9.1, rhr_dev: -0.4, wrist_dev: 0.42 },
  { date: '2026-02-07', hrv_dev: 6.6, rhr_dev: 7.3, wrist_dev: null },
  { date: '2026-02-08', hrv_dev: -13.3, rhr_dev: 4.1, wrist_dev: 0.47 },
  { date: '2026-02-09', hrv_dev: -3.3, rhr_dev: -2.1, wrist_dev: 0.35 },
  { date: '2026-02-10', hrv_dev: -7.9, rhr_dev: 1.1, wrist_dev: 0.46 },
  { date: '2026-02-11', hrv_dev: -10.3, rhr_dev: -1.9, wrist_dev: 1.13 },
  { date: '2026-02-12', hrv_dev: -16.1, rhr_dev: 0.9, wrist_dev: 1.6 },
  { date: '2026-02-13', hrv_dev: -17.0, rhr_dev: -1.0, wrist_dev: 0.07 },
  { date: '2026-02-14', hrv_dev: 2.0, rhr_dev: 1.9, wrist_dev: null },
  { date: '2026-02-15', hrv_dev: -6.8, rhr_dev: -0.3, wrist_dev: null },
  { date: '2026-02-16', hrv_dev: 6.6, rhr_dev: -5.2, wrist_dev: 0.1 },
  { date: '2026-02-17', hrv_dev: 19.0, rhr_dev: -4.9, wrist_dev: 0.26 },
  { date: '2026-02-18', hrv_dev: 7.2, rhr_dev: -7.6, wrist_dev: 0.14 },
  { date: '2026-02-19', hrv_dev: -6.1, rhr_dev: -2.6, wrist_dev: 0.79 },
  { date: '2026-02-20', hrv_dev: -12.7, rhr_dev: 17.8, wrist_dev: null },
  { date: '2026-02-21', hrv_dev: -1.9, rhr_dev: -6.1, wrist_dev: 0.26 },
  { date: '2026-02-22', hrv_dev: 6.3, rhr_dev: 21.1, wrist_dev: -0.16 },
  { date: '2026-02-23', hrv_dev: -28.6, rhr_dev: 33.0, wrist_dev: null },
  { date: '2026-02-24', hrv_dev: -28.9, rhr_dev: 21.1, wrist_dev: 2.77 },
  { date: '2026-02-25', hrv_dev: -18.4, rhr_dev: 12.4, wrist_dev: null },
  { date: '2026-02-26', hrv_dev: -9.7, rhr_dev: -1.6, wrist_dev: 0.24 },
  { date: '2026-02-27', hrv_dev: -5.6, rhr_dev: 5.0, wrist_dev: 0.2 },
  { date: '2026-02-28', hrv_dev: 13.0, rhr_dev: 0.8, wrist_dev: -0.25 },
  { date: '2026-03-01', hrv_dev: -5.3, rhr_dev: -3.3, wrist_dev: 0.28 },
]
 
// Verbatim from your life-context list.
const CONTEXT = {
  '2026-02-11': '9-mile run — felt rough.',
  '2026-02-14': 'Flight to Taiwan.',
  '2026-02-20': 'Chaotic night out, 2hr sleep.',
  '2026-02-21': '4-mile run in Taiwan heat, sleep deprived.',
  '2026-02-22': 'Hot stone deep-tissue massage.',
  '2026-02-23': 'Flight to Japan — body ache.',
  '2026-02-24': 'Fever peaked — skied on DayQuil.',
  '2026-02-25': 'Onsen recovery.',
}
 
// Your five phases, verbatim dates. Only "Fever" keeps a distinct
// tint now (pink) — the other three are neutral grey / green so the
// eye isn't pulled to red-family bands that aren't the fever itself.
const BANDS = [
  { label: 'First change', from: '2026-02-11', to: '2026-02-12', tint: 'rgba(255,255,255,0.05)' },
  { label: 'Apparent recovery', from: '2026-02-14', to: '2026-02-18', tint: 'rgba(39,196,138,0.07)' },
  { label: 'Second wave', from: '2026-02-20', to: '2026-02-23', tint: 'rgba(255,255,255,0.06)' },
  { label: 'Fever', from: '2026-02-24', to: '2026-02-24', tint: 'rgba(196,80,232,0.16)' },
]
 
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmtDate(iso) {
  const [, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}`
}
function fmtShort(iso) {
  return iso.slice(5) // "02-11"
}
 
// Wrist-temp heat: continuous pink-alpha ramp instead of a discrete
// grey → amber → red step. Below 0.3° stays a flat neutral grey
// (basically noise); above that, opacity climbs smoothly with
// severity up to the dataset's real max (2.77° on Feb 24).
function wristHeatColor(v) {
  if (v == null) return 'rgba(255,255,255,0.03)'
  const abs = Math.abs(v)
  if (abs < 0.3) return 'rgba(180,180,180,0.22)'
  const alpha = Math.min(0.85, 0.25 + (abs - 0.3) * 0.28)
  return `rgba(196, 80, 232, ${alpha.toFixed(2)})`
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
  const height = 300
 
  const LABEL_ROW_H = 30
  const STRIP_H = 10
  const STRIP_GAP = 8
  const margin = { top: LABEL_ROW_H + STRIP_H + STRIP_GAP + 14, right: 10, bottom: 10, left: 10 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom
  const midY = margin.top + plotH / 2
  const stripY = margin.top - STRIP_GAP - STRIP_H
 
  const maxAbs = Math.max(...ARC.map((d) => Math.abs(d.hrv_dev ?? 0)), 15)
  const dayW = plotW / ARC.length
  const barW = Math.max(dayW * 0.55, 2)
  const stripCellW = Math.max(dayW * 0.85, 2)
 
  const xCenter = (i) => margin.left + dayW * i + dayW / 2
  const barHeight = (dev) => (Math.abs(dev) / maxAbs) * (plotH / 2)
  const barOpacity = (dev) => 0.3 + (Math.abs(dev) / maxAbs) * 0.6
 
  const svg = el('svg', {
    width: '100%',
    height,
    viewBox: `0 0 ${width} ${height}`,
    style: 'overflow:visible; cursor:crosshair;',
  })
 
  // Phase bands: tint + top label only — no leader line (removed,
  // per your call that it was distracting).
  const NEUTRAL_LABEL = '#9a9a95'
  BANDS.forEach((band) => {
    const i0 = ARC.findIndex((d) => d.date === band.from)
    const i1 = ARC.findIndex((d) => d.date === band.to)
    if (i0 < 0 || i1 < 0) return
    const x0 = xCenter(i0) - dayW / 2
    const x1 = xCenter(i1) + dayW / 2
    svg.appendChild(el('rect', { x: x0, y: margin.top, width: x1 - x0, height: plotH, fill: band.tint }))
 
    const cx = (xCenter(i0) + xCenter(i1)) / 2
    const label = el('text', {
      x: cx, y: LABEL_ROW_H - 4, 'text-anchor': 'middle',
      fill: NEUTRAL_LABEL, 'font-size': 10, 'font-weight': 600, 'letter-spacing': '0.06em',
    })
    label.textContent = band.label.toUpperCase()
    svg.appendChild(label)
  })
 
  // Baseline
  svg.appendChild(el('line', {
    x1: margin.left, x2: width - margin.right, y1: midY, y2: midY,
    stroke: 'rgba(255,255,255,0.15)', 'stroke-width': 1,
  }))
 
  // Wrist-temp heatmap strip
  ARC.forEach((d, i) => {
    svg.appendChild(el('rect', {
      x: xCenter(i) - stripCellW / 2, y: stripY, width: stripCellW, height: STRIP_H, rx: 2,
      fill: wristHeatColor(d.wrist_dev),
    }))
  })
 
  // HRV bars — below baseline pink, above baseline blue, opacity
  // scaled by magnitude for the intensity spectrum.
  ARC.forEach((d, i) => {
    if (d.hrv_dev == null) return
    const isNeg = d.hrv_dev < 0
    const h = barHeight(d.hrv_dev)
    const x = xCenter(i) - barW / 2
    svg.appendChild(el('rect', {
      x, y: isNeg ? midY : midY - h, width: barW, height: h, rx: 1,
      fill: isNeg ? PINK : BLUE, opacity: barOpacity(d.hrv_dev),
      'data-index': i,
      class: 'fv-hit',
    }))
  })
 
  // Invisible full-height hit targets per day, for hover
  ARC.forEach((d, i) => {
    svg.appendChild(el('rect', {
      x: xCenter(i) - dayW / 2, y: margin.top, width: dayW, height: plotH,
      fill: 'transparent', 'data-index': i, class: 'fv-hit',
    }))
  })
 
  container.appendChild(svg)
 
  // Tooltip
  let tooltip = container.querySelector('.fv-tooltip')
  if (!tooltip) {
    tooltip = document.createElement('div')
    tooltip.className = 'fv-tooltip'
    tooltip.style.display = 'none'
    container.appendChild(tooltip)
  }
 
  svg.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (width / rect.width)
    const idx = Math.floor((mx - margin.left) / dayW)
    if (idx < 0 || idx >= ARC.length) { tooltip.style.display = 'none'; return }
    const d = ARC[idx]
    const context = CONTEXT[d.date]
 
    tooltip.innerHTML = `
      <div class="fv-tooltip-date">${fmtDate(d.date)}</div>
      <div class="fv-tooltip-row">
        <span class="fv-tooltip-label">HRV</span>
        <span class="fv-tooltip-val">${d.hrv_dev != null ? `${d.hrv_dev > 0 ? '+' : ''}${d.hrv_dev.toFixed(1)}ms` : '—'}</span>
      </div>
      <div class="fv-tooltip-row">
        <span class="fv-tooltip-label">RHR</span>
        <span class="fv-tooltip-val">${d.rhr_dev != null ? `${d.rhr_dev > 0 ? '+' : ''}${d.rhr_dev.toFixed(1)}bpm` : '—'}</span>
      </div>
      <div class="fv-tooltip-row">
        <span class="fv-tooltip-label">Wrist</span>
        <span class="fv-tooltip-val">${d.wrist_dev != null ? `${d.wrist_dev > 0 ? '+' : ''}${d.wrist_dev.toFixed(2)}°` : 'no reading'}</span>
      </div>
      ${context ? `<div class="fv-tooltip-context">${context}</div>` : ''}
    `
 
    const tipX = xCenter(idx)
    const flip = tipX > width - 160
    tooltip.style.display = 'block'
    tooltip.style.left = flip ? '' : `${tipX + 10}px`
    tooltip.style.right = flip ? `${width - tipX + 10}px` : ''
    tooltip.style.top = `${stripY - 4}px`
  })
  svg.addEventListener('mouseleave', () => { tooltip.style.display = 'none' })
}
 
function initFeverArc() {
  const wrap = document.getElementById('fvChartWrap')
  if (!wrap) return
  renderChart(wrap)
 
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => renderChart(wrap), 150)
  })
}
 
// Call directly — your main.js already wraps everything in one outer
// DOMContentLoaded listener; a second nested listener here never fires.
initFeverArc()
});