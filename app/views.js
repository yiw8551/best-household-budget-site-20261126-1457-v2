// HomeTally's pages. Every view is built from the same live state, so an
// edit on one page — a new transaction, a changed limit, a bill marked
// paid — is already true on every other page when you walk over to it.

const state = {
  txns: TRANSACTIONS.map((t) => ({ date: t[0], payee: t[1], cat: t[2], amount: t[3] })),
  budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  paidEarly: new Set(),   // December bills the family has already settled
  goalBoosts: {},         // one-off top-ups added on the Goals page
  txnFilter: 'all',
  txnSearch: '',
};

function categoryById(id) { return CATEGORIES.find((c) => c.id === id); }
function spentIn(catId) { return state.txns.filter((t) => t.cat === catId).reduce((s, t) => s + t.amount, 0); }
function totalSpent() { return state.txns.reduce((s, t) => s + t.amount, 0); }
function totalIncome() { return INCOME.reduce((s, i) => s + i.amount, 0); }
function totalBudget() { return CATEGORIES.reduce((s, c) => s + state.budgets[c.id], 0); }
function movedToSavings() {
  const transfers = TRANSFERS.reduce((s, t) => s + t[2], 0);
  const boosts = Object.values(state.goalBoosts).reduce((s, v) => s + v, 0);
  return transfers + boosts;
}
function goalSaved(goal) { return goal.saved + (state.goalBoosts[goal.id] || 0); }
function monthsToGoal(goal) {
  const left = goal.target - goalSaved(goal);
  return left <= 0 ? 0 : Math.ceil(left / goal.monthly);
}
const MONTHS_FROM_NOW = ['Dec 2026', 'Jan 2027', 'Feb 2027', 'Mar 2027', 'Apr 2027', 'May 2027', 'Jun 2027', 'Jul 2027', 'Aug 2027', 'Sep 2027', 'Oct 2027', 'Nov 2027', 'Dec 2027', 'Jan 2028', 'Feb 2028', 'Mar 2028', 'Apr 2028', 'May 2028', 'Jun 2028', 'Jul 2028', 'Aug 2028', 'Sep 2028', 'Oct 2028', 'Nov 2028', 'Dec 2028', 'Jan 2029', 'Feb 2029', 'Mar 2029', 'Apr 2029', 'May 2029', 'Jun 2029'];
function goalEta(goal) {
  const m = monthsToGoal(goal);
  return m === 0 ? 'Funded — done!' : MONTHS_FROM_NOW[Math.min(m, MONTHS_FROM_NOW.length) - 1];
}

// ---------- Overview ----------

