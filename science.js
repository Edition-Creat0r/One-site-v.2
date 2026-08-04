(function () {
  "use strict";

  const SCIENCE_LESSONS = {
    space: {
      id: "science-space",
      name: "Space Explorer",
      xp: 25
    },

    earth: {
      id: "science-earth",
      name: "Planet Earth",
      xp: 25
    },

    biology: {
      id: "science-biology",
      name: "Living Things",
      xp: 25
    },

    physics: {
      id: "science-physics",
      name: "Physics Basics",
      xp: 25
    }
  };

  let currentSlide = 0;

  function getAccount() {
    if (
      typeof getOneSiteAccount ===
      "function"
    ) {
      return getOneSiteAccount();
    }

    try {
      return JSON.parse(
        localStorage.getItem(
          "onesiteAccount"
        ) || "null"
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function saveAccount(account) {
    if (
      typeof saveOneSiteAccount ===
      "function"
    ) {
      saveOneSiteAccount(account);
      return;
    }

    localStorage.setItem(
      "onesiteAccount",
      JSON.stringify(account)
    );
  }

  function ensureScienceStats(account) {
    if (
      typeof ensureOneSiteStats ===
      "function"
    ) {
      ensureOneSiteStats(account);
      return;
    }

    account.stats =
      account.stats || {};

    account.stats.lessonsCompleted =
      Number(
        account.stats.lessonsCompleted
      ) || 0;

    account.stats.completedLessons =
      Array.isArray(
        account.stats.completedLessons
      )
        ? account.stats.completedLessons
        : [];
  }

  function completeScienceLesson(
    lessonKey
  ) {
    const lesson =
      SCIENCE_LESSONS[lessonKey];

    if (!lesson) {
      console.warn(
        `Unknown science lesson: ${lessonKey}`
      );

      return false;
    }

    const account = getAccount();

    if (!account) {
      if (
        typeof showOneSiteNotification ===
        "function"
      ) {
        showOneSiteNotification(
          "Sign in required",
          "Create or sign in to an account to save progress.",
          "default"
        );
      } else {
        alert(
          "Sign in to save your lesson progress."
        );
      }

      return false;
    }

    ensureScienceStats(account);

    const alreadyCompleted =
      account.stats.completedLessons.includes(
        lesson.id
      );

    if (alreadyCompleted) {
      if (
        typeof showOneSiteNotification ===
        "function"
      ) {
        showOneSiteNotification(
          "Lesson already completed",
          "You already earned XP for this lesson.",
          "default"
        );
      }

      return false;
    }

    account.stats.completedLessons.push(
      lesson.id
    );

    account.stats.lessonsCompleted =
      account.stats.completedLessons.length;

    saveAccount(account);

    if (
      typeof awardOneSiteXP ===
      "function"
    ) {
      awardOneSiteXP(
        lesson.xp,
        `${lesson.name} completed`
      );
    }

    if (
      typeof checkOneSiteBadges ===
      "function"
    ) {
      checkOneSiteBadges();
    }

    updateScienceCompletionButtons();

    return true;
  }

  function isLessonComplete(
    lessonKey
  ) {
    const lesson =
      SCIENCE_LESSONS[lessonKey];

    if (!lesson) {
      return false;
    }

    const account = getAccount();

    if (!account) {
      return false;
    }

    ensureScienceStats(account);

    return account.stats.completedLessons.includes(
      lesson.id
    );
  }

  function updateScienceCompletionButtons() {
    const buttons =
      document.querySelectorAll(
        "[data-complete-lesson]"
      );

    buttons.forEach(function (button) {
      const lessonKey =
        button.dataset.completeLesson;

      if (
        isLessonComplete(lessonKey)
      ) {
        button.textContent =
          "✅ Lesson Completed";

        button.disabled = true;
      }
    });
  }

  function connectLessonButtons() {
    const buttons =
      document.querySelectorAll(
        "[data-complete-lesson]"
      );

    buttons.forEach(function (button) {
      button.addEventListener(
        "click",
        function () {
          completeScienceLesson(
            button.dataset.completeLesson
          );
        }
      );
    });

    updateScienceCompletionButtons();
  }

  /*
   * Support your existing slide lesson system.
   */

  function getSlides() {
    return Array.from(
      document.querySelectorAll(".slide")
    );
  }

  function showSlide(index) {
    const slides = getSlides();

    if (slides.length === 0) {
      return;
    }

    if (index < 0) {
      index = 0;
    }

    if (index >= slides.length) {
      index = slides.length - 1;
    }

    currentSlide = index;

    slides.forEach(
      function (slide, slideIndex) {
        slide.classList.toggle(
          "active",
          slideIndex === currentSlide
        );
      }
    );

    const counter =
      document.getElementById(
        "slideCounter"
      );

    if (counter) {
      counter.textContent =
        `${currentSlide + 1} / ${
          slides.length
        }`;
    }

    const previousButton =
      document.getElementById(
        "prevSlide"
      );

    const nextButton =
      document.getElementById(
        "nextSlide"
      );

    if (previousButton) {
      previousButton.disabled =
        currentSlide === 0;
    }

    if (nextButton) {
      nextButton.disabled =
        currentSlide ===
        slides.length - 1;
    }
  }

  function connectSlides() {
    const slides = getSlides();

    if (slides.length === 0) {
      return;
    }

    const previousButton =
      document.getElementById(
        "prevSlide"
      );

    const nextButton =
      document.getElementById(
        "nextSlide"
      );

    if (previousButton) {
      previousButton.addEventListener(
        "click",
        function () {
          showSlide(
            currentSlide - 1
          );
        }
      );
    }

    if (nextButton) {
      nextButton.addEventListener(
        "click",
        function () {
          showSlide(
            currentSlide + 1
          );
        }
      );
    }

    showSlide(0);
  }

  /*
   * Support buttons that use:
   *
   * data-lesson-id="space"
   *
   * Clicking one can mark that lesson as the
   * currently viewed lesson.
   */

  function connectLessonCards() {
    const cards =
      document.querySelectorAll(
        "[data-lesson-id]"
      );

    cards.forEach(function (card) {
      card.addEventListener(
        "click",
        function () {
          const lessonKey =
            card.dataset.lessonId;

          localStorage.setItem(
            "onesiteCurrentScienceLesson",
            lessonKey
          );
        }
      );
    });
  }

  /*
   * Compatibility helper.
   *
   * You can call this manually:
   *
   * completeScienceLesson("space");
   */

  window.completeScienceLesson =
    completeScienceLesson;

  window.isScienceLessonComplete =
    isLessonComplete;

  connectSlides();
  connectLessonButtons();
  connectLessonCards();
})();