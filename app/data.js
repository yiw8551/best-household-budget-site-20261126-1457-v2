// HomeTally's data: the Okafor family's November 2026, kept as plain facts.
// Spending totals are never stored — every page adds the transactions up
// itself, so the budget, the overview and the insights can never disagree.

const FAMILY = {
  name: 'The Okafor family',
  members: 'Maya, Daniel, Zoe (9) and Eli (6)',
  home: '14 Maple Court',
  monthLabel: 'November 2026',
  monthDays: 30,
  todayDay: 27, // the book is written up through Friday 27 November
};

// Budget groups follow the 50/30/20 rule: needs, wants, and savings & buffer.
const GROUPS = {
  needs: { name: 'Needs', target: 50 },
  wants: { name: 'Wants', target: 30 },
  savings: { name: 'Savings', target: 20 },
};

// budget = what the family planned for November; october = what October
// actually cost, so Insights can show the change month to month.
const CATEGORIES = [
  { id: 'housing',      name: 'Housing & rent',  group: 'needs', budget: 1850, october: 1850, color: '#C96F4A' },
  { id: 'groceries',    name: 'Groceries',       group: 'needs', budget: 780,  october: 789,  color: '#7FA653' },
  { id: 'utilities',    name: 'Utilities',       group: 'needs', budget: 320,  october: 338,  color: '#4E7FA0' },
  { id: 'transport',    name: 'Transport',       group: 'needs', budget: 380,  october: 314,  color: '#5B8C7B' },
  { id: 'health',       name: 'Health',          group: 'needs', budget: 240,  october: 203,  color: '#4F9D8F' },
  { id: 'kids',         name: 'Kids & school',   group: 'needs', budget: 300,  october: 286,  color: '#E9A13B' },
  { id: 'home',         name: 'Home & repairs',  group: 'needs', budget: 200,  october: 121,  color: '#8C6A4A' },
  { id: 'dining',       name: 'Dining out',      group: 'wants', budget: 260,  october: 235,  color: '#D95F43' },
  { id: 'subscriptions',name: 'Subscriptions',   group: 'wants', budget: 85,   october: 79,   color: '#7C6AAE' },
  { id: 'fun',          name: 'Fun & leisure',   group: 'wants', budget: 220,  october: 196,  color: '#C24E6D' },
  { id: 'clothing',     name: 'Clothing',        group: 'wants', budget: 180,  october: 158,  color: '#5E7A9C' },
  { id: 'personal',     name: 'Personal care',   group: 'wants', budget: 120,  october: 104,  color: '#A3A380' },
];

// Money in during November: two salaries, Maya's Saturday tutoring, cashback.
const INCOME = [
  { date: '2026-11-01', source: 'Salary — Maya (Brightpath School)', amount: 4480 },
  { date: '2026-11-01', source: 'Salary — Daniel (Northgate Logistics)', amount: 2860 },
  { date: '2026-11-12', source: 'Saturday tutoring — Maya', amount: 250 },
  { date: '2026-11-20', source: 'Card cashback', amount: 20 },
];

