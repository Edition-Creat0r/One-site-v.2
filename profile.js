const badgeDefinitions = [
  {
    id: "space-explorer",
    name: "Space Explorer",
    icon: "🚀",
    description:
      "Complete all beginner-level Space quizzes.",
    requirement:
      "Complete the beginner Space quiz."
  },
  {
    id: "galactic-traveler",
    name: "Galactic Traveler",
    icon: "🌌",
    description:
      "Complete all higher-level Space quizzes.",
    requirement:
      "Higher-level quizzes are coming later."
  },
  {
    id: "universal-conqueror",
    name: "Universal Conqueror",
    icon: "👑",
    description:
      "Complete every Space quiz level.",
    requirement:
      "Complete beginner, advanced, and expert Space quiz groups."
  },
  {
    id: "three-day-streak",
    name: "Rising Learner",
    icon: "🔥",
    description:
      "Learn on OneSite for three days in a row.",
    requirement:
      "Reach a three-day streak."
  },
  {
    id: "seven-day-streak",
    name: "Weekly Scholar",
    icon: "⭐",
    description:
      "Learn on OneSite for seven days in a row.",
    requirement:
      "Reach a seven-day streak."
  },
  {
    id: "perfect-score",
    name: "Perfect Mind",
    icon: "🧠",
    description:
      "Earn a perfect score on any quiz.",
    requirement:
      "Score 100% on a quiz."
  }
];

function getSavedNumber(key) {
  return Number(localStorage.getItem(key)) || 0;
}

function getEarnedBadges() {
  const savedBadges = localStorage.getItem("onesite_badges");

  if (!savedBadges) {
    return [];
  }

  try {
    return JSON.parse(savedBadges);
  } catch (error) {
    return [];
  }
}

function renderProfile() {
  const quizzesCompleted =
    getSavedNumber("onesite_quizzes_completed");

  const bestSpaceScore =
    getSavedNumber("onesite_best_space_score");

  const currentStreak =
    getSavedNumber("onesite_current_streak");

  document.getElementById("quizzesCompleted").textContent =
    quizzesCompleted;

  document.getElementById("bestSpaceScore").textContent =
    `${bestSpaceScore} / 5`;

  document.getElementById("currentStreak").textContent =
    `${currentStreak} day${currentStreak === 1 ? "" : "s"}`;

  renderBadges();
}

function renderBadges() {
  const earnedBadges = getEarnedBadges();
  const badgeGrid = document.getElementById("badgeGrid");

  badgeGrid.innerHTML = "";

  badgeDefinitions.forEach(function (badge) {
    const earned = earnedBadges.includes(badge.id);

    const badgeCard = document.createElement("article");

    badgeCard.className = earned
      ? "badge-card earned-badge"
      : "badge-card locked-badge";

    badgeCard.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>

      <div>
        <h3>${badge.name}</h3>
        <p>${badge.description}</p>

        <span class="badge-status">
          ${earned ? "Earned" : "Locked"}
        </span>

        <small>${earned ? "Badge unlocked!" : badge.requirement}</small>
      </div>
    `;

    badgeGrid.appendChild(badgeCard);
  });
}

renderProfile();