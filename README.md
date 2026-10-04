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
| `1` to `4` | Pick an answer while a question is open |
| `C` | Show the Concept Link chips for this segment |
| `R` | Reset this tab (no on-screen button, key only) |
| `F` | Fullscreen on / off |
| `H` | Show / hide the presenter shortcut panel (hidden from the audience by default) |
| `↑` / `↓` | Tab 6 only: change the manager's override |

**Questions (Tabs 4, 5, 6, 7):** after the last step, the next `Space` opens a multiple-choice question. Click an option (or press `1` to `4`), `Space` (or the Show answer button) reveals the correct one in green, and `Space` again (or Continue) moves to the next tab. There are no teams or points.

**Mouse is needed in only a few places:** drag items in Tab 8 mode A (pack the van); click Accept / Return in Tab 9 mode B; click a gate in Tab 2 mode B. All of these also have a Space-only path.

## Presenter cheat sheet (what Space does, in order)

Questions appear in **Tabs 4, 5, 6 and 7 only** (multiple choice). In every other tab the last Space simply moves on to the next tab. Modes are switched with `M`, and each mode name is shown as a heading under the tab title.

**Tab 1: Farm to Factory**
- *A. Build the Burger Map:* 1 Buns, 2 Chicken patty, 3 Cheese, 4 Lettuce, 5 Onions, 6 Mayo, 7 Sesame (each drops a layer and pins the map) → 8 the rest of the menu pins → 9 Local pins (milk and buns). The supplier list scrolls if it gets long.
- *B. Tiers and Suppliers:* 1 Tier-2 (farmer) → 2 Tier-1 (delivery person) → 3 ring "14 of 40" and "80%" → 4 one product, one supplier tiles → 5 "Shortage!" (sugar sachets HELD) → 6 "40 suppliers" caption.

**Tab 2: Supplier Quality Gates** 
- *A. The Gate Run:* 1 HACCP, 2 SQMS, 3 DQMP, 4 Sensory (the crate moves through each gate; Sensory is last) → 5 crate reaches the distribution centre.
- *B. Which Gate?:* for each of 3 scenarios: Space shows it (click a gate or say it aloud), Space reveals the answer (the slide changes to a green answer state with the gate banner). 6 presses in total.

**Tab 3: The Outsourcing Philosophy**
- *A. What Gets Outsourced:* 1 Transportation, 2 Warehousing, 3 Purchasing and invoicing, 4 Supplying, 5 Quality audits → 6 "100% OUTSOURCED" stamp with 438 restaurants / 69 cities in West & South India (as of 31 March 2025) → 7 who is who.
- *B. Handshake vs Contract:* 1 contract → 2 handshake → 3 six KPI gauges.
- *C. Extended Enterprise:* 1 to 7 the seven nodes light up → 8 "what McDonald's keeps".

**Tab 4: Long-Range Forecasting** (first Space shows the opener line)
- *A. 31Q Decoded:* 1 "3" band → 2 "1" band → 3 "Q" band → 4 big 31Q → 5 / 6 / 7 forecast ladder → 8 suppliers-inside-the-plan callout.
- *B. Why Forecast a Pull Chain?:* 1 chain → 2 Forecast ON → 3 Forecast OFF → 4 result tiles (10 days, 36, 99.8%).
- *C. RKFL Does the Purchasing:* 1 to 5 the five spokes → 6 systems strip → 7 trust chip.
- **MCQ:** what does the Q in 31Q stand for, and how far ahead is the rolling forecast? **Quarterly monitoring; 3-month rolling forecast**

**Tab 5: Arrival at the DC** (first Space shows the opener line)
- *A. Hub and Spoke Map:* 1 hubs → 2 spokes → 3 trucks drive supplier → hub → restaurant (smooth, facing their direction) → 4 bypass lines and banner.
- *B. Four Ways to Keep Inbound Lead Time Short:* 1 to 4 flip each card → 5 fill-rate bar fills to 99.8%.
- **MCQ (based on Mode B):** which two items skip the distribution centre? **Buns and Coke**

