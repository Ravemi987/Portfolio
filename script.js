document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFooter();
  initTypeWriter();
  initScrollAnimations();
  initClipboard();
});

// --- Chargement Navbar & Footer ---
function initNavbar() {
  const navPlaceholder = document.getElementById("navbar-placeholder");
  if (navPlaceholder) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(data => {
        navPlaceholder.innerHTML = data;
        setupMobileMenu(); // Initialise le burger une fois le HTML chargé
      })
      .catch(err => console.error("Erreur chargement navbar:", err));
  }
}

function initFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("footer.html")
      .then(res => res.text())
      .then(data => footerPlaceholder.innerHTML = data);
  }
}

// --- Menu Burger Mobile ---
function setupMobileMenu() {
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      burger.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("open", isOpen);
    });

    // Fermer le menu si on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove("active");
        burger.classList.remove("is-open");
        document.body.classList.remove("open");
      });
    });
  }
}

// --- Animation Scroll (Intersection Observer) ---
// Beaucoup plus performant que window.addEventListener('scroll')
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionnel: arrêter d'observer une fois apparu pour économiser des ressources
        // observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 }); // Se déclenche quand 10% de l'élément est visible

  document.querySelectorAll('.scroll-appear').forEach(el => observer.observe(el));
}

// --- Machine à écrire (Typewriter) ---
function initTypeWriter() {
  const title = document.getElementById("typedText");
  if (!title) return;

  const text = title.getAttribute("data-text") || "Welcome";
  let i = 0;
  let isDeleting = false;
  let timer;

  function type() {
    const speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && i < text.length) {
      title.textContent += text.charAt(i);
      i++;
    } else if (isDeleting && i > 0) {
      title.textContent = text.substring(0, i - 1);
      i--;
    }

    if (!isDeleting && i === text.length) {
      isDeleting = true;
      timer = setTimeout(type, 2000); // Pause avant d'effacer
      return;
    } else if (isDeleting && i === 0) {
      isDeleting = false;
      timer = setTimeout(type, 500); // Pause avant de réécrire
      return;
    }

    timer = setTimeout(type, speed);
  }
  
  type();
}

// --- Copier Email ---
function initClipboard() {
  const btn = document.getElementById("copyButton");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const text = btn.dataset.copyText;
    try {
      await navigator.clipboard.writeText(text);
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Copié !`;
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 2000);
    } catch (err) {
      console.error("Erreur copie", err);
    }
  });
}