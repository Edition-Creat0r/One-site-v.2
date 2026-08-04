function getOneSiteAccount() {
  try {
    return JSON.parse(localStorage.getItem("onesiteAccount"));
  } catch (error) {
    return null;
  }
}

function getOneSitePermissions(account) {
  const defaultPermissions = {
    canUseBasicLessons: true,
    canUseBasicQuizzes: true,
    canViewApprovedContent: true,

    canUseAI: false,
    canCreateDocuments: false,
    canCreateSlides: false,
    canCreateQuizzes: false,
    canCreateProjects: false,
    canCreateGames: false,

    canUseChat: false,
    canUseStreaming: false,
    canUseMarketplace: false,

    canSeeAds: false,
    canUseTeacherTools: false,
    canPublishContent: false
  };

  if (!account) {
    return defaultPermissions;
  }

  if (account.ageGroup === "kid") {
    return {
      ...defaultPermissions,
      canUseBasicLessons: true,
      canUseBasicQuizzes: true,
      canViewApprovedContent: true,
      canSeeAds: false
    };
  }

  if (account.ageGroup === "youth") {
    return {
      ...defaultPermissions,
      canUseAI: true,
      canViewApprovedContent: true,
      canSeeAds: false
    };
  }

  if (account.ageGroup === "creator") {
    return {
      ...defaultPermissions,
      canUseAI: true,
      canCreateDocuments: true,
      canCreateSlides: true,
      canCreateQuizzes: true,
      canCreateProjects: true,
      canCreateGames: true,
      canUseChat: true,
      canUseStreaming: true,
      canUseMarketplace: account.age >= 18,
      canSeeAds: !account.premium
    };
  }

  if (account.ageGroup === "adult") {
    return {
      ...defaultPermissions,
      canUseAI: true,
      canCreateDocuments: true,
      canCreateSlides: true,
      canCreateQuizzes: true,
      canCreateProjects: true,
      canCreateGames: true,
      canUseChat: true,
      canUseStreaming: true,
      canUseMarketplace: true,
      canSeeAds: !account.premium,
      canPublishContent: true,
      canUseTeacherTools:
        account.role === "teacher" ||
        account.role === "professor" ||
        account.role === "admin"
    };
  }

  return defaultPermissions;
}