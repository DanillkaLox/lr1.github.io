document.addEventListener("DOMContentLoaded", () => {
  const block1 = document.querySelector(".block1 h2");
  const block6 = document.querySelector(".block6 h2");

  [block1.textContent, block6.textContent] = [
    block6.textContent,
    block1.textContent,
  ];
});

document.addEventListener("DOMContentLoaded", () => {
  const radius = 5;
  const block5 = document.querySelector(".block5");

  function calculateCircleArea() {
    const area = Math.PI * radius ** 2;
    const result = document.createElement("p");
    result.textContent = `Area of a circle with radius ${radius} = ${area.toFixed(
      2
    )}`;
    block5.appendChild(result);
  }

  calculateCircleArea();
});

document.addEventListener("DOMContentLoaded", () => {
  const block5 = document.querySelector(".block5");
  const cookiesData = document.cookie
    .split("; ")
    .find((row) => row.startsWith("minDigit="));

  if (cookiesData) {
    const minDigit = cookiesData.split("=")[1];
    const saveData = confirm(`Cookies store the value of: ${minDigit}. Save?`);
    if (saveData) {
      alert("Cookies are saved. Please reload the page to continue.");
    } else {
      document.cookie = "minDigit=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      location.reload();
    }
  } else {
    const inputForm = document.createElement("form");
    inputForm.innerHTML = `
        <label for="numberInput">Enter a number:</label>
        <input type="number" id="numberInput" required />
        <button type="submit">Find the minimum digit</button>
      `;

    block5.appendChild(inputForm);

    inputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const number = document.getElementById("numberInput").value;
      const minDigit = Math.min(...number.split("").map(Number));
      alert(`The minimum number: ${minDigit}`);
      document.cookie = `minDigit=${minDigit}; path=/;`;
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const block6 = document.querySelector(".block6");
  const savedColor = localStorage.getItem("block6Color");

  if (savedColor) {
    block6.style.color = savedColor;
  }

  block6.addEventListener("click", () => {
    const newColor = prompt(
      "Enter the color of the text (in English):",
      savedColor || "black"
    );
    if (newColor) {
      block6.style.color = newColor;
      localStorage.setItem("block6Color", newColor);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".block").forEach((block) => {
    let form;

    if (
      block.classList.contains("block2") ||
      block.classList.contains("block6")
    ) {
      return;
    }

    block.addEventListener("mouseenter", () => {
      if (!form) {
        form = document.createElement("form");
        form.innerHTML = `
            <label for="cellCount">The number of cells:</label>
            <input type="number" id="cellCount" required min="1" />
            <button type="submit">Create a table</button>
          `;
        block.appendChild(form);

        form.addEventListener("submit", (e) => {
          e.preventDefault();

          const cellCount = Number(document.getElementById("cellCount").value);
          const table = document.createElement("table");
          const row1 = document.createElement("tr");
          const row2 = document.createElement("tr");

          for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement("td");
            cell.textContent = `Cell ${i + 1}`;
            cell.style.border = "1px solid black";
            cell.style.padding = "5px";
            cell.style.cursor = "pointer";

            cell.addEventListener("dblclick", () => {
              const input = document.createElement("input");
              input.type = "text";
              input.value = cell.textContent;
              input.style.width = "100%";
              cell.textContent = "";
              cell.appendChild(input);

              input.addEventListener("blur", () => {
                cell.textContent = input.value;
              });

              input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                  input.blur();
                }
              });

              input.focus();
            });

            (i % 2 === 0 ? row1 : row2).appendChild(cell);
          }

          if (cellCount % 2 !== 0) row2.remove();

          table.appendChild(row1);
          if (row2.children.length) table.appendChild(row2);

          block.appendChild(table);

          const saveButton = document.createElement("button");
          saveButton.textContent = "Save the table";
          saveButton.style.marginTop = "10px";

          block.appendChild(saveButton);

          saveButton.addEventListener("click", () => {
            const tableData = table.outerHTML;
            localStorage.setItem(`tableData${block.className}`, tableData);
            alert("The table is saved in LocalStorage!");
          });

          form.remove();
          form = null;
        });
      }
    });

    block.addEventListener("mouseleave", () => {
      if (form) {
        form.remove();
        form = null;
      }
    });
  });

  window.addEventListener("beforeunload", () => {
    localStorage.clear();
  });
});