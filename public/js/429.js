let seconds = 60;
const countdownEl = document.getElementById("countdown");
const retryBtn = document.getElementById("retryBtn");

const timer = setInterval(() => {
  seconds--;
  countdownEl.textContent = seconds;
  retryBtn.textContent = `Return to Home (${seconds}s)`;

  if (seconds <= 0) {
    clearInterval(timer);
    countdownEl.textContent = "0";
    retryBtn.disabled = false;
    retryBtn.textContent = "Return to Home";
  }
}, 1000);

// Redirect to homepage when button is clicked
retryBtn.addEventListener("click", () => {
  window.location.href = "/";
});

// Also handle Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !retryBtn.disabled) {
    window.location.href = "/";
  }
});
