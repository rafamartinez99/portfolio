const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar ul li a");
const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  const icon = hamburger.querySelector("i");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-xmark");
});

// Cerrar menú al hacer clic en un link
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    const icon = hamburger.querySelector("i");
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-xmark");
  });
});

function updateActiveLink() {
  const scrollY = window.scrollY;
  const pageBottom = window.innerHeight + scrollY;
  const docHeight = document.body.offsetHeight;

  // Si estamos al final del todo → última sección activa
  if (pageBottom >= docHeight - 5) {
    setActive(sections[sections.length - 1].id);
    return;
  }

  // Si estamos arriba del todo → inicio activo
  if (scrollY < 100) {
    setActive("home");
    return;
  }

  // Buscar qué sección ocupa el centro de la pantalla
  const middle = scrollY + window.innerHeight / 2;

  let currentId = sections[0].id;
  for (const section of sections) {
    if (section.offsetTop <= middle) {
      currentId = section.id;
    }
  }

  setActive(currentId);
}

function setActive(id) {
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

// SCROLL REVEAL

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -60px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);
