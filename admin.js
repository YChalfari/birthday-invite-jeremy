const ADMIN_CONFIG = {
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzjZp3u_IgQ1eWwdeB_fLuJk1fyvW_17zp4Kga_NnKx9GH_exkMfEhYgSgeNI8JrV_R/exec",
};

function setMessage(text) {
  document.getElementById("adminMessage").textContent = text;
}

function renderTotals(entries) {
  const totalFamilies = entries.length;
  const totalKids = entries.reduce((sum, entry) => sum + Number(entry.kidsCount || 0), 0);

  document.getElementById("totalFamilies").textContent = String(totalFamilies);
  document.getElementById("totalKids").textContent = String(totalKids);
}

function renderRows(entries) {
  const tbody = document.getElementById("entriesTableBody");
  tbody.innerHTML = "";

  if (!entries.length) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="3">עדיין אין אישורי הגעה.</td>';
    tbody.appendChild(row);
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.createdAt || "-"}</td>
      <td>${entry.familyName || "-"}</td>
      <td>${entry.kidsCount || 0}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadEntries() {
  if (!ADMIN_CONFIG.rsvpEndpoint) {
    setMessage("צריך לעדכן קודם את כתובת ה-RSVP ב-admin.js.");
    return;
  }
  setMessage("טוען נתונים...");
  try {
    const response = await fetch(`${ADMIN_CONFIG.rsvpEndpoint}?admin=1`);
    if (!response.ok) {
      throw new Error("Failed to fetch entries");
    }

    const data = await response.json();
    const entries = Array.isArray(data.entries) ? data.entries : [];
    renderTotals(entries);
    renderRows(entries);
    setMessage(`עודכן בהצלחה (${new Date().toLocaleTimeString("he-IL")})`);
  } catch (error) {
    setMessage("טעינת הנתונים נכשלה. בדקו שה-endpoint מחזיר JSON תקין.");
  }
}

document.getElementById("refreshBtn").addEventListener("click", loadEntries);
loadEntries();
