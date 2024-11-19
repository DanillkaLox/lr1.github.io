document
  .querySelector(".accordionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const titleInput = document.querySelector(".title");
    const contentInput = document.querySelector(".content");

    if (contentInput.value.length < 1 || titleInput.value.length < 1) {
      alert("The header and content must have atleast 1 character!");
      return;
    }

    if (titleInput.value.length > 25) {
      alert("The header cannot be longer than 25 characters!");
      return;
    }

    if (contentInput.value.length > 500) {
      alert("Content cannot be longer than 500 characters!");
      return;
    }

    const title = titleInput.value;
    const content = contentInput.value;

    const response = await fetch(
      "https://weblab-6-default-rtdb.europe-west1.firebasedatabase.app/accordion.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }
    );

    if (response.ok) alert("Data saved!");
    else alert("Data saving error!");
  });
