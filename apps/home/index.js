class HomeScreen {
    constructor() {
        let homeElem = document.createElement("div");
        homeElem.setAttribute("id", "homeElem");
        document.getElementById("mainAppFS").appendChild(homeElem);
        fetch('/apps/gatewayPoints.json')
        .then((response) => {
            if (response.status == 200) {
               
            } else {
                errHandler(response.status, "error");
            }
        })
    }
}

new HomeScreen();