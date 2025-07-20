let paragraph = "The quick brown fox jumps over the lazy dog.";
let startTime, timerInterval;
let chart;
let testHistory = JSON.parse(localStorage.getItem("typingHistory") || "[]");
let lastMistakes = [];

const typingInput = document.getElementById("typingInput");
const paragraphDisplay = document.getElementById("paragraphDisplay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const retestBtn = document.getElementById("retestBtn");
const replayMistakesBtn = document.getElementById("replayMistakesBtn");
const timeInput = document.getElementById("timeInput");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const mistakesDisplay = document.getElementById("mistakes");
const customInput = document.getElementById("customInput");
const historyList = document.getElementById("historyList");

startBtn.addEventListener("click", startTest);
stopBtn.addEventListener("click", stopTest);
retestBtn.addEventListener("click", resetTest);
replayMistakesBtn.addEventListener("click", replayMistakes);
document.getElementById("toggleTheme").addEventListener("click", toggleTheme);

function startTest() {
  if (customInput.value.trim()) {
    paragraph = customInput.value.trim();
  }
  paragraphDisplay.textContent = paragraph;
  typingInput.disabled = false;
  typingInput.value = "";
  typingInput.focus();
  startTime = new Date().getTime();
  let duration = parseInt(timeInput.value);
  timerInterval = setTimeout(stopTest, duration * 1000);
}

function stopTest() {
  clearTimeout(timerInterval);
  typingInput.disabled = true;

  const typed = typingInput.value.trim();
  const original = paragraph.trim();
  const typedWords = typed.split(" ");
  const originalWords = original.split(" ");
  let correct = 0, mistakes = 0;
  lastMistakes = [];

  typedWords.forEach((word, i) => {
    if (word === originalWords[i]) correct++;
    else {
      mistakes++;
      lastMistakes.push(originalWords[i]);
    }
  });

  const timeTaken = (new Date().getTime() - startTime) / 60000;
  const wpm = Math.round(correct / timeTaken);
  const accuracy = Math.round((correct / originalWords.length) * 100);

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
  mistakesDisplay.textContent = mistakes;

  const result = {
    date: new Date().toLocaleString(),
    wpm,
    accuracy,
    mistakes,
  };
  testHistory.push(result);
  localStorage.setItem("typingHistory", JSON.stringify(testHistory));
  updateChart();
  updateHistory();
}

function resetTest() {
  typingInput.value = "";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "0";
  mistakesDisplay.textContent = "0";
  typingInput.disabled = true;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function updateChart() {
  const ctx = document.getElementById("performanceChart").getContext("2d");
  const labels = testHistory.map((t, i) => `Test ${i + 1}`);
  const wpmData = testHistory.map(t => t.wpm);
  const accData = testHistory.map(t => t.accuracy);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "WPM",
          data: wpmData,
          borderColor: "#007bff",
          fill: false,
        },
        {
          label: "Accuracy (%)",
          data: accData,
          borderColor: "#28a745",
          fill: false,
        }
      ]
    }
  });
}

function updateHistory() {
  historyList.innerHTML = "";
  testHistory.slice().reverse().forEach(test => {
    const li = document.createElement("li");
    li.textContent = `${test.date} | WPM: ${test.wpm}, Accuracy: ${test.accuracy}%, Mistakes: ${test.mistakes}`;
    historyList.appendChild(li);
  });
}

function replayMistakes() {
  if (lastMistakes.length === 0) {
    alert("No mistakes from last test to replay.");
    return;
  }
  paragraph = lastMistakes.join(" ");
  paragraphDisplay.textContent = paragraph;
  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.focus();
  startTime = new Date().getTime();
  let duration = parseInt(timeInput.value);
  timerInterval = setTimeout(stopTest, duration * 1000);
}

updateChart();
updateHistory();
