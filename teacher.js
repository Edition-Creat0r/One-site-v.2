const quizSelect = document.getElementById("quizSelect");
const lockGames = document.getElementById("lockGames");
const lockArticles = document.getElementById("lockArticles");
const lockStreaming = document.getElementById("lockStreaming");
const lockVideos = document.getElementById("lockVideos");
const lockChat = document.getElementById("lockChat");

const createSessionButton =
  document.getElementById("createSessionButton");

const startSessionButton =
  document.getElementById("startSessionButton");

const endSessionButton =
  document.getElementById("endSessionButton");

const teacherMessage =
  document.getElementById("teacherMessage");

const sessionPanel =
  document.getElementById("sessionPanel");

const classCode =
  document.getElementById("classCode");

const sessionSummary =
  document.getElementById("sessionSummary");

const sessionStatus =
  document.getElementById("sessionStatus");

function createClassCode() {
  return String(
    Math.floor(100000 + Math.random() * 900000)
  );
}

function yesOrNo(value) {
  return value ? "Locked" : "Available";
}

function saveSession(session) {
  localStorage.setItem(
    "onesite_teacher_session",
    JSON.stringify(session)
  );
}

function createSession() {
  const code = createClassCode();

  const session = {
    code,
    quizId: quizSelect.value,
    quizName:
      quizSelect.options[quizSelect.selectedIndex].text,
    active: false,
    restrictions: {
      games: lockGames.checked,
      articles: lockArticles.checked,
      streaming: lockStreaming.checked,
      videos: lockVideos.checked,
      chat: lockChat.checked
    }
  };

  saveSession(session);

  classCode.textContent = code;

  sessionSummary.innerHTML = `
    <p><strong>Activity:</strong> ${session.quizName}</p>
    <p><strong>Games:</strong> ${yesOrNo(session.restrictions.games)}</p>
    <p><strong>Articles:</strong> ${yesOrNo(session.restrictions.articles)}</p>
    <p><strong>Streaming:</strong> ${yesOrNo(session.restrictions.streaming)}</p>
    <p><strong>Videos:</strong> ${yesOrNo(session.restrictions.videos)}</p>
    <p><strong>Chat:</strong> ${yesOrNo(session.restrictions.chat)}</p>
  `;

  sessionPanel.classList.remove("hidden");
  sessionStatus.textContent = "Waiting to start.";
  teacherMessage.textContent =
    "Classroom code created.";
}

function updateSessionActive(active) {
  const savedSession =
    localStorage.getItem("onesite_teacher_session");

  if (!savedSession) {
    sessionStatus.textContent =
      "Create a session first.";
    return;
  }

  const session = JSON.parse(savedSession);
  session.active = active;

  saveSession(session);

  sessionStatus.textContent = active
    ? "Session is active. Students may begin."
    : "Session has ended.";
}

createSessionButton.addEventListener(
  "click",
  createSession
);

startSessionButton.addEventListener(
  "click",
  function () {
    updateSessionActive(true);
  }
);

endSessionButton.addEventListener(
  "click",
  function () {
    updateSessionActive(false);
  }
);