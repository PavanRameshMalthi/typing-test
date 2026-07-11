let chartInstance = null;

export const chartManager = {
  updateChart(historyRecords) {
    const canvas = document.getElementById("performanceChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const totalRecords = historyRecords.length;

    // If no history, draw an empty or mock state, or destroy chart if exists
    if (totalRecords === 0) {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    // Limit to last 20 tests so the chart doesn't get cluttered, but show clear trajectory
    const displayRecords = historyRecords.slice(-20);
    const labels = displayRecords.map((r, i) => `Test ${historyRecords.length - displayRecords.length + i + 1}`);
    const wpmData = displayRecords.map((r) => r.wpm);
    const accData = displayRecords.map((r) => r.accuracy);

    // Calculate averages
    const avgWpmVal = Math.round(historyRecords.reduce((sum, r) => sum + r.wpm, 0) / totalRecords);
    const avgAccVal = Math.round(historyRecords.reduce((sum, r) => sum + r.accuracy, 0) / totalRecords);

    const avgWpmData = Array(displayRecords.length).fill(avgWpmVal);
    const avgAccData = Array(displayRecords.length).fill(avgAccVal);

    if (chartInstance) {
      chartInstance.destroy();
    }

    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      console.warn("Chart.js is not defined. Skipping chart creation.");
      return;
    }

    // Modern glassmorphism theme colors matching the stylesheet
    const colorWpm = "#4facfe"; // Cyan blue
    const colorAcc = "#00f2fe"; // Neon green-cyan
    const colorAvgWpm = "rgba(79, 172, 254, 0.4)";
    const colorAvgAcc = "rgba(0, 242, 254, 0.4)";

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `WPM (Last Test: ${wpmData[wpmData.length - 1]})`,
            data: wpmData,
            borderColor: colorWpm,
            backgroundColor: "rgba(79, 172, 254, 0.1)",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            yAxisID: "yWpm"
          },
          {
            label: `Accuracy % (Last Test: ${accData[accData.length - 1]}%)`,
            data: accData,
            borderColor: "#10b981", // Emerald green
            backgroundColor: "rgba(16, 185, 129, 0.05)",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            yAxisID: "yAcc"
          },
          {
            label: `Avg WPM (${avgWpmVal})`,
            data: avgWpmData,
            borderColor: colorAvgWpm,
            borderDash: [6, 6],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            yAxisID: "yWpm"
          },
          {
            label: `Avg Accuracy (${avgAccVal}%)`,
            data: avgAccData,
            borderColor: "rgba(16, 185, 129, 0.4)",
            borderDash: [6, 6],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            yAxisID: "yAcc"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.8)",
              font: {
                family: "'Outfit', 'Inter', sans-serif",
                size: 11
              }
            }
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleFont: { family: "'Outfit', sans-serif" },
            bodyFont: { family: "'Outfit', sans-serif" },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)"
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.6)",
              font: { family: "'Outfit', sans-serif" }
            }
          },
          yWpm: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "Words Per Minute",
              color: "#4facfe",
              font: { family: "'Outfit', sans-serif", weight: "bold" }
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)"
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.6)",
              font: { family: "'Outfit', sans-serif" }
            },
            min: 0
          },
          yAcc: {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: "Accuracy (%)",
              color: "#10b981",
              font: { family: "'Outfit', sans-serif", weight: "bold" }
            },
            grid: {
              drawOnChartArea: false // prevent grid line clutter
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.6)",
              font: { family: "'Outfit', sans-serif" }
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }
};
