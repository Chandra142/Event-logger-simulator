const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const socketUrl = `${wsProtocol}://${window.location.host}`;

const elements = {
  eventFeed: document.getElementById("eventFeed"),
  connectionStatus: document.getElementById("connectionStatus"),
  connectionPulse: document.getElementById("connectionPulse"),
  eventCount: document.getElementById("eventCount"),
  cpuValue: document.getElementById("cpuValue"),
  cpuBar: document.getElementById("cpuBar"),
  memoryValue: document.getElementById("memoryValue"),
  memoryBar: document.getElementById("memoryBar"),
  osValue: document.getElementById("osValue"),
  threatBadge: document.getElementById("threatBadge"),
  threatMeter: document.getElementById("threatMeter"),
  meterValue: document.getElementById("meterValue"),
  shieldValue: document.getElementById("shieldValue"),
  timeline: document.getElementById("timeline"),
  simulateBtn: document.getElementById("simulateBtn"),
  burstBtn: document.getElementById("burstBtn"),
  manualStatus: document.getElementById("manualStatus"),
  scenarioChips: document.querySelectorAll('[data-scenario]')
};

const connectionThemes = {
  connecting: { text: "text-amber-200", dot: "bg-amber-200" },
  live: { text: "text-emerald-300", dot: "bg-emerald-300" },
  error: { text: "text-rose-300", dot: "bg-rose-400" }
};

const scenarioCatalog = [
  { id: "login", keywords: ["login", "credential", "session"], severity: 42 },
  { id: "policy", keywords: ["policy", "lockdown", "security"], severity: 55 },
  { id: "insider", keywords: ["insider", "drift", "new session"], severity: 48 },
  { id: "network", keywords: ["network", "sweep", "beacon", "lateral"], severity: 65 },
  { id: "breach", keywords: ["unauthorized", "error", "failed"], severity: 78 }
];

const manualTemplates = [
  {
    scenario: "network",
    securityEvent: "🌐 East-west lateral sweep detected",
    baseSeverity: 72
  },
  {
    scenario: "policy",
    securityEvent: "🔐 Zero-trust policy escalation triggered",
    baseSeverity: 58
  },
  {
    scenario: "insider",
    securityEvent: "🧬 Insider drift: anomalous data exfil sequence",
    baseSeverity: 67
  },
  {
    scenario: "login",
    securityEvent: "⚡ Credential storm detected across remote gateways",
    baseSeverity: 61
  },
  {
    scenario: "breach",
    securityEvent: "🛑 Beacon anomaly suggests command-and-control",
    baseSeverity: 84
  }
];

const state = {
  totalEvents: 0,
  lastOperatingSystem: "Windows",
  reconnectHandle: null,
  socket: null
};

function setConnectionState(themeKey, label) {
  const palette = connectionThemes[themeKey] || connectionThemes.connecting;
  elements.connectionStatus.textContent = label;
  elements.connectionStatus.className = `text-sm font-medium ${palette.text}`;
  elements.connectionPulse.className = `w-2 h-2 rounded-full ${palette.dot} animate-pulse`;
}

function connectSocket() {
  clearTimeout(state.reconnectHandle);
  state.socket?.close?.();
  setConnectionState("connecting", "Linking to telemetry...");

  try {
    state.socket = new WebSocket(socketUrl);
  } catch (error) {
    setConnectionState("error", "WebSocket unavailable");
    return;
  }

  state.socket.addEventListener("open", () => {
    setConnectionState("live", "Live telemetry locked");
  });

  state.socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    pushEvent(payload, "live");
  });

  state.socket.addEventListener("close", () => {
    setConnectionState("connecting", "Re-linking channel...");
    state.reconnectHandle = setTimeout(connectSocket, 2000);
  });

  state.socket.addEventListener("error", () => {
    setConnectionState("error", "Signal disrupted");
  });
}

function pushEvent(payload, source) {
  state.totalEvents += 1;
  elements.eventCount.textContent = state.totalEvents;
  renderEventCard(payload, source);
  updateStats(payload);
  const cpuValue = parseFloat(payload.cpuUsage);
  const threatScore = evaluateThreatScore(payload.securityEvent, cpuValue);
  updateThreatMeter(threatScore);
  appendTimeline(payload, source, threatScore);
  highlightScenario(payload.securityEvent);
}

function renderEventCard(payload, source) {
  if (!elements.eventFeed) return;

  const badgeClasses =
    source === "live"
      ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-200"
      : "bg-fuchsia-500/15 border border-fuchsia-400/40 text-fuchsia-200";

  const card = document.createElement("article");
  card.className = "feed-card p-4 pop-in";
  card.innerHTML = `
    <div class="flex items-center justify-between text-sm text-slate-300">
      <span>${payload.timestamp}</span>
      <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.3em] ${badgeClasses}">
        ${source === "live" ? "LIVE" : "SIM"}
      </span>
    </div>
    <p class="text-lg mt-2 text-white">${payload.securityEvent}</p>
    <div class="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-400">
      <span>OS<br><strong class="text-white">${payload.operatingSystem}</strong></span>
      <span>CPU<br><strong class="text-sky-300">${payload.cpuUsage}</strong></span>
      <span>Free<br><strong class="text-amber-200">${payload.freeMemory}</strong></span>
    </div>
  `;

  elements.eventFeed.querySelector("p")?.remove();
  elements.eventFeed.prepend(card);

  if (elements.eventFeed.children.length > 15) {
    elements.eventFeed.removeChild(elements.eventFeed.lastElementChild);
  }

  elements.eventFeed.scrollTop = 0;
}

