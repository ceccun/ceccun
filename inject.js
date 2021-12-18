
if (workspace.className.startsWith("𝕚𝕟𝕛𝕖𝕔𝕥𝕖𝕕-workspace") || workspace.className.startsWith("inst-workspace")) {
    console.log("%c𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐟𝐨𝐫 𝐮𝐬𝐢𝐧𝐠 𝐁𝐚𝐮𝐡𝐚𝐬𝐬𝐜𝐫𝐢𝐩𝐭.", "color: red; font-size: 20px;");
    console.log("Bauhasscript is currently injecting into Dash...");

    document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft inactive";

    var newList = [];

    appList.forEach(item => {
        if (item.name.startsWith("𝕚𝕟𝕛𝕖𝕔𝕥𝕖𝕕") || item.name.startsWith("inst")) {
        } else {
            newList.push(item);
        }
    });

    appList = newList;

    appList.push({
        name: "/be-resp",
        label: "Respring Dash",
        entry: "/inject.js",
        icon: "/images/delete.svg"
    })

    appList.push({
        name: "/be-raa",
        label: "Remove all apps",
        entry: "/inject.js",
        icon: "/images/delete.svg"
    })

    appList.push({
        name: "/be-dcw",
        label: "Clear traces",
        entry: "/inject.js",
        icon: "/images/delete.svg"
    })

    appList.push({
        name: "/be-amgr",
        label: "Manage Apps",
        entry: "/inject.js",
        icon: "/images/delete.svg"
    })

    appList.push({
        name: "/be-console",
        label: "Console",
        entry: "/inject.js",
        icon: "/images/delete.svg"
    });

    appList.push({
        name: "/be-exp",
        label: "Experiments",
        entry: "/inject.js",
        icon: "/images/delete.svg"
    });

    setTimeout(() => {
        document.getElementsByClassName("dashBarLeftItems")[0].innerHTML = ``;
        setupAppButtons();
        document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft"
    }, 1000)
}

if (workspace.className.startsWith("/be-raa-workspace")) {
    workspace.innerText += ("Removing all apps, this should not take more than a few milliseconds.");

    var newList = [];
    newList.push({
        name: "pad-app",
        label: "Padding App",
        entry: "/inject.js",
        icon: "/"
    })
    newList.push({
        entry: "/inject.js",
        icon: "/images/unlocked_holo.svg",
        label: "Install Bauhas",
        name: "inst",
    })
    newList.push({
        entry: "/inject.js",
        icon: "/images/logo@0.5x.png",
        label: "Install Ceccun Apps",
        name: "ccn-apps",
    })
    appList.forEach(item => {
            workspace.innerText += `\nClearing ${item.name}`
    });

    workspace.innerText += `\n\nMerging changes`;
    appList = newList;

    workspace.innerText += `\nDone`
    alert("Some apps may contain trace-data in them as their workspaces are still active. You'll need to clean to remove those permanently.");
    alert("Now attempting to respring.")
    document.getElementsByClassName("dashBarLeftItems")[0].innerHTML = ``;
    setupAppButtons();
}

if (workspace.className.startsWith("/be-resp-workspace")) {
    alert("Attempting to respring.")
    document.getElementsByClassName("dashBarLeftItems")[0].innerHTML = ``;
    setupAppButtons();
}

if (workspace.className.startsWith("/be-amgr-workspace")) {
    if (created == 1) {
        var input = document.createElement("textarea");
    
        input.innerText = JSON.stringify(appList).replace(",", `,\n`);
    
        input.addEventListener("keyup", () => {
            appList = JSON.parse(input.value);
        })
    
        workspace.appendChild(input)
    }
}

if (workspace.className.startsWith("/be-console-workspace")) {
    if (created == 1) {
        var myIndex = 0;

        var input1 = document.createElement("input");
        input1.placeholder = "Enter your command here.";
        input1.id = "1in";
        var input2 = document.createElement("input");
        input2.id = "2in";
        input2.placeholder = "Type app index";
        var button = document.createElement("button");
        button.innerText = "Execute";

        var astatus = document.createElement("p");
        astatus.innerText = "Status: Ready";
        astatus.id = "statusin"


        button.addEventListener("click", () => {
            var v1 = document.getElementById("1in").value;
            var v2 = Number.parseInt(document.getElementById("2in").value);

            document.getElementById("statusin").innerText = "Status: Running";

            launch(v2);
            
            launch(myIndex);
            
            var backup = appList[v2].script;

            appList[v2].script = Function("element", "created", v1);
            
            try {
                launch(v2);
                launch(myIndex);


                document.getElementById("statusin").innerText = "Status: Restoring Environment";
                appList[v2].script = backup;
    
                document.getElementById("statusin").innerText = "Status: Done!";
            } catch (error) {
                document.getElementById("statusin").innerText = "Status: Reverting back to last known script.";
                appList[v2].script = backup;
                
                document.getElementById("statusin").innerText = `Status: ERROR! Your script failed to run. Some changes may remain, but the environment has been restored.\n\n${error}`;


            }

        })
    
        workspace.appendChild(input1)
        workspace.appendChild(input2)
        workspace.appendChild(button)
        workspace.appendChild(astatus)
    }
}

if (workspace.className.startsWith("ccn-apps")) {
    document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft inactive";

    fetch("/constants/apps.json").then((response) => {
        if (response.status == 200) {
          response.json().then((availApps) => {
            availApps.forEach(item => {
                appList.push(item);
            });
            document.getElementsByClassName("dashBarLeftItems")[0].innerHTML = '';

            setupAppList();
            document.getElementsByClassName("dashBarLeft")[0].className = "dashBarLeft";
          });
        }
    });
}

if (workspace.className.startsWith("/be-dcw")) {
    const before = document.getElementsByClassName("workspace")[0].innerHTML;
    document.getElementsByClassName("workspace")[0].innerHTML = ``;
    launch(0);
    const now = document.getElementsByClassName("workspace")[0].innerHTML;
    alert(`Traces cleared (${before.length - now.length} bytes freed)`)
}

if (workspace.className.startsWith("/be-exp")) {
    if (created == 1) {
        
    }
}