function viewOverview() {
  const income = totalIncome(), spent = totalSpent(), budget = totalBudget();
  const saved = movedToSavings();
  const left = budget - spent;
  const donutParts = CATEGORIES.map((c) => ({ value: spentIn(c.id), color: c.color })).filter((p) => p.value > 0);
  const topCats = [...CATEGORIES].sort((a, b) => spentIn(b.id) - spentIn(a.id)).slice(0, 6);
  const nextBills = [...BILLS].sort((a, b) => a.dueDay - b.dueDay).slice(0, 3);
  const recent = [...state.txns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const goalPeek = GOALS.slice(0, 2);

  const cards = [
    { label: 'Money in', value: money(income), sub: INCOME.length + ' payments in November' },
    { label: 'Money out', value: money(spent), sub: state.txns.length + ' purchases & bills paid' },
    { label: 'Left to spend', value: money(left), sub: 'of a ' + money(budget) + ' plan, 3 days to go' },
    { label: 'Moved to savings', value: money(saved), sub: percent(saved, income) + ' of income — target is 20%' },
  ].map((c) => '<div class="stat-card"><p class="stat-label">' + c.label + '</p><p class="stat-value">' + c.value +
    '</p><p class="stat-sub">' + c.sub + '</p></div>').join('');

  const legend = CATEGORIES.filter((c) => spentIn(c.id) > 0).map((c) =>
    '<li><span class="dot" style="background:' + c.color + '"></span>' + c.name +
    '<span class="legend-amt">' + money(spentIn(c.id)) + '</span></li>').join('');

  const health = topCats.map((c) => {
    const s = spentIn(c.id), b = state.budgets[c.id];
    const note = s > b ? '<span class="over-text">' + money(s - b) + ' over</span>' : money(b - s) + ' left';
    return '<div class="health-row"><div class="health-head"><span>' + c.name + '</span><span class="health-note">' + note + '</span></div>' +
      budgetBar(s, b) + '<div class="health-figs"><span>' + money(s) + ' spent</span><span>plan ' + money(b) + '</span></div></div>';
  }).join('');

  const bills = nextBills.map((b) => '<li><div><strong>' + b.name + '</strong><span class="bill-when">Due ' +
    (b.dueDay === 28 ? 'tomorrow, 28 Nov' : b.dueDay + ' Dec') + '</span></div><span class="bill-amt">' + money(b.amount) + '</span></li>').join('');

  const recentRows = recent.map((t) => '<li><div><strong>' + esc(t.payee) + '</strong><span class="txn-meta">' +
    prettyDate(t.date) + ' · ' + categoryById(t.cat).name + '</span></div><span class="txn-amt">−' + moneyExact(t.amount) + '</span></li>').join('');

  const goals = goalPeek.map((g) => '<div class="goal-peek">' + progressRing(goalSaved(g) / g.target, 74, 8, '#177E6C') +
    '<div><strong>' + g.name + '</strong><p>' + money(goalSaved(g)) + ' of ' + money(g.target) + ' · lands ' + goalEta(g) + '</p></div></div>').join('');

  return '<div class="page-head"><h1>November at a glance</h1>' +
    '<p class="lede">Three days left in the month, and the plan is holding: the family is under budget in ten of twelve categories, and savings beat the 20% target again.</p></div>' +
    '<div class="stat-grid">' + cards + '</div>' +
    '<div class="cols-2"><div class="panel"><h2>Where the money went</h2><div class="donut-wrap">' +
    donutChart(donutParts, 190, 26, money(spent), 'spent in Nov') + '<ul class="legend">' + legend + '</ul></div></div>' +
    '<div class="panel"><h2>Budget health</h2>' + health +
    '<p class="panel-link"><a href="#/budget">Open the full budget planner →</a></p></div></div>' +
    '<div class="cols-2"><div class="panel"><h2>Six months of cash flow</h2>' +
    groupedBars(HISTORY, [{ key: 'income', name: 'Money in', color: '#177E6C' }, { key: 'spent', name: 'Money out', color: '#E9A13B' }], 520, 210) +
    '<p class="chart-note">Income (green) against spending (amber), June to November. Spending has stayed under income every month since June.</p></div>' +
    '<div class="panel"><h2>Coming up</h2><ul class="bill-list">' + bills + '</ul>' +
    '<p class="panel-link"><a href="#/bills">All bills & the December calendar →</a></p>' +
    '<h2 class="sub-head">Savings in sight</h2>' + goals +
    '<p class="panel-link"><a href="#/goals">All four goals →</a></p></div></div>' +
    '<div class="panel"><h2>Latest spending</h2><ul class="txn-list">' + recentRows + '</ul>' +
    '<p class="panel-link"><a href="#/transactions">The full November ledger →</a></p></div>';
}

// ---------- Budget planner ----------

function groupTotals(groupId) {
  const cats = CATEGORIES.filter((c) => c.group === groupId);
  return {
    budget: cats.reduce((s, c) => s + state.budgets[c.id], 0),
    spent: cats.reduce((s, c) => s + spentIn(c.id), 0),
  };
}

function viewBudget() {
  const income = totalIncome();
  const ruleRows = Object.keys(GROUPS).map((g) => {
    const t = g === 'savings'
      ? { budget: income - totalBudget(), spent: movedToSavings() }
      : groupTotals(g);
    const share = percent(t.spent, income);
    return '<div class="rule-row"><div class="rule-head"><strong>' + GROUPS[g].name + '</strong>' +
      '<span>' + share + ' of income · target ' + GROUPS[g].target + '%</span></div>' +
      '<div class="bar rule-bar"><div class="bar-fill' + (g === 'savings' ? ' save' : '') + '" style="width:' +
      Math.min(100, (t.spent / (income * GROUPS[g].target / 100)) * 100).toFixed(1) + '%"></div></div>' +
      '<p class="rule-note">' + money(t.spent) + ' so far against a ' + money(income * GROUPS[g].target / 100) + ' guide.</p></div>';
  }).join('');

  const rows = CATEGORIES.map((c) => {
    const s = spentIn(c.id), b = state.budgets[c.id], left = b - s;
    return '<tr><td><span class="dot" style="background:' + c.color + '"></span>' + c.name +
      '<span class="row-group">' + GROUPS[c.group].name + '</span></td>' +
      '<td class="num"><label class="visually-hidden" for="limit-' + c.id + '">Monthly limit for ' + c.name + '</label>' +
      '<span class="limit-wrap">$<input class="limit-input" id="limit-' + c.id + '" data-cat="' + c.id + '" type="number" min="0" step="10" value="' + b + '"></span></td>' +
      '<td class="num">' + money(s) + '</td>' +
      '<td class="num ' + (left < 0 ? 'over-text' : '') + '">' + (left < 0 ? '−' + money(-left) + ' over' : money(left)) + '</td>' +
      '<td class="bar-cell">' + budgetBar(s, b) + '</td></tr>';
  }).join('');

  return '<div class="page-head"><h1>The November budget</h1>' +
    '<p class="lede">The plan the family set on 1 November, next to what actually happened. Change any limit and every total on this page — and on the overview — moves with it.</p></div>' +
    '<div class="panel"><h2>The 50 / 30 / 20 shape of the month</h2>' + ruleRows + '</div>' +
    '<div class="panel"><h2>Category by category</h2><div class="table-scroll"><table class="budget-table">' +
    '<thead><tr><th>Category</th><th class="num">Limit</th><th class="num">Spent</th><th class="num">Remaining</th><th>Progress</th></tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '<tfoot><tr><td>Total plan</td><td class="num">' + money(totalBudget()) + '</td><td class="num">' + money(totalSpent()) +
    '</td><td class="num">' + money(totalBudget() - totalSpent()) + '</td><td></td></tr></tfoot></table></div>' +
    '<p class="chart-note">Income is ' + money(income) + ', the plan spends ' + money(totalBudget()) + ' of it, and the remaining ' +
    money(income - totalBudget()) + ' is earmarked for savings before the month even starts — pay yourself first, then live on the rest.</p></div>';
}

// ---------- Transactions ----------

function filteredTxns() {
  return [...state.txns]
    .filter((t) => state.txnFilter === 'all' || t.cat === state.txnFilter)
    .filter((t) => !state.txnSearch || t.payee.toLowerCase().includes(state.txnSearch))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function viewTransactions() {
  const income = totalIncome(), spent = totalSpent();
  const chips = ['all', ...CATEGORIES.map((c) => c.id)].map((id) =>
    '<button type="button" class="chip' + (state.txnFilter === id ? ' on' : '') + '" data-filter="' + id + '">' +
    (id === 'all' ? 'Everything' : categoryById(id).name) + '</button>').join('');
  const rows = filteredTxns().map((t) => '<tr><td>' + prettyDate(t.date) + '</td><td>' + esc(t.payee) + '</td>' +
    '<td><span class="dot" style="background:' + categoryById(t.cat).color + '"></span>' + categoryById(t.cat).name + '</td>' +
    '<td class="num">−' + moneyExact(t.amount) + '</td></tr>').join('');
  const options = CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.name + '</option>').join('');

  return '<div class="page-head"><h1>November ledger</h1>' +
    '<p class="lede">Every payment in and out, written up to Friday 27 November. Add a purchase and the budget, the overview and the insights all move at once.</p></div>' +
    '<div class="stat-grid three"><div class="stat-card"><p class="stat-label">Money in</p><p class="stat-value">' + money(income) + '</p><p class="stat-sub">' +
    INCOME.map((i) => prettyDate(i.date) + ' · ' + esc(i.source) + ' ' + money(i.amount)).join('<br>') + '</p></div>' +
    '<div class="stat-card"><p class="stat-label">Money out</p><p class="stat-value">' + money(spent) + '</p><p class="stat-sub">' + state.txns.length + ' entries across ' + CATEGORIES.length + ' categories</p></div>' +
    '<div class="stat-card"><p class="stat-label">Net for November</p><p class="stat-value">' + money(income - spent) + '</p><p class="stat-sub">' + money(movedToSavings()) + ' already moved to savings; the rest covers bills due before the 30th</p></div></div>' +
    '<div class="panel"><h2>Add a purchase</h2><form id="add-txn" class="txn-form">' +
    '<label>Date <input type="date" name="date" value="2026-11-27" min="2026-11-01" max="2026-11-30" required></label>' +
    '<label>Payee <input type="text" name="payee" placeholder="e.g. GreenMart Groceries" required maxlength="60"></label>' +
    '<label>Category <select name="cat">' + options + '</select></label>' +
    '<label>Amount $ <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>' +
    '<button type="submit" class="btn">Add to ledger</button></form>' +
    '<p class="form-note" id="add-txn-note" role="status"></p></div>' +
    '<div class="panel"><h2>All entries</h2><div class="chip-row">' + chips + '</div>' +
    '<label class="search-label">Search payees <input type="search" id="txn-search" placeholder="Try “GreenMart”" value="' + esc(state.txnSearch) + '"></label>' +
    '<div class="table-scroll"><table class="ledger-table"><thead><tr><th>Date</th><th>Payee</th><th>Category</th><th class="num">Amount</th></tr></thead>' +
    '<tbody>' + (rows || '<tr><td colspan="4">Nothing matches — try a different filter or search.</td></tr>') + '</tbody></table></div>' +
    '<p class="chart-note">Showing ' + filteredTxns().length + ' of ' + state.txns.length + ' entries.</p></div>';
}

// ---------- Bills & schedule ----------

function viewBills() {
  const decTotal = BILLS.reduce((s, b) => s + b.amount, 0);
  const autopayCount = BILLS.filter((b) => b.autopay).length;
  const rows = BILLS.map((b) => {
    const paid = state.paidEarly.has(b.name);
    return '<tr><td><strong>' + b.name + '</strong><span class="row-note">' + b.note + '</span></td>' +
      '<td>' + (b.dueDay === 28 ? 'Sat 28 Nov' : b.dueDay + ' Dec') + '</td>' +
      '<td class="num">' + money(b.amount) + '</td>' +
      '<td>' + (b.autopay ? '<span class="tag auto">Autopay</span>' : '<span class="tag manual">Pay by hand</span>') + '</td>' +
      '<td>' + (b.novemberPaid ? moneyExact(b.novemberPaid) : '—') + '</td>' +
      '<td>' + (paid ? '<span class="tag done">Paid early ✓</span>' : '<button type="button" class="btn small" data-pay="' + esc(b.name) + '">Mark paid</button>') + '</td></tr>';
  }).join('');

  // December 2026 calendar: the 1st is a Tuesday, one empty cell in a
  // Monday-first grid.
  const firstWeekday = 1, daysInMonth = 31;
  let cells = '';
  for (let i = 0; i < firstWeekday; i++) cells += '<div class="cal-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const due = BILLS.filter((b) => b.dueDay === d);
    cells += '<div class="cal-cell' + (due.length ? ' has-bill' : '') + '"><span class="cal-day">' + d + '</span>' +
      due.map((b) => '<span class="cal-bill" style="border-color:' + '#177E6C">' + b.name.split(' — ')[0] + ' ' + money(b.amount) + '</span>').join('') + '</div>';
  }

  return '<div class="page-head"><h1>Bills & what’s due</h1>' +
    '<p class="lede">The fixed costs that leave whether the family thinks about them or not — ' + money(decTotal) + ' a month, ' +
    autopayCount + ' of ' + BILLS.length + ' on autopay, so only the water bill ever needs a human.</p></div>' +
    '<div class="cols-2"><div class="panel"><h2>December, day by day</h2><div class="cal">' +
    '<div class="cal-head">Mon</div><div class="cal-head">Tue</div><div class="cal-head">Wed</div><div class="cal-head">Thu</div><div class="cal-head">Fri</div><div class="cal-head">Sat</div><div class="cal-head">Sun</div>' +
    cells + '</div><p class="chart-note">City Power & Light’s November bill ($118) is due tomorrow, Saturday 28 November — it is on autopay and the money is already set aside.</p></div>' +
    '<div class="panel"><h2>Every recurring bill</h2><div class="table-scroll"><table class="bills-table">' +
    '<thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>How</th><th>Paid in Nov</th><th></th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>' +
    '<p class="chart-note">Marking a bill paid early is for the family’s own peace of mind — December’s money stays in the current account until each due date.</p></div></div>';
}

