# McDonald's India Supply Chain: presentation demo

A pixel-art, keyboard-driven demo for a 10-segment talk. It runs fully offline.

## How to open it

1. Open the file **`index.html`** (or `dist/index.html`, same file) by double-clicking it. Chrome, Edge, Firefox and Safari all work.
2. Press **F** for fullscreen. It scales to any 16:9 screen (designed for 1920x1080 and 1366x768).
3. Press **Space** on the opening screen to start.

Nothing is downloaded: no internet, fonts or libraries are used, so it works with Wi-Fi off.

## Keyboard shortcuts

| Key | What it does |
|---|---|
| `1` to `9`, `0` | Jump to Tab 1 to 9, and Tab 10 |
| `PageUp` / `PageDown` | Previous / next tab (works with a clicker) |
| `Space` or `Enter` | Main action: reveal / next step / play |
| `→` / `←` | Step forward / back |
| `M` | Next mode inside the tab (most tabs have 2 or 3) |
| `T` | Open the Question Break now (Tab 10 has none) |
| `Esc` | Close the Question Break or concept links |
| `B` / `Y` / `S` | Point to Team Burger / Team Fries / skip (only after the answer is shown) |
| `C` | Show the Concept Link chips for this segment |
| `R` | Reset this tab (scores are kept) |
| `F` | Fullscreen on / off |
| `P` | Stopwatch: start, then pause, then reset |
| `H` | Show / hide the shortcut panel (also has "Reset scores", asks to confirm) |
| `↑` / `↓` | Tab 6 only: change the manager's override |

**Question Break flow:** after the last step of a tab, the next `Space` opens the question ticket (15-second timer bar). `Space` shows the answer, `B`/`Y`/`S` gives a point, `Space` again closes it and drives the truck to the next tab. The on-screen +1 buttons also work.

**Mouse is needed in only three places:** drag items in Tab 8 (pack the van) and Tab 9 mode B (waste bin); click Accept / Return in Tab 9 mode A; click a gate in Tab 2 mode C. All of these also have a Space-only path.

## Presenter cheat sheet (what Space does, in order)

Every tab ends with its Question Break (except Tab 10). Modes are switched with `M`.

**Tab 1: Farm to Factory**
- *A. Build the Burger Map:* 1 Buns, 2 Chicken patty, 3 Cheese, 4 Lettuce, 5 Onions, 6 Mayo, 7 Sesame (each drops a layer and pins the map) → 8 the rest of the menu pins → 9 Local pins (milk and buns) glow.
- *B. Tier Ladder:* 1 Tier-2 → 2 Tier-1 → 3 DC → 4 ring "14 of 40" and "80%".
- *C. One Product, One Supplier:* 1 supplier tiles → 2 "Shortage!" (sugar sachets HELD) → 3 "40 suppliers" caption.
- Question: how many Tier-1 suppliers fulfil about 80% of demand? **14 (of 40)**

**Tab 2: Supplier Quality Gates**
- *A. Gate Run:* 1 HACCP, 2 SQMS, 3 Sensory, 4 DQMP (the crate moves through each gate) → 5 crate reaches the DC.
- *B. Find the CCP:* 1 to 7 the seven nugget stages (hazard + control) → 8 "Where is the CCP?" → 9 Cooking pulses → 10 to 16 the seven HACCP principles light up.
- *C. Which Gate?:* for each of 3 scenarios: Space shows it (click a gate or say it aloud), Space reveals the answer. 6 presses in total.
- Question: which worldwide plant quality system? **SQMS**

**Tab 3: The Outsourcing Philosophy**
- *A. 5-Person Control Room:* 1 Transportation, 2 Warehousing, 3 Purchasing and invoicing, 4 Supplying, 5 Quality audits (each flies out) → 6 "100% OUTSOURCED" stamp with 40 cities / 250 restaurants → 7 who is who.
- *B. Handshake vs Contract:* 1 contract (no signed agreements) → 2 handshake → 3 six KPI gauges.
- *C. Extended Enterprise:* 1 to 7 the seven nodes light up → 8 "what McDonald's keeps".
- Question: which concept describes the loosely coupled network? **The Extended Enterprise**

**Tab 4: Long-Range Forecasting** (first Space shows the opener line)
- *A. 31Q Decoded:* 1 "3" band → 2 "1" band → 3 "Q" band → 4 big 31Q → 5 / 6 / 7 forecast ladder → 8 suppliers-inside-the-plan callout.
- *B. Why Forecast a Pull Chain?:* 1 chain → 2 Forecast ON → 3 Forecast OFF → 4 result tiles (10 days, 36, 99.8%).
- *C. RKFL Does the Purchasing:* 1 to 5 the five spokes → 6 systems strip → 7 trust chip.
- Question: what does Q stand for and how far ahead is the rolling forecast? **Quarterly; 3 months**

