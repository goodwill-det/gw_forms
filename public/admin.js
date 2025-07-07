console.log("✅ admin.js loaded");

async function fetchEmployees() {
  const res = await fetch("/api/employees");
  const data = await res.json();
  const tableBody = document.querySelector("#employeeTable tbody");
  tableBody.innerHTML = "";

  data.forEach(emp => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${emp.id}</td>
      <td><input type="text" value="${emp.name}" data-id="${emp.id}" class="edit-name"/></td>
      <td>
        <select data-id="${emp.id}" class="edit-role">
          <option value="user" ${emp.role === 'user' ? 'selected' : ''}>User</option>
          <option value="admin" ${emp.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </td>
      <td>
        <button onclick="updateEmployee(${emp.id})">Update</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

async function addEmployee() {
  const id = document.getElementById("empId").value;
  const name = document.getElementById("empName").value;
  const password = document.getElementById("empPassword").value;
  const role = document.getElementById("empRole").value;

  if (!id || !name || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const res = await fetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, password, role })
  });

  const result = await res.json();
  if (res.ok) {
    alert(`✅ Employee ${name} added.`);
    fetchEmployees();
  } else {
    alert(`❌ Error: ${result.error}`);
  }
}

async function updateEmployee(id) {
  const name = document.querySelector(`input[data-id="${id}"]`).value;
  const role = document.querySelector(`select[data-id="${id}"]`).value;

  const res = await fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role })
  });

  const result = await res.json();
  if (res.ok) {
    alert("✅ Employee updated.");
    fetchEmployees();
  } else {
    alert(`❌ Error: ${result.error}`);
  }
}

async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  const res = await fetch(`/api/employees/${id}`, {
    method: "DELETE"
  });

  const result = await res.json();
  if (res.ok) {
    alert("🗑️ Employee deleted.");
    fetchEmployees();
  } else {
    alert(`❌ Error: ${result.error}`);
  }
}

document.getElementById("addEmployeeBtn").addEventListener("click", addEmployee);
window.addEventListener("DOMContentLoaded", fetchEmployees);
