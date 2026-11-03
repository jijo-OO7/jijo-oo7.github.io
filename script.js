
/* =========================================
   SUMAN MANDAL — WEBSITE INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // COPYRIGHT YEAR
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // PURPLE — INTERACTIVE CAT COMPANION
  const companion = document.getElementById("purpleCompanion");
  const cat = document.getElementById("purpleCat");
  const bubble = document.getElementById("purpleBubble");
  const message = document.getElementById("purpleMessage");
  const closeButton = document.getElementById("purpleClose");

  if (!companion || !cat || !bubble || !message) {
    return;
  }

  const suggestions = {
    top: {
      text: "Hey! I'm Purple. Welcome to Suman's corner of the internet!",
      link: "#work",
      action: "Explore his work"
    },

    work: {
      text: "Lots of open-source engineering here! Start with Kubescape.",
      link: "https://github.com/kubescape/kubescape",
      action: "Explore Kubescape"
    },

    writing: {
      text: "Curious about how Suman protects security scan reports? Read this!",
      link: "https://kubescape.io/blog/2026/07/24/kubescape-report-metadata-protection/",
      action: "Read the article"
    },

    about: {
      text: "Go, Kubernetes, security and observability. That's his world!",
      link: "#about",
      action: "See his background"
    }
  };

  let currentSection = "top";
  let lastMessage = "";
  let walkingTimeout;
  let dismissed = false;

  // Show a message
  function showMessage(text, link, action) {
    if (dismissed) return;

    message.textContent = text;

    // Remove any previous action
    const oldAction = bubble.querySelector(".purple-action");

    if (oldAction) {
      oldAction.remove();
    }

    // Add contextual action
    if (link && action) {
      const actionLink = document.createElement("a");

      actionLink.className = "purple-action";
      actionLink.href = link;
      actionLink.textContent = action + " ↗";

      if (link.startsWith("https://")) {
        actionLink.target = "_blank";
        actionLink.rel = "noopener noreferrer";
      }

      bubble.appendChild(actionLink);
    }

    bubble.classList.remove("is-hidden");
    cat.setAttribute("aria-expanded", "true");
    lastMessage = text;
  }

  // Detect which section the visitor is reading
  const sections = [
    { id: "top", element: document.getElementById("top") },
    { id: "work", element: document.getElementById("work") },
    { id: "writing", element: document.getElementById("writing") },
    { id: "about", element: document.getElementById("about") }
  ].filter(section => section.element);

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleSections.length) return;

      const nextSection = sections.find(
        section => section.element === visibleSections[0].target
      );

      if (!nextSection || nextSection.id === currentSection) return;

      currentSection = nextSection.id;

      const suggestion = suggestions[currentSection];

      if (suggestion && suggestion.text !== lastMessage) {
        showMessage(
          suggestion.text,
          suggestion.link,
          suggestion.action
        );
      }

      // Make Purple take a little stroll
      companion.classList.add("is-walking");

      clearTimeout(walkingTimeout);

      walkingTimeout = setTimeout(() => {
        companion.classList.remove("is-walking");
      }, 1800);
    },
    {
      rootMargin: "-20% 0px -35% 0px",
      threshold: [0.1, 0.3, 0.5]
    }
  );

  sections.forEach(section => {
    observer.observe(section.element);
  });

  // Click the cat to get another suggestion
  cat.addEventListener("click", () => {
    if (dismissed) return;

    const suggestion = suggestions[currentSection] || suggestions.top;

    if (bubble.classList.contains("is-hidden")) {
      showMessage(
        suggestion.text,
        suggestion.link,
        suggestion.action
      );
    } else {
      showMessage(
        "Psst! You can explore the projects, read the blog, or check out Suman's CV.",
        "/assets/Suman-Mandal-CV.pdf",
        "View the CV"
      );
    }

    companion.classList.add("is-walking");

    clearTimeout(walkingTimeout);

    walkingTimeout = setTimeout(() => {
      companion.classList.remove("is-walking");
    }, 1200);
  });

  // Dismiss Purple completely
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      dismissed = true;
      companion.classList.add("is-dismissed");
      observer.disconnect();
      clearTimeout(walkingTimeout);
    });
  }

  // Initial welcome message
  showMessage(
    suggestions.top.text,
    suggestions.top.link,
    suggestions.top.action
  );

});
