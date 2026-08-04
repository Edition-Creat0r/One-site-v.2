(function () {
  "use strict";

  const STORAGE_KEY = "onesiteSpacesV1";

  const ROLE_DEFINITIONS = {
    owner: { label: "Space Owner", emoji: "👑", level: 5 },
    admin: { label: "Space Admin", emoji: "🛡️", level: 4 },
    helper: { label: "Space Helper", emoji: "🧭", level: 3 },
    contributor: { label: "Space Contributor", emoji: "✍️", level: 2 },
    viewer: { label: "Space Viewer", emoji: "👀", level: 1 }
  };

  const AGE_RATING_LABELS = {
    0: "Everyone",
    8: "Ages 8+",
    12: "Ages 12+",
    16: "Ages 16+",
    18: "Ages 18+"
  };

  let activeSpaceId = null;

  const elements = {};
  [
    "openCreateSpaceButton", "closeCreateSpaceButton", "createSpacePanel",
    "createSpaceForm", "spacesMessage", "spaceLibraryPanel", "spaceLibrary",
    "emptySpacesState", "spaceViewerPanel", "backToSpacesButton",
    "spaceNameInput", "spaceEmojiInput", "spaceDescriptionInput",
    "spaceAgeRatingInput", "spaceVisibilityInput", "activeSpaceEmoji",
    "activeSpaceTitle", "activeSpaceDescription", "activeSpaceAgeBadge",
    "activeSpaceVisibility", "activeSpaceMemberCount", "activeSpaceOwnerName",
    "createPostForm", "spacePostInput", "publishPostButton",
    "postPermissionMessage", "spacePostsList", "addMemberForm",
    "memberNameInput", "memberAgeInput", "memberRoleInput", "addMemberButton",
    "spaceMembersList", "spaceSettingsForm", "settingsEmojiInput",
    "settingsDescriptionInput", "settingsAgeRatingInput",
    "settingsVisibilityInput", "saveSpaceSettingsButton", "postsTabPanel",
    "membersTabPanel", "settingsTabPanel"
  ].forEach(function (id) {
    elements[id] = document.getElementById(id);
  });

  function getAccount() {
    if (typeof getOneSiteAccount === "function") {
      return getOneSiteAccount();
    }

    try {
      return JSON.parse(localStorage.getItem("onesiteAccount") || "null");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function getSpaces() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function saveSpaces(spaces) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
  }

  function createId(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getAccountAge(account) {
    const directAge = Number(account && account.age);
    if (Number.isFinite(directAge) && directAge > 0) return directAge;

    const birthYear = Number(account && account.birthYear);
    if (Number.isFinite(birthYear) && birthYear > 1900) {
      return new Date().getFullYear() - birthYear;
    }

    return 0;
  }

  function getAccountName(account) {
    return (account && account.displayName) || "OneSite User";
  }

  function getAccountId(account) {
    if (account && account.id) return String(account.id);

    return "local-" + getAccountName(account)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  }

  function showMessage(message, type) {
    if (!elements.spacesMessage) return;

    elements.spacesMessage.textContent = message;
    elements.spacesMessage.className = "spaces-message spaces-message-" + (type || "info");

    window.setTimeout(function () {
      elements.spacesMessage.classList.add("hidden");
    }, 4500);
  }

  function announce(title, message, type) {
    if (typeof showOneSiteNotification === "function") {
      showOneSiteNotification(title, message, type || "xp");
      return;
    }

    showMessage(title + ": " + message, type);
  }

  function getActiveSpace() {
    return getSpaces().find(function (space) {
      return space.id === activeSpaceId;
    }) || null;
  }

  function getCurrentMember(space) {
    const account = getAccount();
    if (!account || !space) return null;

    const accountId = getAccountId(account);
    return space.members.find(function (member) {
      return member.accountId === accountId;
    }) || null;
  }

  function getRoleLevel(role) {
    return ROLE_DEFINITIONS[role] ? ROLE_DEFINITIONS[role].level : 0;
  }

  function canManageMembers(space) {
    const member = getCurrentMember(space);
    return member && getRoleLevel(member.role) >= 4;
  }

  function canManageSettings(space) {
    const member = getCurrentMember(space);
    return member && getRoleLevel(member.role) >= 4;
  }

  function canPost(space) {
    const member = getCurrentMember(space);
    return member && getRoleLevel(member.role) >= 2;
  }

  function canViewSpace(space) {
    const account = getAccount();
    return !!account && getAccountAge(account) >= Number(space.ageRating || 0);
  }

  function formatDate(timestamp) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(timestamp));
  }

  function renderLibrary() {
    const spaces = getSpaces();
    const account = getAccount();
    const accountId = account ? getAccountId(account) : "";

    elements.spaceLibrary.innerHTML = "";

    const visibleSpaces = spaces.filter(function (space) {
      return space.members.some(function (member) {
        return member.accountId === accountId;
      });
    });

    elements.emptySpacesState.classList.toggle("hidden", visibleSpaces.length > 0);

    visibleSpaces.forEach(function (space) {
      const member = space.members.find(function (item) {
        return item.accountId === accountId;
      });
      const role = ROLE_DEFINITIONS[member ? member.role : "viewer"];

      const card = document.createElement("article");
      card.className = "spaces-library-card";
      card.innerHTML = `
        <div class="spaces-library-icon">${escapeHTML(space.emoji)}</div>
        <div class="spaces-library-content">
          <div class="spaces-library-heading">
            <h3>${escapeHTML(space.name)}</h3>
            <span class="spaces-age-badge">${AGE_RATING_LABELS[Number(space.ageRating)] || "Everyone"}</span>
          </div>
          <p>${escapeHTML(space.description)}</p>
          <div class="spaces-card-meta">
            <span>${role.emoji} ${role.label}</span>
            <span>${space.members.length} ${space.members.length === 1 ? "member" : "members"}</span>
            <span>${escapeHTML(space.visibility)}</span>
          </div>
        </div>
        <button class="spaces-open-button" type="button">Open Space</button>
      `;

      card.querySelector(".spaces-open-button").addEventListener("click", function () {
        openSpace(space.id);
      });

      elements.spaceLibrary.appendChild(card);
    });
  }

  function openSpace(spaceId) {
    activeSpaceId = spaceId;
    const space = getActiveSpace();

    if (!space) {
      showMessage("That Space could not be found.", "error");
      return;
    }

    if (!canViewSpace(space)) {
      showMessage("Your account does not meet this Space's age requirement.", "error");
      return;
    }

    elements.createSpacePanel.classList.add("hidden");
    elements.spaceLibraryPanel.classList.add("hidden");
    elements.spaceViewerPanel.classList.remove("hidden");

    showTab("posts");
    renderActiveSpace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderActiveSpace() {
    const space = getActiveSpace();
    if (!space) return;

    const owner = space.members.find(function (member) {
      return member.role === "owner";
    });

    elements.activeSpaceEmoji.textContent = space.emoji;
    elements.activeSpaceTitle.textContent = space.name;
    elements.activeSpaceDescription.textContent = space.description;
    elements.activeSpaceAgeBadge.textContent = AGE_RATING_LABELS[Number(space.ageRating)] || "Everyone";
    elements.activeSpaceVisibility.textContent = "Visibility: " + space.visibility;
    elements.activeSpaceMemberCount.textContent = space.members.length + (space.members.length === 1 ? " member" : " members");
    elements.activeSpaceOwnerName.textContent = "Owner: " + (owner ? owner.name : "Unknown");

    renderPosts(space);
    renderMembers(space);
    renderSettings(space);
    updatePermissions(space);
  }

  function renderPosts(space) {
    elements.spacePostsList.innerHTML = "";

    if (!space.posts.length) {
      elements.spacePostsList.innerHTML = '<div class="spaces-empty-posts"><div>💬</div><h3>No posts yet</h3><p>Start the first discussion in this Space.</p></div>';
      return;
    }

    space.posts.slice().sort(function (a, b) {
      return b.createdAt - a.createdAt;
    }).forEach(function (post) {
      const card = document.createElement("article");
      card.className = "spaces-post-card";
      card.innerHTML = `
        <div class="spaces-post-header">
          <div>
            <strong>${escapeHTML(post.authorName)}</strong>
            <span>${ROLE_DEFINITIONS[post.authorRole] ? ROLE_DEFINITIONS[post.authorRole].emoji + " " + ROLE_DEFINITIONS[post.authorRole].label : "Member"}</span>
          </div>
          <time>${escapeHTML(formatDate(post.createdAt))}</time>
        </div>
        <p>${escapeHTML(post.text).replaceAll("\n", "<br>")}</p>
      `;
      elements.spacePostsList.appendChild(card);
    });
  }

  function renderMembers(space) {
    elements.spaceMembersList.innerHTML = "";

    const currentMember = getCurrentMember(space);
    const currentLevel = currentMember ? getRoleLevel(currentMember.role) : 0;

    space.members.slice().sort(function (a, b) {
      return getRoleLevel(b.role) - getRoleLevel(a.role);
    }).forEach(function (member) {
      const role = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.viewer;
      const row = document.createElement("article");
      row.className = "spaces-member-card";
      row.innerHTML = `
        <div class="spaces-member-avatar">${escapeHTML(member.avatar || "🙂")}</div>
        <div class="spaces-member-details">
          <h4>${escapeHTML(member.name)}</h4>
          <p>${role.emoji} ${role.label} · Age ${escapeHTML(member.age)}</p>
        </div>
        <div class="spaces-member-controls"></div>
      `;

      const controls = row.querySelector(".spaces-member-controls");
      const canEdit = currentLevel >= 4 && member.role !== "owner" && getRoleLevel(member.role) < currentLevel;

      if (canEdit) {
        const select = document.createElement("select");
        ["viewer", "contributor", "helper", "admin"]
          .filter(function (roleName) {
            return getRoleLevel(roleName) < currentLevel;
          })
          .forEach(function (roleName) {
            const option = document.createElement("option");
            option.value = roleName;
            option.textContent = ROLE_DEFINITIONS[roleName].label;
            option.selected = member.role === roleName;
            select.appendChild(option);
          });

        select.addEventListener("change", function () {
          changeMemberRole(member.id, select.value);
        });

        controls.appendChild(select);
      } else {
        const badge = document.createElement("span");
        badge.className = "spaces-role-badge";
        badge.textContent = role.label;
        controls.appendChild(badge);
      }

      elements.spaceMembersList.appendChild(row);
    });
  }

  function renderSettings(space) {
    elements.settingsEmojiInput.value = space.emoji;
    elements.settingsDescriptionInput.value = space.description;
    elements.settingsAgeRatingInput.value = String(space.ageRating);
    elements.settingsVisibilityInput.value = space.visibility;
  }

  function updatePermissions(space) {
    const member = getCurrentMember(space);
    const role = member ? ROLE_DEFINITIONS[member.role] : ROLE_DEFINITIONS.viewer;
    const postAllowed = canPost(space);
    const manageMembersAllowed = canManageMembers(space);
    const manageSettingsAllowed = canManageSettings(space);

    elements.spacePostInput.disabled = !postAllowed;
    elements.publishPostButton.disabled = !postAllowed;
    elements.postPermissionMessage.textContent = postAllowed
      ? role.emoji + " Posting as " + role.label
      : "Your role can view posts but cannot publish.";

    Array.from(elements.addMemberForm.querySelectorAll("input, select, button")).forEach(function (control) {
      control.disabled = !manageMembersAllowed;
    });

    Array.from(elements.spaceSettingsForm.querySelectorAll("input, select, textarea, button")).forEach(function (control) {
      control.disabled = !manageSettingsAllowed;
    });
  }

  function createSpace(event) {
    event.preventDefault();

    const account = getAccount();
    if (!account) {
      showMessage("Please create or sign in to a OneSite account first.", "error");
      return;
    }

    const accountAge = getAccountAge(account);
    const minimumAge = Number(elements.spaceAgeRatingInput.value);

    if (accountAge < minimumAge) {
      showMessage("You cannot create a Space with an age rating above your own age.", "error");
      return;
    }

    const name = elements.spaceNameInput.value.trim();
    const emoji = elements.spaceEmojiInput.value.trim();
    const description = elements.spaceDescriptionInput.value.trim();

    const newSpace = {
      id: createId("space"),
      name: name,
      emoji: emoji,
      description: description,
      ageRating: minimumAge,
      visibility: elements.spaceVisibilityInput.value,
      verificationStatus: "prototype-unverified",
      communityMode: false,
      ownerAccountId: getAccountId(account),
      createdAt: Date.now(),
      members: [{
        id: createId("member"),
        accountId: getAccountId(account),
        name: getAccountName(account),
        avatar: account.avatar || "🙂",
        age: accountAge,
        role: "owner",
        joinedAt: Date.now()
      }],
      posts: [{
        id: createId("post"),
        authorAccountId: getAccountId(account),
        authorName: getAccountName(account),
        authorRole: "owner",
        text: "Welcome to " + name + "! This is the first post in the Space.",
        createdAt: Date.now()
      }]
    };

    const spaces = getSpaces();
    spaces.push(newSpace);
    saveSpaces(spaces);

    elements.createSpaceForm.reset();
    elements.spaceEmojiInput.value = "🌟";
    elements.createSpacePanel.classList.add("hidden");

    announce("Space created", name + " is ready.", "badge");
    renderLibrary();
    openSpace(newSpace.id);
  }

  function publishPost(event) {
    event.preventDefault();

    const space = getActiveSpace();
    const account = getAccount();

    if (!space || !account || !canPost(space)) {
      showMessage("Your role cannot publish posts in this Space.", "error");
      return;
    }

    const text = elements.spacePostInput.value.trim();
    if (!text) return;

    const member = getCurrentMember(space);
    const spaces = getSpaces();
    const storedSpace = spaces.find(function (item) {
      return item.id === activeSpaceId;
    });

    storedSpace.posts.push({
      id: createId("post"),
      authorAccountId: getAccountId(account),
      authorName: getAccountName(account),
      authorRole: member.role,
      text: text,
      createdAt: Date.now()
    });

    saveSpaces(spaces);
    elements.spacePostInput.value = "";
    announce("Post published", "Your update was added to the Space.", "xp");
    renderActiveSpace();
  }

  function addMember(event) {
    event.preventDefault();

    const space = getActiveSpace();
    if (!space || !canManageMembers(space)) {
      showMessage("Only a Space Owner or Space Admin can add members.", "error");
      return;
    }

    const name = elements.memberNameInput.value.trim();
    const age = Number(elements.memberAgeInput.value);
    const role = elements.memberRoleInput.value;

    if (!name || !Number.isFinite(age)) {
      showMessage("Enter a valid member name and age.", "error");
      return;
    }

    if (age < Number(space.ageRating)) {
      showMessage("This person is too young for the Space's age rating.", "error");
      return;
    }

    const spaces = getSpaces();
    const storedSpace = spaces.find(function (item) {
      return item.id === activeSpaceId;
    });

    storedSpace.members.push({
      id: createId("member"),
      accountId: createId("prototype-account"),
      name: name,
      avatar: "🙂",
      age: age,
      role: role,
      joinedAt: Date.now(),
      prototypeOnly: true
    });

    saveSpaces(spaces);
    elements.addMemberForm.reset();
    announce("Member added", name + " joined as " + ROLE_DEFINITIONS[role].label + ".", "badge");
    renderActiveSpace();
  }

  function changeMemberRole(memberId, newRole) {
    const space = getActiveSpace();
    if (!space || !canManageMembers(space)) return;

    const currentMember = getCurrentMember(space);
    if (getRoleLevel(newRole) >= getRoleLevel(currentMember.role)) {
      showMessage("You cannot assign a role equal to or above your own.", "error");
      renderActiveSpace();
      return;
    }

    const spaces = getSpaces();
    const storedSpace = spaces.find(function (item) {
      return item.id === activeSpaceId;
    });
    const target = storedSpace.members.find(function (member) {
      return member.id === memberId;
    });

    if (!target || target.role === "owner") return;

    target.role = newRole;
    saveSpaces(spaces);
    showMessage(target.name + " is now a " + ROLE_DEFINITIONS[newRole].label + ".", "success");
    renderActiveSpace();
  }

  function saveSettings(event) {
    event.preventDefault();

    const space = getActiveSpace();
    const account = getAccount();

    if (!space || !account || !canManageSettings(space)) {
      showMessage("Only a Space Owner or Space Admin can change settings.", "error");
      return;
    }

    const newRating = Number(elements.settingsAgeRatingInput.value);
    if (getAccountAge(account) < newRating) {
      showMessage("You cannot set a rating above your own age.", "error");
      return;
    }

    const tooYoungMember = space.members.find(function (member) {
      return Number(member.age) < newRating;
    });

    if (tooYoungMember) {
      showMessage("The rating cannot be raised because " + tooYoungMember.name + " would no longer meet the requirement.", "error");
      return;
    }

    const spaces = getSpaces();
    const storedSpace = spaces.find(function (item) {
      return item.id === activeSpaceId;
    });

    storedSpace.emoji = elements.settingsEmojiInput.value.trim() || "🌟";
    storedSpace.description = elements.settingsDescriptionInput.value.trim();
    storedSpace.ageRating = newRating;
    storedSpace.visibility = elements.settingsVisibilityInput.value;

    saveSpaces(spaces);
    announce("Settings saved", "Your Space was updated.", "xp");
    renderActiveSpace();
  }

  function showTab(tabName) {
    document.querySelectorAll(".spaces-tab").forEach(function (button) {
      button.classList.toggle("active-space-tab", button.dataset.spaceTab === tabName);
    });

    elements.postsTabPanel.classList.toggle("hidden", tabName !== "posts");
    elements.membersTabPanel.classList.toggle("hidden", tabName !== "members");
    elements.settingsTabPanel.classList.toggle("hidden", tabName !== "settings");
  }

  function showCreatePanel() {
    if (!getAccount()) {
      showMessage("Create or sign in to an account before making a Space.", "error");
      return;
    }

    elements.createSpacePanel.classList.remove("hidden");
    elements.spaceViewerPanel.classList.add("hidden");
    elements.spaceLibraryPanel.classList.remove("hidden");
    elements.spaceNameInput.focus();
  }

  function returnToLibrary() {
    activeSpaceId = null;
    elements.spaceViewerPanel.classList.add("hidden");
    elements.createSpacePanel.classList.add("hidden");
    elements.spaceLibraryPanel.classList.remove("hidden");
    renderLibrary();
  }

  function initialize() {
    if (!getAccount()) {
      showMessage("You can view this page, but you need a OneSite account to create a Space.", "info");
    }

    if (elements.openCreateSpaceButton) elements.openCreateSpaceButton.addEventListener("click", showCreatePanel);
    if (elements.closeCreateSpaceButton) elements.closeCreateSpaceButton.addEventListener("click", function () {
      elements.createSpacePanel.classList.add("hidden");
    });
    if (elements.createSpaceForm) elements.createSpaceForm.addEventListener("submit", createSpace);
    if (elements.backToSpacesButton) elements.backToSpacesButton.addEventListener("click", returnToLibrary);
    if (elements.createPostForm) elements.createPostForm.addEventListener("submit", publishPost);
    if (elements.addMemberForm) elements.addMemberForm.addEventListener("submit", addMember);
    if (elements.spaceSettingsForm) elements.spaceSettingsForm.addEventListener("submit", saveSettings);

    document.querySelectorAll(".spaces-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        showTab(button.dataset.spaceTab);
      });
    });

    renderLibrary();
  }

  initialize();
})();