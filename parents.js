const correctPin = "123456";

const lockedScreen =
  document.getElementById("lockedScreen");

const controlPanel =
  document.getElementById("controlPanel");

const pinInput =
  document.getElementById("pinInput");

const unlockButton =
  document.getElementById("unlockButton");

const lockButton =
  document.getElementById("lockButton");

const pinMessage =
  document.getElementById("pinMessage");

const gameMinutes =
  document.getElementById("gameMinutes");

const gameMinutesValue =
  document.getElementById("gameMinutesValue");

const streamingMinutes =
  document.getElementById("streamingMinutes");

const streamingMinutesValue =
  document.getElementById("streamingMinutesValue");

const saveSettingsButton =
  document.getElementById("saveSettings");

const resetSettingsButton =
  document.getElementById("resetSettings");

const settingsSummary =
  document.getElementById("settingsSummary");

const saveMessage =
  document.getElementById("saveMessage");

function unlockControls() {
  const enteredPin = pinInput.value.trim();

  if (enteredPin === correctPin) {
    lockedScreen.classList.add("hidden");
    controlPanel.classList.remove("hidden");

    pinInput.value = "";
    pinMessage.textContent = "";

    return;
  }

  pinMessage.textContent =
    "Incorrect PIN. Try again.";
}

function lockControls() {
  controlPanel.classList.add("hidden");
  lockedScreen.classList.remove("hidden");

  pinInput.value = "";

  pinMessage.textContent =
    "Controls have been locked.";
}

unlockButton.addEventListener(
  "click",
  unlockControls
);

lockButton.addEventListener(
  "click",
  lockControls
);

pinInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    unlockControls();
  }
});

gameMinutes.addEventListener("input", function () {
  gameMinutesValue.textContent =
    `${gameMinutes.value} minutes`;
});

streamingMinutes.addEventListener("input", function () {
  streamingMinutesValue.textContent =
    `${streamingMinutes.value} minutes`;
});

function createSettingsSummary() {
  const ageRating =
    document.getElementById("ageRating").value;

  const gameAccess =
    document.getElementById("gameAccess").value;

  const streamingAccess =
    document.getElementById("streamingAccess").value;

  const chatLevel =
    document.getElementById("chatLevel").value;

  const weekdayStart =
    document.getElementById("weekdayStart").value;

  const weekdayEnd =
    document.getElementById("weekdayEnd").value;

  const weekendStart =
    document.getElementById("weekendStart").value;

  const weekendEnd =
    document.getElementById("weekendEnd").value;

  const multiplayerAllowed =
    document.getElementById("allowMultiplayer").checked
      ? "Allowed"
      : "Blocked";

  const purchasesAllowed =
    document.getElementById("allowPurchases").checked
      ? "Allowed"
      : "Blocked";

  const schoolMode =
    document.getElementById("schoolMode").checked
      ? "Enabled"
      : "Disabled";

  settingsSummary.innerHTML = `
    <p><strong>Maximum rating:</strong> ${ageRating}</p>
    <p><strong>Games:</strong> ${gameAccess}</p>
    <p><strong>Game limit:</strong> ${gameMinutes.value} minutes</p>
    <p><strong>Multiplayer:</strong> ${multiplayerAllowed}</p>
    <p><strong>Purchases:</strong> ${purchasesAllowed}</p>
    <p><strong>Streaming:</strong> ${streamingAccess}</p>
    <p><strong>Streaming limit:</strong> ${streamingMinutes.value} minutes</p>
    <p><strong>Chat:</strong> ${chatLevel}</p>
    <p><strong>Weekday hours:</strong> ${weekdayStart} to ${weekdayEnd}</p>
    <p><strong>Weekend hours:</strong> ${weekendStart} to ${weekendEnd}</p>
    <p><strong>School Mode:</strong> ${schoolMode}</p>
  `;
}

saveSettingsButton.addEventListener("click", function () {
  createSettingsSummary();

  saveMessage.textContent =
    "Parent settings saved for this prototype.";
});

resetSettingsButton.addEventListener("click", function () {
  document.getElementById("ageRating").value =
    "10+";

  document.getElementById("gameAccess").value =
    "Approved games only";

  document.getElementById("streamingAccess").value =
    "Disabled";

  document.getElementById("chatLevel").value =
    "Preset phrases only";

  gameMinutes.value = "60";
  streamingMinutes.value = "30";

  gameMinutesValue.textContent =
    "60 minutes";

  streamingMinutesValue.textContent =
    "30 minutes";

  document.getElementById("allowMultiplayer").checked =
    false;

  document.getElementById("allowPurchases").checked =
    false;

  document.getElementById("allowLiveChat").checked =
    false;

  document.getElementById("allowBroadcasting").checked =
    false;

  document.getElementById("allowFriendRequests").checked =
    false;

  document.getElementById("showOnlineStatus").checked =
    false;

  document.getElementById("schoolMode").checked =
    false;

  document.getElementById("weekdayStart").value =
    "16:00";

  document.getElementById("weekdayEnd").value =
    "20:00";

  document.getElementById("weekendStart").value =
    "09:00";

  document.getElementById("weekendEnd").value =
    "21:00";

  settingsSummary.textContent =
    "Settings returned to their defaults.";

  saveMessage.textContent = "";
});