// ---------- Savings goals ----------

function viewGoals() {
  const totalSaved = GOALS.reduce((s, g) => s + goalSaved(g), 0);
  const totalTarget = GOALS.reduce((s, g) => s + g.target, 0);
  const cards = GOALS.map((g) => {
    const saved = goalSaved(g), left = g.target - saved;
    const november = TRANSFERS.filter((t) => t[1] === g.id).reduce((s, t) => s + t[2], 0);
    return '<article class="goal-card"><div class="goal-top">' + progressRing(saved / g.target, 92, 9, '#177E6C') +
      '<div><h3>' + g.name + '</h3><p class="goal-figs"><strong>' + money(saved) + '</strong> of ' + money(g.target) + '</p>' +
      '<p class="goal-left">' + money(left) + ' to go · ' + money(g.monthly) + ' a month · lands ' + goalEta(g) + '</p></div></div>' +
      '<p class="goal-note">' + g.note + '</p>' +
      '<p class="goal-nov">November added ' + money(november + (state.goalBoosts[g.id] || 0)) + '.</p>' +
      '<div class="goal-actions"><button type="button" class="btn small" data-boost="' + g.id + '" data-amt="25">+ $25</button>' +
      '<button type="button" class="btn small" data-boost="' + g.id + '" data-amt="50">+ $50</button>' +
      '<button type="button" class="btn small" data-boost="' + g.id + '" data-amt="100">+ $100</button></div></article>';
  }).join('');

  return '<div class="page-head"><h1>Savings goals</h1>' +
    '<p class="lede">Four pots, one habit: money moves on payday, before spending starts. The family has ' + money(totalSaved) +
    ' put away toward ' + money(totalTarget) + ' of plans. Add a top-up and the finish line moves closer on the spot.</p></div>' +
    '<div class="goal-grid">' + cards + '</div>' +
    '<div class="panel"><h2>How the pots fill</h2><p>Every month the same transfers leave on the 3rd and 15th: $700 to the emergency fund, $250 to Kyoto, $340 to the car and $650 to the home deposit — ' +
    money(GOALS.reduce((s, g) => s + g.monthly, 0)) + ' in all, ' + percent(GOALS.reduce((s, g) => s + g.monthly, 0), totalIncome()) +
    ' of income. November’s deposit pot got an extra $300 from Maya’s tutoring bonus, which is why it is ahead of its own schedule.</p>' +
    '<p class="chart-note">Projections assume the monthly amounts stay the same and nothing is withdrawn. The emergency fund comes first on purpose: the other three pots only fill once it can cover six months of needs (about ' + money(groupTotals('needs').budget) + ' a month of essentials).</p></div>';
}

