if (!requireOneSiteLogin()) {
  throw new Error("OneSite login is required.");
}

const account = getCurrentOneSiteUser();
const permissions = getOneSitePermissions(account);
if (
  account &&
  account.age < 13 &&
  account.parentalConsentStatus !== "approved"
) {
  window.location.href = "parent-approval.html";
}

if (!account) {
  window.location.href = "account.html";
}


const scienceLessonOrder = [
  "space",
  "earth",
  "weather",
  "plants",
  "body",
  "physics",
  "chemistry"
];

const scienceLessonNames = {
  space: "Space and the Solar System",
  earth: "Earth Science",
  weather: "Weather",
  plants: "Plants",
  body: "The Human Body",
  physics: "Physics Basics",
  chemistry: "Chemistry Basics"
};

function getCompletedScienceLessons() {
  try {
    const completedLessons = JSON.parse(
      localStorage.getItem("onesiteScienceCompleted")
    );

    return Array.isArray(completedLessons) ? completedLessons : [];
  } catch (error) {
    return [];
  }
}

function formatAgeGroup(ageGroup) {
  const ageGroupNames = {
    kid: "Kids Learning · Ages 5–11",
    youth: "Youth Learning · Ages 12–15",
    creator: "Creator Access · Ages 16–22",
    adult: "Adult Access · Ages 23+"
  };

  return ageGroupNames[ageGroup] || "OneSite Member";
}

