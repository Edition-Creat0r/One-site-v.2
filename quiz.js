(function () {
  "use strict";

  const QUIZZES = [
    {
      id: "space-basics",
      title: "Space Basics",
      category: "Science",
      icon: "🚀",
      difficulty: "Beginner",
      questions: [
        {
          question: "Which planet is closest to the Sun?",
          answers: [
            "Venus",
            "Mercury",
            "Earth",
            "Mars"
          ],
          correct: 1,
          explanation:
            "Mercury is the closest planet to the Sun."
        },

        {
          question: "Which planet do we live on?",
          answers: [
            "Mars",
            "Jupiter",
            "Earth",
            "Venus"
          ],
          correct: 2,
          explanation:
            "Earth is our home planet."
        },

        {
          question: "What is the Sun?",
          answers: [
            "A planet",
            "A moon",
            "A star",
            "An asteroid"
          ],
          correct: 2,
          explanation:
            "The Sun is a star at the center of our solar system."
        },

        {
          question: "Which planet is known for its rings?",
          answers: [
            "Saturn",
            "Earth",
            "Mercury",
            "Mars"
          ],
          correct: 0,
          explanation:
            "Saturn is famous for its large ring system."
        },

        {
          question: "What travels around Earth?",
          answers: [
            "The Sun",
            "The Moon",
            "Jupiter",
            "Mars"
          ],
          correct: 1,
          explanation:
            "The Moon orbits Earth."
        }
      ]
    },

    {
      id: "animal-basics",
      title: "Amazing Animals",
      category: "Animals",
      icon: "🦁",
      difficulty: "Beginner",
      questions: [
        {
          question: "Which animal is a mammal?",
          answers: [
            "Shark",
            "Dolphin",
            "Lizard",
            "Salmon"
          ],
          correct: 1,
          explanation:
            "Dolphins are mammals."
        },

        {
          question: "What do herbivores mainly eat?",
          answers: [
            "Plants",
            "Rocks",
            "Metal",
            "Plastic"
          ],
          correct: 0,
          explanation:
            "Herbivores mainly eat plants."
        },

        {
          question: "Which animal can fly?",
          answers: [
            "Penguin",
            "Ostrich",
            "Eagle",
            "Elephant"
          ],
          correct: 2,
          explanation:
            "Eagles are powerful flying birds."
        },

        {
          question: "Which animal lives mainly in water?",
          answers: [
            "Whale",
            "Tiger",
            "Horse",
            "Rabbit"
          ],
          correct: 0,
          explanation:
            "Whales live in oceans."
        },

        {
          question: "A frog is a type of...",
          answers: [
            "Bird",
            "Amphibian",
            "Mammal",
            "Fish"
          ],
          correct: 1,
          explanation:
            "Frogs are amphibians."
        }
      ]
    },

    {
      id: "technology-basics",
      title: "Technology Basics",
      category: "Technology",
      icon: "💻",
      difficulty: "Beginner",
      questions: [
        {
          question: "What does a keyboard help you do?",
          answers: [
            "Type",
            "Cook",
            "Fly",
            "Swim"
          ],
          correct: 0,
          explanation:
            "A keyboard lets you type letters, numbers, and commands."
        },

        {
          question: "Which device can display images and text?",
          answers: [
            "Monitor",
            "Fork",
            "Bookcase",
            "Cup"
          ],
          correct: 0,
          explanation:
            "A monitor displays information from a computer."
        },

        {
          question: "What is software?",
          answers: [
            "Computer programs",
            "A desk",
            "A cable",
            "A battery"
          ],
          correct: 0,
          explanation:
            "Software is made of programs and instructions."
        },

        {
          question: "Which is commonly used to move a pointer?",
          answers: [
            "Mouse",
            "Printer",
            "Speaker",
            "Camera"
          ],
          correct: 0,
          explanation:
            "A mouse can control the pointer on a computer."
        },

        {
          question: "What does a web browser do?",
          answers: [
            "Opens websites",
            "Washes clothes",
            "Cooks food",
            "Charges batteries"
          ],
          correct: 0,
          explanation:
            "A browser lets you visit and use websites."
        }
      ]
    }
  ];

  let selectedQuiz = null;
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;

  const quizLibraryPanel =
    document.getElementById("quizLibraryPanel");

  const quizLibrary =
    document.getElementById("quizLibrary");

  const quizPlayerPanel =
    document.getElementById("quizPlayerPanel");

  const quizResultPanel =
    document.getElementById("quizResultPanel");

  const quizCategory =
    document.getElementById("quizCategory");

  const quizTitle =
    document.getElementById("quizTitle");

  const quizQuestionCounter =
    document.getElementById("quizQuestionCounter");

  const quizProgressBar =
    document.getElementById("quizProgressBar");

  const questionText =
    document.getElementById("questionText");

  const answerGrid =
    document.getElementById("answerGrid");

  const answerFeedback =
    document.getElementById("answerFeedback");

  const nextQuestionButton =
    document.getElementById("nextQuestionButton");

  const backToQuizLibrary =
    document.getElementById("backToQuizLibrary");

  const retryQuizButton =
    document.getElementById("retryQuizButton");

  const chooseAnotherQuizButton =
    document.getElementById("chooseAnotherQuizButton");

  function getAccount() {
    if (typeof getOneSiteAccount === "function") {
      return getOneSiteAccount();
    }

    try {
      return JSON.parse(
        localStorage.getItem("onesiteAccount") || "null"
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function saveAccount(account) {
    if (typeof saveOneSiteAccount === "function") {
      saveOneSiteAccount(account);
      return;
    }

    localStorage.setItem(
      "onesiteAccount",
      JSON.stringify(account)
    );
  }

  function ensureQuizStats(account) {
    if (typeof ensureOneSiteStats === "function") {
      ensureOneSiteStats(account);
      return;
    }

    account.stats = account.stats || {};

    account.stats.xp =
      Number(account.stats.xp) || 0;

    account.stats.level =
      Number(account.stats.level) || 1;

    account.stats.quizzesCompleted =
      Number(account.stats.quizzesCompleted) || 0;

    account.stats.completedQuizzes =
      Array.isArray(account.stats.completedQuizzes)
        ? account.stats.completedQuizzes
        : [];

    account.stats.badges =
      Array.isArray(account.stats.badges)
        ? account.stats.badges
        : [];
  }

  function isQuizCompleted(quizId) {
    const account = getAccount();

    if (!account) {
      return false;
    }

    ensureQuizStats(account);

    return account.stats.completedQuizzes.includes(
      quizId
    );
  }

  function renderQuizLibrary() {
    quizLibrary.innerHTML = "";

    QUIZZES.forEach(function (quiz) {
      const completed =
        isQuizCompleted(quiz.id);

      const card =
        document.createElement("article");

      card.className =
        "quiz-library-card";

      card.innerHTML = `
        <div class="quiz-card-icon">
          ${quiz.icon}
        </div>

        <div>
          <div class="quiz-card-labels">
            <span>${quiz.category}</span>
            <span>${quiz.difficulty}</span>
            <span>
              ${quiz.questions.length} Questions
            </span>
          </div>

          <h3>${quiz.title}</h3>

          <p>
            ${
              completed
                ? "Completed — you can replay this quiz."
                : "Complete this quiz to earn XP."
            }
          </p>
        </div>

        <div class="quiz-card-progress">
          ${
            completed
              ? "✅ Completed"
              : "⭐ XP available"
          }
        </div>

        <button type="button">
          ${
            completed
              ? "Play Again"
              : "Start Quiz"
          }
        </button>
      `;

      card
        .querySelector("button")
        .addEventListener(
          "click",
          function () {
            startQuiz(quiz.id);
          }
        );

      quizLibrary.appendChild(card);
    });
  }

  function startQuiz(quizId) {
    selectedQuiz = QUIZZES.find(function (quiz) {
      return quiz.id === quizId;
    });

    if (!selectedQuiz) {
      return;
    }

    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    quizLibraryPanel.classList.add("hidden");
    quizResultPanel.classList.add("hidden");
    quizPlayerPanel.classList.remove("hidden");

    quizCategory.textContent =
      selectedQuiz.category;

    quizTitle.textContent =
      `${selectedQuiz.icon} ${selectedQuiz.title}`;

    renderCurrentQuestion();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function renderCurrentQuestion() {
    answered = false;

    const question =
      selectedQuiz.questions[currentQuestionIndex];

    questionText.textContent =
      question.question;

    answerGrid.innerHTML = "";

    answerFeedback.textContent = "";
    answerFeedback.classList.add("hidden");

    nextQuestionButton.classList.add("hidden");

    quizQuestionCounter.textContent =
      `Question ${currentQuestionIndex + 1} of ${
        selectedQuiz.questions.length
      }`;

    const progress =
      (currentQuestionIndex /
        selectedQuiz.questions.length) *
      100;

    quizProgressBar.style.width =
      `${progress}%`;

    question.answers.forEach(
      function (answer, index) {
        const button =
          document.createElement("button");

        button.className =
          "answer-button";

        button.type = "button";
        button.textContent = answer;

        button.addEventListener(
          "click",
          function () {
            selectAnswer(index, button);
          }
        );

        answerGrid.appendChild(button);
      }
    );
  }

  function selectAnswer(index, button) {
    if (answered) {
      return;
    }

    answered = true;

    const question =
      selectedQuiz.questions[currentQuestionIndex];

    const answerButtons =
      answerGrid.querySelectorAll(
        ".answer-button"
      );

    answerButtons.forEach(function (item) {
      item.disabled = true;
    });

    if (index === question.correct) {
      score += 1;

      button.classList.add(
        "correct-answer"
      );

      answerFeedback.innerHTML =
        `<strong>✅ Correct!</strong><br>${question.explanation}`;
    } else {
      button.classList.add(
        "wrong-answer"
      );

      const correctButton =
        answerButtons[question.correct];

      if (correctButton) {
        correctButton.classList.add(
          "correct-answer"
        );
      }

      answerFeedback.innerHTML =
        `<strong>Not quite.</strong><br>${question.explanation}`;
    }

    answerFeedback.classList.remove(
      "hidden"
    );

    nextQuestionButton.textContent =
      currentQuestionIndex ===
      selectedQuiz.questions.length - 1
        ? "See Results"
        : "Next Question";

    nextQuestionButton.classList.remove(
      "hidden"
    );
  }

  function nextQuestion() {
    currentQuestionIndex += 1;

    if (
      currentQuestionIndex >=
      selectedQuiz.questions.length
    ) {
      finishQuiz();
      return;
    }

    renderCurrentQuestion();
  }

  function finishQuiz() {
    quizPlayerPanel.classList.add("hidden");
    quizResultPanel.classList.remove(
      "hidden"
    );

    quizProgressBar.style.width =
      "100%";

    const total =
      selectedQuiz.questions.length;

    const percentage =
      Math.round((score / total) * 100);

    document.getElementById(
      "resultScore"
    ).textContent =
      `${score} / ${total}`;

    const resultTitle =
      document.getElementById(
        "resultTitle"
      );

    const resultMessage =
      document.getElementById(
        "resultMessage"
      );

    if (percentage === 100) {
      resultTitle.textContent =
        "🏆 Perfect Score!";

      resultMessage.textContent =
        "Outstanding work! You answered every question correctly.";
    } else if (percentage >= 80) {
      resultTitle.textContent =
        "🌟 Great Job!";

      resultMessage.textContent =
        "You have a strong understanding of this topic.";
    } else if (percentage >= 60) {
      resultTitle.textContent =
        "👍 Nice Work!";

      resultMessage.textContent =
        "Keep practicing and you will get even better.";
    } else {
      resultTitle.textContent =
        "📚 Keep Learning!";

      resultMessage.textContent =
        "Review the topic and try the quiz again.";
    }

    processQuizRewards(
      percentage === 100
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function processQuizRewards(
    perfectScore
  ) {
    const rewardMessage =
      document.getElementById(
        "quizRewardMessage"
      );

    const account = getAccount();

    if (!account) {
      rewardMessage.textContent =
        "Sign in to save XP and quiz progress.";

      return;
    }

    ensureQuizStats(account);

    const alreadyCompleted =
      account.stats.completedQuizzes.includes(
        selectedQuiz.id
      );

    if (alreadyCompleted) {
      rewardMessage.innerHTML =
        "✅ Quiz complete! You already received XP for this quiz.";

      return;
    }

    account.stats.completedQuizzes.push(
      selectedQuiz.id
    );

    account.stats.quizzesCompleted =
      account.stats.completedQuizzes.length;

    saveAccount(account);

    let rewardText =
      "⭐ +40 XP for completing this quiz.";

    if (
      typeof awardOneSiteXP ===
      "function"
    ) {
      awardOneSiteXP(
        40,
        "Quiz completed"
      );
    }

    if (perfectScore) {
      rewardText +=
        " 🏆 +25 XP perfect-score bonus!";

      if (
        typeof awardOneSiteXP ===
        "function"
      ) {
        awardOneSiteXP(
          25,
          "Perfect quiz bonus"
        );
      }

      if (
        typeof unlockOneSiteBadge ===
        "function"
      ) {
        unlockOneSiteBadge(
          "perfectQuiz"
        );
      }
    }

    if (
      typeof checkOneSiteBadges ===
      "function"
    ) {
      checkOneSiteBadges();
    }

    rewardMessage.textContent =
      rewardText;
  }

  function showQuizLibrary() {
    selectedQuiz = null;

    quizPlayerPanel.classList.add(
      "hidden"
    );

    quizResultPanel.classList.add(
      "hidden"
    );

    quizLibraryPanel.classList.remove(
      "hidden"
    );

    renderQuizLibrary();
  }

  /*
   * Connect quiz controls safely.
   */

  if (nextQuestionButton) {
    nextQuestionButton.addEventListener(
      "click",
      nextQuestion
    );
  }

  if (backToQuizLibrary) {
    backToQuizLibrary.addEventListener(
      "click",
      showQuizLibrary
    );
  }

  if (chooseAnotherQuizButton) {
    chooseAnotherQuizButton.addEventListener(
      "click",
      showQuizLibrary
    );
  }

  if (retryQuizButton) {
    retryQuizButton.addEventListener(
      "click",
      function () {
        if (selectedQuiz) {
          startQuiz(selectedQuiz.id);
        }
      }
    );
  }

  /*
   * Only build the quiz library if
   * quiz.html contains the library.
   */

  if (quizLibrary) {
    renderQuizLibrary();
  }
})();