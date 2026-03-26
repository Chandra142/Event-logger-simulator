export function updateRiskGauge(dom, score, activeThreats) {
  dom.threatMeter.style.setProperty('--val', score);
  dom.meterValue.textContent = score;

  let color = "#10b981"; // emerald
  let statusText = "Normal";
  let badgeColor = "text-emerald-400";
  let badgeBg = "border-slate-700/50 bg-slate-800/40";
  
  if (score >= 75) {
    color = "#ef4444"; // red
    statusText = "Critical Risk";
    badgeColor = "text-red-400 blink-critical";
    badgeBg = "border-red-500/50 bg-red-500/10 glow-border-critical";
  } else if (score >= 50) {
    color = "#f59e0b"; // amber
    statusText = "Elevated";
    badgeColor = "text-amber-400";
    badgeBg = "border-amber-500/50 bg-amber-500/10 glow-border-warning";
  }

  dom.threatMeter.style.setProperty('--bg-color', color);
  dom.threatBadge.textContent = statusText;
  dom.threatBadge.className = `text-[1.05rem] font-bold tracking-wider uppercase ${badgeColor}`;
  dom.threatBadgePanel.className = `w-full rounded-xl p-4 border flex flex-col items-center gap-1.5 z-10 transition-colors ${badgeBg}`;
}

export function generateEventRow(payload, timeStr, threatLevel) {
  const logEntry = document.createElement("div");
  logEntry.className = `font-mono text-xs px-3 py-2 border-l-2 rounded-r-md event-enter-active hover:bg-slate-800/80 transition-colors ${threatLevel.bgClass}`;
  logEntry.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="text-slate-500 shrink-0">[${timeStr}]</span>
      <span class="font-bold ${threatLevel.colorClass} shrink-0 w-20">[${threatLevel.label}]</span>
      <span class="text-slate-300 break-words flex-1">${payload.securityEvent}</span>
      <span class="text-slate-500 shrink-0 hidden sm:block">CPU: ${payload.cpuUsage}</span>
    </div>
  `;
  return logEntry;
}
