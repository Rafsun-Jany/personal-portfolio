document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-links");

  if (navToggle && navList) {
    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("nav-open", !expanded);
    });

    document.addEventListener("click", (event) => {
      if (!navList.classList.contains("nav-open")) {
        return;
      }
      if (!navList.contains(event.target) && event.target !== navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navList.classList.remove("nav-open");
      }
    });

    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navList.classList.remove("nav-open");
      });
    });
  }

  const themeToggle = document.querySelector(".theme-toggle");
  const themeLabel = themeToggle ? themeToggle.querySelector(".theme-toggle-label") : null;
  const themeStorageKey = "portfolio-theme";
  const storage = (() => {
    try {
      const probeKey = "__theme_probe__";
      window.localStorage.setItem(probeKey, "1");
      window.localStorage.removeItem(probeKey);
      return window.localStorage;
    } catch (error) {
      return null;
    }
  })();
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (theme, persist = false) => {
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.dataset.theme = theme;
      const toggleLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
      themeToggle.setAttribute("aria-label", toggleLabel);
      if (themeLabel) {
        themeLabel.textContent = isDark ? "Dark" : "Light";
      }
    }
    if (persist) {
      storage?.setItem(themeStorageKey, theme);
    }
  };

  const storedTheme = storage ? storage.getItem(themeStorageKey) : null;
  const initialTheme =
    storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : prefersDarkScheme.matches
      ? "dark"
      : "light";
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  }

  const handlePreferenceChange = (event) => {
    if (!storage || !storage.getItem(themeStorageKey)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  };

  if (typeof prefersDarkScheme.addEventListener === "function") {
    prefersDarkScheme.addEventListener("change", handlePreferenceChange);
  } else if (typeof prefersDarkScheme.addListener === "function") {
    prefersDarkScheme.addListener(handlePreferenceChange);
  }

  const toast = document.querySelector(".toast");
  let toastTimeout;
  const showToast = (message) => {
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2400);
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      if (!value) {
        return;
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const temp = document.createElement("textarea");
          temp.value = value;
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.append(temp);
          temp.select();
          document.execCommand("copy");
          temp.remove();
        }
        showToast("Email copied to clipboard.");
      } catch (error) {
        showToast("Copy failed. Try again.");
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = Number(entry.target.getAttribute("data-delay") || 0);
              setTimeout(() => entry.target.classList.add("is-visible"), delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealElements.forEach((element) => observer.observe(element));
    }
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const statCounters = document.querySelectorAll(".stat-number[data-count-to]");
  if (statCounters.length > 0) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateCounter = (element, value, formatter) => {
      const suffixNode = element.querySelector(".stat-number-suffix");
      const valueNode = element.querySelector(".stat-number-value");
      const suffix = element.dataset.suffix || "";
      if (suffixNode) {
        suffixNode.textContent = suffix;
      }
      if (valueNode) {
        valueNode.textContent = formatter.format(value);
      } else {
        element.textContent = formatter.format(value) + suffix;
      }
      const label = element.dataset.label || "";
      const accessibleValue = `${formatter.format(value)}${suffix}`.trim();
      element.setAttribute("aria-label", label ? `${accessibleValue} ${label}` : accessibleValue);
    };

    const animateCounter = (element) => {
      if (element.dataset.animated === "true") {
        return;
      }

      const target = Number(element.dataset.countTo || 0);
      const decimals = Number.parseInt(element.dataset.decimals || "0", 10);
      const formatter = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const duration = 1400;
      const startTimestamp = performance.now();

      element.dataset.animated = "true";
      element.classList.add("is-animating");

      const step = (timestamp) => {
        const progress = Math.min(1, (timestamp - startTimestamp) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue =
          decimals > 0 ? Number((target * eased).toFixed(decimals)) : Math.round(target * eased);
        updateCounter(element, currentValue, formatter);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          updateCounter(element, target, formatter);
          element.classList.remove("is-animating");
        }
      };

      requestAnimationFrame(step);
    };

    if (prefersReducedMotion) {
      statCounters.forEach((element) => {
        const target = Number(element.dataset.countTo || 0);
        const decimals = Number.parseInt(element.dataset.decimals || "0", 10);
        const formatter = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        updateCounter(element, target, formatter);
        element.classList.remove("is-animating");
        element.dataset.animated = "true";
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      statCounters.forEach((element) => {
        counterObserver.observe(element);
      });
    }
  }

  const heroRotatorText = document.getElementById("hero-rotator-text");
  const heroSection = document.querySelector(".hero");
  if (heroRotatorText && heroSection) {
    const heroPhrases = [
      "Shipping nearly zero-downtime releases",
      "Instrumenting systems for instant insights",
      "Designing resilient event flows",
    ];
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let phraseIndex = 0;
    heroRotatorText.textContent = heroPhrases[phraseIndex];

    if (!motionQuery.matches && heroPhrases.length > 1) {
      let rotateTimer = null;
      const changeDelay = 220;
      const intervalDelay = 3800;

      const stepPhrase = () => {
        heroRotatorText.classList.add("is-changing");
        setTimeout(() => {
          phraseIndex = (phraseIndex + 1) % heroPhrases.length;
          heroRotatorText.textContent = heroPhrases[phraseIndex];
          heroRotatorText.classList.remove("is-changing");
        }, changeDelay);
      };

      const startRotator = () => {
        if (rotateTimer) {
          return;
        }
        rotateTimer = setInterval(stepPhrase, intervalDelay);
      };

      const stopRotator = () => {
        if (!rotateTimer) {
          return;
        }
        clearInterval(rotateTimer);
        rotateTimer = null;
      };

      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startRotator();
            } else {
              stopRotator();
            }
          });
        },
        { threshold: 0.45 }
      );

      heroObserver.observe(heroSection);
      if (heroSection.getBoundingClientRect().top < window.innerHeight) {
        startRotator();
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopRotator();
        } else if (heroSection.getBoundingClientRect().top < window.innerHeight) {
          startRotator();
        }
      });
    }
  }

  const heroGlow = document.querySelector(".hero-glow");
  if (heroGlow && heroSection) {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    heroGlow.classList.add("is-idle");
    heroGlow.style.setProperty("--glow-x", "50%");
    heroGlow.style.setProperty("--glow-y", "45%");

    if (!motionQuery.matches) {
      const updateGlow = (clientX, clientY) => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        heroGlow.style.setProperty("--glow-x", `${Math.min(Math.max(x, 0), 100).toFixed(2)}%`);
        heroGlow.style.setProperty("--glow-y", `${Math.min(Math.max(y, 0), 100).toFixed(2)}%`);
      };

      const handlePointerMove = (event) => {
        heroGlow.classList.remove("is-idle");
        updateGlow(event.clientX, event.clientY);
      };

      const handlePointerLeave = () => {
        heroGlow.classList.add("is-idle");
        heroGlow.style.setProperty("--glow-x", "50%");
        heroGlow.style.setProperty("--glow-y", "45%");
      };

      heroSection.addEventListener("pointermove", handlePointerMove, { passive: true });
      heroSection.addEventListener("pointerleave", handlePointerLeave);
      heroSection.addEventListener("pointerdown", (event) => {
        heroGlow.classList.remove("is-idle");
        updateGlow(event.clientX, event.clientY);
      });
    }
  }

  const heroDoodleCanvas = document.getElementById("hero-doodle");
  if (heroDoodleCanvas && heroSection) {
    const ctx = heroDoodleCanvas.getContext("2d");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let doodleFrame = null;

    const getPalette = () =>
      document.body.classList.contains("theme-dark")
        ? ["rgba(96, 165, 250, 0.6)", "rgba(14, 165, 233, 0.5)", "rgba(45, 212, 191, 0.45)"]
        : ["rgba(37, 99, 240, 0.35)", "rgba(14, 165, 233, 0.28)", "rgba(34, 197, 94, 0.25)"];

    const resizeCanvas = () => {
      const rect = heroSection.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      heroDoodleCanvas.width = rect.width * dpr;
      heroDoodleCanvas.height = rect.height * dpr;
      heroDoodleCanvas.style.width = `${rect.width}px`;
      heroDoodleCanvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      const width = heroDoodleCanvas.width / (window.devicePixelRatio || 1);
      const height = heroDoodleCanvas.height / (window.devicePixelRatio || 1);
      const palette = getPalette();
      ctx.clearRect(0, 0, width, height);
      palette.forEach((color, index) => {
        const amplitude = 14 + index * 6;
        ctx.beginPath();
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = color;
        for (let x = 0; x <= width; x += 14) {
          const angle = (x / width) * Math.PI * 2 + index * 0.8;
          const y = height * 0.45 + Math.sin(angle) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };

    const animateCanvas = (timestamp) => {
      const width = heroDoodleCanvas.width / (window.devicePixelRatio || 1);
      const height = heroDoodleCanvas.height / (window.devicePixelRatio || 1);
      const palette = getPalette();
      ctx.clearRect(0, 0, width, height);
      palette.forEach((color, index) => {
        const amplitude = 16 + index * 7;
        ctx.beginPath();
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = color;
        for (let x = 0; x <= width; x += 12) {
          const phase = timestamp / 1400 + index * 0.6;
          const angle = (x / width) * Math.PI * 2;
          const y = height * 0.42 + Math.sin(angle + phase) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      doodleFrame = requestAnimationFrame(animateCanvas);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (motionQuery.matches) {
      drawStatic();
    } else {
      const startAnimation = () => {
        if (doodleFrame !== null) {
          return;
        }
        doodleFrame = requestAnimationFrame(animateCanvas);
      };

      const stopAnimation = () => {
        if (doodleFrame !== null) {
          cancelAnimationFrame(doodleFrame);
          doodleFrame = null;
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimation();
            } else {
              stopAnimation();
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(heroSection);
      if (heroSection.getBoundingClientRect().top < window.innerHeight) {
        startAnimation();
      }

      motionQuery.addEventListener("change", (event) => {
        stopAnimation();
        if (event.matches) {
          drawStatic();
        } else if (heroSection.getBoundingClientRect().top < window.innerHeight) {
          startAnimation();
        }
      });
    }
  }

  const projectFilterButtons = document.querySelectorAll(".project-filter");
  const projectCards = document.querySelectorAll(".projects-grid .project-card");
  if (projectFilterButtons.length > 0 && projectCards.length > 0) {
    const filterGroup = document.querySelector(".project-filters");

    const activateFilter = (target) => {
      projectFilterButtons.forEach((button) => {
        const isActive = button === target;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
        button.setAttribute("tabindex", isActive ? "0" : "-1");
      });
      if (filterGroup && target.id) {
        filterGroup.setAttribute("aria-activedescendant", target.id);
      }
    };

    const applyFilter = (filter) => {
      const normalized = filter || "all";
      projectCards.forEach((card) => {
        const category = card.dataset.category || "all";
        const shouldShow = normalized === "all" || category === normalized;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    };

    projectFilterButtons.forEach((button, index) => {
      const filterValue = button.dataset.filter || "all";
      if (!button.id) {
        button.id = `project-filter-${filterValue}`;
      }

      button.addEventListener("click", () => {
        activateFilter(button);
        applyFilter(filterValue);
      });

      button.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) {
          return;
        }
        event.preventDefault();
        const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (index + direction + projectFilterButtons.length) % projectFilterButtons.length;
        projectFilterButtons[nextIndex].focus();
      });
    });

    const firstButton = projectFilterButtons[0];
    activateFilter(firstButton);
    applyFilter("all");
    if (filterGroup && firstButton.id) {
      filterGroup.setAttribute("aria-activedescendant", firstButton.id);
    }
  }

  const confettiCanvas = document.getElementById("confetti-canvas");
  const confettiTriggers = document.querySelectorAll("[data-confetti-trigger]");
  if (confettiCanvas && confettiTriggers.length > 0) {
    const ctx = confettiCanvas.getContext("2d");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const colors = ["#38bdf8", "#f97316", "#facc15", "#22c55e", "#a855f7"];
    let confettiPieces = [];
    let confettiFrame = null;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      confettiCanvas.width = window.innerWidth * dpr;
      confettiCanvas.height = window.innerHeight * dpr;
      confettiCanvas.style.width = "100%";
      confettiCanvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const renderConfetti = () => {
      const width = confettiCanvas.width / (window.devicePixelRatio || 1);
      const height = confettiCanvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      confettiPieces = confettiPieces.filter((piece) => piece.y < height + 20 && piece.life > 0);

      confettiPieces.forEach((piece) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += piece.gravity;
        piece.rotation += piece.rotationSpeed;
        piece.life -= piece.fade;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = piece.color;
        ctx.globalAlpha = Math.max(piece.life, 0);
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
        ctx.restore();
      });

      if (confettiPieces.length > 0) {
        confettiFrame = requestAnimationFrame(renderConfetti);
      } else {
        confettiFrame = null;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const launchConfetti = () => {
      if (motionQuery.matches) {
        return;
      }

      const width = confettiCanvas.width / (window.devicePixelRatio || 1);
      const height = confettiCanvas.height / (window.devicePixelRatio || 1);
      const pieceCount = width < 640 ? 50 : 90;

      confettiPieces = Array.from({ length: pieceCount }, () => {
        const angle = Math.random() * Math.PI;
        const speed = 2 + Math.random() * 3;
        return {
          x: width / 2 + (Math.random() - 0.5) * (width * 0.4),
          y: height * 0.1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          size: 8 + Math.random() * 6,
          gravity: 0.05 + Math.random() * 0.12,
          life: 1,
          fade: 0.008 + Math.random() * 0.006,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });

      if (confettiFrame !== null) {
        cancelAnimationFrame(confettiFrame);
        confettiFrame = null;
      }
      renderConfetti();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    confettiTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        launchConfetti();
      });
    });
  }

  const reactionButtons = document.querySelectorAll(".reaction-btn");
  if (reactionButtons.length > 0 && heroSection) {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reactionStorageKey = "portfolio-hero-reactions";
    let reactionState = {};

    if (storage) {
      try {
        const stored = storage.getItem(reactionStorageKey);
        if (stored) {
          reactionState = JSON.parse(stored);
        }
      } catch (error) {
        reactionState = {};
      }
    }

    const setButtonCount = (button, count) => {
      button.dataset.count = String(count);
      const countNode = button.querySelector(".reaction-count");
      if (countNode) {
        countNode.textContent = String(count);
      }
      const label = button.querySelector(".reaction-label")?.textContent || "Reaction";
      button.setAttribute("aria-label", `${label} (${count})`);
    };

    const emojiOptions = {
      applause: ["\uD83D\uDC4F", "\uD83D\uDE4C", "\uD83D\uDCAA"],
      rocket: ["\uD83D\uDE80", "\uD83D\uDEF8", "\uD83D\uDEE2"],
      idea: ["\uD83D\uDCA1", "\u2728", "\uD83D\uDD2D"],
    };

    const spawnBurst = (button, reaction) => {
      if (motionQuery.matches) {
        return;
      }
      const burst = document.createElement("span");
      burst.className = "reaction-burst";
      const defaultEmoji = button.querySelector(".reaction-emoji")?.textContent || "\u2B50";
      const choices = emojiOptions[reaction] || [defaultEmoji];
      burst.textContent = choices[Math.floor(Math.random() * choices.length)];

      const buttonRect = button.getBoundingClientRect();
      const heroRect = heroSection.getBoundingClientRect();
      const left = buttonRect.left + buttonRect.width / 2 - heroRect.left;
      const top = buttonRect.top - heroRect.top;

      burst.style.left = `${left}px`;
      burst.style.top = `${top}px`;

      heroSection.appendChild(burst);
      burst.addEventListener("animationend", () => burst.remove());
      setTimeout(() => burst.remove(), 1200);
    };

    reactionButtons.forEach((button) => {
      const reaction = button.dataset.reaction || "reaction";
      const initial = Number.parseInt(button.dataset.count || "0", 10);
      const storedCount = Number.parseInt(reactionState[reaction], 10);
      const startingCount = Number.isFinite(storedCount) && storedCount > initial ? storedCount : initial;
      setButtonCount(button, startingCount);

      button.addEventListener("click", () => {
        const current = Number.parseInt(button.dataset.count || "0", 10) || 0;
        const next = current + 1;
        setButtonCount(button, next);
        button.classList.add("is-animating");
        setTimeout(() => button.classList.remove("is-animating"), 360);
        spawnBurst(button, reaction);

        reactionState[reaction] = next;
        if (storage) {
          try {
            storage.setItem(reactionStorageKey, JSON.stringify(reactionState));
          } catch (error) {
            // ignore quota errors
          }
        }
      });
    });
  }

  const navAnchors = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  if (navAnchors.length > 0) {
    const sectionTargets = navAnchors
      .map((anchor) => {
        const id = anchor.getAttribute("href");
        if (!id) {
          return null;
        }
        const section = document.querySelector(id);
        return section ? { anchor, section } : null;
      })
      .filter((entry) => entry);

    const clearActive = () => {
      navAnchors.forEach((link) => {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });
    };

    const setActiveLink = (anchor) => {
      clearActive();
      anchor.classList.add("is-active");
      anchor.setAttribute("aria-current", "page");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach((entry) => {
            const match = sectionTargets.find((target) => target.section === entry.target);
            if (match) {
              setActiveLink(match.anchor);
            }
          });
      },
      {
        rootMargin: "-48% 0px -48% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionTargets.forEach((target) => observer.observe(target.section));

    navAnchors.forEach((link) => {
      link.addEventListener("click", () => {
        setActiveLink(link);
      });
    });
  }

  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  if (scrollProgressBar) {
    const updateScrollProgress = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const progressRatio = scrollHeight > 0 ? Math.min(window.scrollY / scrollHeight, 1) : 0;
      scrollProgressBar.style.width = `${(progressRatio * 100).toFixed(2)}%`;
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
  }

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const toggleBackToTop = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    };

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
  }

  const contactClockWrapper = document.getElementById("contact-clock");
  const contactClockValue = document.getElementById("contact-local-time");
  if (contactClockWrapper && contactClockValue) {
    const contactClockZone = document.getElementById("contact-clock-zone");
    const contactClockStatus = document.getElementById("contact-clock-status");
    const clockIndicator = contactClockWrapper.querySelector(".contact-clock-indicator");
    const locale = navigator.language || "en-US";

    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });
    const zoneFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      timeZoneName: "short",
    });
    const hourFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Dhaka",
    });

    const updateClock = () => {
      const now = new Date();
      const timeString = timeFormatter.format(now);
      contactClockValue.textContent = timeString;

      let zoneLabel = "GMT+6";
      if (contactClockZone) {
        const parts = zoneFormatter.formatToParts(now);
        zoneLabel = parts.find((part) => part.type === "timeZoneName")?.value?.trim() || zoneLabel;
        contactClockZone.textContent = zoneLabel;
      }

      const hour = Number.parseInt(hourFormatter.format(now), 10);
      const isWorkingHour = Number.isFinite(hour) && hour >= 9 && hour < 19;
      if (contactClockStatus) {
        contactClockStatus.textContent = isWorkingHour ? "Within working hours" : "Off hours";
      }
      contactClockWrapper.dataset.online = isWorkingHour ? "true" : "false";

      const statusLabel = isWorkingHour ? "Available now" : "Outside working hours";
      contactClockWrapper.setAttribute("aria-label", `Local time ${timeString} ${zoneLabel} - ${statusLabel}`);

      if (clockIndicator) {
        clockIndicator.setAttribute("aria-hidden", "true");
      }
    };

    updateClock();
    setInterval(updateClock, 60000);
  }

  const supportsHover = window.matchMedia ? window.matchMedia("(hover: hover)") : null;
  const resumePreviews = document.querySelectorAll(".resume-preview");
  resumePreviews.forEach((resumePreview) => {
    const trigger = resumePreview.querySelector(".resume-preview-trigger");
    const panel = resumePreview.querySelector(".resume-preview-panel");
    const content = panel ? panel.querySelector("[data-preview-content]") : null;
    let showTimer = null;
    let hideTimer = null;

    const setPanelVisibility = (visible) => {
      if (!panel) {
        return;
      }
      if (visible) {
        resumePreview.classList.add("is-preview-visible");
        panel.setAttribute("aria-hidden", "false");
      } else {
        resumePreview.classList.remove("is-preview-visible");
        panel.setAttribute("aria-hidden", "true");
      }
    };

    const loadPreview = () => {
      if (!panel || !content || panel.dataset.loaded === "true") {
        return;
      }
      const source = trigger?.getAttribute("data-preview") || trigger?.getAttribute("href");
      if (!source) {
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = source;
      iframe.title = "Resume preview";
      iframe.loading = "lazy";
      iframe.setAttribute("aria-label", "Resume preview");
      content.innerHTML = "";
      content.appendChild(iframe);
      panel.dataset.loaded = "true";
    };

    const openPanel = (instant = false) => {
      clearTimeout(hideTimer);
      const delay = instant || supportsHover?.matches === false ? 0 : 150;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => {
        loadPreview();
        setPanelVisibility(true);
      }, delay);
    };

    const closePanel = (instant = false) => {
      clearTimeout(showTimer);
      const delay = instant ? 0 : 160;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setPanelVisibility(false);
      }, delay);
    };

    if (supportsHover?.matches ?? true) {
      resumePreview.addEventListener("pointerenter", () => openPanel(false));
      resumePreview.addEventListener("pointerleave", (event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget && resumePreview.contains(nextTarget)) {
          return;
        }
        closePanel(false);
      });

      panel?.addEventListener("pointerenter", () => openPanel(true));
      panel?.addEventListener("pointerleave", (event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget && resumePreview.contains(nextTarget)) {
          return;
        }
        closePanel(false);
      });
    }

    resumePreview.addEventListener("focusin", () => openPanel(true));
    resumePreview.addEventListener("focusout", (event) => {
      if (!event.relatedTarget || !resumePreview.contains(event.relatedTarget)) {
        closePanel(false);
      }
    });

    panel?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePanel(true);
        trigger?.focus();
      }
    });
  });

  const agentWidgets = document.querySelectorAll("[data-agent-widget]");
  agentWidgets.forEach((widget) => {
    const runButton = widget.querySelector("[data-agent-run]");
    const statusLabel = widget.querySelector("[data-agent-status]");
    const logOutput = widget.querySelector("[data-agent-log]");
    const steps = Array.from(widget.querySelectorAll("[data-agent-step]"));
    const stepStateNodes = steps.map((step) => step.querySelector("[data-agent-step-state]"));

    if (!runButton || steps.length === 0 || !logOutput) {
      return;
    }

    const workflow = [
      {
        status: "Assessing service health…",
        logs: [
          "<strong>Agent:</strong> Querying Grafana for checkout latency and error rate.",
          "<strong>Agent:</strong> Pulling Loki logs for checkout-api pods.",
        ],
        completion: "Health snapshot captured. Bottleneck isolated to config drift.",
      },
      {
        status: "Drafting remediation plan…",
        logs: [
          "<strong>Agent:</strong> Proposing config hotfix to rollback timeout value.",
          "<strong>Agent:</strong> Generating rollback instructions + diff summary.",
        ],
        completion: "Playbook ready. Awaiting human sign-off.",
      },
      {
        status: "Executing guarded rollout…",
        logs: [
          "<strong>Agent:</strong> Applying patch in staging and running smoke tests.",
          "<strong>Agent:</strong> Requesting human validation checkpoint.",
        ],
        completion: "Staging validation passed. Human approval recorded.",
      },
      {
        status: "Verifying production impact…",
        logs: [
          "<strong>Agent:</strong> Deploying change behind feature flag.",
          "<strong>Agent:</strong> Monitoring metrics + error budget for 2 release cycles.",
        ],
        completion: "Latency restored < 220ms. Error budget back within limits.",
      },
    ];

    let timers = [];
    let running = false;

    const clearTimers = () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers = [];
    };

    const pushLog = (message) => {
      const entry = document.createElement("p");
      entry.className = "agent-log-entry";
      entry.innerHTML = message;
      logOutput.append(entry);
      logOutput.scrollTop = logOutput.scrollHeight;
    };

    const reset = ({ preserveButton = false, statusText } = {}) => {
      clearTimers();
      running = false;
      widget.classList.remove("is-running", "is-complete");
      steps.forEach((step, index) => {
        step.classList.remove("is-active", "is-complete");
        step.classList.add("is-pending");
        const stateNode = stepStateNodes[index];
        if (stateNode) {
          stateNode.textContent = "Queued";
        }
      });
      if (!preserveButton) {
        runButton.disabled = false;
        runButton.textContent = "Run Demo";
      }
      if (statusLabel) {
        statusLabel.textContent = statusText || "Idle — awaiting task";
      }
      logOutput.innerHTML =
        '<p class="agent-log-entry">Agent standing by. Press “Run Demo” to simulate the workflow.</p>';
    };

    const finish = () => {
      widget.classList.remove("is-running");
      widget.classList.add("is-complete");
      running = false;
      runButton.disabled = false;
      runButton.textContent = "Run Again";
      if (statusLabel) {
        statusLabel.textContent = "Completed — ready for human approval";
      }
      pushLog("<strong>Agent:</strong> Deployment complete. Awaiting human sign-off to close the incident.");
    };

    const runStep = (index) => {
      if (index >= workflow.length) {
        timers.push(setTimeout(finish, 900));
        return;
      }
      const step = steps[index];
      const stateNode = stepStateNodes[index];
      const current = workflow[index];

      step.classList.remove("is-pending");
      step.classList.add("is-active");
      if (stateNode) {
        stateNode.textContent = "Running";
      }
      if (statusLabel) {
        statusLabel.textContent = current.status;
      }

      current.logs.forEach((message, logIndex) => {
        timers.push(
          setTimeout(() => {
            pushLog(message);
          }, logIndex * 900)
        );
      });

      const completionDelay = current.logs.length * 900 + 1200;
      timers.push(
        setTimeout(() => {
          step.classList.remove("is-active");
          step.classList.add("is-complete");
          if (stateNode) {
            stateNode.textContent = "Complete";
          }
          pushLog(`<span>✔</span> ${current.completion}`);
          runStep(index + 1);
        }, completionDelay)
      );
    };

    const runDemo = () => {
      if (running) {
        return;
      }
      reset({ preserveButton: true, statusText: "Preparing playbook…" });
      running = true;
      widget.classList.add("is-running");
      runButton.disabled = true;
      runButton.textContent = "Running…";
      pushLog("<strong>Agent:</strong> Loading guardrails and scoping the incident.");
      timers.push(
        setTimeout(() => {
          runStep(0);
        }, 600)
      );
    };

    runButton.addEventListener("click", runDemo);

    reset();
  });

  const footerYear = document.getElementById("year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
