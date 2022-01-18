let appList;

let current = {
  app: null,
  appVars: {},
  width: 0,
  height: 0
};

let experiments = {
  "chinaRealNameAuthentication": false,
  "aprilFools": true
}

setInterval(() => {
  const heightCondition = current.height != window.innerHeight;
  const widthCondition = current.width != window.innerWidth;

  const conditions = heightCondition || widthCondition;
  if (conditions) {
    current.width = window.innerWidth;
    current.height = window.innerHeight;

    document.getElementById("changableStyle").innerHTML = `
  :root {
    --v-height: ${current.height}px;
    --v-width: ${current.width}px;
  }
  `;
  }
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
}


function setupAppList() {
  let awarenessVars = {
    max: appList.length,
    current: 0,
  };

  if (experiments.aprilFools == true) {
    appList.push({
      "name": "aprilFools-freePerks",
      "label": "Free upgrades",
      "icon": "/images/up_arrow.svg",
      "entry": "/dash-scripts/fools.js",
      "stylesheet": "/dash-scripts/css/fools.css"
    })
  }


  appList.forEach((item) => {
    const entry = item.entry;

    // fetch(entry).then((response) => {
    //   if (response.status == 200) {
    //     response.text().then((script) => {
    //       item["script"] = Function(script);
    //       awarenessVars.current += 1;
    //       if (awarenessVars.current == awarenessVars.max) {
    //         setupAppButtons();
    //       }
    //     });
    //   }
    // });

  });

  setupAppButtons();
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
    label.innerText = item.label;

    button.appendChild(img);
    button.appendChild(label);

    document
      .getElementsByClassName("dashBarLeftItems")[0]
      .appendChild(button);
  });

  if (current.app == null) {
    launch(0);
  }
}


function launch(app) {
  document.getElementById("currentWorkspaceStyle").innerHTML = ``;
  let active = document.getElementsByClassName("dashBarLeftItem-active");
  if (active.length != 0) {
    active[0].className = "dashBarLeftItem";
  }
  document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft inactive"

  if (appList[app]["script"] == undefined) {
    fetch(appList[app].entry).then((response) => {
      if (response.status == 200) {
        response.text().then((script) => {
          appList[app]["script"] = Function("workspace", "created", script);
          document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft"
          if (appList[app]["stylesheet"] != undefined) {
            fetch(appList[app]["stylesheet"]).then((response) => {
              response.text().then((data) => {
                appList[app]["stylesheet"] = data;
                document.getElementById("currentWorkspaceStyle").innerHTML = appList[app]["stylesheet"];
                launchAndRun()
              })
            });
          } else {
            launchAndRun()
          }
        });
      }
    });
  } else {
    if (appList[app]["stylesheet"] != undefined) {
          document.getElementById("currentWorkspaceStyle").innerHTML = appList[app]["stylesheet"];
    }
    launchAndRun()
    document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft";
  }

  function launchAndRun() {
    let newCurrentApp = document.getElementsByClassName("dashBarLeftItem")[app];
    newCurrentApp.className = "dashBarLeftItem dashBarLeftItem-active";

    var workspaceName = `${appList[app].name}-workspace`;
    var workspace = document.getElementsByClassName(workspaceName)[0];

    if (workspace == null) {
      workspace = document.createElement("div");
      workspace.className = `${workspaceName} workspace-active`;
      document.getElementsByClassName("workspace")[0].appendChild(workspace);
      appList[app]["script"](workspace, 1);
    } else {
      appList[app]["script"](workspace, 0); 
    }

    document.getElementsByClassName("workspace-active")[0].className = document
    .getElementsByClassName("workspace-active")[0]
    .className.replace("workspace-active", "");

    document.getElementsByClassName(
      workspaceName
    )[0].className = `${workspaceName} workspace-active`;
  }
}

startUp();
