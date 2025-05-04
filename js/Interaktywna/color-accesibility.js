
function setTheme(theme) {
const body = document.body;
body.classList.remove('theme-default', 'theme-deuteranopia', 'theme-protanopia', 'theme-tritanopia');
body.classList.add(`theme-${theme}`);
localStorage.setItem('theme', theme); // Zapamiętaj wybór
}

// Ustaw motyw po odświeżeniu
const savedTheme = localStorage.getItem('theme') || 'default';
document.body.classList.add(`theme-${savedTheme}`);

