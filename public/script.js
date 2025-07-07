console.log("✅ script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    // Splash to login screen
    const splash = document.getElementById("splashScreen");
    const login = document.getElementById("loginScreen");

    if (splash && login) {
        splash.classList.add("active");
        setTimeout(() => {
            splash.classList.remove("active");
            login.classList.add("active");
        }, 2000);
    }

    // Login logic
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            const id = document.getElementById("loginId").value.trim();
            const pw = document.getElementById("loginPassword").value.trim();
            const error = document.getElementById("loginError");

            if (!id || !pw) {
                error.textContent = "Please enter both Employee ID and Password.";
                return;
            }

            try {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, password: pw }),
                });

                const data = await res.json();

                if (!res.ok) {
                    error.textContent = data.error || "Login failed";
                    return;
                }

                // ✅ Successful login
                console.log("Logged in:", data);

                sessionStorage.setItem("employee_id", data.id);
                sessionStorage.setItem("role", data.role);
                window.location.href = "/dashboard.html";
            }
       catch (err) {
            console.error(err);
            error.textContent = "An error occurred while logging in.";
        }
    });
  }

  //password logic
  document.getElementById("passwordChangeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  const status = document.getElementById("passwordChangeStatus");
  status.textContent = "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    status.textContent = "❗ All fields are required.";
    return;
  }

  if (newPassword !== confirmPassword) {
    status.textContent = "❗ New passwords do not match.";
    return;
  }

  try {
    const res = await fetch("/api/employees/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    const msg = await res.text();
    status.textContent = res.ok ? "✅ Password updated successfully!" : `❌ ${msg}`;
  } catch (err) {
    console.error("❌ Error updating password:", err);
    status.textContent = "❌ Network error. Please try again.";
  }
});


// Evaluation form submit logic
const form = document.getElementById("evaluationForm");
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/evaluations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("✅ Evaluation submitted!");
                form.reset();
            } else {
                alert("❌ Failed to submit evaluation.");
            }
        } catch (err) {
            console.error(err);
            alert("❌ Error submitting evaluation.");
        }
    });
}
});
