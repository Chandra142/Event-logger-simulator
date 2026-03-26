import { scenarioCatalog, generateRandomEvent, manualTemplates } from './data/mockData.js';
import { evaluateThreatScore, generateAIInsight } from './utils/analyzeThreats.js';
import { updateRiskGauge, generateEventRow } from './components/uiRenderers.js';
import { createEventStream } from './services/eventStream.js';
import { useRiskContext } from './hooks/useRiskContext.js';

const elements = {
  topStatusText: document.getElementById("topStatusText"),
  topStatusDot: document.getElementById("topStatusDot"),
  clock: document.getElementById("clock"),
  eventFeed: document.getElementById("eventFeed"),
  eventCount: document.getElementById("eventCount"),
  cpuValue: document.getElementById("cpuValue"),
  cpuBar: document.getElementById("cpuBar"),
  memoryValue: document.getElementById("memoryValue"),
  memBar: document.getElementById("memBar"),
  threatMeter: document.getElementById("threatMeter"),
  meterValue: document.getElementById("meterValue"),
  threatBadge: document.getElementById("threatBadge"),
  threatBadgePanel: document.getElementById("threatBadgePanel"),
  activeThreatsCount: document.getElementById("activeThreatsCount"),
  timeline: document.getElementById("timeline"),
  simulateBtn: document.getElementById("simulateBtn"),
  burstBtn: document.getElementById("burstBtn"),
  manualStatus: document.getElementById("manualStatus")
};

let totalEvents = 0;
const riskContext = useRiskContext();

setInterval(() => {
  const now = new Date();
  elements.clock.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}, 1000);

function updateMeters(cpuNumeric, memNumeric) {
  elements.cpuValue.textContent = `${cpuNumeric.toFixed(1)}%`;
  elements.cpuBar.style.width = `${Math.min(100, cpuNumeric)}%`;
  elements.cpuBar.className = `h-1 transition-all duration-300 shadow-[0_0_10px_currentColor] ${cpuNumeric > 80 ? 'bg-red-500' : cpuNumeric > 50 ? 'bg-amber-500' : 'bg-blue-500'}`;
  
  elements.memoryValue.textContent = `${memNumeric.toFixed(0)} MB`;
  elements.memBar.style.width = `${Math.min(100, (memNumeric/8000)*100)}%`; // Fake 8GB scale
}

function processIncomingEvent(payload) {
  totalEvents++;
  elements.eventCount.textContent = totalEvents;
  
  const cpuNumeric = parseFloat(payload.cpuUsage.replace('%',''));
  const memNumeric = parseFloat(payload.freeMemory.replace(' MB',''));

  updateMeters(cpuNumeric, memNumeric);
  
  const threatLevel = evaluateThreatScore(payload.securityEvent, cpuNumeric, scenarioCatalog);
  const nowStr = new Date().toISOString();
  
  const ctxStatus = riskContext.addRiskEvent(threatLevel, nowStr);
  const aiInsightStr = generateAIInsight(ctxStatus);
  
  elements.activeThreatsCount.textContent = ctxStatus.criticals;
  updateRiskGauge(elements, ctxStatus.score, ctxStatus.criticals);
  
  const timeStr = nowStr.substring(11, 19);
  
  // Clear placeholder text
  if (totalEvents === 1) elements.eventFeed.innerHTML = "";
  
  // Update UI Elements
  const row = generateEventRow(payload, timeStr, threatLevel);
  elements.eventFeed.prepend(row);
  if (elements.eventFeed.children.length > 30) {
    elements.eventFeed.removeChild(elements.eventFeed.lastChild);
  }

  // Handle critical timeline
  if (threatLevel.label === 'CRITICAL') {
    const alertEntry = document.createElement("li");
    alertEntry.className = "text-xs px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-md text-slate-300 font-medium";
    alertEntry.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="text-red-400 font-bold">Severity: ${threatLevel.score}</span>
        <span class="text-slate-500">${timeStr}</span>
      </div>
      <p class="truncate">${payload.securityEvent}</p>
    `;
    
    if (elements.timeline.children[0]?.textContent.includes("No anomalous")) {
      elements.timeline.innerHTML = "";
    }
    
    elements.timeline.prepend(alertEntry);
    if (elements.timeline.children.length > 5) {
      elements.timeline.removeChild(elements.timeline.lastChild);
    }
  }

  // AI chip update
  let manualBlock = elements.manualStatus.parentElement.querySelector('#aiInsight');
  if (!manualBlock) {
    manualBlock = document.createElement("span");
    manualBlock.id = "aiInsight";
    elements.manualStatus.parentElement.appendChild(manualBlock);
  }
  
  if (ctxStatus.criticals > 3) {
    manualBlock.className = "text-xs text-amber-400 font-medium blink-critical ml-auto border border-amber-500/20 bg-amber-500/10 px-3 py-2 rounded-md";
    manualBlock.textContent = `AI: ${aiInsightStr}`;
  } else {
    manualBlock.className = "hidden";
  }
}

// Start Stream
const eventStream = createEventStream(processIncomingEvent, 1500, 3500);
eventStream.start();

// Controls
elements.simulateBtn.addEventListener('click', () => {
  const t = manualTemplates[Math.floor(Math.random() * manualTemplates.length)];
  const cpu = Math.min(99, t.baseSeverity + Math.random() * 15);
  const mem = 1024 + Math.random() * 4000;
  
  eventStream.inject({
    timestamp: new Date().toISOString(),
    operatingSystem: "Linux",
    cpuUsage: `${cpu.toFixed(1)}%`,
    freeMemory: `${mem.toFixed(0)} MB`,
    securityEvent: t.securityEvent
  });
  
  elements.manualStatus.textContent = "Event injected.";
  setTimeout(()=> elements.manualStatus.textContent="Console idle", 2000);
});

elements.burstBtn.addEventListener('click', () => {
  elements.manualStatus.textContent = "Injecting burst...";
  let count = 0;
  const iv = setInterval(() => {
    const t = manualTemplates[Math.floor(Math.random() * manualTemplates.length)];
    const cpu = Math.min(99, t.baseSeverity + Math.random() * 15);
    const mem = 1024 + Math.random() * 4000;
    
    eventStream.inject({
      timestamp: new Date().toISOString(),
      operatingSystem: "Linux",
      cpuUsage: `${cpu.toFixed(1)}%`,
      freeMemory: `${mem.toFixed(0)} MB`,
      securityEvent: t.securityEvent
    });
    
    count++;
    if (count > 4) {
      clearInterval(iv);
      elements.manualStatus.textContent = "Burst complete.";
      setTimeout(()=> elements.manualStatus.textContent="Console idle", 2000);
    }
  }, 250);
});
