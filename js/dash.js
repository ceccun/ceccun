let appList;

let current = {
  app: null,
  appVars: {},
};

setInterval(() => {
  document.getElementById("changableStyle").innerHTML = `
  :root {
    --v-height: ${window.innerHeight}px;
    --v-width: ${window.innerWidth}px;
  }
  `;
}, 100);

function startUp() {
  fetch("/constants/apps.json").then((response) => {
    if (response.status == 200) {
      response.json().then((availApps) => {
        appList = availApps;
        setupAppList();
      });
    }
  });

  function setupAppList() {
    let awarenessVars = {
      max: appList.length,
      current: 0,
    };
    appList.forEach((item) => {
      const entry = item.entry;
      fetch(entry).then((response) => {
        if (response.status == 200) {
          response.text().then((script) => {
            item["script"] = Function(script);
            awarenessVars.current += 1;
            if (awarenessVars.current == awarenessVars.max) {
              setupAppButtons();
            }
          });
        }
      });
    });
  }

  function setupAppButtons() {
    appList.forEach((item, index) => {
      let button = document.createElement("div");
      button.className = "dashBarLeftItem";
      button.setAttribute("data-appName", item.name);
      button.setAttribute("onclick", `launch(${index})`);

      let img = document.createElement("img");
      img.src = item.icon;

      let label = document.createElement("p");
      label.setAttribute("flsestring", item.label);

      button.appendChild(img);
      button.appendChild(label);

      document
        .getElementsByClassName("dashBarLeftItems")[0]
        .appendChild(button);
    });

    // <div class="dashBarLeftItem dashBarLeftItem-active">
    //   <img src="/images/notes.svg" />
    //   <p>Notes</p>
    // </div>;

    // let appButtons = document.getElementsByClassName("dashBarLeftItem");
    // for (const item of appButtons) {
    //   item.addEventListener("click", launch);
    // }

    if (current.app == null) {
      launch(0);
    }
  }
}

function launch(app) {
  let active = document.getElementsByClassName("dashBarLeftItem-active");
  if (active.length != 0) {
    active[0].className = "dashBarLeftItem";
  }

  let newCurrentApp = document.getElementsByClassName("dashBarLeftItem")[app];
  newCurrentApp.className = "dashBarLeftItem dashBarLeftItem-active";

  appList[app]["script"]();
}

function notes() {}

function deck() {}

function clock() {}

startUp();
