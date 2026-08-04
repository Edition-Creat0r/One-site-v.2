const CURRENT_YEAR = new Date().getFullYear();

const accountForm = document.getElementById("accountForm");
const displayNameInput = document.getElementById("displayName");
const birthYearInput = document.getElementById("birthYear");
const countryInput = document.getElementById("country");

const previewName = document.getElementById("previewName");
const previewAvatar = document.getElementById("previewAvatar");
const previewGroup = document.getElementById("previewGroup");
const accountMessage = document.getElementById("accountMessage");

function calculateAge(birthYear) {
  return CURRENT_YEAR - Number(birthYear);
}

function getAgeGroup(age) {
  if (age >= 5 && age <= 11) {
    return "kid";
  }

  if (age >= 12 && age <= 15) {
    return "youth";
  }

  if (age >= 16 && age <= 17) {
    return "older-teen";
  }

  if (age >= 18 && age <= 22) {
    return "creator";
  }

  if (age >= 23) {
    return "adult";
  }

  return "too-young";
}

function getAgeGroupName(ageGroup) {
  const names = {
    kid: "Kids Learning · Ages 5–11",
    youth: "Youth Learning · Ages 12–15",
    "older-teen": "Older Teen · Ages 16–17",
    creator: "Young Adult Creator · Ages 18–22",
    adult: "Adult Access · Ages 23+",
    "too-young": "Parent setup required"
  };

  return names[ageGroup] || "Age group will appear here";
}

function getSelectedAvatar() {
  const selectedAvatar = document.querySelector(
    'input[name="avatar"]:checked'
  );

  return selectedAvatar ? selectedAvatar.value : "🦊";
}

function createDefaultStats() {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    badges: [],
    quizzesCompleted: 0,
    lessonsCompleted: 0
  };
}

function createDefaultRole(ageGroup) {
  if (
    ageGroup === "kid" ||
    ageGroup === "youth" ||
    ageGroup === "older-teen"
  ) {
    return "student";
  }

  return "member";
}

function showAccountMessage(message, isError = false) {
  if (!accountMessage) {
    return;
  }

  accountMessage.textContent = message;
  accountMessage.classList.toggle("account-error", isError);
}

function updatePreview() {
  if (
    !displayNameInput ||
    !birthYearInput ||
    !previewName ||
    !previewAvatar ||
    !previewGroup
  ) {
    return;
  }

  const displayName = displayNameInput.value.trim();
  const birthYear = Number(birthYearInput.value);
  const avatar = getSelectedAvatar();

  previewName.textContent = displayName || "New learner";
  previewAvatar.textContent = avatar;

  if (!birthYear) {
    previewGroup.textContent = "Age group will appear here";
    return;
  }

  const age = calculateAge(birthYear);
  const ageGroup = getAgeGroup(age);

  previewGroup.textContent = getAgeGroupName(ageGroup);
}

function saveAccount(event) {
  event.preventDefault();

  if (!displayNameInput || !birthYearInput || !countryInput) {
    console.error(
      "OneSite account form is missing one or more required fields."
    );

    showAccountMessage(
      "The account page is missing a required field.",
      true
    );

    return;
  }

  const displayName = displayNameInput.value.trim();
  const birthYear = Number(birthYearInput.value);
  const country = countryInput.value;
  const avatar = getSelectedAvatar();

  showAccountMessage("");

  if (displayName.length < 2) {
    showAccountMessage(
      "Your display name must contain at least two characters.",
      true
    );

    displayNameInput.focus();
    return;
  }

  if (!Number.isInteger(birthYear)) {
    showAccountMessage("Please enter a valid birth year.", true);
    birthYearInput.focus();
    return;
  }

  const age = calculateAge(birthYear);
  const ageGroup = getAgeGroup(age);

  if (age < 5) {
    showAccountMessage(
      "This account must be created with a parent or guardian.",
      true
    );

    birthYearInput.focus();
    return;
  }

  if (age > 126) {
    showAccountMessage("Please enter a valid birth year.", true);
    birthYearInput.focus();
    return;
  }

  if (!country) {
    showAccountMessage("Please choose a country or region.", true);
    countryInput.focus();
    return;
  }

  const requiresParentApproval = age < 13;

  const pendingProvider =
    typeof getPendingSignInProvider === "function"
      ? getPendingSignInProvider()
      : "guest";

  const account = {
    displayName,
    birthYear,
    age,
    ageGroup,
    country,
    avatar,

    signInProvider: pendingProvider,
    emailVerified: false,
    ageVerificationStatus: "self-declared",

    parentalConsentStatus: requiresParentApproval
      ? "required"
      : "not-required",

    role: createDefaultRole(ageGroup),
    trustLevel: "standard",
    premium: false,

    createdAt: new Date().toISOString(),
    lastSignedInAt: new Date().toISOString(),

    stats: createDefaultStats()
  };

  try {
    if (typeof saveOneSiteAccount === "function") {
      const saved = saveOneSiteAccount(account);

      if (!saved) {
        throw new Error("Account could not be saved.");
      }
    } else {
      localStorage.setItem(
        "onesiteAccount",
        JSON.stringify(account)
      );
    }

    if (typeof createOneSiteSession === "function") {
      createOneSiteSession(account.signInProvider);
    }

    if (typeof clearPendingSignInProvider === "function") {
      clearPendingSignInProvider();
    }

    showAccountMessage("Your OneSite profile was created.");

    if (requiresParentApproval) {
      window.location.href = "parent-approval.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.error("OneSite could not create the account.", error);

    showAccountMessage(
      "OneSite could not save your account. Please try again.",
      true
    );
  }
}

function initializeAccountPage() {
  if (!accountForm) {
    console.error(
      'OneSite could not find the form with id="accountForm".'
    );

    return;
  }

  if (birthYearInput) {
    birthYearInput.max = String(CURRENT_YEAR - 5);
    birthYearInput.min = String(CURRENT_YEAR - 126);
  }

  if (displayNameInput) {
    displayNameInput.addEventListener("input", updatePreview);
  }

  if (birthYearInput) {
    birthYearInput.addEventListener("input", updatePreview);
  }

  document
    .querySelectorAll('input[name="avatar"]')
    .forEach(function (input) {
      input.addEventListener("change", updatePreview);
    });

  accountForm.addEventListener("submit", saveAccount);

  updatePreview();
}

initializeAccountPage();