// Every penny out, 1–27 November: [date, payee, category, dollars].
const TRANSACTIONS = [
  ['2026-11-01', 'Maple Court Apartments — rent', 'housing', 1850.00],
  ['2026-11-01', 'StreamBox', 'subscriptions', 15.99],
  ['2026-11-02', 'GreenMart Groceries', 'groceries', 86.40],
  ['2026-11-02', 'Vision Care — Eli glasses deposit', 'health', 34.00],
  ['2026-11-03', 'MusicWave Family', 'subscriptions', 16.99],
  ['2026-11-03', 'MetroCard top-up', 'transport', 60.00],
  ['2026-11-04', 'City Power & Light', 'utilities', 118.45],
  ['2026-11-05', 'GreenMart Groceries', 'groceries', 64.25],
  ['2026-11-05', 'Riverside Elementary — lunch account', 'kids', 45.00],
  ['2026-11-06', 'Noodle House', 'dining', 46.50],
  ['2026-11-06', 'Hardware Hut — bulbs & filters', 'home', 36.75],
  ['2026-11-07', 'BrightPath Pharmacy', 'health', 34.60],
  ['2026-11-07', 'Sourdough & Sons Bakery', 'groceries', 18.00],
  ['2026-11-08', 'Shell — fuel', 'transport', 52.40],
  ['2026-11-08', 'Cinema City — family matinee', 'fun', 42.00],
  ['2026-11-09', "Farmers' Market — Saturday stalls", 'groceries', 38.60],
  ['2026-11-09', 'Trim & Co — haircuts', 'personal', 52.00],
  ['2026-11-09', 'Piano lessons — Ms. Rivera', 'kids', 40.00],
  ['2026-11-10', 'CloudKeep 2TB', 'subscriptions', 9.99],
  ['2026-11-10', 'Taco Mesa', 'dining', 42.00],
  ['2026-11-11', 'Water & Sewer — City', 'utilities', 56.30],
  ['2026-11-11', 'Northwind Outfitters — Zoe coat', 'clothing', 64.00],
  ['2026-11-12', 'GreenMart Groceries', 'groceries', 92.15],
  ['2026-11-12', 'KidsKick Soccer — season fees', 'kids', 90.00],
  ['2026-11-13', 'Pizza Forge', 'dining', 38.00],
  ['2026-11-14', 'FiberLink Internet', 'utilities', 48.00],
  ['2026-11-14', 'Concert tickets — school band night', 'fun', 45.00],
  ['2026-11-15', 'Shell — fuel', 'transport', 48.90],
  ['2026-11-15', 'NewsDaily subscription', 'subscriptions', 12.00],
  ['2026-11-16', 'Warehouse Club — big shop', 'groceries', 148.30],
  ['2026-11-16', 'Board game — Settlers expansion', 'fun', 34.00],
  ['2026-11-17', 'Cafe Luna', 'dining', 24.75],
  ['2026-11-18', 'NorthGas Heating', 'utilities', 74.25],
  ['2026-11-18', 'Book Nook — school books', 'kids', 38.50],
  ['2026-11-19', 'GreenMart Groceries', 'groceries', 71.55],
  ['2026-11-19', 'Dr. Patel — dental copay', 'health', 85.00],
  ['2026-11-19', 'Glow Pharmacy — toiletries', 'personal', 36.00],
  ['2026-11-20', 'City parking — centre', 'transport', 18.00],
  ['2026-11-20', 'StreamBox Sports add-on', 'subscriptions', 11.99],
  ['2026-11-20', 'Hardware Hut — faucet washer kit', 'home', 12.25],
  ['2026-11-21', 'Sushi Go', 'dining', 68.40],
  ['2026-11-21', 'Shoe Mart — Eli sneakers', 'clothing', 48.00],
  ['2026-11-22', 'MetroCard top-up', 'transport', 60.00],
  ['2026-11-22', 'Craft Barn — art supplies', 'kids', 24.50],
  ['2026-11-23', 'GreenMart Groceries', 'groceries', 88.20],
  ['2026-11-23', 'Mini golf — family round', 'fun', 28.00],
  ['2026-11-24', 'AutoCare — oil change', 'transport', 102.70],
  ['2026-11-24', 'BrightPath Pharmacy', 'health', 22.40],
  ['2026-11-24', 'Garden Centre — soil & herbs', 'home', 47.00],
  ['2026-11-25', 'Burger Barn', 'dining', 31.35],
  ['2026-11-25', 'Riverside Elementary — field trip', 'kids', 30.00],
  ['2026-11-25', 'Northwind Outfitters — socks & basics', 'clothing', 30.00],
  ['2026-11-26', "Farmers' Market — Saturday stalls", 'groceries', 42.55],
  ['2026-11-26', 'Yoga studio — drop-in class', 'fun', 15.00],
  ['2026-11-27', 'Noodle House', 'dining', 38.00],
  ['2026-11-27', 'PuzzleClub', 'subscriptions', 12.04],
  ['2026-11-27', 'GreenMart Groceries', 'groceries', 92.00],
];

