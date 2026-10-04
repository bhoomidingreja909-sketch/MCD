/* =====================================================================
   EDITABLE CONTENT  (change text and numbers here, nothing else needed)
   Each block below is one "config object". Keep the quotes and commas.
   ===================================================================== */

/* SEGMENTS: one entry per tab. Change speaker names here. (def is kept for reference but is no longer shown on screen.) */
const SEGMENTS = [
  { n: 1, title: 'Farm to Factory', domain: 'Inbound', speaker: 'Speaker 1',
    def: 'Farm to factory is the upstream stage where growers and processors turn raw produce, poultry and dairy into ready-to-cook ingredients that flow to McDonald’s distribution centres.',
    key: ['14 of 40 Tier-1 suppliers', '80% of demand'] },
  { n: 2, title: 'Supplier Quality Gates', domain: 'Inbound', speaker: 'Speaker 2',
    def: 'Quality gates are the certifications, audits and taste tests a supplier must clear before its product moves down the chain.',
    key: ['4 gates', 'HACCP → SQMS → Sensory → DQMP'] },
  { n: 3, title: 'The Outsourcing Philosophy', domain: 'Inbound', speaker: 'Speaker 3',
    def: 'McDonald’s India outsources every supply chain activity to specialist partners and keeps only a very small, lean team to set standards and oversee the network.',
    key: ['100% outsourced', '40 suppliers'] },
  { n: 4, title: 'Long-Range Forecasting', domain: 'Inbound', speaker: 'Speaker 4',
    def: 'Long-range forecasting tells suppliers what is coming, so capacity is ready before a single order arrives.',
    key: ['31Q', '3-month rolling forecast'] },
  { n: 5, title: 'Arrival at the DC', domain: 'Inbound', speaker: 'Speaker 5',
    def: 'The distribution centre is where inbound logistics ends and outbound logistics begins.',
    key: ['Hub and spoke network', '99.8% fill rate'] },
  { n: 6, title: 'Store Ordering Mechanics', domain: 'Operations', speaker: 'Speaker 6',
    def: 'Every pull in the pull chain begins at the store: the system suggests an order, the manager decides.',
    key: ['Cut-off about 12 PM', 'Buffer: 1 to 2 days'] },
  { n: 7, title: 'RKFL’s Distribution Engine', domain: 'Operations', speaker: 'Speaker 7',
    def: 'RKFL is the one outsourced company that runs all of McDonald’s India’s warehousing and transport.',
    key: ['80% reefer movement', '10 days max inventory'] },
  { n: 8, title: 'The Delivery Leg', domain: 'Operations', speaker: 'Speaker 8',
    def: 'The delivery vehicles and routes that carry frozen, chilled and dry goods from the DC to the store.',
    key: ['3 temperature zones', '80% on time'] },
  { n: 9, title: 'Store Receiving and Storage', domain: 'Operations', speaker: 'Speaker 9',
    def: 'What happens in the store after the truck arrives: quality check, storage, expiry control and waste.',
    key: ['Turn ratio 36', '10 days max inventory'] },
  { n: 10, title: 'Kitchen to Customer', domain: 'Customer', speaker: 'Speaker 10',
    def: 'The whole chain replayed: from one order, back up the chain, to one customer.',
    key: ['99.8% fill rate', 'McDelivery +400%'] }
];

/* SUPPLIERS (Tab 1 map). Order matters: the first 7 are revealed one by one.
   sup = [supplier name, location, map x, map y]. Map is 30 wide x 34 tall. */
