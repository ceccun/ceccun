var globalVariable = {};
var globalFlows = {
    loading: {
        js: () => {},
        html: `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <img class="loading-spinner" style="filter: var(--invert-icon);" src="/images/loading-thick-small.png">
        </div>
        `,
        css: ` 
        .loading-spinner {
            height: 30px;
            position: relative;
        }
        `
    }
}

function backToLastApp() {
    alert("Going back to last app")
}

let params = new URL(window.location).searchParams.get("flow");

const modalMain = document.getElementsByClassName("modal-main")[0];

if (!params) {
    params = "unknown"
}


async function main() {
    bootstrap();
    await fetchModals(params, () => {
        console.log("Finished fetching flows.")
        setTimeout(() => {
            goTo(1);
        }, 1000)
    })
}

function goTo(number) {
    const flows = Object.keys(globalFlows);
    console.log(flows);
    const currentFlow = flows[number];
    try{
        document.getElementsByClassName("current")[0].className = "outgoing";
    }catch(err){}

    if (!document.getElementById(currentFlow)) {
        const element = document.createElement("div");
        element.className = "current";
        element.id = currentFlow;
        element.innerHTML = globalFlows[currentFlow].html;
    
        modalMain.appendChild(element);
    } else {
        document.getElementById(currentFlow).className = "current"
    }

    globalFlows[currentFlow].js();
}

function bootstrap() {
    const element = document.createElement("div");
    element.className = "current";
    element.innerHTML = globalFlows.loading.html;
    
    modalMain.appendChild(element);

    const style = document.createElement("style");
    style.innerHTML = globalFlows.loading.css;
    modalMain.appendChild(style)
}

function endCheckFetchModals(cb) {
    if (Object.keys(globalFlows).length > 1) {
        cb()
    } else {
        endCheckFetchModals(cb);
    }
}

async function fetchModals(url, cb) {
    await fetch(`/modals/${url}/index.js`).then(async(response) => {
        if (response.status == 200) {
            await response.text().then(async(data) => {
                const involvedScript = new Function('', data);

                (involvedScript()).forEach((item, index) => {

                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", `/modals/${url}/js/${item}`, true);

                    xhr.onload = async function (e) {
                        if (xhr.readyState === 4) {
                          if (xhr.status === 200) {
                            const itemJs = xhr.responseText;

                            const itemExecutable = new Function('', itemJs);

                            const available = await itemExecutable();

                            globalFlows[item] = {};

                            available.forEach(async(JSItem, index) => {
                                if (JSItem.name == "getLayout") {
                                    globalFlows[item]["html"] = await JSItem();
                                }
                                if (JSItem.name == "getStyles") {
                                    globalFlows[item]["css"] = await JSItem();
                                }
                                if (JSItem.name == "exec") {
                                    globalFlows[item]["js"] = JSItem;
                                }
                            })

                          } else {
                            console.error(xhr.statusText);
                          }
                        }
                    };

                    xhr.send()

                    // await fetch(`/modals/${url}/js/${item}`).then(async(response) => {
                    //     if (response.status == 200) {
                    //         await response.text().then(async(itemJs) => {
                    //             const itemExecutable = new Function('', itemJs);

                    //             const available = await itemExecutable();

                    //             globalFlows[item] = {};
                    //             await available.forEach(async(JSItem, index) => {
                    //                 if (JSItem.name == "getLayout") {
                    //                     globalFlows[item]["html"] = await JSItem();
                    //                 }
                    //                 if (JSItem.name == "getStyles") {
                    //                     globalFlows[item]["css"] = await JSItem();
                    //                 }
                    //                 if (JSItem.name == "exec") {
                    //                     globalFlows[item]["js"] = JSItem;
                    //                 }
                    //             })


                    //         })
                    //     }
                    // })
                })

                const timeFrame = setInterval(check, 1000)
        
                function check() {
                    console.log(Object.keys(globalFlows).length, (involvedScript()).length + 1)
                    if (Object.keys(globalFlows).length == ((involvedScript()).length + 1)) {
                        cb()
                        clearInterval(timeFrame)
                    }
                }
            })
        }
    })
}

window.onload = main