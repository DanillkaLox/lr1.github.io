async function fetchAccordion() {
  const response = await fetch(
    "https://weblab-6-default-rtdb.europe-west1.firebasedatabase.app/accordion.json"
  );
  const data = await response.json();
  const container = document.querySelector(".accordion-container");
  container.innerHTML = "";

  for (const key in data) {
    const item = document.createElement("div");
    item.classList.add("accordion");
    item.setAttribute("data-key", key);

    item.innerHTML = `
      <h3>${data[key].title}</h3>
      <div style="display: none;">
        <p>${data[key].content}</p>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    container.appendChild(item);
  }

  document.querySelectorAll(".accordion h3").forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isVisible = content.style.display === "block";
      document.querySelectorAll(".accordion div").forEach((div) => {
        div.style.display = "none";
      });
      content.style.display = isVisible ? "none" : "block";
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      const accordion = button.closest(".accordion");
      const key = accordion.getAttribute("data-key");

      const response = await fetch(
        `https://weblab-6-default-rtdb.europe-west1.firebasedatabase.app/accordion/${key}.json`,
        { method: "DELETE" }
      );

      if (response.ok) {
        accordion.remove();
        alert("The item has been successfully deleted!");
      } else {
        alert("Error when deleting an item.");
      }
    });
  });
}

fetchAccordion();
setInterval(fetchAccordion, 1000 * 60);
