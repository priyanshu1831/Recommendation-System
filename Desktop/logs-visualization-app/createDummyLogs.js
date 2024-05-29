// createDummyLogs.js
const fs = require('fs');

const generateDummyLogs = (numLogs) => {
  const logs = [];
  const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

  for (let i = 0; i < numLogs; i++) {
    const randomTimestamp = new Date(Date.now() - Math.random() * tenDaysInMillis);
    const timestamp = randomTimestamp.toISOString();
    const text = `Log entry ${i + 1}`;
    logs.push({ timestamp, text });
  }

  return JSON.stringify(logs, null, 2);
};


fs.writeFileSync('log.txt', generateDummyLogs(1000));
console.log('Dummy logs created in log.txt');
