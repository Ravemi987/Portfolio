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

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("typedText");
  const fullText = "Bienvenue dans mon univers ⚡";
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
