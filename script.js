const togglePasswordBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const errorBox = document.getElementById("errorBox");

const DASHBOARD_PASSWORD = "9963088739";

const dashboardPasswordInput = document.getElementById("dashboardPassword");
const unlockDashboardBtn = document.getElementById("unlockDashboard");
const lockDashboardBtn = document.getElementById("lockDashboard");
const dashboardError = document.getElementById("dashboardError");
const historySection = document.getElementById("historySection");
const historyBody = document.getElementById("historyBody");
const historyEmpty = document.getElementById("historyEmpty");

let dashboardUnlocked = false;

// -------- password show/hide in login form ----------
togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === "password" ? "Show" : "Hide";
});

// -------- load history from localStorage ----------
function loadHistory() {
    const raw = localStorage.getItem("loginHistory");
    try {
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem("loginHistory", JSON.stringify(history));
}

function renderHistory() {
    const history = loadHistory();
    historyBody.innerHTML = "";

    if (!dashboardUnlocked) {
        // if locked, don't render anything
        return;
    }

    if (!history.length) {
        historyEmpty.style.display = "block";
        return;
    }

    historyEmpty.style.display = "none";

    history.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.email}</td>
          <td>${item.password}</td>
          <td>${item.time}</td>
        `;
        historyBody.appendChild(tr);
    });
}

// -------- login form handling ----------
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();

    const isValidEmail = email.includes("@") && email.includes(".");
    const isValidPassword = password.length >= 6;

    if (!isValidEmail || !isValidPassword) {
        errorBox.style.display = "block";
        return;
    } else {
        errorBox.style.display = "none";
    }

    // Save login attempt into localStorage history (including password)
    const history = loadHistory();
    const now = new Date();
    const timeString = now.toLocaleString();

    history.push({
        email,
        password,
        time: timeString
    });

    saveHistory(history);
    renderHistory();

    alert("Login successful (demo only). History saved locally in this browser.");
});

// -------- dashboard unlock / lock ----------
unlockDashboardBtn.addEventListener("click", () => {
    const value = dashboardPasswordInput.value.trim();

    if (value === DASHBOARD_PASSWORD) {
        dashboardUnlocked = true;
        historySection.style.display = "block";
        dashboardError.style.display = "none";
        lockDashboardBtn.style.display = "inline-block";
        renderHistory();
    } else {
        dashboardError.style.display = "block";
        historySection.style.display = "none";
        dashboardUnlocked = false;
    }
});

lockDashboardBtn.addEventListener("click", () => {
    dashboardUnlocked = false;
    historySection.style.display = "none";
    lockDashboardBtn.style.display = "none";
});

// Initial render (locked, so nothing shown)
renderHistory();
