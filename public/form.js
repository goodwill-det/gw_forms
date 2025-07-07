console.log("✅ form.js loaded");

const groups = [
  "dressed", "direction", "performed", "supervision",
  "helpfulness", "beyond", "attitude", "attendance",
  "paperwork", "organize", "safety"
];

// Dynamically build radio inputs (1–5)
function buildRadios(groupName) {
  const container = document.querySelector(`.radio-group[data-name="${groupName}"]`);
  if (!container) return;

  for (let i = 1; i <= 5; i++) {
    const label = document.createElement("label");
    label.innerText = i;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = groupName;
    input.value = i;
    input.id = `${groupName}-${i}`;

    label.setAttribute("for", input.id);
    label.prepend(input); // input inside label

    container.appendChild(label);
  }
}

// Load employee names from DB
async function populateEmployees() {
  try {
    const res = await fetch("/api/employees");
    const employees = await res.json();

    const select = document.getElementById("employeeId");
    employees.forEach(emp => {
      const option = document.createElement("option");
      option.value = emp.id;
      option.textContent = emp.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("❌ Failed to load employees:", err);
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("evaluationForm");

  const employeeIdValue = document.getElementById("employeeId").value;
  if (!employeeIdValue) {
    document.getElementById("submitStatus").textContent = "❗ Please select an employee.";
    return;
  }

  const formData = {
    employee_id: parseInt(employeeIdValue, 10)
  };

  let valid = true;
  let totalScore = 0;

  groups.forEach(group => {
    const selected = document.querySelector(`input[name="${group}"]:checked`);
    if (!selected) valid = false;
    const score = selected ? parseInt(selected.value, 10) : 0;
    formData[group] = score;
    totalScore += score;
  });

  if (!valid) {
    document.getElementById("submitStatus").textContent = "❗ Please complete all categories.";
    return;
  }

  // Grade logic
  let grade = '';
  if (totalScore >= 40) grade = 'A';
  else if (totalScore >= 35) grade = 'B';
  else if (totalScore >= 29) grade = 'C';
  else grade = 'D';

  formData.totalScore = totalScore;
  formData.grade = grade;

  // Send to server
  try {
    const res = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      document.getElementById("submitStatus").textContent = "✅ Evaluation submitted!";
      form.reset();
    } else {
      const result = await res.text();
      document.getElementById("submitStatus").textContent = `❌ Error: ${result}`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("submitStatus").textContent = "❌ Network or server error.";
  }
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  populateEmployees();
  groups.forEach(buildRadios);
  document.getElementById("evaluationForm").addEventListener("submit", handleSubmit);
});
