// navbar, footer
document.addEventListener("DOMContentLoaded", () => {
  const nav_placeholder = document.getElementById("navbar-placeholder");
  const footer_placeholder = document.getElementById("footer-placeholder")

  if (nav_placeholder) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(data => {
        nav_placeholder.innerHTML = data;
        initNavbarFeatures();
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


function initNavbarFeatures() {
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");

  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("active");
      burger.classList.toggle("is-open", open);
      document.body.classList.toggle('open');
    });
  }
}


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
  const fullText = title.getAttribute("data-text") || "Welcome to my Portfolio ";
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


// Copie dans le presse-papiers

let canClick = true;
const clickCooldown = 2000; // 2 secondes de cooldown entre les clics
const copyButton = document.getElementById("copyButton");

copyButton.addEventListener("click", async () => {
  if (!canClick) return;

  canClick = false;

  const textToCopy = copyButton.dataset.copyText;

  try {
    await navigator.clipboard.writeText(textToCopy);

    // sauvegarder l'état original
    const originalHTML = copyButton.innerHTML;

    // mettre l'état “copié”
    copyButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 13.5L4 10L5.5 8.5L7.5 10.5L14.5 3.5L16 5L7.5 13.5Z"/>
      </svg>
      Copié
    `;

    // revenir à l'état original après 2 secondes
    setTimeout(() => {
      copyButton.innerHTML = originalHTML;
      canClick = true;
    }, clickCooldown);

  } catch (err) {
    console.error("Erreur lors de la copie: ", err);
  }
});