**Tab 6: Store Ordering Mechanics** (first Space shows the opener line; the screen is a mock ordering website)
- 1 Nightly stock count → 2 The suggestion (2 cases) → 3 The concert the system cannot see (press `↑`/`↓` to override; cut-off about 12 PM) → 4 Buffer stock → 5 Shortage drill → 6 Late truck.
- **MCQ:** what should the manager do about the concert, and what is the cut-off? **Override and order more (e.g. 3 cases) before about 12 PM**

**Tab 7: RKFL's Distribution Engine** (one mode)
- 1 to 6 the six RKFL facts → 7 technology flow → 8 exceptions strip.
- **MCQ (based on this mode):** which description of RKFL is correct? **An independent logistics partner that manages all DCs and national truck movement**

**Tab 8: The Delivery Leg**
- *A. Pack the Van:* drag each item into its zone (or Space auto-packs the next one). Click a door to open one zone and frost the others.
- *B. One Van, Three Stores:* 1 one van per store (3 vans) → 2 route-based (1 van) → 3 outstation → 4 return trip → 5 tonight's delivery ON TIME (green) → 6 tonight's delivery DELAYED (the map turns red, the van is broken down).
- *C. Shelf Life:* 1 Milk, 2 Buns, 3 Vegetables, 4 Frozen/chilled, 5 General pattern → 6 "Shorter shelf life = more frequent delivery".

**Tab 9: Store Receiving and Storage**
- *A. Turn 36:* 1 ring spins to 36 → 2 365 ÷ 36 ≈ 10 days → 3 SKU explosion → 4 closing line.
- *B. Night Shift, QIP and Pyrometer:* for each box: Space = box arrives and the needle reads; then click **Accept** or **Return to DC** (or Space to take the correct call). Last Space = the checkpoint recap.

**Tab 10: Kitchen to Customer** (no question)
- 1 to 9 the order ticket visits each segment → 10 McDelivery scooter and closing line → 11 chain scorecard → 12 "Thank you. Questions?" with confetti

## Changing the content

Open `index.html` in any text editor, or edit the files in `src/` and run `node build.js` to rebuild. All editable content is in **`src/config.js`** (it is also the first block inside `index.html`):

| To change… | Edit this object |
|---|---|
| Speaker names and titles (the one-line definitions in `SEGMENTS` are no longer shown on screen) | `SEGMENTS` |
| The four multiple-choice questions, options and correct answer (`correct`: 0 = first option) | `QUESTIONS` |
| Tab 1 supplier pins and map positions | `SUPPLIERS`, `LOCAL_PINS`, `ONE_SUPPLIER` |
| Tab 2 gates and scenarios | `GATES`, `SCENARIOS` |
| Tab 3 KPIs and outsourcing list | `KPIS`, `OUTSOURCE`, `NETWORK` |
| Tab 6 numbers (₹5 lakh, 2 cases, 3 cases, 12 PM) | `STORE_SCENARIO` |
| Tab 8 van items and zones, weekly schedule | `VAN_ITEMS`, `ZONES`, `SHELF_LIFE` |
| Tab 9 delivery boxes | `QIP_BOXES` |
| Concept chips (`C` key) | `CONCEPTS` |
| Tab 10 journey lines | `JOURNEY` |

## Notes

- Figures that carry a date (Tab 3: 438 restaurants in 69 cities) show an "as of 31 March 2025" badge.
- KPI gauges, the van counts and the oil-cost counter are labelled "illustrative".
- If a tab ever fails to draw, it falls back to a clean card with the title and key numbers, and the Question Break still works.
- The audience-facing screen has no speaker names, team scores, timers, key hints or reset buttons; all of those keys still work (see the table above).
- Mode letters (A, B, C) are numbered automatically in the order the modes appear.
- Developer tests (Playwright) are in `tests/`.
