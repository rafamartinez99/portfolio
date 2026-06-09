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
  threshold: 0.08,
  rootMargin: "0px 0px -20px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);

// Typing effect
function typeText(element, text, speed, keepCursor, onDone) {
  const cursor = document.createElement("span");
  cursor.classList.add("typing-cursor");
  cursor.textContent = "|";
  element.appendChild(cursor);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
    } else {
      clearInterval(interval);
      if (keepCursor) {
        let blinks = 0;
        const blinkInterval = setInterval(() => {
          blinks++;
          if (blinks >= 2) {
            clearInterval(blinkInterval);
            cursor.classList.add("done");
            if (onDone) onDone();
          }
        }, 500);
      } else {
        cursor.classList.add("done");
        setTimeout(() => { if (onDone) onDone(); }, 500);
      }
    }
  }, speed);
}

const subtitleEl = document.querySelector(".subtitle");
const pitchEl = document.querySelector(".pitch");
const subtitleText = subtitleEl.dataset.text;
const pitchText = pitchEl.dataset.text;

setTimeout(() => {
  typeText(subtitleEl, subtitleText, 65, false, () => {
    typeText(pitchEl, pitchText, 55, true, null);
  });
}, 1000);

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Back to top button
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Animated stats counters
const statNumbers = document.querySelectorAll(".stat-number");

function animateCounter(el) {
  if (el.dataset.text) {
    el.textContent = el.dataset.text;
    return;
  }

  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// Cursor spotlight (desktop only)
if (window.matchMedia("(hover: hover)").matches) {
  const spotlight = document.getElementById("cursor-spotlight");

  document.addEventListener("mousemove", (e) => {
    spotlight.style.left = e.clientX + "px";
    spotlight.style.top = e.clientY + "px";
    spotlight.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    spotlight.style.opacity = "0";
  });
}
