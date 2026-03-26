# Real-Time SOC Operations Dashboard

## Overview
A production-grade, modular Security Operations Center (SOC) dashboard. This project simulates real-time system telemetry and security anomalies using a modern, decoupled architecture. It provides intelligent threat detection simulation, dynamic risk scoring, and AI-driven insights to demonstrate modern cybersecurity monitoring patterns.

## Feature Highlights
- **Modular SOC Architecture** - Clean separation of concerns with dedicated layers for `services`, `hooks`, `utils`, and `components`.
- **Intelligent Threat Simulation** - Automated 1-3s event streaming simulating brute-force, lateral movement, and data exfiltration.
- **Dynamic Risk Scoring** - Real-time calculation based on event density, severity (Critical/Warning/Info), and system load over a rolling 60-second window.
- **AI Anomaly Detection Layer** - Logical heuristics that detect patterns like "Attack Spikes" or "Credential Storms" and provide contextual AI insights.
- **Interactive Console** - Manual injection and burst triggers to test dashboard response and alert tracking.
- **High-End UI/UX** - Dark-mode glassmorphism, glowing accents, real-time gauges, and trend sparklines.

## Tech Stack
- **Backend:** Node.js, Express, WebSocket (`ws`), `systeminformation`
- **Frontend:** Vanilla JavaScript (ES Modules), Tailwind CSS, Lucide Icons, Inter Typeface
- **Architecture:** Decoupled Modular Design (Service-Hook-Component pattern)

## Project Structure
```
Event-logger-main/
├── scc/
│   ├── index.html          # Main Dashboard Entry
│   ├── script.js           # Main Controller (ES Module)
│   ├── components/         # UI Renderers and Gauges
│   ├── services/           # Event Streaming & Logic
│   ├── hooks/              # State & Risk Context Management
│   ├── utils/              # Threat Analysis & AI Logic
│   ├── data/               # Scenario & Mock Data
│   └── event-logger/       # Node.js Telemetry Server
└── README.md
```

## Getting Started

### 1. Start the Telemetry Server
```bash
cd scc/event-logger
npm install
node server.js
```
The server runs at `http://localhost:4000`.

### 2. View the Dashboard
Simply serve the `scc` directory using any static server (e.g., Live Server in VS Code or `python -m http.server`).
Navigate to the hosted URL (e.g., `http://localhost:8080`).

## Usage
- **Live Stream:** The dashboard automatically connects to the local telemetry server if available, otherwise it falls back to the internal high-fidelity simulation.
- **Threat Console:** Use "Inject Single Event" or "Trigger Breach Burst" to manually stress the AI detection engine.
- **Risk Gauge:** Watch the central gauge shift color (Green → Amber → Red) as threat density increases.

## License
ISC License.
