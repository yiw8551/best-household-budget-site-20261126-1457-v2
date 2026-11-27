// Small formatting helpers every page shares, so a dollar looks the same
// on the overview, in the ledger and on a goal card.

// $1,850 or $86.40 — whole dollars drop the cents, anything else keeps them.
function money(amount) {
  const rounded = Math.round(amount * 100) / 100;
  const text = Number.isInteger(rounded)
    ? rounded.toLocaleString('en-US')
    : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + text;
}

// Always two decimals, for tables where columns of cents should line up.
function moneyExact(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// '2026-11-04' -> 'Wed 4 Nov'
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return DAY_NAMES[d.getDay()] + ' ' + d.getDate() + ' ' + MONTH_NAMES[d.getMonth()];
}

// 0.294 -> '29%'
function percent(part, whole) {
  if (!whole) return '0%';
  return Math.round((part / whole) * 100) + '%';
}

// +23% / -6% for month-to-month changes.
function signedPercent(now, before) {
  if (!before) return '—';
  const change = Math.round(((now - before) / before) * 100);
  return (change > 0 ? '+' : '') + change + '%';
}

// Escape text before it goes into HTML the pages build.
function esc(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
