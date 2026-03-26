export function useRiskContext() {
  const history = [];

  const addRiskEvent = (threatLevel, time) => {
    history.push({ threatLevel, time });
    
    // Purge elements older than 60 seconds
    const now = new Date().getTime();
    while (history.length > 0 && (now - new Date(history[0].time).getTime() > 60000)) {
      history.shift();
    }
    
    let totalScore = 0;
    let criticals = 0;
    
    // Weights: CRITICAL=40, WARNING=15, INFO=2
    history.forEach(h => {
      if (h.threatLevel.label === 'CRITICAL') { 
        totalScore += 40; 
        criticals++; 
      } else if (h.threatLevel.label === 'WARNING') {
        totalScore += 15;
      } else if (h.threatLevel.label === 'INFO') {
        totalScore += 2;
      }
    });

    const finalScore = Math.min(100, Math.round(totalScore));

    return {
      score: finalScore,
      criticals,
      history: [...history] // Pass a copy for AI logic
    };
  };

  return { addRiskEvent, history };
}
