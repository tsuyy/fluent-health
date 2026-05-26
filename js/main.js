// ── Scroll fade-in ─────────────────────────────────────────
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

// ── Fever arc heat strip ───────────────────────────────────
const bars = [
  ['#2C2C2A', 30], ['#2C2C2A', 25], ['#2C2C2A', 28],
  ['#2C2C2A', 20], ['#2C2C2A', 22], ['#2C2C2A', 18],
  ['#2C2C2A', 24], ['#444441', 20], ['#444441', 16],
  ['#444441', 22], ['#5F5E5A', 18], ['#712B13', 30],
  ['#993C1D', 42], ['#D85A30', 55], ['#993C1D', 78],
  ['#E24B4A', 100],['#D85A30', 72], ['#993C1D', 52],
  ['#712B13', 36], ['#5F5E5A', 22], ['#444441', 18],
];

const strip = document.getElementById('faStrip');
if (strip) {
  bars.forEach(([color, height]) => {
    const bar = document.createElement('div');
    bar.className = 'fa-bar';
    bar.style.cssText = `background:${color};height:${height}%`;
    strip.appendChild(bar);
  });
}

// ── VO2 max chart ──────────────────────────────────────────
const vo2Canvas = document.getElementById('vo2Chart');
if (vo2Canvas && window.Chart) {
  const labels = [
    'Mar 22','Jun 22','Sep 22','Dec 22',
    'Mar 23','Jun 23','Sep 23','Dec 23',
    'Mar 24','Jun 24','Sep 24','Dec 24',
    'Mar 25','Jun 25','Sep 25','Dec 25',
    'Mar 26'
  ];
  const data = [
    40.2, 37.3, 35.1, 31.3,
    32.1, 31.8, 31.4, 31.8,
    32.1, 33.8, 34.6, 35.9,
    36.3, 38.1, 37.9, 37.4,
    38.2
  ];

  const pointColors = data.map((v, i) => {
    if (i === 0)  return '#E24B4A';  // all-time peak
    if (i === 6)  return '#D85A30';  // all-time low
    if (i === 12) return '#662af2';  // running starts
    if (i === 16) return '#662af2';  // current
    return '#444441';
  });

  new Chart(vo2Canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#5F5E5A',
        borderWidth: 2,
        pointBackgroundColor: pointColors,
        pointRadius: data.map((_, i) => [0,6,12,16].includes(i) ? 7 : 3),
        tension: 0.4,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#161615',
          borderColor: '#2C2C2A',
          borderWidth: 1,
          titleColor: '#F1EFE8',
          bodyColor: '#888780',
          callbacks: {
            afterTitle: items => {
              const notes = {
                0:  '↑ All-time peak — XC skiing with dog',
                6:  '↓ All-time low — training stress',
                12: '→ Running starts',
                16: '↑ Current — HM training',
              };
              return notes[items[0].dataIndex] || '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5F5E5A', font: { size: 11 }, maxRotation: 45 }
        },
        y: {
          min: 28, max: 42,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5F5E5A', font: { size: 11 } },
          title: { display: true, text: 'mL/min·kg', color: '#5F5E5A', font: { size: 10 } }
        }
      }
    }
  });
}