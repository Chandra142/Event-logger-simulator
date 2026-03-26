export function evaluateThreatScore(eventText, cpuValue, catalog) {
  const lower = eventText.toLowerCase();
  const scenario = catalog.find(item => item.keywords.some(k => lower.includes(k)));
  const base = scenario?.severity || 20;
  const computed = base + (cpuValue * 0.2);
  const score = Math.min(100, Math.round(computed));
  
  let label = "INFO";
  let colorClass = "text-sky-400";
  let bgClass = "bg-sky-500/10 border-sky-500/20";
  
  if (score >= 75) {
    label = "CRITICAL";
    colorClass = "text-red-400";
    bgClass = "bg-red-500/10 border-red-500/30";
  } else if (score >= 50) {
    label = "WARNING";
    colorClass = "text-amber-400";
    bgClass = "bg-amber-500/10 border-amber-500/30";
  } else {
    label = "INFO";
    colorClass = "text-emerald-400";
    bgClass = "bg-emerald-500/10 border-emerald-500/20";
  }

  return { score, label, colorClass, bgClass };
}

export function generateAIInsight(threatStatus) {
  const { score, recentCriticals, highLoad } = threatStatus;
  
  if (recentCriticals > 3) return "Possible brute-force or coordinated attack detected.";
  if (highLoad && recentCriticals > 0) return "High load anomaly correlates with critical behavior.";
  if (score > 85) return "Attack spike detected across monitoring vectors.";
  if (score > 60) return "Suspicious behavior matching historical threat signatures.";
  
  return "Telemetry stream nominal. No anomalies detected.";
}
