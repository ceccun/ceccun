const bigimages = [
    `/images/promo/flse/FLSE-${settings.longLan.split("_")[0]}.svg`
]

const setupSlideshow = () => {
    const imageViewer = document.getElementById("slideshow-image");

    imageViewer.src = bigimages[0];
}

setupSlideshow();