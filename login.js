const providerButtons = document.querySelectorAll(
  "[data-provider]"
);

const guestLoginButton = document.getElementById(
  "guestLoginButton"
);

const loginMessage = document.getElementById("loginMessage");

const existingAccountNotice = document.getElementById(
  "existingAccountNotice"
);

const existingAccountAvatar = document.getElementById(
  "existingAccountAvatar"
);

const existingAccountName = document.getElementById(
  "existingAccountName"
);

function formatProviderName(provider) {
  const providerNames = {
    google: "Google",
    microsoft: "Microsoft",
    apple: "Apple",
    guest: "Guest"
  };

  return providerNames[provider] || "OneSite";
}

function handleProviderSignIn(provider) {
  loginMessage.textContent =
    `Opening the ${formatProviderName(provider)} prototype sign-in...`;

  window.setTimeout(function () {
    beginOneSiteSignIn(provider);
  }, 350);
}

function displayExistingAccount() {
  const account = getOneSiteAccount();

  if (!account) {
    return;
  }

  existingAccountAvatar.textContent = account.avatar || "🦊";

  existingAccountName.textContent =
    account.displayName || "OneSite learner";

  existingAccountNotice.classList.remove("hidden");
}

providerButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const provider = button.dataset.provider;

    handleProviderSignIn(provider);
  });
});

guestLoginButton.addEventListener("click", function () {
  handleProviderSignIn("guest");
});

displayExistingAccount();