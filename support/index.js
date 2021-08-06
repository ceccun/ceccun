document.title = "Ceccun Support Center";

const entry = () => {
  let supportPage = "";
  try {
    supportPage = new URL(window.location).searchParams.get("p");
  } catch (error) {}
  fetch(`support.html`).then((response) => {
    if (response.status == 200) {
      response.text().then((app) => {
        var appElement = document.createElement("div");
        appElement.innerHTML = app;
        document.body.appendChild(appElement);
        showApp();
        loadSupport(supportPage);
      });
    }
  });
};

const loadSupport = (articleNum) => {
  fetch(`articles/${articleNum}.json`).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        const title = data["title"];
        const article = data["article"];
      });
    }
  });
};
