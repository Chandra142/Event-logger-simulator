export function useRiskContext() {
  const history = [];

  const addRiskEvent = (threatLevel, time) => {
    history.push({ threatLevel, time });
    
    // Purge elements older than 60 seconds
    const now = new Date().getTime();
    while (history.length > 0 && (now - new Date(history[0].time).getTime() > 60000)) {
      history.shift();
    }
    
    let score = 0;
    let criticals = 0;
    
    history.forEach(h => {
      if (h.threatLevel.label === 'CRITICAL') { score += 25; criticals++; }
      else if (h.threatLevel.label === 'WARNING') score += 10;
      else if (h.threatLevel.label === 'INFO') score += 1;
    });

    return {
      score: Math.min(100, score),
      criticals,
      highLoad: history.length > 0 && Math.random() > 0.5 // Simulated load heuristic
    };
  };

  return { addRiskEvent, history };
}