const SUPPLIERS = [
  { ing: 'Buns', layer: 'bun', line: 'The buns are sourced from a local factory at Taloja.', sup: [['Local factory', 'Taloja', 3.6, 14.1]] },
  { ing: 'Chicken patty', layer: 'patty', sup: [['Vista Foods', 'Taloja', 5, 15.5]] },
  { ing: 'Cheese', layer: 'cheese', sup: [['Dynamix Dairy', 'Pune', 9, 18.3]] },
  { ing: 'Iceberg lettuce', layer: 'lettuce', sup: [['Trikaya Agriculture', 'Pune', 10.5, 20.3], ['Meena Agritech', 'Delhi', 9.5, 8.5], ['Ooty Farms & Orchards', 'Ooty', 11.5, 24.5]] },
  { ing: 'Dehydrated onions', layer: 'onion', sup: [['Jain Foods', 'Jalgaon', 11, 13.3]] },
  { ing: 'Eggless mayo', layer: 'mayo', sup: [['Quaker Cremica', 'Phillaur', 8.5, 4.2]] },
  { ing: 'Sesame seeds', layer: 'sesame', sup: [['', 'Ghaziabad', 13, 9.6]] },
  { ing: 'Veg patty, nuggets, pineapple pie', rest: true, sup: [['Kitran Foods', 'Taloja', 7.5, 16.4]] },
  { ing: 'Dressed chicken', rest: true, sup: [['Riverdale', 'Talegaon', 6.2, 18.4]] },
  { ing: 'Fish fillet patties', rest: true, sup: [['Amalgam Foods', 'Kochi', 8.8, 27.2]] },
  { ing: 'Vegetables for patties', rest: true, sup: [['Finns Frozen Foods and Jain Foods', 'Nasik/Jalgaon', 8, 13.6]] },
  { ing: 'Mutton and mutton patties', rest: true, sup: [['Al Kabeer', 'Hyderabad', 14.5, 19.5]] }
];
const LOCAL_PINS = [
  { ing: 'Milk', note: 'Local authorised regional suppliers. Shortest shelf life, not shipped from Kalamboli.', x: 3, y: 19.6 },
  { ing: 'Buns', note: 'Local factory at Taloja.', x: 2.2, y: 16.4 }
];

/* ONE_SUPPLIER (Tab 1, mode C): ingredient tiles with their one dedicated supplier. */
const ONE_SUPPLIER = [
  ['Buns', 'Local factory, Taloja', 'bun'], ['Chicken patty', 'Vista Foods', 'burger'], ['Cheese', 'Dynamix Dairy', 'cheese'],
  ['Lettuce', 'Trikaya Agriculture', 'lettuce'], ['Onions', 'Jain Foods', 'lettuce'], ['Mayo', 'Quaker Cremica', 'cup'],
  ['Fries', 'McCain Foods India', 'fries'], ['Fish patties', 'Amalgam Foods', 'burger'],
  ['Mutton', 'Al Kabeer', 'burger'], ['Sugar sachets', 'Dedicated supplier', 'receipt']
];

/* GATES (Tab 2): colour = quality-gate colour, q = the one short question, facts = small chips. */
const GATES = [
  { id: 'HACCP', name: 'HACCP', color: '#3DBE62', q: 'What can make food unsafe, and how do we control it?',
    facts: ['Industry-wide', 'Applies to all suppliers'] },
  { id: 'SQMS', name: 'SQMS', color: '#FFC629', q: 'Can this plant make it safe, legal and on-spec, every time?',
    facts: ['A worldwide McDonald\u2019s mandate', 'Globally trained auditors score plants'] },
  { id: 'DQMP', name: 'DQMP', color: '#E8392F', q: 'Does it stay safe while stored and moved?',
    facts: ['Audits warehouses, transport and the distribution centre'] },
  { id: 'Sensory', name: 'Sensory', color: '#9B7BE0', q: 'Does it taste right? Minimum score to ship.',
    facts: ['Every batch goes to an approved panel at the plant', 'Experts trained by a central lab in Hong Kong', 'Product cutting: fry, taste, score (quarterly or half-yearly)'] }
];

/* SCENARIOS (Tab 2, mode C) */
const SCENARIOS = [
  { text: 'A metal fragment could enter the product during production.', answer: 'HACCP', why: 'A physical hazard, found by hazard analysis.' },
  { text: 'A plant’s batches keep missing weight and size specification.', answer: 'SQMS', why: 'Can the plant make it on-spec every time?' },
  { text: 'A truck’s temperature rises and the product partly thaws on the way.', answer: 'DQMP', why: 'Safety while stored and moved.' }
];

/* KPIS (Tab 3, mode B): needle = 0 to 1 (illustrative only). */
const KPIS = [
  { name: 'Admin efficiency', group: 'warehouse', v: 0.78 },
  { name: 'Cases managed per man-hour', group: 'warehouse', v: 0.66 },
  { name: 'Warehouse efficiency', group: 'warehouse', v: 0.85 },
  { name: 'Overtime %', group: 'warehouse', v: 0.25 },
  { name: 'Cases handled per trip', group: 'transport', v: 0.72 },
  { name: 'Truck utilisation', group: 'transport', v: 0.8 }
];

