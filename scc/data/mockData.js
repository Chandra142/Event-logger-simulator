export const scenarioCatalog = [
  { id: "login", keywords: ["login", "credential", "session"], severity: 30 },
  { id: "policy", keywords: ["policy", "lockdown", "security"], severity: 55 },
  { id: "insider", keywords: ["insider", "drift", "exfil"], severity: 70 },
  { id: "network", keywords: ["network", "sweep", "lateral", "beacon"], severity: 85 },
  { id: "breach", keywords: ["unauthorized", "failed", "breach"], severity: 90 }
];

export const manualTemplates = [
  { securityEvent: "East-west lateral sweep detected on VLAN 4", baseSeverity: 82 },
  { securityEvent: "Zero-trust policy escalation triggered", baseSeverity: 68 },
  { securityEvent: "Insider drift: anomalous data exfil sequence", baseSeverity: 77 },
  { securityEvent: "Credential storm detected across remote gateways", baseSeverity: 95 },
  { securityEvent: "Network Beacon anomaly suggests command-and-control", baseSeverity: 88 }
];

export const generateRandomEvent = () => {
  const t = manualTemplates[Math.floor(Math.random() * manualTemplates.length)];
  const cpu = Math.min(99, t.baseSeverity + Math.random() * 15);
  const mem = 1024 + Math.random() * 4000;
  
  return {
    timestamp: new Date().toISOString(),
    operatingSystem: "Linux Server",
    cpuUsage: `${cpu.toFixed(1)}%`,
    freeMemory: `${mem.toFixed(0)} MB`,
    securityEvent: t.securityEvent
  };
};
