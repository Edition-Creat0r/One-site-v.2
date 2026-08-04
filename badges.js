const ONESITE_BADGES = {
  firstLesson: {
    id: "firstLesson",
    name: "First Step",
    icon: "📘",
    description: "Complete your first lesson."
  },

  fiveLessons: {
    id: "fiveLessons",
    name: "Learning Explorer",
    icon: "🧭",
    description: "Complete five lessons."
  },

  firstQuiz: {
    id: "firstQuiz",
    name: "Quiz Beginner",
    icon: "🧠",
    description: "Complete your first quiz."
  },

  perfectQuiz: {
    id: "perfectQuiz",
    name: "Perfect Score",
    icon: "🏆",
    description: "Earn a perfect score on a quiz."
  },

  hundredXP: {
    id: "hundredXP",
    name: "XP Starter",
    icon: "⭐",
    description: "Earn 100 XP."
  },

  fiveHundredXP: {
    id: "fiveHundredXP",
    name: "Rising Scholar",
    icon: "🌟",
    description: "Earn 500 XP."
  }
};

function getOneSiteBadge(badgeId) {
  return ONESITE_BADGES[badgeId] || null;
}

function hasOneSiteBadge(account, badgeId) {
  if (!account || !account.stats) {
    return false;
  }

  if (!Array.isArray(account.stats.badges)) {
    return false;
  }

  return account.stats.badges.some(function (badge) {
    if (typeof badge === "string") {
      return badge === badgeId;
    }

    return badge && badge.id === badgeId;
  });
}

function unlockOneSiteBadge(badgeId) {
  const badge = getOneSiteBadge(badgeId);

  if (!badge) {
    console.warn(`Unknown OneSite badge: ${badgeId}`);
    return false;
  }

  const account =
    typeof getOneSiteAccount === "function"
      ? getOneSiteAccount()
      : JSON.parse(localStorage.getItem("onesiteAccount") || "null");

  if (!account) {
    return false;
  }

  if (typeof ensureOneSiteStats === "function") {
    ensureOneSiteStats(account);
  } else {
    account.stats = account.stats || {};
    account.stats.badges = account.stats.badges || [];
  }

  if (hasOneSiteBadge(account, badgeId)) {
    return false;
  }

  account.stats.badges.push({
    id: badge.id,
    name: badge.name,
    icon: badge.icon,
    description: badge.description,
    unlockedAt: new Date().toISOString()
  });

  if (typeof saveOneSiteAccount === "function") {
    saveOneSiteAccount(account);
  } else {
    localStorage.setItem("onesiteAccount", JSON.stringify(account));
  }

  if (typeof showOneSiteNotification === "function") {
    showOneSiteNotification(
      `${badge.icon} Badge unlocked`,
      badge.name,
      "badge"
    );
  }

  return true;
}

function checkOneSiteBadges() {
  const account =
    typeof getOneSiteAccount === "function"
      ? getOneSiteAccount()
      : JSON.parse(localStorage.getItem("onesiteAccount") || "null");

  if (!account) {
    return;
  }

  if (typeof ensureOneSiteStats === "function") {
    ensureOneSiteStats(account);
  }

  const stats = account.stats;

  if (stats.lessonsCompleted >= 1) {
    unlockOneSiteBadge("firstLesson");
  }

  if (stats.lessonsCompleted >= 5) {
    unlockOneSiteBadge("fiveLessons");
  }

  if (stats.quizzesCompleted >= 1) {
    unlockOneSiteBadge("firstQuiz");
  }

  if (stats.xp >= 100) {
    unlockOneSiteBadge("hundredXP");
  }

  if (stats.xp >= 500) {
    unlockOneSiteBadge("fiveHundredXP");
  }
}