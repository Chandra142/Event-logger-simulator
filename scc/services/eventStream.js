import { generateRandomEvent } from '../data/mockData.js';

export function createEventStream(callback, minDelay = 1000, maxDelay = 3000) {
  let isRunning = false;
  let timerId = null;

  const loop = () => {
    if (!isRunning) return;
    callback(generateRandomEvent());
    const nextDelay = minDelay + Math.random() * (maxDelay - minDelay);
    timerId = setTimeout(loop, nextDelay);
  };

  return {
    start: () => {
      isRunning = true;
      loop();
    },
    stop: () => {
      isRunning = false;
      clearTimeout(timerId);
    },
    inject: (payload) => {
      callback(payload);
    }
  };
}
