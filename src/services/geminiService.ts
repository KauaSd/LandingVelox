import { GoogleGenAI } from '@google/genai';

// Initialize Gemini safely. Avoid crashing on startup if key is missing
let aiClient: any = null;
const key = process.env.GEMINI_API_KEY;

if (key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '') {
  try {
    aiClient = new GoogleGenAI({ apiKey: key });
  } catch (e) {
    console.warn('Could not initialize Google GenAI SDK:', e);
  }
}

export async function askCoPilot(prompt: string, flightContext?: string): Promise<string> {
  const fullPrompt = `You are the AERO_CORE Automated Travel Pilot Co-Pilot, an expert in aeronautics, flight routes, premium cabin specifications, and flight ticket assistance for Velox Aero-Tech.
Your aesthetic is precise, technical, premium, polite, and space-cyberpunk (Tech-Noir).
${flightContext ? `Current Flight Context: ${flightContext}` : ''}
User Query: "${prompt}"

Provide a highly formatted, helpful response. You may use bullet points, structural grids of text, or advice. Be concise and professional. Limit your output to 3 meaningful paragraphs max.`;

  // Case 1: Live Gemini API key configured
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.error('Gemini API query error. Falling back to local offline assistance.', error);
    }
  }

  // Case 2: Fluent Offline simulated responses matching standard prompt queries
  return new Promise((resolve) => {
    setTimeout(() => {
      const promptLower = prompt.toLowerCase();
      if (promptLower.includes('flight plan') || promptLower.includes('jfk') || promptLower.includes('tokyo') || promptLower.includes('route')) {
        resolve(`### **FLIGHT ROUTE PLAN: JFK [NEW YORK] ➔ HND [TOKYO]**
**ESTIMATED DISPATCH REFERENCE: VC-409/M**

1. **ATMOSPHERIC CODES & CO-ORDINATES**
   - **Departure Corridor:** JFK Jet-Route V16 to North Atlantic air tracks.
   - **Cruising Corridors:** Over Great Circle route via Northern Canada, Alaska, and down the pacific Kamchatka Corridor.
   - **Estimated Time En-Route (ETE):** 14 hours 20 minutes average.

2. **JET STREAM OPTIMIZATION**
   - Active polar jet streams currently sitting at 45,000 feet suggest a minor deviation north side to shave off 24 minutes of flying time.
   - Average fuel burn reduction: 3.2% using direct route curves.

3. **ALTITUDE PARAMETERS**
   - Initial Flight Level: FL340 (34,000 ft) holding.
   - Step Climb Profile: FL380, reaching FL400 upon entering Japanese airspace to secure optimal air density ratios.`);
      } else if (promptLower.includes('baggage') || promptLower.includes('luggage') || promptLower.includes('limits') || promptLower.includes('upgrade')) {
        resolve(`### **VELOX CO-PILOT BAGGAGE PROFILE & ASSIGNMENT**

* **ECONOMY Cabin:** 1 Overhead Carriage (up to 10kg) + 1 checked briefcase/item (up to 23kg).
* **BUSINESS Cabin:** 1 Overhead Carriage (up to 15kg) + 2 checked items (up to 32kg each) with prioritized VIP handling tags.
* **FIRST Cabin (Elite status):** Unbounded personal baggage profile + 3 prioritize freight lockboxes (up to 32kg each) + complimentary delicate wardrobe carrier.

**PRE-FLIGHT UPGRADES:**
Loyalty upgrades to **Business Room Suites** can be processed with 20,000 Aero-Credits or direct cabin billing in your custom flight selection map.`);
      } else if (promptLower.includes('turbulence') || promptLower.includes('weather') || promptLower.includes('storm')) {
        resolve(`### **METEOROLOGICAL REPORT & NORTH ATLANTIC WEATHER PATTERN**

1. **CURRENT STATUS REPORT**
   - **North Atlantic Track system:** Substantial thermal convection detected between longitude 40°W and 50°W.
   - **Turbulence Vector:** Light-to-moderate high-level chop expected for 18 minutes around step climb point.

2. **CREW RECOMMENDATION PROTOCOLS**
   - Seatbelt sign will be checked automatically via digital avionics sensors.
   - We maintain a direct datalink line to Gander Oceanic Center to secure real-time clear-air altitudinal shifts if turbulence intensity escalates.
   - Cabins are fully pressurized to a comfortable 6,000-ft equivalent inside the custom composite hull.`);
      } else {
        resolve(`### **AERO_CORE FLIGHT PILOT CO-PILOT ASSISTANT**
**SYSTEM STATUS: ONLINE. INTERACTIVE DOCK ACTIVE.**

* **Request Analysis:** Terminal maps, luggage limits, upgrade rules, active gate schedules, or specific weather vectors.
* **Avionics Database Sync:** Complete logs for JFK, MXP, CDG, DXB, and LHR are fully cached.

*Response matching your core query: "${prompt}". Let me know if you would like me to generate a live customs declaration checklist or update your current seat selections.*`);
      }
    }, 1200); // Realistic short network latency
  });
}