// Recurring bills: what leaves the account whether the family thinks about
// it or not. dueDay is the December due date; novemberPaid is what the same
// bill cost in November, so the Bills page can show both months honestly.
const BILLS = [
  { name: 'Rent — Maple Court Apartments', dueDay: 1,  amount: 1850, autopay: true,  novemberPaid: 1850.00, note: 'The big one. Paid on the 1st, same as payday.' },
  { name: 'City Power & Light',            dueDay: 28, amount: 118,  autopay: true,  novemberPaid: 118.45, note: 'November’s bill lands 28 Nov — due tomorrow.' },
  { name: 'StreamBox',                     dueDay: 1,  amount: 16,   autopay: true,  novemberPaid: 15.99,  note: 'Family plan, shared with Maya’s sister.' },
  { name: 'FiberLink Internet',            dueDay: 3,  amount: 48,   autopay: true,  novemberPaid: 48.00,  note: 'Fibre 300. Renews at the same price until March.' },
  { name: 'Water & Sewer — City',          dueDay: 9,  amount: 56,   autopay: false, novemberPaid: 56.30,  note: 'Paid by hand — the city portal will not save a card.' },
  { name: 'NorthGas Heating',              dueDay: 12, amount: 74,   autopay: true,  novemberPaid: 74.25,  note: 'Winter is coming; December will be higher.' },
  { name: 'Car insurance — Shield Mutual', dueDay: 15, amount: 132,  autopay: true,  novemberPaid: 0,        note: 'Quarterly premium; November had no payment.' },
  { name: 'Duo Mobile — two lines',        dueDay: 18, amount: 86,   autopay: true,  novemberPaid: 0,        note: 'Billed mid-December for the first time on this plan.' },
];

// Savings goals: saved so far, the monthly amount the family plans to add,
// and what actually moved in November (transfers below).
const GOALS = [
  { id: 'emergency', name: 'Emergency fund',        target: 10000, saved: 6420, monthly: 700, note: 'Six months of essentials if a salary ever stops. Held at First Corner Bank, 4.1%.' },
  { id: 'kyoto',     name: 'Kyoto family trip',     target: 3200,  saved: 1150, monthly: 250, note: 'Flights for four, a week in a machiya, and far too many noodles. Aimed at cherry-blossom season after next.' },
  { id: 'car',       name: 'Car replacement',       target: 8000,  saved: 2340, monthly: 340, note: 'The hatchback is 11 years old. A reliable used estate, bought outright, no loan.' },
  { id: 'deposit',   name: 'Home deposit',          target: 25000, saved: 4850, monthly: 650, note: 'A place of their own near Riverside Elementary. November got a $300 top-up from Maya’s tutoring bonus.' },
];

// Money moved into savings during November: [date, goal, dollars].
const TRANSFERS = [
  ['2026-11-03', 'emergency', 700],
  ['2026-11-15', 'kyoto', 250],
  ['2026-11-15', 'car', 340],
  ['2026-11-15', 'deposit', 950],
];

// The last six months, for the trend charts: money in, money out, and what
// was moved to savings. November matches the ledger above to the dollar.
const HISTORY = [
  { month: 'Jun', income: 7420, spent: 4610, saved: 1980 },
  { month: 'Jul', income: 7420, spent: 4905, saved: 1760 },
  { month: 'Aug', income: 7555, spent: 5120, saved: 1690 },
  { month: 'Sep', income: 7610, spent: 4388, saved: 2310 },
  { month: 'Oct', income: 7610, spent: 4673, saved: 2255 },
  { month: 'Nov', income: 7610, spent: 4533, saved: 2240 },
];
