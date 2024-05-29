// ingestLogs.js

const fs = require('fs');
// Use dynamic import to load node-fetch
import('node-fetch')
  .then(async (module) => {
    const fetch = module.default;

    const ingestLogs = async () => {
      try {
        const logsData = fs.readFileSync('log.txt', 'utf-8');
        const logs = JSON.parse(logsData);

        for (const log of logs) {
          try {
            await fetch('http://localhost:3000/logs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(log),
            });
            console.log(`Log ingested: ${log.text}`);
          } catch (error) {
            console.error(`Error ingesting log: ${log.text}`, error.message);
          }
        }
      } catch (error) {
        console.error('Error reading log.txt:', error.message);
      }
    };

    ingestLogs();
  })
  .catch((error) => {
    console.error('Error loading node-fetch:', error.message);
  });
