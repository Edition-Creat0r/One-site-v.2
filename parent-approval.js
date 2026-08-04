const account = getStoredAccount();

const emailStep = document.getElementById("emailStep");
const codeStep = document.getElementById("codeStep");
const successStep = document.getElementById("successStep");

const parentEmailForm = document.getElementById("parentEmailForm");
const approvalCodeForm = document.getElementById("approvalCodeForm");

const parentEmailInput = document.getElementById("parentEmail");
const approvalCodeInput = document.getElementById("approvalCode");

const displayedApprovalCode = document.getElementById(
  "displayedApprovalCode"
);

const changeEmailButton = document.getElementById("changeEmailButton");
const approvalMessage = document.getElementById("approvalMessage");

let generatedApprovalCode = "";

function getStoredAccount() {
  try {
    return JSON.parse(localStorage.getItem("onesiteAccount"));
  } catch (error) {
    return null;
  }
}

function saveStoredAccount(updatedAccount) {
  localStorage.setItem("onesiteAccount", JSON.stringify(updatedAccount));
}

function showMessage(message, isError = false) {
  approvalMessage.textContent = message;
  approvalMessage.classList.toggle("approval-error", isError);
}

function generateSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function renderChildInformation() {
  if (!account) {
    window.location.href = "account.html";
    return;
  }

  document.getElementById("childAvatar").textContent =
    account.avatar || "🦊";

  document.getElementById("childName").textContent =
    account.displayName || "OneSite learner";

  document.getElementById("childAge").textContent =
    typeof account.age === "number"
      ? `Age ${account.age}`
      : "Age information unavailable";
}

function checkExistingApproval() {
  if (!account) {
    return;
  }

  if (account.parentalConsentStatus === "approved") {
    emailStep.classList.add("hidden");
    codeStep.classList.add("hidden");
    successStep.classList.remove("hidden");
  }
}

function handleParentEmail(event) {
  event.preventDefault();

  const parentEmail = parentEmailInput.value.trim().toLowerCase();

  if (!parentEmail || !parentEmail.includes("@")) {
    showMessage("Please enter a valid parent email address.", true);
    return;
  }

  generatedApprovalCode = generateSixDigitCode();

  account.parentEmail = parentEmail;
  account.parentalConsentStatus = "pending";
  account.parentApprovalRequestedAt = new Date().toISOString();

  saveStoredAccount(account);

  displayedApprovalCode.textContent = generatedApprovalCode;

  emailStep.classList.add("hidden");
  codeStep.classList.remove("hidden");

  approvalCodeInput.value = "";
  approvalCodeInput.focus();

  showMessage(
    `A prototype code was generated for ${parentEmail}.`
  );
}

function handleApprovalCode(event) {
  event.preventDefault();

  const enteredCode = approvalCodeInput.value.trim();

  if (!/^\d{6}$/.test(enteredCode)) {
    showMessage("Enter the complete six-digit code.", true);
    return;
  }

  if (enteredCode !== generatedApprovalCode) {
    showMessage("That code is incorrect. Please try again.", true);
    return;
  }

  account.parentalConsentStatus = "approved";
  account.parentApprovedAt = new Date().toISOString();
  account.parentEmailVerified = true;

  saveStoredAccount(account);

  codeStep.classList.add("hidden");
  successStep.classList.remove("hidden");

  showMessage("Parent approval was completed successfully.");
}

function resetEmailStep() {
  generatedApprovalCode = "";

  account.parentalConsentStatus = "required";
  delete account.parentEmail;
  delete account.parentApprovalRequestedAt;

  saveStoredAccount(account);

  approvalCodeInput.value = "";
  displayedApprovalCode.textContent = "000000";

  codeStep.classList.add("hidden");
  emailStep.classList.remove("hidden");

  parentEmailInput.focus();

  showMessage("");
}

parentEmailForm.addEventListener("submit", handleParentEmail);
approvalCodeForm.addEventListener("submit", handleApprovalCode);
changeEmailButton.addEventListener("click", resetEmailStep);

renderChildInformation();
checkExistingApproval();