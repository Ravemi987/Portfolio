// navbar, footer
document.addEventListener("DOMContentLoaded", () => {
  const nav_placeholder = document.getElementById("navbar-placeholder");
  const footer_placeholder = document.getElementById("footer-placeholder")

  if (nav_placeholder) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(data => {
        nav_placeholder.innerHTML = data;
      });
  }

  if (footer_placeholder) {
    fetch("footer.html")
      .then(res => res.text())
      .then(data => {
        footer_placeholder.innerHTML = data;
      });
  }
});


// ----------------

// Effets d'apparition au scroll
const scrollElements = document.querySelectorAll('.scroll-appear');

const elementInView = (el, offset = 0) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <= 
    (window.innerHeight || document.documentElement.clientHeight) - offset
  );
};

const displayScrollElement = (el) => {
  el.classList.add('visible');
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 50)) { // 50px avant que l'élément soit visible
      displayScrollElement(el);
    }
  });
};

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);

// -----------------

// Animation machine à écrire
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("typedText");
  const fullText = title.getAttribute("data-text") || "Welcome to my Portfolio ⚡";
  let i = 0;
  let typingInterval;

  const delayBeforeDeleting = 30_000;
  const delayBeforeTyping = 2_000;
  const typingSpeed = 100

  function typeWriter() {
    if (i < fullText.length) {
      title.textContent += fullText[i];
      i++;
    } else {
      clearInterval(typingInterval);
      setTimeout(startDeleting, delayBeforeDeleting);
    }
  }

  function startTyping() {
    title.textContent = "";
    i = 0;
    typingInterval = setInterval(typeWriter, typingSpeed);
  }

  function deleteWriter() {
    if (i > 0) {
      title.textContent = fullText.substring(0, i - 1);
      i--;
    } else {
      clearInterval(typingInterval);
      setTimeout(startTyping, delayBeforeTyping);
    }
  }

  function startDeleting() {
    typingInterval = setInterval(deleteWriter, typingSpeed);
  }

  startTyping();
});
