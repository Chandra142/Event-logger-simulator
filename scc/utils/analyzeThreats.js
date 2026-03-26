export function evaluateThreatScore(eventText, cpuValue, catalog) {
  const lower = eventText.toLowerCase();
  const scenario = catalog.find(item => item.keywords.some(k => lower.includes(k)));
  
  // Base severity from catalog or default
  const base = scenario?.severity || 20;
  
  // CPU usage influence (simulating system strain during attack)
  const cpuFactor = cpuValue > 80 ? 15 : (cpuValue > 50 ? 5 : 0);
  const computed = base + cpuFactor;
  
  const score = Math.min(100, Math.round(computed));
  
  let label = scenario?.label || "INFO";
  let colorClass = "text-sky-400";
  let bgClass = "bg-sky-500/10 border-sky-500/20";
  
  if (score >= 80 || label === "CRITICAL") {
    label = "CRITICAL";
    colorClass = "text-red-400";
    bgClass = "bg-red-500/10 border-red-500/30";
  } else if (score >= 50 || label === "WARNING") {
    label = "WARNING";
    colorClass = "text-amber-400";
    bgClass = "bg-amber-500/10 border-amber-500/30";
  } else {
    label = "INFO";
    colorClass = "text-emerald-400";
    bgClass = "bg-emerald-500/10 border-emerald-500/20";
  }

  return { score, label, colorClass, bgClass, id: scenario?.id };
}

export function generateAIInsight(threatStatus) {
  const { score, criticals, history } = threatStatus;
  
  // Rule-based patterns
  const recentEvents = history.slice(-5);
  const failedLogins = recentEvents.filter(h => h.threatLevel.id === 'brute_force').length;
  const criticalCount = recentEvents.filter(h => h.threatLevel.label === 'CRITICAL').length;

  if (failedLogins >= 3) return "Brute Force Attack: Multiple failed logins detected in short succession.";
  if (criticalCount >= 3) return "Attack Spike: Rapid sequence of critical security events detected.";
  if (score > 80) return "Critical System Breach: High-severity threat matched. Immediate action required.";
  if (score > 50) return "Suspicious Activity: Unusual patterns detected. Monitoring escalation recommended.";
  
  return "System Healthy: Telemetry stream nominal. No active threats detected.";
}
