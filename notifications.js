function createOneSiteNotificationContainer() {
  let container = document.getElementById(
    "onesiteNotificationContainer"
  );

  if (container) {
    return container;
  }

  container = document.createElement("div");
  container.id = "onesiteNotificationContainer";
  container.className = "onesite-notification-container";

  document.body.appendChild(container);

  return container;
}

function showOneSiteNotification(title, message, type) {
  const container = createOneSiteNotificationContainer();

  const notification = document.createElement("div");

  notification.className =
    `onesite-notification onesite-notification-${type || "default"}`;

  const titleElement = document.createElement("strong");
  titleElement.textContent = title || "OneSite";

  const messageElement = document.createElement("p");
  messageElement.textContent = message || "";

  notification.appendChild(titleElement);
  notification.appendChild(messageElement);

  container.appendChild(notification);

  requestAnimationFrame(function () {
    notification.classList.add("onesite-notification-visible");
  });

  window.setTimeout(function () {
    notification.classList.remove("onesite-notification-visible");

    window.setTimeout(function () {
      notification.remove();
    }, 300);
  }, 3500);
}