const CONFIG = {
  childName: "ירמי",
  dateLabel: "יום רביעי, 27 במאי 2026",
  timeLabel: "17:00 - 19:00",
  venueName: "אולם הספורט רננים, קריית ראשון",
  venueAddress: "רחוב הגומא 5, ראשון לציון",
  mapQuery: "רח הגומא 5 ראשון לציון",
  siteUrl: "http://localhost:8000",
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzjZp3u_IgQ1eWwdeB_fLuJk1fyvW_17zp4Kga_NnKx9GH_exkMfEhYgSgeNI8JrV_R/exec",
};

function fillStaticData() {
  document.getElementById("childName").textContent = CONFIG.childName;
  document.getElementById("eventDate").textContent = CONFIG.dateLabel;
  document.getElementById("eventTime").textContent = CONFIG.timeLabel;
  document.getElementById("eventPlace").textContent = CONFIG.venueName;
  document.getElementById("eventAddress").textContent = CONFIG.venueAddress;
}

function buildLinks() {
  const encodedMap = encodeURIComponent(CONFIG.mapQuery);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMap}`;
  const wazeUrl = `https://waze.com/ul?q=${encodedMap}&navigate=yes`;
  document.getElementById("mapsLink").href = mapsUrl;
  document.getElementById("wazeLink").href = wazeUrl;

  const calendarTitle = encodeURIComponent(`יום הולדת 5 ל${CONFIG.childName}`);
  const calendarDetails = encodeURIComponent(
    `מוזמנים לחגוג איתנו.\nמקום: ${CONFIG.venueName}, ${CONFIG.venueAddress}`
  );
  const calendarLocation = encodeURIComponent(`${CONFIG.venueName}, ${CONFIG.venueAddress}`);
  const calendarDates = "20260527T170000/20260527T190000";
  document.getElementById(
    "calendarLink"
  ).href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${calendarDetails}&location=${calendarLocation}`;

  const shareText = encodeURIComponent(
    `הזמנה ליום הולדת 5 של ${CONFIG.childName}! כל הפרטים וה-RSVP כאן: ${CONFIG.siteUrl}`
  );
  document.getElementById("whatsappShareLink").href = `https://wa.me/?text=${shareText}`;
}

async function submitRsvp(event) {
  event.preventDefault();
  const message = document.getElementById("rsvpMessage");
  if (!CONFIG.rsvpEndpoint) {
    message.textContent = "צריך לעדכן קודם את כתובת ה-RSVP ב-config.";
    return;
  }
  message.textContent = "שולח...";

  const payload = {
    familyName: document.getElementById("familyName").value.trim(),
    kidsCount: Number(document.getElementById("kidsCount").value),
  };

  try {
    const response = await fetch(CONFIG.rsvpEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    message.textContent = "תודה! אישור ההגעה נקלט בהצלחה.";
    event.target.reset();
  } catch (error) {
    message.textContent = "משהו השתבש בשליחה. נסו שוב בעוד רגע.";
  }
}

function launchConfettiBurst(amount = 34) {
  const colors = ["#ff4fa3", "#ffd34d", "#00b8ff", "#7b4dff", "#3bd37f", "#ff7a45"];
  const layer = document.querySelector(".confetti-layer");
  if (!layer) {
    return;
  }

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${3 + Math.random() * 2.4}s`;
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    layer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 6200);
  }
}

function setupConfetti() {
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  document.body.appendChild(layer);

  launchConfettiBurst(48);
  setInterval(() => {
    launchConfettiBurst(10);
  }, 1800);
}

document.getElementById("rsvpForm").addEventListener("submit", submitRsvp);
fillStaticData();
buildLinks();
setupConfetti();
