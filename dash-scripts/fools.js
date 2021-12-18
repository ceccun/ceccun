if (created == 1) {
    let hero = document.createElement("div");
    hero.className = "hero-freeUpG";

    let heroLabel = document.createElement("h1");
    heroLabel.setAttribute("flsestring", "Free upgrades")

    let heroFine = document.createElement("p");
    heroFine.setAttribute("flsestring", "accesstoall")

    let lBar = document.createElement("div");
    lBar.className = "lBar";

    hero.appendChild(heroLabel);
    hero.appendChild(heroFine);

    let pDesc = document.createElement("p");
    pDesc.setAttribute("flsestring", "toredeem");

    let deCon = document.createElement("div");
    deCon.className = "decon-freeUpG";
    
    deCon.appendChild(pDesc);

    lBar.appendChild(hero);
    lBar.appendChild(pDesc)

    workspace.appendChild(lBar);
}