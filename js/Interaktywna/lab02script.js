function showPhoto(thumbnail) {
    const photoViewer = document.getElementById("photoViewer");
    const imgSrc = thumbnail.querySelector("img").src;

    photoViewer.querySelector("img").src = imgSrc;
    photoViewer.style.display = "block";
    photoViewer.style.transform = "translate(0%, 0%) scale(1)";
}
