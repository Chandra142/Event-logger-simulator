export const scenarioCatalog = [
  { id: "brute_force", keywords: ["failed login", "brute force", "credential", "auth failure"], severity: 85, label: "CRITICAL" },
  { id: "unauthorized", keywords: ["unauthorized access", "permission denied", "privilege escalation", "access denied"], severity: 90, label: "CRITICAL" },
  { id: "anomaly", keywords: ["network anomaly", "unusual traffic", "malicious payload", "ddos"], severity: 75, label: "WARNING" },
  { id: "malware", keywords: ["malware detected", "virus", "trojan", "ransomware"], severity: 95, label: "CRITICAL" },
  { id: "config", keywords: ["configuration change", "policy update", "system reconfigured", "ssh key added"], severity: 40, label: "INFO" },
  { id: "session", keywords: ["new session", "user login", "account created", "logout"], severity: 20, label: "INFO" },
  { id: "sql_injection", keywords: ["sql injection", "database vulnerability", "query error"], severity: 80, label: "CRITICAL" }
];

export const manualTemplates = [
  { securityEvent: "Failed login attempt from IP 192.168.1.45 (user: root)", category: "brute_force", baseSeverity: 45 },
  { securityEvent: "Multiple brute-force patterns detected on port 22", category: "brute_force", baseSeverity: 92 },
  { securityEvent: "Unauthorized access attempt to /etc/shadow", category: "unauthorized", baseSeverity: 88 },
  { securityEvent: "Network anomaly: outbound traffic spike to known malicious C2", category: "anomaly", baseSeverity: 78 },
  { securityEvent: "Malware payload detected in temporary directory /tmp/xps", category: "malware", baseSeverity: 95 },
  { securityEvent: "SQL injection attempt detected on user login form", category: "sql_injection", baseSeverity: 82 },
  { securityEvent: "Privilege escalation: user 'web-app' executed sudo -i", category: "unauthorized", baseSeverity: 94 },
  { securityEvent: "Anomalous DNS traffic pattern across internal gateway", category: "anomaly", baseSeverity: 65 },
  { securityEvent: "Critical system file /usr/bin/sudo modified", category: "unauthorized", baseSeverity: 91 },
  { securityEvent: "New SSH key added to root authorized_keys from unauthorized origin", category: "config", baseSeverity: 72 },
  { securityEvent: "User logout: admin session terminated", category: "session", baseSeverity: 15 },
  { securityEvent: "Scheduled system health check: all services nominal", category: "session", baseSeverity: 5 }
];

export const generateRandomEvent = () => {
  const t = manualTemplates[Math.floor(Math.random() * manualTemplates.length)];
  const cpu = Math.min(99, 15 + Math.random() * 25); // Default stable CPU
  const mem = 2048 + Math.random() * 2000;
  
  // Occasional spikes
  const highCpu = Math.random() > 0.85 ? (60 + Math.random() * 35) : cpu;
  const highMem = Math.random() > 0.85 ? (4000 + Math.random() * 3000) : mem;

  return {
    timestamp: new Date().toISOString(),
    operatingSystem: "Linux",
    cpuUsage: `${highCpu.toFixed(1)}%`,
    freeMemory: `${highMem.toFixed(0)} MB`,
    securityEvent: t.securityEvent
  };
};
