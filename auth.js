const ONESITE_ACCOUNT_KEY = "onesiteAccount";
const ONESITE_SESSION_KEY = "onesiteSession";
const ONESITE_PENDING_PROVIDER_KEY = "onesitePendingProvider";

function getOneSiteAccount() {
  try {
    const storedAccount = localStorage.getItem(ONESITE_ACCOUNT_KEY);

    return storedAccount ? JSON.parse(storedAccount) : null;
  } catch (error) {
    console.error("OneSite could not read the account.", error);
    return null;
  }
}

function saveOneSiteAccount(account) {
  if (!account || typeof account !== "object") {
    return false;
  }

  try {
    localStorage.setItem(
      ONESITE_ACCOUNT_KEY,
      JSON.stringify(account)
    );

    return true;
  } catch (error) {
    console.error("OneSite could not save the account.", error);
    return false;
  }
}

function getOneSiteSession() {
  try {
    const storedSession = sessionStorage.getItem(ONESITE_SESSION_KEY);

    return storedSession ? JSON.parse(storedSession) : null;
  } catch (error) {
    console.error("OneSite could not read the session.", error);
    return null;
  }
}

function createOneSiteSession(provider) {
  const account = getOneSiteAccount();

  if (!account) {
    return null;
  }

  const session = {
    signedIn: true,
    provider: provider || account.signInProvider || "guest",
    startedAt: new Date().toISOString()
  };

  sessionStorage.setItem(
    ONESITE_SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

function isOneSiteLoggedIn() {
  const account = getOneSiteAccount();
  const session = getOneSiteSession();

  return Boolean(account && session && session.signedIn);
}

function getCurrentOneSiteUser() {
  if (!isOneSiteLoggedIn()) {
    return null;
  }

  return getOneSiteAccount();
}

function setPendingSignInProvider(provider) {
  localStorage.setItem(
    ONESITE_PENDING_PROVIDER_KEY,
    provider || "guest"
  );
}

function getPendingSignInProvider() {
  return (
    localStorage.getItem(ONESITE_PENDING_PROVIDER_KEY) || "guest"
  );
}

function clearPendingSignInProvider() {
  localStorage.removeItem(ONESITE_PENDING_PROVIDER_KEY);
}

function beginOneSiteSignIn(provider) {
  const selectedProvider = provider || "guest";
  const account = getOneSiteAccount();

  setPendingSignInProvider(selectedProvider);

  if (!account) {
    window.location.href = "account.html";
    return;
  }

  account.signInProvider = selectedProvider;
  account.lastSignedInAt = new Date().toISOString();

  saveOneSiteAccount(account);
  createOneSiteSession(selectedProvider);
  clearPendingSignInProvider();

  sendUserAfterSignIn(account);
}

function sendUserAfterSignIn(account) {
  if (
    account.age < 13 &&
    account.parentalConsentStatus !== "approved"
  ) {
    window.location.href = "parent-approval.html";
    return;
  }

  window.location.href = "dashboard.html";
}

function requireOneSiteLogin() {
  const account = getOneSiteAccount();

  if (!account) {
    window.location.replace("login.html");
    return false;
  }

  if (!getOneSiteSession()) {
    createOneSiteSession(account.signInProvider || "guest");
  }

  if (
    account.age < 13 &&
    account.parentalConsentStatus !== "approved"
  ) {
    window.location.replace("parent-approval.html");
    return false;
  }

  return true;
}

function signOutOneSite() {
  sessionStorage.removeItem(ONESITE_SESSION_KEY);
  window.location.href = "login.html";
}

function deleteOneSiteAccount() {
  localStorage.removeItem(ONESITE_ACCOUNT_KEY);
  localStorage.removeItem(ONESITE_PENDING_PROVIDER_KEY);
  sessionStorage.removeItem(ONESITE_SESSION_KEY);

  window.location.href = "login.html";
}