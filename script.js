document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // MEOW — INTERACTIVE VIRTUAL PET
  // =========================================

  const pet = document.getElementById("meowPet");
  const cat = document.getElementById("meowCat");
  const ball = document.getElementById("meowBall");
  const message = document.getElementById("meowMessage");
  const messageText = document.getElementById("meowText");
  const closeButton = document.getElementById("meowClose");
  const pupils = document.querySelectorAll(".meow-pupil");
  const stage = document.getElementById("meowStage");

  if (pet && cat && ball && message && messageText) {
    let idleTimer;
    let messageTimer;
    let lastTarget = "";
    let isSleeping = false;

    const defaultMessages = [
      "Hello human. What are we investigating today?",
      "I inspected your code. It needs more cat comments.",
      "Are we shipping something or just looking busy?",
      "Remember: every great engineer needs a nap.",
      "I would help debug, but I am a cat.",
      "Your keyboard looks suspiciously comfortable."
    ];

    const projectMessages = [
      "Kubescape? Excellent. Security is important. So is my security blanket.",
      "OpenTelemetry! I am monitoring your cursor movements.",
      "Knative? I approve of event-driven architecture. Very cat-like.",
      "Regolibrary! I hope those rules include a rule about feeding cats.",
      "Open source is great. Does it come with open tuna?",
      "Another contribution? Your GitHub graph approves."
    ];

    // -----------------------------------------
    // MESSAGE SYSTEM
    // -----------------------------------------

    function showMessage(text, duration = 5000) {
      messageText.textContent = text;
      message.classList.add("is-visible");

      clearTimeout(messageTimer);

      if (duration > 0) {
        messageTimer = setTimeout(() => {
          message.classList.remove("is-visible");
        }, duration);
      }
    }

    function hideMessage() {
      message.classList.remove("is-visible");
      clearTimeout(messageTimer);
    }

    function randomMessage(messages) {
      return messages[Math.floor(Math.random() * messages.length)];
    }

    // -----------------------------------------
    // WAKE UP AND IDLE
    // -----------------------------------------

    function wakeMeow() {
      if (isSleeping) {
        isSleeping = false;
        pet.classList.remove("is-sleeping");
        showMessage("I'm awake! Did someone say tuna?", 4500);
      }
    }

    function resetIdleTimer() {
      clearTimeout(idleTimer);

      if (isSleeping) return;

      idleTimer = setTimeout(() => {
        isSleeping = true;
        pet.classList.remove("is-playing");
        pet.classList.add("is-sleeping");
        hideMessage();
      }, 30000);
    }

    // -----------------------------------------
    // CAT INTERACTION
    // -----------------------------------------

    cat.addEventListener("click", () => {
      if (isSleeping) {
        wakeMeow();
      } else {
        showMessage(randomMessage(defaultMessages), 5000);
      }

      resetIdleTimer();
    });

    // -----------------------------------------
    // EYES FOLLOW THE POINTER
    // -----------------------------------------

    document.addEventListener("pointermove", (event) => {
      if (isSleeping) return;

      const catRect = cat.getBoundingClientRect();
      const centerX = catRect.left + catRect.width / 2;
      const centerY = catRect.top + catRect.height / 2;

      const angle = Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX
      );

      const distance = Math.min(
        3,
        Math.hypot(event.clientX - centerX, event.clientY - centerY) / 100
      );

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      pupils.forEach((pupil) => {
        pupil.style.transform = `translate(${x}px, ${y}px)`;
      });

      resetIdleTimer();
    });

    // -----------------------------------------
    // PROJECT AND SECTION REACTIONS
    // -----------------------------------------

    const projectCards = document.querySelectorAll(".work-item");

    projectCards.forEach((card, index) => {
      card.addEventListener("pointerenter", () => {
        wakeMeow();

        const text =
          projectMessages[index % projectMessages.length];

        showMessage(text, 4500);
        resetIdleTimer();
      });
    });

    const sectionMessages = {
      "#top": "Welcome! I was just supervising this website.",
      "#writing": "Reading time! I prefer books about fish.",
      "#about": "A little about the human behind the keyboard. Interesting!",
      "#work": "Look at all that engineering. I am impressed. Mostly."
    };

    Object.entries(sectionMessages).forEach(([selector, text]) => {
      const section = document.querySelector(selector);

      if (!section) return;

      section.addEventListener("pointerenter", () => {
        wakeMeow();
        showMessage(text, 4500);
        resetIdleTimer();
      });
    });

    // -----------------------------------------
    // PLAY WITH THE BALL
    // -----------------------------------------

    ball.addEventListener("click", () => {
      wakeMeow();

      pet.classList.remove("is-playing");

      // Restart the animation.
      void ball.offsetWidth;

      pet.classList.add("is-playing");

      showMessage("THE BALL! MY GREATEST ENEMY. 🐾", 3500);

      resetIdleTimer();

      setTimeout(() => {
        pet.classList.remove("is-playing");
      }, 2200);
    });

    // -----------------------------------------
    // CLOSE MESSAGE
    // -----------------------------------------

    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        hideMessage();
        resetIdleTimer();
      });
    }

    // -----------------------------------------
    // USER ACTIVITY
    // -----------------------------------------

    ["click", "keydown", "touchstart", "scroll"].forEach((eventName) => {
      document.addEventListener(eventName, () => {
        if (isSleeping) return;
        resetIdleTimer();
      }, { passive: true });
    });

    // -----------------------------------------
    // LET THE FUN BEGIN
    // -----------------------------------------

    resetIdleTimer();

    setTimeout(() => {
      showMessage("Psst... I'm Meow. Click the ball if you dare.", 5500);
    }, 2500);
  }

  // =========================================
  // MOBILE NAVIGATION
  // =========================================

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================================
  // LIGHT / DARK THEME
  // =========================================

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    if (themeToggle) {
      const nextTheme = theme === "dark" ? "light" : "dark";

      themeToggle.setAttribute(
        "aria-label",
        `Switch to ${nextTheme} mode`
      );

      themeToggle.setAttribute(
        "title",
        `Switch to ${nextTheme} mode`
      );
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (themeColor) {
      themeColor.setAttribute(
        "content",
        theme === "dark" ? "#111019" : "#6226fb"
      );
    }
  }

  // Restore saved preference, or use the visitor's system preference.
  const savedTheme = localStorage.getItem("portfolio-theme");

  const preferredTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches ? "dark" : "light";

  applyTheme(savedTheme || preferredTheme);

  // Toggle theme on click.
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";

      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("portfolio-theme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  // =========================================
  // COPYRIGHT YEAR
  // =========================================

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // =========================================
  // CV REQUEST — SUPABASE INTEGRATION
  // =========================================

  const cvRequestForm = document.getElementById("cvRequestForm");

  if (cvRequestForm) {
    const submitButton = document.getElementById("cvSubmitButton");
    const cvMessage = document.getElementById("cvRequestMessage");

    const SUPABASE_URL ="https://dwltwuycvszpeyzrhaar.supabase.co";

    // IMPORTANT: Replace this with your Supabase publishable key.
    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5EMeiHt8dUeq53ZPKhTZtg_9pezkhjO";

    cvRequestForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!submitButton || !cvMessage) return;

      cvMessage.textContent = "";
      cvMessage.className = "";

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      try {
        const formData = new FormData(cvRequestForm);

        const payload = {
          full_name: formData.get("full_name").trim(),
          email: formData.get("email").trim(),
          company: formData.get("company").trim(),
          job_title: formData.get("job_title").trim(),
          purpose: formData.get("purpose").trim()
        };

        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/request-cv`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify(payload)
          }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to submit your request. Please try again."
          );
        }

        cvRequestForm.reset();

        cvMessage.textContent =
          "Thank you! Your CV request has been submitted successfully. I'll review it and email you if approved.";

        cvMessage.className = "success";

      } catch (error) {
        console.error("CV request error:", error);

        cvMessage.textContent =
          error.message || "Something went wrong. Please try again.";

        cvMessage.className = "error";

      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML =
          'Submit CV request <span aria-hidden="true">↗</span>';
      }
    });
  }
});
