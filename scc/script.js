import { scenarioCatalog, generateRandomEvent, manualTemplates } from './data/mockData.js';
import { evaluateThreatScore, generateAIInsight } from './utils/analyzeThreats.js';
import { updateRiskGauge, generateEventRow, initCharts, updateCharts } from './components/uiRenderers.js';
import { createEventStream } from './services/eventStream.js';
import { useRiskContext } from './hooks/useRiskContext.js';

const elements = {
  topStatusText: document.getElementById("topStatusText"),
  clock: document.getElementById("clock"),
  eventFeed: document.getElementById("eventFeed"),
  eventCount: document.getElementById("eventCount"),
  cpuValue: document.getElementById("cpuValue"),
  memoryValue: document.getElementById("memoryValue"),
  threatMeter: document.getElementById("threatMeter"),
  meterValue: document.getElementById("meterValue"),
  threatBadge: document.getElementById("threatBadge"),
  threatBadgePanel: document.getElementById("threatBadgePanel"),
  activeThreatsCount: document.getElementById("activeThreatsCount"),
  timeline: document.getElementById("timeline"),
  aiInsightText: document.getElementById("aiInsightText"),
  simulateBtn: document.getElementById("simulateBtn"),
  burstBtn: document.getElementById("burstBtn")
};

let totalEvents = 0;
const riskContext = useRiskContext();

// Initialize Charts
initCharts(window.Chart);

// Clock update
setInterval(() => {
  const now = new Date();
  elements.clock.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}, 1000);

function processIncomingEvent(payload) {
  totalEvents++;
  elements.eventCount.textContent = totalEvents.toLocaleString();
  
  const cpuNumeric = parseFloat(payload.cpuUsage.replace('%',''));
  const memNumeric = parseFloat(payload.freeMemory.replace(' MB',''));

  // Update Metrics & Charts
  elements.cpuValue.textContent = payload.cpuUsage;
  elements.memoryValue.textContent = payload.freeMemory;
  updateCharts(cpuNumeric, memNumeric);
  
  // Threat Analysis
  const threatLevel = evaluateThreatScore(payload.securityEvent, cpuNumeric, scenarioCatalog);
  const nowStr = new Date().toISOString();
  const ctxStatus = riskContext.addRiskEvent(threatLevel, nowStr);
  
  // AI Insights
  elements.aiInsightText.textContent = generateAIInsight(ctxStatus);
  
  // Risk Dashboard
  elements.activeThreatsCount.textContent = ctxStatus.criticals;
  updateRiskGauge(elements, ctxStatus.score, ctxStatus.criticals);
  
  const timeStr = nowStr.substring(11, 19);
  
  // Feed Management (Limit to 10 items)
  if (totalEvents === 1) elements.eventFeed.innerHTML = "";
  
  const row = generateEventRow(payload, timeStr, threatLevel);
  elements.eventFeed.appendChild(row);
  
  // Limit to 10 items
  if (elements.eventFeed.children.length > 10) {
    elements.eventFeed.removeChild(elements.eventFeed.firstChild);
  }
  
  // Auto-scroll
  elements.eventFeed.scrollTop = elements.eventFeed.scrollHeight;

  // Handle critical timeline (Limit to 5)
  if (threatLevel.label === 'CRITICAL') {
    const alertEntry = document.createElement("div");
    alertEntry.className = "p-2 border border-red-500/20 bg-red-400/5 rounded text-slate-400";
    alertEntry.innerHTML = `
      <div class="flex justify-between mb-0.5">
        <span class="text-red-500 font-bold uppercase">CRITICAL</span>
        <span class="text-slate-600">${timeStr}</span>
      </div>
      <div class="truncate">${payload.securityEvent}</div>
    `;
    
    if (elements.timeline.querySelector('.italic')) {
      elements.timeline.innerHTML = "";
    }
    
    elements.timeline.prepend(alertEntry);
    if (elements.timeline.children.length > 5) {
      elements.timeline.removeChild(elements.timeline.lastChild);
    }
  }
}

// Start Real-Time Stream (1-3 seconds interval)
const eventStream = createEventStream(processIncomingEvent, 1000, 3000);
eventStream.start();

// Manual Simulation Controls
elements.simulateBtn.addEventListener('click', () => {
  const t = manualTemplates[Math.floor(Math.random() * manualTemplates.length)];
  const cpu = Math.min(99, 20 + Math.random() * 60);
  const mem = 4000 + Math.random() * 3000;
  
  eventStream.inject({
    timestamp: new Date().toISOString(),
    operatingSystem: "Linux",
    cpuUsage: `${cpu.toFixed(1)}%`,
    freeMemory: `${mem.toFixed(0)} MB`,
    securityEvent: t.securityEvent
  });
});

elements.burstBtn.addEventListener('click', () => {
  let count = 0;
  const iv = setInterval(() => {
    const t = manualTemplates[Math.floor(Math.random() * (manualTemplates.length / 2))]; // Prefer nasty ones
    const cpu = 85 + Math.random() * 10;
    const mem = 7000 + Math.random() * 500;
    
    eventStream.inject({
      timestamp: new Date().toISOString(),
      operatingSystem: "Linux",
      cpuUsage: `${cpu.toFixed(1)}%`,
      freeMemory: `${mem.toFixed(0)} MB`,
      securityEvent: t.securityEvent
    });
    
    count++;
    if (count > 6) clearInterval(iv);
  }, 200);
});
