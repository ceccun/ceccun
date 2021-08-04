var imageBlob = {};
var packMan = {
  name: "Ceccun Web Manager",
  version: "1",
};

checkNetConnection();
var targetApp;
targetApp = new URL(window.location).searchParams.get("package");
if (window["goTo"] != null || window["goTo"] != undefined) {
  targetApp = window["goTo"];
}
fetch(`${targetApp}/manifest.json`).then((response) => {
  if (response.status == 200) {
    response.json().then((manifest) => {
      window.history.replaceState(
        "",
        "",
        manifest["virtURI"] + window.location.search
      );
      document.getElementsByClassName("app-splash")[0].innerHTML = `
            <div class="app-splash-inner">
                <div class="app-splash-skel-icon">
                    <img style="width: 70px; max-width: 50vw; z-index: -1; display: block; filter: var(--invert-icon);" src="${manifest["icon"]}" />
                    <img class="loading-spinner" style="width: 30px; margin-top: 50px; filter: var(--invert-icon);" src="/images/loading-thick-small.png" />
                </div>
            </div>
            `;
      setTimeout(() => {
        loadApp(manifest);
      }, 500);
    });
  } else {
    document.getElementsByClassName("app-splash")[0].innerHTML = `
            <div class="app-splash-inner">
                <div class="app-splash-skel-icon">
                    <img style="width: 70px; max-width: 50vw; z-index: -1; display: block; margin: auto;" src="/images/cloud-off.svg" />
                    <h1>Woops</h1>
                    <p>Something went wrong!</p>
                </div>
            </div>
            `;
  }
});

const loadApp = (manifest) => {
  fetch(manifest["entryPoint"]).then((response) => {
    if (response.status == 200) {
      response.text().then((data) => {
        var appEntryPoint = document.createElement("script");
        appEntryPoint.innerHTML = data;
        document.body.appendChild(appEntryPoint);
        manifest["flse"].forEach((item, index) => {
          var flseElement = document.createElement("flseimport");
          flseElement.setAttribute("name", item["name"]);
          flseElement.setAttribute("type", item["type"]);
          flseElement.setAttribute("src", item["src"]);
          document.body.appendChild(flseElement);
        });
        entry();
      });
    } else {
    }
  });
};

const showApp = () => {
  document.getElementsByClassName("app-splash")[0].remove();
};
