(function () {
  "use strict";

  function getAccount() {
    if (typeof getOneSiteAccount === "function") {
      return getOneSiteAccount();
    }

    try {
      return JSON.parse(
        localStorage.getItem("onesiteAccount") || "null"
      );
    } catch (error) {
      console.error("Could not read OneSite account.", error);
      return null;
    }
  }

  function getStats(account) {
    if (!account) {
      return {
        xp: 0,
        level: 1
      };
    }

    if (
      typeof ensureOneSiteStats === "function"
    ) {
      ensureOneSiteStats(account);
    }

    account.stats = account.stats || {};

    return {
      xp: Number(account.stats.xp) || 0,
      level: Number(account.stats.level) || 1
    };
  }

  function getLevelInfo(xp, level) {
    if (
      typeof getLevelProgress === "function"
    ) {
      return getLevelProgress(xp);
    }

    return {
      level,
      currentXP: xp,
      nextLevelXP: 100,
      xpRemaining: Math.max(0, 100 - xp),
      percent: Math.min(100, xp)
    };
  }

  function getCurrentPage() {
    const path = window.location.pathname;

    const page =
      path.substring(path.lastIndexOf("/") + 1) ||
      "index.html";

    return page;
  }

  function createMainLinks() {
    const currentPage = getCurrentPage();

    const links = [
      {
        name: "Home",
        href: "index.html"
      },
      {
        name: "Learn",
        href: "topics.html"
      },
      {
        name: "Quizzes",
        href: "quiz.html"
      },
      {
        name: "Games",
        href: "games.html"
      },
      {
        name: "Create",
        href: "creator.html"
      }
    ];

    return links
      .map(function (link) {
        const active =
          currentPage === link.href
            ? " onesite-nav-active"
            : "";

        return `
          <a
            href="${link.href}"
            class="onesite-nav-link${active}"
          >
            ${link.name}
          </a>
        `;
      })
      .join("");
  }

  function createGuestNavigation() {
    return `
      <nav class="onesite-nav">
        <div class="onesite-nav-inner">

          <a
            href="index.html"
            class="onesite-nav-logo"
          >
            <span class="onesite-nav-logo-mark">
              1
            </span>

            <span>
              OneSite
            </span>
          </a>

          <div class="onesite-nav-links">
            ${createMainLinks()}
          </div>

          <div class="onesite-nav-account">
            <a
              href="login.html"
              class="onesite-nav-signin"
            >
              Sign In
            </a>
          </div>

        </div>
      </nav>
    `;
  }

  function createSignedInNavigation(account) {
    const stats = getStats(account);

    const progress =
      getLevelInfo(
        stats.xp,
        stats.level
      );

    const displayName =
      account.displayName || "Learner";

    const avatar =
      account.avatar || "🦊";

    let progressText;

    if (progress.nextLevelXP === null) {
      progressText =
        `${stats.xp} XP · Max Level`;
    } else {
      progressText =
        `${stats.xp} / ${progress.nextLevelXP} XP`;
    }

    return `
      <nav class="onesite-nav">
        <div class="onesite-nav-inner">

          <a
            href="index.html"
            class="onesite-nav-logo"
          >
            <span class="onesite-nav-logo-mark">
              1
            </span>

            <span>
              OneSite
            </span>
          </a>

          <div class="onesite-nav-links">
            ${createMainLinks()}
          </div>

          <div class="onesite-nav-account">

            <a
              href="dashboard.html"
              class="onesite-nav-profile"
            >
              <span class="onesite-nav-avatar">
                ${avatar}
              </span>

              <span class="onesite-nav-user-info">
                <strong>
                  ${displayName}
                </strong>

                <small>
                  Level ${stats.level}
                </small>
              </span>
            </a>

            <div class="onesite-nav-xp">
              <div class="onesite-nav-xp-top">
                <span>
                  ⭐ ${progressText}
                </span>
              </div>

              <div class="onesite-nav-xp-track">
                <div
                  class="onesite-nav-xp-bar"
                  style="width: ${progress.percent}%"
                ></div>
              </div>
            </div>

            <button
              id="onesiteNavSignOut"
              class="onesite-nav-signout"
              type="button"
              title="Sign out"
            >
              Sign Out
            </button>

          </div>

        </div>
      </nav>
    `;
  }

  function signOut() {
    if (
      typeof signOutOneSite === "function"
    ) {
      signOutOneSite();

      /*
       * Some versions of auth.js redirect
       * automatically. This fallback handles
       * versions that do not.
       */
      window.setTimeout(function () {
        window.location.href =
          "index.html";
      }, 100);

      return;
    }

    localStorage.removeItem(
      "onesiteSession"
    );

    window.location.href =
      "index.html";
  }

  function initializeNavigation() {
    const container =
      document.getElementById(
        "onesiteNavigation"
      );

    if (!container) {
      return;
    }

    const account = getAccount();

    if (account) {
      container.innerHTML =
        createSignedInNavigation(
          account
        );
    } else {
      container.innerHTML =
        createGuestNavigation();
    }

    const signOutButton =
      document.getElementById(
        "onesiteNavSignOut"
      );

    if (signOutButton) {
      signOutButton.addEventListener(
        "click",
        signOut
      );
    }
  }

  /*
   * Allows other systems to refresh
   * navigation after XP changes.
   */
  window.refreshOneSiteNavigation =
    initializeNavigation;

  initializeNavigation();
})();