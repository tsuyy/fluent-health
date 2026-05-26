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

  // ── VO2 max chart ────────────────────────────────────────
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
      if (i === 0)  return '#E24B4A';
      if (i === 6)  return '#D85A30';
      if (i === 12) return '#EF9F27';
      if (i === 16) return '#EF9F27';
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

  // ── Fever arc ────────────────────────────────────────────
  const BAR_DATA = [
    ['#2C2C2A', 18,  'Feb 11', 0],
    ['#2C2C2A', 14,  'Feb 12', -1],
    ['#2C2C2A', 16,  'Feb 13', -1],
    ['#444441', 12,  'Feb 14', 1],
    ['#444441', 10,  'Feb 15', -1],
    ['#444441', 11,  'Feb 16', -1],
    ['#444441', 10,  'Feb 17', -1],
    ['#444441', 12,  'Feb 18', -1],
    ['#444441', 10,  'Feb 19', -1],
    ['#5F5E5A', 24,  'Feb 20', 2],
    ['#993C1D', 58,  'Feb 21', 3],
    ['#D85A30', 68,  'Feb 22', 4],
    ['#993C1D', 78,  'Feb 23', 5],
    ['#E24B4A', 100, 'Feb 24', 6],
    ['#D85A30', 72,  'Feb 25', 7],
    ['#993C1D', 48,  'Feb 26', -1],
    ['#712B13', 32,  'Feb 27', -1],
    ['#5F5E5A', 20,  'Feb 28', -1],
    ['#444441', 14,  'Mar 1',  -1],
    ['#2C2C2A', 10,  'Mar 2',  -1],
  ];

  const EVENTS = [
    { date: 'Feb 11', title: '9-mile run — felt rough',             note: 'HRV −10ms. Wrist temp +1.0°. First signal.' },
    { date: 'Feb 14', title: 'Flight to Taiwan',                    note: 'Long haul 16hr. Circadian disruption. Immune exposure.' },
    { date: 'Feb 20', title: 'Chaotic night out',                   note: 'Severe immune suppression. 2 hours of sleep.' },
    { date: 'Feb 21', title: '4mi run · heat · sleep deprived',     note: 'Four simultaneous stressors. RHR already +21.' },
    { date: 'Feb 22', title: 'Hot stone deep tissue + acupuncture', note: 'Felt incredible. Physiologically indistinguishable from illness on sensors alone.' },
    { date: 'Feb 23', title: 'Flight to Japan',                     note: 'Whole body sore. RHR 93 bpm on the plane. +33 above baseline.' },
    { date: 'Feb 24', title: 'Fever — skied on DayQuil',            note: '38.2°C. Slushy runs at Zao — manageable enough to ski through. Every signal simultaneously at worst.', fever: true },
    { date: 'Feb 25', title: 'Onsen recovery — twice daily',        note: 'HRV back to baseline by Feb 26. Faster than expected.' },
  ];

  const feverStrip   = document.getElementById('faStrip');
  const feverTooltip = document.getElementById('tooltip');
  const tlContainer  = document.getElementById('tlEvents');

  if (!feverStrip || !tlContainer) return;

  // Build bars
  BAR_DATA.forEach(([color, height, date, evtIdx], i) => {
    const bar = document.createElement('div');
    bar.className = 'fa-bar';
    bar.style.cssText = `background:${color};height:${height}%`;
    bar.dataset.idx    = i;
    bar.dataset.date   = date;
    bar.dataset.evtIdx = evtIdx;
    feverStrip.appendChild(bar);
  });

  // Build timeline rows — dot color matches bar color
  const tlRows = [];
  EVENTS.forEach((evt, i) => {
    const row = document.createElement('div');
    const matchingBar = BAR_DATA.find(b => b[3] === i);
    const dotColor    = matchingBar ? matchingBar[0] : '#888780';
    row.className     = 'fa-event' + (evt.fever ? ' fever-row' : '');
    row.dataset.evtIdx = i;
    row.innerHTML = `
      <span class="fa-date${evt.fever ? ' red' : ''}">${evt.date}</span>
      <div class="fa-dot-wrap">
        <div class="fa-dot${evt.fever ? ' lg' : ''}" style="background:${dotColor};"></div>
      </div>
      <div class="fa-event-text">
        <strong>${evt.title}</strong>${evt.note}
      </div>`;
    tlContainer.appendChild(row);
    tlRows.push(row);
  });

  // Hover interactions
  const feverBars = feverStrip.querySelectorAll('.fa-bar');

  function clearHighlights() {
    feverBars.forEach(b => b.classList.remove('dimmed', 'active'));
    tlRows.forEach(r => r.classList.remove('active-row'));
    if (feverTooltip) feverTooltip.style.display = 'none';
  }

  function highlightBar(idx) {
    const evtIdx = parseInt(BAR_DATA[idx][3]);
    feverBars.forEach((b, i) => {
      b.classList.toggle('dimmed', i !== idx);
      b.classList.toggle('active', i === idx);
    });
    tlRows.forEach(r => r.classList.remove('active-row'));
    if (evtIdx >= 0 && tlRows[evtIdx]) {
      tlRows[evtIdx].classList.add('active-row');
      tlRows[evtIdx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function moveTooltip(e) {
    if (!feverTooltip) return;
    const x  = e.clientX + 14;
    const y  = e.clientY - 10;
    const tw = feverTooltip.offsetWidth;
    const th = feverTooltip.offsetHeight;
    feverTooltip.style.left = (x + tw > window.innerWidth  ? x - tw - 28 : x) + 'px';
    feverTooltip.style.top  = (y + th > window.innerHeight ? y - th      : y) + 'px';
  }

  feverBars.forEach((bar, i) => {
    bar.addEventListener('mouseenter', e => {
      highlightBar(i);
      if (!feverTooltip) return;
      const [color, height, date, evtIdx] = BAR_DATA[i];
      const evt      = evtIdx >= 0 ? EVENTS[evtIdx] : null;
      const severity = height >= 70 ? '#E24B4A' : height >= 40 ? '#D85A30' : '#888780';
      const label    = height >= 70 ? 'severely elevated' : height >= 25 ? 'elevated' : 'near baseline';
      feverTooltip.innerHTML = `
        <strong>${date}</strong>
        ${evt ? `<span style="color:#D3D1C7;">${evt.title}</span><br>` : ''}
        <span style="font-size:11px;color:${severity};">RHR ${label}</span>`;
      feverTooltip.style.display = 'block';
      moveTooltip(e);
    });
    bar.addEventListener('mousemove', moveTooltip);
    bar.addEventListener('mouseleave', clearHighlights);
  });

});