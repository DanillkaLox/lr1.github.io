const work = document.querySelector(".work");
const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".btn-close");
const btnOpen = document.querySelector(".btn-open");
const btnStart = document.querySelector(".btn-start");
const anim = document.querySelector(".anim");
const btnStop = document.querySelector(".btn-stop");
const btnReload = document.querySelector(".btn-reload");
const btnContinue = document.querySelector(".btn-continue");
const btnDelete = document.querySelector(".btn-delete");
const serverUrl =
  "https://weblab-6-default-rtdb.europe-west1.firebasedatabase.app/events.json";
const serverBlock = document.querySelector(".block5");
const localBlock = document.querySelector(".block6");

let eventCounter = 0;
let localEvents = JSON.parse(localStorage.getItem("events")) || [];
let left = false;
let square = document.querySelector(".moving-square");
let intervalId,
  angle,
  speed = 4;
let x = parseInt(square.style.right || 0);
let y = parseInt(square.style.top || 0);

const openModal = () => {
  overlay.classList.remove("hidden");
  work.classList.remove("hidden");
  logEvent("Modal opened");
};

const closeModal = () => {
  overlay.classList.add("hidden");
  work.classList.add("hidden");
  logEvent("Modal closed");
  displayEvents();
};

const toggleButtons = (hideBtn, showBtn) => {
  hideBtn.classList.add("hidden");
  showBtn.classList.remove("hidden");
};

const moveSquare = () => {
  let radians = (angle * Math.PI) / 180;
  x += speed * Math.cos(radians);
  y += speed * Math.sin(radians);

  square.style.right = `${x}px`;
  square.style.top = `${y}px`;

  if ((y > anim.offsetHeight - 20 || y < 0) && x < anim.offsetWidth) {
    angle = -angle;
    logEvent("Square hit the wall");
  } else if (left === false && x > anim.offsetWidth) {
    left = true;
    toggleButtons(btnStop, btnReload);
    logEvent("Square reached the end of the anima box");
  }
  if (x > work.offsetWidth || y > anim.offsetHeight) {
    clearInterval(intervalId);
    logEvent("Square left work zone");
  }
};

const randomAngle = () => Math.random() * 90;

const clearAllData = async () => {
  localStorage.removeItem("events");
  localEvents = [];
  try {
    const response = await fetch(serverUrl, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Server data cleared.");
    } else {
      console.error("Failed to clear server data.");
    }
  } catch (error) {
    console.error("Error clearing server data:", error);
  }

  displayEvents();
};

const sendEventToServer = async (event) => {
  try {
    await fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    console.log("Event sent to server:", event);
  } catch (error) {
    console.error("Error sending event to server:", error);
  }
};

const saveEventToLocal = (event) => {
  localEvents.push(event);
  localStorage.setItem("events", JSON.stringify(localEvents));
  console.log("Event saved to LocalStorage:", event);
};

const logEvent = (description) => {
  const currentTime = new Date().toISOString();
  const event = {
    id: ++eventCounter,
    time: currentTime,
    description,
  };
  sendEventToServer(event);

  saveEventToLocal(event);
};

const displayEvents = () => {
  serverBlock.innerHTML = `
    <h3>Події із сервера</h3>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Опис</th>
          <th>Час</th>
        </tr>
      </thead>
      <tbody class="server-table-body"></tbody>
    </table>
  `;
  localBlock.innerHTML = `
    <h3>Події із LocalStorage</h3>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Опис</th>
          <th>Час</th>
        </tr>
      </thead>
      <tbody class="local-table-body"></tbody>
    </table>
  `;
  setTimeout(() => {
    fetch(serverUrl)
      .then((res) => res.json())
      .then((serverData) => {
        const serverTableBody = document.querySelector(".server-table-body");
        if (serverData) {
          Object.values(serverData).forEach((event) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${event.description}</td>
            <td>${event.time}</td>
          `;
            serverTableBody.appendChild(row);
          });
        }
      });
  }, 50);

  const localTableBody = document.querySelector(".local-table-body");
  localEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${event.description}</td>
      <td>${event.time}</td>
    `;
    localTableBody.appendChild(row);
  });
};

btnOpen.addEventListener("click", openModal);

btnClose.addEventListener("click", closeModal);

btnStart.addEventListener("click", () => {
  angle = randomAngle();
  intervalId = setInterval(moveSquare, 30);
  toggleButtons(btnStart, btnStop);
  x = 0;
  y = 0;
  logEvent("Animation started");
});

btnStop.addEventListener("click", () => {
  clearInterval(intervalId);
  toggleButtons(btnStop, btnContinue);
  logEvent("Animation stopped");
});

btnReload.addEventListener("click", () => {
  square.style.right = "0px";
  square.style.top = "0px";
  clearInterval(intervalId);
  toggleButtons(btnReload, btnStart);
  logEvent("Animation reloaded");
  left = false;
});

btnContinue.addEventListener("click", () => {
  intervalId = setInterval(moveSquare, 30);
  toggleButtons(btnContinue, btnStop);
  logEvent("Animation continued");
});

btnDelete.addEventListener("click", clearAllData);
