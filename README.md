# 🛡️ Real-Time SOC Operations Dashboard

[![Status](https://img.shields.io/badge/Status-Live-emerald.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Modular_ESM-blue.svg)]()
[![License](https://img.shields.io/badge/License-ISC-rose.svg)]()

A high-performance, production-grade **Security Operations Center (SOC)** simulator. This project combines real-world system telemetry with an intelligent simulation engine to provide a cinematic dashboard for monitoring security anomalies, brute-force attacks, and network drift.

---

## 🚀 Key Innovations

### 1. 🧠 Intelligent Anomaly Detection
The dashboard doesn't just display logs; it analyzes them. Using a logical heuristic layer, it can detect coordinated patterns:
- **Brute Force Detection:** Identifies rapid failed login attempts across the telemetry stream.
- **Attack Spikes:** Flags sudden surges in critical events correlated with high system load.
- **AI Insights:** Provides a dynamic insight panel that translates raw data into human-readable security conclusions.

### 2. 📊 Dynamic Risk Scoring
Features a real-time risk evaluation engine that calculates a global risk score based on:
- **Event Density:** Number of recent alerts in a sliding 60-second window.
- **Severity Weighting:** Different weights for `CRITICAL`, `WARNING`, and `INFO` events.
- **Auto-Escalation:** The dashboard visualizes risk through a central "Glow-Gauge" that shifts from **Emerald (Normal)** to **Amber (Elevated)** to **Red (Critical Attack)**.

### 3. 🏗️ Modular SOC Architecture
Built using a professional "Service-Hook-Component" architecture natively in JavaScript (ES Modules):
- **Services:** Real-time event streaming and socket management.
- **Hooks:** State-driven logic for risk tracking and scoring contexts.
- **Utils:** Isolated threat analysis and AI detection algorithms.
- **Components:** High-performance UI renderers for gauges and feed logs.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, WebSocket (`ws`), `systeminformation`
- **Frontend:** Vanilla JavaScript (ES Modules), Tailwind CSS, Lucide Icons, Inter Typeface
- **Design:** Dark-mode Glassmorphism with Glowing Accents

---

## 📁 Project Structure
```text
Event-logger-main/
├── scc/
│   ├── index.html          # Main Dashboard Entry (The App Shell)
│   ├── script.js           # Main Controller (Orchestrates Services/Hooks)
│   ├── components/         # High-fidelity UI Rendering logic
│   ├── services/           # Event Stream & Backend Connection handlers
│   ├── hooks/              # State Management for Risk & Chronology
│   ├── utils/              # The "Brain" (AI Logic & Anomaly detection)
│   ├── data/               # Scenario Definitions & Threat Catalog
│   └── event-logger/       # Node.js Telemetry Server
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### 1. Start the Telemetry Server
The backend samples live system data (CPU/Memory) and broadcasts it.
```bash
cd scc/event-logger
npm install
node server.js
```
The server will start at `http://localhost:4000`.

### 2. Launch the Dashboard
Serve the `scc` directory using any static server (like VS Code **Live Server** or Python's `http.server`).
```bash
# Example using Python
cd scc
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

---

## 💡 How to Demo
1. **Live Feed:** Watch real-time system vitals stream in from your local machine.
2. **Chaos Drill:** Use the **Simulate Burst** button to inject an orchestrated attack sequence.
3. **AI Observation:** Watch the **AI Insight** chip and **Global Risk Gauge** respond to the attack density in real-time.

---

## 🛡️ License
This project is licensed under the ISC License.
