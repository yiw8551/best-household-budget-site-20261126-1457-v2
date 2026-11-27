// HomeTally's wiring: a hash router, and the handlers that make every
// control on every page do what it says. Rendering lives in views.js;
// this file only connects the pages to the person using them.

const ROUTES = {
  overview: viewOverview,
  budget: viewBudget,
  transactions: viewTransactions,
  bills: viewBills,
  goals: viewGoals,
  insights: viewInsights,
};

function currentRoute() {
  const name = location.hash.replace('#/', '').split('/')[0];
  return ROUTES[name] ? name : 'overview';
}

// Rebuild every page from the live state, then show the routed one. Pages
// are cheap to rebuild, and rebuilding them all is what keeps an edit made
// on one page true on the others.
function renderAll() {
  for (const [name, view] of Object.entries(ROUTES)) {
    document.getElementById('page-' + name).innerHTML = view();
  }
  wirePageControls();
  showRoute();
}

function showRoute() {
  const route = currentRoute();
  for (const name of Object.keys(ROUTES)) {
    document.getElementById('page-' + name).hidden = name !== route;
  }
  document.querySelectorAll('#mainnav a').forEach((a) => {
    a.classList.toggle('on', a.dataset.route === route);
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

function wirePageControls() {
  // Budget planner: typing a new limit re-plans the month everywhere.
  document.querySelectorAll('.limit-input').forEach((input) => {
    input.addEventListener('change', () => {
      const value = Math.max(0, Math.round(Number(input.value) || 0));
      state.budgets[input.dataset.cat] = value;
      renderAll();
    });
  });

  // Transactions: category chips, payee search, and the add form.
  document.querySelectorAll('[data-filter]').forEach((chip) => {
    chip.addEventListener('click', () => { state.txnFilter = chip.dataset.filter; renderAll(); });
  });
  const search = document.getElementById('txn-search');
  if (search) {
    search.addEventListener('input', () => {
      state.txnSearch = search.value.trim().toLowerCase();
      const pos = search.selectionStart;
      renderAll();
      const again = document.getElementById('txn-search');
      again.focus();
      again.setSelectionRange(pos, pos);
    });
  }
  const form = document.getElementById('add-txn');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const amount = Number(data.get('amount'));
      const payee = String(data.get('payee')).trim();
      if (!payee || !(amount > 0)) return;
      state.txns.push({ date: String(data.get('date')), payee, cat: String(data.get('cat')), amount });
      state.txnFilter = 'all';
      state.txnSearch = '';
      renderAll();
      const note = document.getElementById('add-txn-note');
      if (note) note.textContent = 'Added ' + payee + ' (' + moneyExact(amount) + ') — the budget and overview already count it.';
    });
  }

  // Bills: settle a December bill early.
  document.querySelectorAll('[data-pay]').forEach((button) => {
    button.addEventListener('click', () => { state.paidEarly.add(button.dataset.pay); renderAll(); });
  });

  // Goals: one-off top-ups move the finish line closer at once.
  document.querySelectorAll('[data-boost]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.boost;
      state.goalBoosts[id] = (state.goalBoosts[id] || 0) + Number(button.dataset.amt);
      renderAll();
    });
  });
}

window.addEventListener('hashchange', showRoute);
renderAll();
