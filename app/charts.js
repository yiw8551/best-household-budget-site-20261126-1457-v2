// HomeTally's charts are hand-drawn SVG: no library, no canvas, nothing to
// fetch. Each function takes plain numbers and returns an SVG string the
// views drop into the page, so a chart always shows the live figures.

// A donut of spending by category, with the total in the middle.
function donutChart(parts, size, thickness, centreTop, centreBottom) {
  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  let arcs = '';
  for (const p of parts) {
    if (p.value <= 0) continue;
    const frac = p.value / total;
    const dash = Math.max(frac * c - 2, 0.5);
    arcs += '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + p.color +
      '" stroke-width="' + thickness + '" stroke-dasharray="' + dash.toFixed(1) + ' ' + (c - dash).toFixed(1) +
      '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>';
    offset += frac * c;
  }
  return '<svg class="donut" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category">' + arcs +
    '<text x="50%" y="46%" text-anchor="middle" class="donut-total">' + centreTop + '</text>' +
    '<text x="50%" y="60%" text-anchor="middle" class="donut-label">' + centreBottom + '</text></svg>';
}

// Grouped vertical bars: one group per month, one bar per series.
function groupedBars(history, series, width, height) {
  const max = Math.max(...history.map((h) => Math.max(...series.map((s) => h[s.key])))) * 1.12;
  const padTop = 14, padBottom = 26, padX = 8;
  const plotH = height - padTop - padBottom;
  const groupW = (width - padX * 2) / history.length;
  const barW = Math.min(26, (groupW - 18) / series.length);
  let out = '';
  history.forEach((h, i) => {
    const gx = padX + i * groupW + (groupW - barW * series.length - 4 * (series.length - 1)) / 2;
    series.forEach((s, j) => {
      const bh = Math.max(2, (h[s.key] / max) * plotH);
      const x = gx + j * (barW + 4);
      const y = padTop + plotH - bh;
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + bh.toFixed(1) +
        '" rx="3" fill="' + s.color + '"><title>' + h.month + ' ' + s.name + ': ' + money(h[s.key]) + '</title></rect>';
    });
    out += '<text x="' + (padX + i * groupW + groupW / 2) + '" y="' + (height - 8) + '" text-anchor="middle" class="axis-label">' + h.month + '</text>';
  });
  return '<svg class="bars" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Six month trend chart">' + out + '</svg>';
}

// A progress ring for one savings goal.
function progressRing(frac, size, thickness, color) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const shown = Math.min(Math.max(frac, 0), 1);
  return '<svg class="ring" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Goal progress">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#EDE4D0" stroke-width="' + thickness + '"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + thickness +
    '" stroke-linecap="round" stroke-dasharray="' + (shown * c).toFixed(1) + ' ' + c.toFixed(1) +
    '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
    '<text x="50%" y="55%" text-anchor="middle" class="ring-text">' + Math.round(frac * 100) + '%</text></svg>';
}

// A horizontal budget bar: spent against the limit, coral once it spills.
function budgetBar(spent, budget) {
  const frac = budget ? spent / budget : 0;
  const width = Math.min(frac, 1) * 100;
  const cls = frac > 1 ? 'bar-fill over' : frac > 0.85 ? 'bar-fill warn' : 'bar-fill';
  return '<div class="bar" role="img" aria-label="' + percent(spent, budget) + ' of budget used">' +
    '<div class="' + cls + '" style="width:' + width.toFixed(1) + '%"></div></div>';
}
