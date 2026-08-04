const studentName =
  document.getElementById("studentName");

const joinCode =
  document.getElementById("joinCode");

const joinButton =
  document.getElementById("joinButton");

const joinMessage =
  document.getElementById("joinMessage");

const joinPanel =
  document.getElementById("joinPanel");

const studentSession =
  document.getElementById("studentSession");

const welcomeStudent =
  document.getElementById("welcomeStudent");

const assignedActivity =
  document.getElementById("assignedActivity");

const restrictionSummary =
  document.getElementById("restrictionSummary");

function statusText(locked) {
  return locked ? "Locked" : "Available";
}

function joinClass() {
  const name = studentName.value.trim();
  const code = joinCode.value.trim();

  if (!name) {
    joinMessage.textContent =
      "Enter a nickname.";
    return;
  }

  if (!/^\d{6}$/.test(code)) {
    joinMessage.textContent =
      "Enter a valid six-digit code.";
    return;
  }

  const savedSession =
    localStorage.getItem("onesite_teacher_session");

  if (!savedSession) {
    joinMessage.textContent =
      "No classroom session exists on this browser.";
    return;
  }

  let session;

  try {
    session = JSON.parse(savedSession);
  } catch (error) {
    joinMessage.textContent =
      "The classroom session could not be read.";
    return;
  }

  if (session.code !== code) {
    joinMessage.textContent =
      "That classroom code is incorrect.";
    return;
  }

  if (!session.active) {
    joinMessage.textContent =
      "The teacher has not started this session yet.";
    return;
  }

  localStorage.setItem(
    "onesite_student_teacher_mode",
    JSON.stringify({
      joined: true,
      name,
      code,
      quizId: session.quizId
    })
  );

  joinPanel.classList.add("hidden");
  studentSession.classList.remove("hidden");

  welcomeStudent.textContent =
    `Welcome, ${name}!`;

  assignedActivity.textContent =
    `Assigned activity: ${session.quizName}`;

  restrictionSummary.innerHTML = `
    <p><strong>Games:</strong> ${statusText(session.restrictions.games)}</p>
    <p><strong>Articles:</strong> ${statusText(session.restrictions.articles)}</p>
    <p><strong>Streaming:</strong> ${statusText(session.restrictions.streaming)}</p>
    <p><strong>Videos:</strong> ${statusText(session.restrictions.videos)}</p>
    <p><strong>Chat:</strong> ${statusText(session.restrictions.chat)}</p>
  `;
}

joinButton.addEventListener(
  "click",
  joinClass
);

joinCode.addEventListener(
  "keydown",
  function (event) {
    if (event.key === "Enter") {
      joinClass();
    }
  }
);