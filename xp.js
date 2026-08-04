(function () {
  "use strict";

  /*
   * ========================================
   * OneSite XP System
   * ========================================
   */

  const XP_LEVELS = [
    {
      level: 1,
      requiredXP: 0
    },

    {
      level: 2,
      requiredXP: 100
    },

    {
      level: 3,
      requiredXP: 250
    },

    {
      level: 4,
      requiredXP: 500
    },

    {
      level: 5,
      requiredXP: 850
    },

    {
      level: 6,
      requiredXP: 1300
    },

    {
      level: 7,
      requiredXP: 1900
    },

    {
      level: 8,
      requiredXP: 2700
    },

    {
      level: 9,
      requiredXP: 3700
    },

    {
      level: 10,
      requiredXP: 5000
    },

    {
      level: 11,
      requiredXP: 6500
    },

    {
      level: 12,
      requiredXP: 8300
    },

    {
      level: 13,
      requiredXP: 10400
    },

    {
      level: 14,
      requiredXP: 12800
    },

    {
      level: 15,
      requiredXP: 15500
    }
  ];


  /*
   * Read the current account.
   */

  function getAccount() {
    if (
      typeof window.getOneSiteAccount ===
      "function"
    ) {
      return window.getOneSiteAccount();
    }

    try {
      return JSON.parse(
        localStorage.getItem(
          "onesiteAccount"
        ) || "null"
      );
    } catch (error) {
      console.error(
        "OneSite could not read the account.",
        error
      );

      return null;
    }
  }


  /*
   * Save the account.
   */

  function saveAccount(account) {
    if (!account) {
      return false;
    }

    if (
      typeof window.saveOneSiteAccount ===
      "function"
    ) {
      return window.saveOneSiteAccount(
        account
      );
    }

    try {
      localStorage.setItem(
        "onesiteAccount",
        JSON.stringify(account)
      );

      return true;
    } catch (error) {
      console.error(
        "OneSite could not save XP.",
        error
      );

      return false;
    }
  }


  /*
   * Makes older OneSite accounts compatible
   * with the newer progress system.
   */

  function ensureStats(account) {
    if (!account) {
      return null;
    }

    if (
      !account.stats ||
      typeof account.stats !== "object"
    ) {
      account.stats = {};
    }


    /*
     * XP
     */

    if (
      !Number.isFinite(
        Number(account.stats.xp)
      )
    ) {
      account.stats.xp = 0;
    } else {
      account.stats.xp =
        Math.max(
          0,
          Number(account.stats.xp)
        );
    }


    /*
     * Level
     */

    if (
      !Number.isFinite(
        Number(account.stats.level)
      )
    ) {
      account.stats.level = 1;
    }


    /*
     * Streak
     */

    if (
      !Number.isFinite(
        Number(account.stats.streak)
      )
    ) {
      account.stats.streak = 0;
    }


    /*
     * Completed lesson count
     */

    if (
      !Number.isFinite(
        Number(
          account.stats.lessonsCompleted
        )
      )
    ) {
      account.stats.lessonsCompleted = 0;
    }


    /*
     * Completed quiz count
     */

    if (
      !Number.isFinite(
        Number(
          account.stats.quizzesCompleted
        )
      )
    ) {
      account.stats.quizzesCompleted = 0;
    }


    /*
     * Lesson IDs
     */

    if (
      !Array.isArray(
        account.stats.completedLessons
      )
    ) {
      account.stats.completedLessons = [];
    }


    /*
     * Quiz IDs
     */

    if (
      !Array.isArray(
        account.stats.completedQuizzes
      )
    ) {
      account.stats.completedQuizzes = [];
    }


    /*
     * Badges
     */

    if (
      !Array.isArray(
        account.stats.badges
      )
    ) {
      account.stats.badges = [];
    }


    /*
     * Correct old count values.
     */

    if (
      account.stats.completedLessons.length >
      account.stats.lessonsCompleted
    ) {
      account.stats.lessonsCompleted =
        account.stats.completedLessons.length;
    }


    if (
      account.stats.completedQuizzes.length >
      account.stats.quizzesCompleted
    ) {
      account.stats.quizzesCompleted =
        account.stats.completedQuizzes.length;
    }


    /*
     * Recalculate level from XP.
     */

    account.stats.level =
      getLevelFromXP(
        account.stats.xp
      );


    return account;
  }


  /*
   * Determine level from total XP.
   */

  function getLevelFromXP(xp) {
    const safeXP =
      Math.max(
        0,
        Number(xp) || 0
      );

    let currentLevel = 1;


    XP_LEVELS.forEach(
      function (levelInfo) {
        if (
          safeXP >=
          levelInfo.requiredXP
        ) {
          currentLevel =
            levelInfo.level;
        }
      }
    );


    return currentLevel;
  }


  /*
   * Find the next level.
   */

  function getNextLevelInfo(xp) {
    const safeXP =
      Math.max(
        0,
        Number(xp) || 0
      );


    return (
      XP_LEVELS.find(
        function (levelInfo) {
          return (
            levelInfo.requiredXP >
            safeXP
          );
        }
      ) || null
    );
  }


  /*
   * Find information about the
   * current level.
   */

  function getCurrentLevelInfo(xp) {
    const level =
      getLevelFromXP(xp);


    return (
      XP_LEVELS.find(
        function (levelInfo) {
          return (
            levelInfo.level ===
            level
          );
        }
      ) || XP_LEVELS[0]
    );
  }


  /*
   * Used by the dashboard and navigation
   * progress bars.
   */

  function getLevelProgress(xp) {
    const safeXP =
      Math.max(
        0,
        Number(xp) || 0
      );


    const level =
      getLevelFromXP(
        safeXP
      );


    const current =
      getCurrentLevelInfo(
        safeXP
      );


    const next =
      getNextLevelInfo(
        safeXP
      );


    /*
     * Max level.
     */

    if (!next) {
      return {
        level: level,

        currentXP: safeXP,

        levelStartXP:
          current.requiredXP,

        nextLevelXP: null,

        xpRemaining: 0,

        percent: 100
      };
    }


    const totalNeeded =
      next.requiredXP -
      current.requiredXP;


    const earnedThisLevel =
      safeXP -
      current.requiredXP;


    let percent =
      (earnedThisLevel /
        totalNeeded) *
      100;


    percent =
      Math.max(
        0,
        Math.min(
          100,
          percent
        )
      );


    return {
      level: level,

      currentXP: safeXP,

      levelStartXP:
        current.requiredXP,

      nextLevelXP:
        next.requiredXP,

      xpRemaining:
        Math.max(
          0,
          next.requiredXP -
            safeXP
        ),

      percent:
        percent
    };
  }


  /*
   * Refresh anything displaying
   * XP or account information.
   */

  function refreshXPDisplays() {
    if (
      typeof window
        .refreshOneSiteNavigation ===
      "function"
    ) {
      window.refreshOneSiteNavigation();
    }


    window.dispatchEvent(
      new CustomEvent(
        "onesiteXPChanged"
      )
    );
  }


  /*
   * Main XP award function.
   */

  function awardXP(amount, reason) {
    const safeAmount =
      Math.floor(
        Math.max(
          0,
          Number(amount) || 0
        )
      );


    if (safeAmount <= 0) {
      return null;
    }


    const account =
      getAccount();


    if (!account) {
      console.warn(
        "OneSite could not award XP because no account is signed in."
      );

      return null;
    }


    ensureStats(account);


    const previousXP =
      account.stats.xp;


    const previousLevel =
      getLevelFromXP(
        previousXP
      );


    account.stats.xp +=
      safeAmount;


    const newLevel =
      getLevelFromXP(
        account.stats.xp
      );


    account.stats.level =
      newLevel;


    const saved =
      saveAccount(account);


    if (!saved) {
      return null;
    }


    /*
     * XP notification
     */

    if (
      typeof window
        .showOneSiteNotification ===
      "function"
    ) {
      window.showOneSiteNotification(
        `+${safeAmount} XP`,
        reason ||
          "Learning progress saved",
        "xp"
      );
    }


    /*
     * Level-up notification
     */

    if (
      newLevel >
      previousLevel
    ) {
      if (
        typeof window
          .showOneSiteNotification ===
        "function"
      ) {
        window.showOneSiteNotification(
          `🎉 Level ${newLevel}!`,
          "You reached a new OneSite level.",
          "level"
        );
      }
    }


    refreshXPDisplays();


    return {
      amount:
        safeAmount,

      reason:
        reason || "",

      previousXP:
        previousXP,

      totalXP:
        account.stats.xp,

      previousLevel:
        previousLevel,

      level:
        newLevel,

      leveledUp:
        newLevel >
        previousLevel
    };
  }


  /*
   * Optional helper used when displaying
   * total XP.
   */

  function getCurrentXP() {
    const account =
      getAccount();


    if (!account) {
      return 0;
    }


    ensureStats(account);


    return account.stats.xp;
  }


  /*
   * Optional helper used when displaying
   * current level.
   */

  function getCurrentLevel() {
    const account =
      getAccount();


    if (!account) {
      return 1;
    }


    ensureStats(account);


    return account.stats.level;
  }


  /*
   * Expose only the functions OneSite
   * actually needs.
   *
   * Keeping everything else private helps
   * prevent duplicate variable errors.
   */

  window.ensureOneSiteStats =
    ensureStats;


  window.getLevelFromXP =
    getLevelFromXP;


  window.getNextLevelInfo =
    getNextLevelInfo;


  window.getLevelProgress =
    getLevelProgress;


  window.awardOneSiteXP =
    awardXP;


  window.getOneSiteXP =
    getCurrentXP;


  window.getOneSiteLevel =
    getCurrentLevel;


  /*
   * Repair older account data when XP.js
   * first loads.
   */

  const existingAccount =
    getAccount();


  if (existingAccount) {
    ensureStats(
      existingAccount
    );

    saveAccount(
      existingAccount
    );
  }
})();