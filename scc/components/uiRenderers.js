let cpuChart = null;
let memChart = null;

export function initCharts(Chart) {
  const chartConfig = (color) => ({
    type: 'line',
    data: {
      labels: Array(20).fill(''),
      datasets: [{
        data: Array(20).fill(0),
        borderColor: color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: color.replace('1)', '0.1)')
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false, min: 0, max: 100 }
      },
      animation: { duration: 400 }
    }
  });

  cpuChart = new Chart(document.getElementById('cpuChart'), chartConfig('rgba(59, 130, 246, 1)'));
  memChart = new Chart(document.getElementById('memChart'), chartConfig('rgba(245, 158, 11, 1)'));
}

export function updateCharts(cpu, mem) {
  if (!cpuChart || !memChart) return;
  
  [cpuChart, memChart].forEach((chart, i) => {
    const val = i === 0 ? cpu : (mem / 8000) * 100;
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(val);
    chart.update('none');
  });
}

export function updateRiskGauge(dom, score, activeThreats) {
  dom.threatMeter.style.setProperty('--val', score);
  dom.meterValue.textContent = score;

  let color = "#10b981"; // emerald
  let statusText = "Normal";
  let badgeClasses = "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
  
  if (score >= 80) {
    color = "#ef4444"; 
    statusText = "Critical";
    badgeClasses = "border-red-500/50 bg-red-500/10 text-red-500 blink-critical";
  } else if (score >= 50) {
    color = "#f59e0b"; 
    statusText = "Elevated";
    badgeClasses = "border-amber-500/30 bg-amber-500/10 text-amber-500";
  }

  dom.threatMeter.style.setProperty('--bg-color', color);
  dom.threatBadge.textContent = statusText;
  dom.threatBadge.className = `text-lg font-black uppercase tracking-widest ${badgeClasses.split(' ').pop()}`;
  dom.threatBadgePanel.className = `w-full py-4 rounded-xl border flex flex-col items-center transition-all ${badgeClasses}`;
  
  const topText = document.getElementById("topStatusText");
  topText.textContent = statusText.toUpperCase();
  topText.className = score >= 80 ? 'text-red-500' : (score >= 50 ? 'text-amber-500' : 'text-emerald-400');
}

export function generateEventRow(payload, timeStr, threatLevel) {
  const logEntry = document.createElement("div");
  logEntry.className = `event-row font-mono text-[11px] px-4 py-2.5 border-l-2 flex items-center gap-4 transition-all hover:bg-white/5 ${threatLevel.bgClass}`;
  logEntry.innerHTML = `
    <span class="text-slate-600 shrink-0 select-none">${timeStr}</span>
    <span class="font-bold ${threatLevel.colorClass} shrink-0 w-16">[${threatLevel.label}]</span>
    <span class="text-slate-300 flex-1 truncate">${payload.securityEvent}</span>
    <div class="flex items-center gap-3 shrink-0">
      <span class="text-[10px] text-slate-500">CPU: ${payload.cpuUsage}</span>
    </div>
  `;
  return logEntry;
}