// ---------- Insights ----------

function viewInsights() {
  const income = totalIncome(), spent = totalSpent();
  const movers = [...CATEGORIES].map((c) => ({ c, now: spentIn(c.id) }))
    .sort((a, b) => Math.abs(b.now - b.c.october) / b.c.october - Math.abs(a.now - a.c.october) / a.c.october);
  const moverRows = movers.map(({ c, now }) => {
    const diff = now - c.october;
    return '<tr><td><span class="dot" style="background:' + c.color + '"></span>' + c.name + '</td>' +
      '<td class="num">' + money(c.october) + '</td><td class="num">' + money(now) + '</td>' +
      '<td class="num ' + (diff > 0 ? 'over-text' : 'under-text') + '">' + (diff > 0 ? '+' : '−') + money(Math.abs(diff)) + ' (' + signedPercent(now, c.october) + ')</td></tr>';
  }).join('');

  const payees = {};
  for (const t of state.txns) payees[t.payee] = (payees[t.payee] || 0) + t.amount;
  const topPayees = Object.entries(payees).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([name, amt]) => '<li><div><strong>' + esc(name) + '</strong></div><span class="bill-amt">' + money(amt) + '</span></li>').join('');

  const dining = spentIn('dining'), diningCount = state.txns.filter((t) => t.cat === 'dining').length;
  const tips = [
    '<strong>Dining out is the one leak.</strong> ' + money(dining) + ' across ' + diningCount + ' meals — ' + money(dining - state.budgets.dining) +
      ' over plan, averaging ' + money(dining / diningCount) + ' a meal. Swapping two meals out for two at home saves about ' + money(2 * dining / diningCount) +
      ', which closes the overspend and still leaves change for the Kyoto pot.',
    '<strong>Groceries quietly won the month.</strong> ' + money(spentIn('groceries')) + ' against a ' + money(state.budgets.groceries) +
      ' plan — the Warehouse Club big shop on 16 Nov replaced three smaller top-ups. Moving the spare ' + money(state.budgets.groceries - spentIn('groceries')) +
      ' to Kyoto brings the trip fund to ' + money(goalSaved(GOALS[1]) + (state.budgets.groceries - spentIn('groceries'))) + '.',
    '<strong>Transport jumped ' + signedPercent(spentIn('transport'), categoryById('transport').october) + ' — and it is a one-off.</strong> The $102.70 oil change on 24 Nov is half the rise; the underlying run-rate is flat, so December’s $380 limit stands.',
    '<strong>The savings habit is the story of the year.</strong> Six straight months above 20% of income, ' + money(HISTORY.reduce((s, h) => s + h.saved, 0)) +
      ' moved since June. At this pace the emergency fund closes in ' + goalEta(GOALS[0]) + ' and the deposit pot passes $10,000 next summer.',
  ].map((t) => '<li>' + t + '</li>').join('');

  return '<div class="page-head"><h1>Insights</h1>' +
    '<p class="lede">What November’s numbers actually say, in plain words — the same figures as the ledger, read closely.</p></div>' +
    '<div class="cols-2"><div class="panel"><h2>Six months, three lines</h2>' +
    groupedBars(HISTORY, [{ key: 'income', name: 'Money in', color: '#177E6C' }, { key: 'spent', name: 'Money out', color: '#E9A13B' }, { key: 'saved', name: 'Saved', color: '#7C6AAE' }], 520, 210) +
    '<p class="chart-note">Income (green), spending (amber) and savings (violet). Savings dipped in the summer holidays and have climbed since September.</p>' +
    '<h2 class="sub-head">Biggest payees in November</h2><ul class="bill-list">' + topPayees + '</ul></div>' +
    '<div class="panel"><h2>What changed since October</h2><div class="table-scroll"><table class="movers-table">' +
    '<thead><tr><th>Category</th><th class="num">October</th><th class="num">November</th><th class="num">Change</th></tr></thead>' +
    '<tbody>' + moverRows + '</tbody></table></div></div></div>' +
    '<div class="panel"><h2>Four things worth knowing</h2><ol class="tips">' + tips + '</ol>' +
    '<p class="chart-note">November’s savings rate: ' + percent(movedToSavings(), income) + ' of ' + money(income) + ' in. The family’s rule is simple — needs near half, wants well under a third, savings never under a fifth — and November kept all three.</p></div>';
}