/* OUTSOURCE (Tab 3, mode A): what flies out of the 5-person control room, and to whom. */
const OUTSOURCE = [
  ['Transportation', 'Reefer fleet', 'About 80% of movement is by refrigerated truck'],
  ['Warehousing', 'RKFL', ''],
  ['Purchasing and invoicing', 'RKFL', ''],
  ['Supplying', '40 suppliers', ''],
  ['Quality audits', 'Trained auditors', 'SQMS / DQMP']
];
const NETWORK = ['Franchisees', 'Distributors (RKFL, third-party logistics)', 'Restaurants', 'Services', 'Food suppliers', 'Advertising cooperatives', 'Food purchasing cooperatives'];

/* STORE_SCENARIO (Tab 6): the numbers on the mock ordering screen. */
const STORE_SCENARIO = {
  sales: '₹5 lakh', suggested: 2, override: 3, cutoff: '12 PM',
  event: 'Concert at the D.Y. Patil ground',
  buffer: '₹1 to 2 lakh', bufferDays: '1 to 2 days',
  fridayThis: 5.0, fridayLast: 4.4, // lakh, drawn as two bars
  onTime: 80, delayed: 20
};

/* VAN_ITEMS (Tab 8): which zone each item belongs in. zone = frozen | chilled | dry */
const ZONES = {
  frozen: { name: 'Frozen', temp: '-18°C to -25°C', color: '#7FB6EA' },
  chilled: { name: 'Chilled', temp: '1°C to 4°C', color: '#5CCBB8' },
  dry: { name: 'Dry', temp: 'ambient', color: '#F0A35E' }
};
const VAN_ITEMS = [
  { name: 'Fries', zone: 'frozen', icon: 'fries' },
  { name: 'Chicken patties', zone: 'frozen', icon: 'burger' },
  { name: 'Cheese', zone: 'chilled', icon: 'cheese' },
  { name: 'Lettuce', zone: 'chilled', icon: 'lettuce' },
  { name: 'Cups', zone: 'dry', icon: 'cup' },
  { name: 'Napkins', zone: 'dry', icon: 'receipt' },
  { name: 'Sauce packs', zone: 'dry', icon: 'milk' }
];

/* SHELF_LIFE (Tab 8, mode C): days = delivery weekdays (0=Mon..6=Sun, illustrative), bar = 0..100. */
const SHELF_LIFE = [
  { item: 'Milk', note: 'Ordered daily. Separate dedicated supplier. Shortest shelf life.', days: [0, 1, 2, 3, 4, 5, 6], bar: 10, life: 'very short', icon: 'milk' },
  { item: 'Buns', note: '4 days a week. Shelf life about 3 days.', days: [0, 2, 4, 6], bar: 22, life: 'about 3 days', icon: 'bun' },
  { item: 'Vegetables', note: 'Last about 7 days.', days: [1, 3, 5], bar: 45, life: 'about 7 days', icon: 'lettuce' },
  { item: 'Frozen / chilled', note: '2 days a week via RK Cold Chain.', days: [1, 4], bar: 100, life: 'weeks to months', icon: 'fries' },
  { item: 'General pattern', note: '3 days a week with a 2-day lead time.', days: [0, 2, 4], bar: 60, life: 'varies', icon: 'tray' }
];

/* QIP_BOXES (Tab 9, mode A): scripted deliveries. tempF = pyrometer reading, ok = should be accepted.
   Target band is 0 to -10 degrees F. */
const QIP_BOXES = [
  { name: 'Chicken patties', tempF: -6, ok: true },
  { name: 'French fries', tempF: -3, ok: true },
  { name: 'Fish fillets', tempF: 14, ok: false },
  { name: 'Nuggets', tempF: -9, ok: true }
];
const QIP_BAND = [-10, 0];

