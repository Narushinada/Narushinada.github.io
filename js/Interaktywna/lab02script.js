const thumbs = document.querySelectorAll(".thumbnail");
const lightbox = document.getElementById("lightbox");
const fullImage = document.getElementById("fullImage");

thumbs.forEach(img => {
  img.addEventListener("click", () => {
    // Tymczasowo ukryj obraz
    fullImage.style.opacity = "0";

    const newSrc = img.dataset.full;

    // Preload nowego obrazka
    const tempImage = new Image();
    tempImage.src = newSrc;

    tempImage.onload = () => {
      fullImage.src = newSrc;
      lightbox.classList.remove("hidden");

      // Pokaż z opóźnieniem, żeby uniknąć migania
      setTimeout(() => {
        fullImage.style.opacity = "1";
      }, 10); // krótka pauza, by wymusić odświeżenie stylu
    };
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});
