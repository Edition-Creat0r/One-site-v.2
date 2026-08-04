const topicButtons = document.querySelectorAll("[data-topic]");
const message = document.getElementById("message");

topicButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const topic = button.dataset.topic;

    message.textContent =
      `${topic} is coming soon. Try Space for now!`;
  });
});