/* CONCEPTS: shown with the C key. [name, one plain line]. */
const CONCEPTS = {
  1: [['Channel management', 'Bringing suppliers, manufacturers and distributors together to lower cost and raise efficiency.']],
  2: [['Standardisation', 'A common certification for every supplier minimises variance.'],
      ['Channel integration', 'Owning suppliers gives the most control; McDonald’s gets it through standards, audits and scoring instead.'],
      ['Manufacturing interface', 'The plant is the core of operations, so SQMS targets plants.']],
  3: [['Extended enterprise', 'Outsourcing lets a firm focus on its core competencies, which define its unique value.'],
      ['Defining business boundaries', 'Deciding what to do in-house, taken to the extreme.'],
      ['Relationship management', 'A shift from adversarial to cooperative approaches, with trust instead of distrust.']],
  4: [['Outsourcing procurement, transport and warehousing', 'Firms outsource these to focus on their core.'],
      ['External integration', 'Coordination reaches upstream and downstream beyond the firm.']],
  5: [['Inbound vs outbound logistics', 'The DC is where one ends and the other begins.'],
      ['Compressing the value chain', 'Cutting lead times gets goods to market faster.']],
  6: [['Forecast inaccuracy and anticipation of shortages', 'Two classic causes of over-ordering up the chain, kept under control by short horizons and a small buffer.']],
  7: [['Logistics vs SCM', 'Logistics is supply driven; SCM is demand driven.']],
  8: [['Strengthen logistics', 'Storing, moving, transporting and handling material.'],
      ['Outbound logistics', 'Movement from the DC to the stores.']],
  9: [['Two-way flows and inventory visibility', 'Minimum total cost. Lean stock keeps cost down.'],
      ['Carrying cost', 'Lean stock avoids it.']],
  10: [['Role of logistics in SCM', 'Order fulfilment builds competitive advantage.']]
};

/* QUESTIONS: only segments 4, 5, 6 and 7 have a question (all multiple choice).
   q = question, opts = the answer choices, correct = position of the right choice (0 = first), a = text in the gold stamp. */
const QUESTIONS = {
  4: { q: 'In the 31Q system, what does the \u2018Q\u2019 stand for, and how far ahead is the rolling forecast the DC gives to suppliers?',
       opts: ['Quality check, with a 3-year rolling forecast', 'Quarterly monitoring, with a 3-day rolling forecast', 'Quarterly monitoring, with a 3-month rolling forecast', 'Quantity check, with a 1-week rolling forecast'],
       correct: 2, a: 'Quarterly monitoring. The DC gives suppliers a 3-month rolling forecast.' },
  5: { q: 'Under \u201Cdirect flow for perishables\u201D, which two items skip the distribution centre and go straight to the restaurants?',
       opts: ['Milk and French fries', 'Buns and Coke', 'Cheese and lettuce', 'Chicken patties and onions'],
       correct: 1, a: 'Buns and Coke skip the DC.' },
  6: { q: 'A concert near a store will raise sales, but the system cannot see it. What should the manager do, and what is the cut-off for the order?',
       opts: ['Trust the suggestion, because the system already knows about the concert', 'Override the suggestion and order more (for example 3 cases instead of 2) before the cut-off of about 12 PM', 'Wait for the concert and place a formal emergency order afterwards', 'Order fewer cases, because the projection is already high'],
       correct: 1, a: 'Override the suggestion and order more (for example 3 cases instead of 2). Cut-off: about 12 PM for the next applicable delivery.' },
  7: { q: 'Which description of RKFL is correct?',
       opts: ['A McDonald\u2019s department that sets menu prices', 'A supplier that grows lettuce and potatoes', 'An independent logistics partner that manages all DCs and national truck movement', 'A franchisee that runs the West and South zone'],
       correct: 2, a: 'RKFL is an independent logistics partner. It manages all DCs and handles all truck movement nationally.' }
};

/* JOURNEY (Tab 10): nine stations, one per segment. */
const JOURNEY = [
  ['burger', 'Farm and tiers', '40 suppliers, 14 of them Tier-1'],
  ['clipboard', 'Quality gates', 'HACCP, SQMS, Sensory, DQMP'],
  ['handshake', 'Outsourcing', '100% outsourced, trust over contracts'],
  ['receipt', 'Forecast', '31Q: plan ahead, pull on demand'],
  ['dc', 'The DC', 'Where inbound ends, outbound begins'],
  ['tray', 'Store order', 'The system suggests, the manager decides'],
  ['truck', 'RKFL pull engine', 'Nothing is made until it is ordered'],
  ['van', 'Van delivery', 'Three temperature zones, one route'],
  ['thermometer', 'Store storage', 'Check every box, then turn stock about 36 times a year']
];