**Tab 5: Arrival at the DC** (first Space shows the opener line)
- *A. Hub and Spoke (West & South):* 1 hubs → 2 spokes → 3 trucks flow → 4 bypass lines and banner.
- *B. National View (as of 2013):* 1 Noida, 2 Mumbai (primary, company-owned), 3 Bengaluru, 4 Kolkata (secondary, leased).
- *C. Four Ways:* 1 to 4 flip each card → 5 fill-rate bar fills to 99.8%.
- Question: which two DCs are primary, and which two items skip the DC? **Noida and Mumbai; buns and Coca-Cola**

**Tab 6: Store Ordering Mechanics** (first Space shows the opener line; the screen is a mock ordering website)
- 1 Nightly stock count → 2 The suggestion (2 cases) → 3 The concert the system cannot see (press `↑`/`↓` to override; cut-off about 12 PM) → 4 Buffer stock → 5 Shortage drill (cheese paused; oil-filter powder) → 6 Late truck.
- Question: what should the manager do about the concert, and what is the cut-off? **Override and order more (e.g. 3 cases); about 12 PM**

**Tab 7: RKFL's Distribution Engine**
- *A. Bullwhip: PUSH* and *B. Bullwhip: PULL* (switch with `M`): 1 chain → 2 customer demand wobbles → 3 caption and remedies → 4 result tiles.
- *C. Inside the Engine:* 1 to 6 the six RKFL facts → 7 technology flow → 8 exceptions strip.
- Question: what must happen before a supplier starts production? **The restaurant places an order (restaurant → DC → supplier → production)**

**Tab 8: The Delivery Leg**
- *A. Pack the Van:* drag each item into its zone (or Space auto-packs the next one). Click a door to open one zone and frost the others.
- *B. One Van, Three Stores:* 1 one van per store (3 vans) → 2 route-based (1 van) → 3 outstation → 4 return trip → 5 tonight's delivery on time → 6 tonight's delivery delayed.
- *C. Shelf Life:* 1 Milk, 2 Buns, 3 Vegetables, 4 Frozen/chilled, 5 General pattern → 6 "Shorter shelf life = more frequent delivery".
- Question: why buns 4 days a week but frozen 2? **Shelf life (about 3 days vs much longer)**

**Tab 9: Store Receiving and Storage**
- *A. Night Shift, QIP and Pyrometer:* for each box: Space = box arrives and the needle reads; then click **Accept** or **Return to DC** (or Space to take the correct call). Last Space = the five-checkpoint recap.
- *B. CFD Shelves, FIFO and Waste:* 1 shelves → 2 "Which one goes out first?" → 3 earliest glows → 4 nightly count loop → 5 Raw Waste bin (Space drops one; drag more) → 6 reverse-flow strip.
- *C. Turn 36:* 1 ring spins to 36 → 2 365 ÷ 36 ≈ 10 days → 3 SKU explosion → 4 closing line.
- Question: what does an inventory turn of 36 mean, and what is the max inventory? **Used and replaced about 36 times a year; max 10 days**

**Tab 10: Kitchen to Customer** (no question)
- 1 to 9 the order ticket visits each segment → 10 McDelivery scooter and closing line → 11 chain scorecard → 12 final team scores → 13 winner (or tie) with confetti → 14 "Thank you. Questions?"

## Changing the content

Open `index.html` in any text editor, or edit the files in `src/` and run `node build.js` to rebuild. All editable content is in **`src/config.js`** (it is also the first block inside `index.html`):

| To change… | Edit this object |
|---|---|
| Speaker names, titles, one-line definitions | `SEGMENTS` |
| The questions and answers | `QUESTIONS` |
| Team names | `TEAMS` |
| Tab 1 supplier pins and map positions | `SUPPLIERS`, `LOCAL_PINS`, `ONE_SUPPLIER` |
| Tab 2 gates, nugget stages, scenarios | `GATES`, `HACCP_STAGES`, `HACCP_PRINCIPLES`, `SCENARIOS` |
| Tab 3 KPIs and outsourcing list | `KPIS`, `OUTSOURCE`, `NETWORK` |
| Tab 6 numbers (₹5 lakh, 2 cases, 3 cases, 12 PM) | `STORE_SCENARIO` |
| Tab 8 van items and zones, weekly schedule | `VAN_ITEMS`, `ZONES`, `SHELF_LIFE` |
| Tab 9 delivery boxes and shelves | `QIP_BOXES`, `SHELVES` |
| Concept chips (`C` key) | `CONCEPTS` |
| Tab 10 journey lines | `JOURNEY` |

## Notes

- Figures that describe the network in 2013 carry an "as of 2013" badge.
- KPI gauges, the bullwhip swings, the van counts and the oil-cost counter are labelled "illustrative".
- If a tab ever fails to draw, it falls back to a clean card with the title and key numbers, and the Question Break still works.
- Tab 5 has three modes (West & South, National view, Four Ways) and Tab 7 treats PUSH and PULL as two modes, so `M` is the one key that toggles them.
- Developer tests (Playwright) are in `tests/`.