function updateStats(payload) {
  const cpuNumeric = parseFloat(payload.cpuUsage) || 0;
  const memoryNumeric = parseFloat(payload.freeMemory) || 0;

  elements.cpuValue.textContent = payload.cpuUsage;
  elements.cpuBar.style.width = `${Math.min(100, Math.max(5, cpuNumeric))}%`;

  const normalizedMemory = Math.max(5, Math.min(100, 100 - (memoryNumeric / 16384) * 100));
  elements.memoryValue.textContent = payload.freeMemory;
  elements.memoryBar.style.width = `${normalizedMemory}%`;

  state.lastOperatingSystem = payload.operatingSystem || state.lastOperatingSystem;
  elements.osValue.textContent = state.lastOperatingSystem;
}

function evaluateThreatScore(eventText, cpuValue) {
  const lower = eventText.toLowerCase();
  const scenario = scenarioCatalog.find((item) =>
    item.keywords.some((keyword) => lower.includes(keyword))
  );
  const base = scenario?.severity ?? 32;
  const computed = base + cpuValue * 0.55;
  return Math.min(100, Math.round(computed));
}

function updateThreatMeter(score) {
  const clamped = Math.min(100, Math.max(0, score));
  elements.threatMeter.style.setProperty("--value", clamped);
  elements.meterValue.textContent = `${clamped}%`;
  const shield = Math.max(0, 100 - Math.round(clamped * 0.75));
  elements.shieldValue.textContent = `${shield}%`;

  let badge;
  if (clamped >= 75) {
    badge = {
      label: "Critical",
      classes: "bg-rose-500/20 border border-rose-400/40 text-rose-200"
    };
  } else if (clamped >= 50) {
    badge = {
      label: "Elevated",
      classes: "bg-amber-400/15 border border-amber-300/40 text-amber-200"
    };
  } else {
    badge = {
      label: "Stable",
      classes: "bg-emerald-500/15 border border-emerald-300/40 text-emerald-200"
    };
  }

  elements.threatBadge.textContent = badge.label;
  elements.threatBadge.className = `px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${badge.classes}`;
}

function appendTimeline(payload, source, score) {
  const descriptor = document.createElement("li");
  descriptor.className = "flex items-center justify-between gap-4 border-b border-white/10 pb-2 last:border-none";

  const statusClass = score >= 75 ? "text-rose-300" : score >= 50 ? "text-amber-300" : "text-emerald-300";
  descriptor.innerHTML = `
    <div>
      <p class="font-medium">${payload.securityEvent}</p>
      <span class="text-xs text-slate-500">${payload.timestamp} • ${source === "live" ? "Live feed" : "Manual sim"}</span>
    </div>
    <span class="${statusClass} font-semibold">${payload.cpuUsage}</span>
  `;

  elements.timeline.querySelector("li.text-slate-500")?.remove();
  elements.timeline.prepend(descriptor);
  while (elements.timeline.children.length > 6) {
    elements.timeline.removeChild(elements.timeline.lastElementChild);
  }
}

function highlightScenario(eventText) {
  const lower = eventText.toLowerCase();
  const scenario = scenarioCatalog.find((item) =>
    item.keywords.some((keyword) => lower.includes(keyword))
  );

  elements.scenarioChips.forEach((chip) => {
    chip.classList.toggle("active", scenario?.id === chip.dataset.scenario);
  });
}

function generateManualEvent() {
  const template = manualTemplates[Math.floor(Math.random() * manualTemplates.length)];
  const cpu = Math.min(99, template.baseSeverity + Math.random() * 15);
  const memory = (420 + Math.random() * 480).toFixed(2);

  return {
    timestamp: new Date().toLocaleString(),
    operatingSystem: state.lastOperatingSystem,
    cpuUsage: `${cpu.toFixed(2)}%`,
    freeMemory: `${memory} MB`,
    securityEvent: template.securityEvent
  };
}

function wireControls() {
  elements.simulateBtn?.addEventListener("click", () => {
    pushEvent(generateManualEvent(), "manual");
    elements.manualStatus.textContent = "Single spike injected.";
    elements.manualStatus.classList.add("text-fuchsia-200");
  });

  elements.burstBtn?.addEventListener("click", () => {
    elements.manualStatus.textContent = "Burst drill executing...";
    const wave = Array.from({ length: 4 });
    wave.forEach((_, index) => {
      setTimeout(() => {
        pushEvent(generateManualEvent(), "manual");
        if (index === wave.length - 1) {
          elements.manualStatus.textContent = "Burst completed.";
        }
      }, index * 450);
    });
  });
}

wireControls();
connectSocket();
