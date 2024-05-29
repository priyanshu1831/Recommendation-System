// app.js
var myChart=null
document.addEventListener('DOMContentLoaded', async () => {
  // Initial render
  const logs = await fetchLogs();
  renderChart(logs);

  // Event listener for adding new logs
  document.getElementById('addLogButton').addEventListener('click', () => {
    const logText = document.getElementById('logText').value;
    if (logText.trim() !== '') {
      // Send the log to the server
      addLog({ text: logText, timestamp: new Date() });
    } else {
      console.error('Log text is empty.');
    }
  });
});

async function addLog(log) {
  try {
    const response = await fetch('/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      throw new Error(`Error adding log: ${response.statusText}`);
    }

    console.log('Log added successfully');

    // Fetch updated logs after adding a new log
    const updatedLogs = await fetchLogs();

    // Render the updated chart
    renderChart(updatedLogs);
  } catch (error) {
    console.error('Error adding log:', error);
  }
}

async function fetchLogs() {
  try {
    const response = await fetch('/logs');
    const logs = await response.json();
    return logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

function renderChart(logs) {
  // Destroy existing charts if they exist
  if (myChart) {
    myChart.destroy();
  }

  // Aggregate logs by day
  const logsByDay = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Bar chart data
  const barLabels = Object.keys(logsByDay);
  const barData = Object.values(logsByDay);

  // Pie chart data
  const pieLabels = barLabels;
  const pieData = barData;

  // Bar chart
  const barCanvas = document.getElementById('barChart');
  const barCtx = barCanvas ? barCanvas.getContext('2d') : null;
  if (barCtx) {
    const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [{
          label: 'Logs per Day',
          data: barData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
    });
  }

  // Pie chart
  const pieCanvas = document.getElementById('pieChart');
  const pieCtx = pieCanvas ? pieCanvas.getContext('2d') : null;
  if (pieCtx) {
    myChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        }],
      },
    });
  }
}