function formatRole(role) {
  if (!role) {
    return "Member";
  }

  return role
    .split("-")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatCountry(countryCode) {
  const countryNames = {
    US: "United States",
    CA: "Canada",
    IN: "India",
    UK: "United Kingdom",
    AU: "Australia",
    OTHER: "Other"
  };

  return countryNames[countryCode] || countryCode || "Not selected";
}

function getAccountStats() {
  return {
    xp: account.stats?.xp || 0,
    level: account.stats?.level || 1,
    streak: account.stats?.streak || 0,
    badges: account.stats?.badges || [],
    quizzesCompleted: account.stats?.quizzesCompleted || 0,
    lessonsCompleted: account.stats?.lessonsCompleted || 0
  };
}

function renderAccountInformation() {
  const stats = getAccountStats();

  document.getElementById("dashboardAvatar").textContent =
    account.avatar || "🦊";

  document.getElementById("summaryAvatar").textContent =
    account.avatar || "🦊";

  document.getElementById("dashboardName").textContent =
    account.displayName || "Learner";

  document.getElementById("summaryName").textContent =
    account.displayName || "Learner";

  document.getElementById("summaryAgeGroup").textContent =
    formatAgeGroup(account.ageGroup);

  document.getElementById("summaryCountry").textContent =
    formatCountry(account.country);

  document.getElementById("summaryRole").textContent =
    formatRole(account.role);

  document.getElementById("summaryPremium").textContent = account.premium
    ? "Active"
    : "No";

  document.getElementById("dashboardLevel").textContent = stats.level;
  document.getElementById("dashboardXP").textContent = `${stats.xp} XP`;
  document.getElementById("dashboardStreak").textContent = stats.streak;
  document.getElementById("dashboardQuizzes").textContent =
    stats.quizzesCompleted;

  document.getElementById("dashboardBadges").textContent =
    stats.badges.length;

  const greetingMessages = {
    kid: "Ready for another fun learning adventure?",
    youth: "Explore new subjects, quizzes, and approved learning content.",
    creator: "Learn, create projects, and explore your available tools.",
    adult: "Continue learning, teaching, creating, or publishing."
  };

  document.getElementById("dashboardMessage").textContent =
    greetingMessages[account.ageGroup] ||
    "Continue learning and exploring OneSite.";
}

function renderScienceProgress() {
  const completedLessons = getCompletedScienceLessons();

  const validCompletedLessons = completedLessons.filter(function (lessonId) {
    return scienceLessonOrder.includes(lessonId);
  });

  const completedCount = validCompletedLessons.length;

  const progressPercentage = Math.round(
    (completedCount / scienceLessonOrder.length) * 100
  );

  document.getElementById("dashboardLessons").textContent = completedCount;

  document.getElementById(
    "scienceProgressPercent"
  ).textContent = `${progressPercentage}%`;

  document.getElementById(
    "scienceDashboardProgress"
  ).style.width = `${progressPercentage}%`;

  const progressMessage = document.getElementById("scienceProgressMessage");
  const continueButton = document.getElementById("continueLearningButton");

  const nextLessonId = scienceLessonOrder.find(function (lessonId) {
    return !validCompletedLessons.includes(lessonId);
  });

  if (completedCount === 0) {
    progressMessage.textContent =
      "Start with Space and the Solar System, your first Science lesson.";

    continueButton.textContent = "Start Science";
    continueButton.href = "science.html?lesson=space";
    return;
  }

  if (!nextLessonId) {
    progressMessage.textContent =
      "You completed every available Science lesson!";

    continueButton.textContent = "Review Science";
    continueButton.href = "science.html";
    return;
  }

  progressMessage.textContent =
    `${completedCount} of ${scienceLessonOrder.length} lessons completed. ` +
    `Next: ${scienceLessonNames[nextLessonId]}.`;

  continueButton.textContent = `Continue: ${scienceLessonNames[nextLessonId]}`;
  continueButton.href = `science.html?lesson=${nextLessonId}`;
}

function addFeatureCard(icon, title, description, link) {
  const featureList = document.getElementById("dashboardFeatureList");

  const feature = document.createElement(link ? "a" : "div");

  feature.className = "dashboard-feature-card";

  if (link) {
    feature.href = link;
  }

  feature.innerHTML = `
    <span>${icon}</span>

    <div>
      <strong>${title}</strong>
      <p>${description}</p>
    </div>
  `;

  featureList.appendChild(feature);
}

function renderAvailableFeatures() {
  const featureList = document.getElementById("dashboardFeatureList");
  featureList.innerHTML = "";

  addFeatureCard(
    "📚",
    "Learning Library",
    "Lessons and approved educational content.",
    "topics.html"
  );

  addFeatureCard(
    "📝",
    "Quiz Library",
    "Practice with quizzes for different subjects.",
    "quiz.html"
  );

  if (account.ageGroup === "kid") {
    addFeatureCard(
      "🧩",
      "Kids Activities",
      "Safe games, puzzles, and beginner learning.",
      "games.html"
    );
  }

  if (permissions.canUseAI) {
    addFeatureCard(
      "🤖",
      "AI Tutor",
      account.ageGroup === "youth"
        ? "Limited and age-appropriate AI learning support."
        : "AI learning and project assistance.",
      null
    );
  }

  if (permissions.canCreateDocuments) {
    addFeatureCard(
      "🎨",
      "Creator Studio",
      "Create documents, projects, quizzes, and more.",
      "creator.html"
    );
  }

  if (permissions.canCreateGames) {
    addFeatureCard(
      "🎮",
      "Game Creator",
      "Build and share approved games later.",
      null
    );
  }

  if (permissions.canUseStreaming) {
    addFeatureCard(
      "📺",
      "Streaming",
      "Age-appropriate creator and entertainment content later.",
      null
    );
  }

  if (permissions.canUseMarketplace) {
    addFeatureCard(
      "🛍️",
      "Marketplace",
      "Buying and selling will be added in a future phase.",
      null
    );
  }

  if (permissions.canUseTeacherTools) {
    addFeatureCard(
      "👩‍🏫",
      "Teacher Hub",
      "Create classes and manage learning activities.",
      "teacher.html"
    );
  }

  if (!account.premium && permissions.canSeeAds) {
    document.getElementById("upgradeCard").classList.remove("hidden");
  }
}

function renderDashboard() {
  renderAccountInformation();
  renderScienceProgress();
  renderAvailableFeatures();
}

renderDashboard();