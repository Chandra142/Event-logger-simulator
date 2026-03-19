# Real-Time OS Security Event Logger

## Overview
This project is a small but expressive security-operations-center (SOC) simulator. A Node.js/Express server streams synthetic system telemetry (CPU load, memory availability, platform metadata, and curated security events) to a cinematic WebSocket dashboard. The front-end fuses those signals into threat meters, timeline cards, and manual "chaos drill" controls so engineers can demonstrate monitoring concepts without touching production infrastructure.

## Feature Highlights
- **Continuous Telemetry Stream** – `systeminformation` samples CPU and memory every 3 seconds and delivers JSON payloads over native WebSockets.
- **Immersive Dashboard** – Tailwind-styled interface with stat tiles, live event feed, threat meter, pulse timeline, and animated scenario chips.
- **Scenario Console** – Trigger single spikes or multi-event bursts that enrich the narrative with credential storms, insider drift, and policy lockdowns.
- **Adaptive Threat Scoring** – Client computes a composite severity score ($\text{score} = \text{base severity} + 0.55 \times \text{CPU}$) to animate the radial gauge and shield-integrity readout.
- **Resilient WS Handling** – Automatic reconnection logic updates connection badges so demonstrations keep running even after network hiccups.

## Tech Stack
- **Server:** Node.js, Express, WebSocket (`ws`), `systeminformation`
- **Client:** Vanilla JavaScript, Tailwind CSS CDN, Space Grotesk typeface
- **Transport:** Native WebSockets (no Socket.IO dependency)

## Getting Started
1. **Install dependencies**
	```bash
	cd scc/event-logger
	npm install
	```
2. **Run the telemetry server**
	```bash
	node server.js
	```
	- The server defaults to `http://localhost:4000`. Override by setting `PORT`.
3. **View the dashboard**
	- Navigate to `http://localhost:4000` in your browser.
	- Keep the terminal open so the WebSocket stream stays active.

## Project Structure
```
Event-logger-main/
├─ README.md
└─ scc/
	├─ index.html          # Cinematic dashboard
	├─ script.js           # WebSocket + simulator logic
	└─ event-logger/
		├─ server.js       # Express + WS stream
		└─ package.json
```

## Usage Notes
- The front-end displays "Linking to telemetry..." until the browser establishes a WebSocket connection. Ensure the Node process is running locally or exposed via tunneling.
- Use **Simulate Spike** for a single manual injection or **Launch Burst** for a rapid sequence that stresses the feed, threat meter, and timeline widgets.
- Scenario chips light up automatically as incoming event text matches their keyword set.
- For demos on locked-down ports, export `PORT=80` (or similar) before launching the server and update any reverse-proxy rules accordingly.

## Roadmap Ideas
- Add persistence so the last N events survive a browser refresh.
- Persist manual drill presets server-side for collaborative rehearsals.
- Introduce authentication + API keys when exposing telemetry beyond localhost.

## License
This repository uses the ISC license as defined in `package.json`.