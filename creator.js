const typeButtons =
  document.querySelectorAll(".creator-type-button");

const selectedTypeMessage =
  document.getElementById("selectedTypeMessage");

const projectTitle =
  document.getElementById("projectTitle");

const projectDescription =
  document.getElementById("projectDescription");

const projectAgeRating =
  document.getElementById("projectAgeRating");

const projectVisibility =
  document.getElementById("projectVisibility");

const documentFields =
  document.getElementById("documentFields");

const quizFields =
  document.getElementById("quizFields");

const slidesFields =
  document.getElementById("slidesFields");

const mediaFields =
  document.getElementById("mediaFields");

const documentBody =
  document.getElementById("documentBody");

const quizQuestion =
  document.getElementById("quizQuestion");

const quizAnswerA =
  document.getElementById("quizAnswerA");

const quizAnswerB =
  document.getElementById("quizAnswerB");

const quizAnswerC =
  document.getElementById("quizAnswerC");

const quizAnswerD =
  document.getElementById("quizAnswerD");

const quizCorrectAnswer =
  document.getElementById("quizCorrectAnswer");

const quizExplanation =
  document.getElementById("quizExplanation");

const slideTitle =
  document.getElementById("slideTitle");

const slideText =
  document.getElementById("slideText");

const mediaUrl =
  document.getElementById("mediaUrl");

const mediaCaption =
  document.getElementById("mediaCaption");

const mediaSource =
  document.getElementById("mediaSource");

const saveProjectButton =
  document.getElementById("saveProjectButton");

const clearProjectButton =
  document.getElementById("clearProjectButton");

const creatorMessage =
  document.getElementById("creatorMessage");

const projectList =
  document.getElementById("projectList");

const projectCount =
  document.getElementById("projectCount");

const emptyProjectsMessage =
  document.getElementById("emptyProjectsMessage");

let selectedType = "document";
let editingProjectId = null;

function getProjects() {
  const savedProjects =
    localStorage.getItem("onesite_creator_projects");

  if (!savedProjects) {
    return [];
  }

  try {
    const parsedProjects = JSON.parse(savedProjects);

    return Array.isArray(parsedProjects)
      ? parsedProjects
      : [];
  } catch (error) {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(
    "onesite_creator_projects",
    JSON.stringify(projects)
  );
}

function createProjectId() {
  return `project-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;
}

function formatTypeName(type) {
  const typeNames = {
    document: "Document",
    quiz: "Quiz",
    slides: "Slides",
    media: "Media"
  };

  return typeNames[type] || "Project";
}

function showSelectedFields() {
  documentFields.classList.add("hidden");
  quizFields.classList.add("hidden");
  slidesFields.classList.add("hidden");
  mediaFields.classList.add("hidden");

  if (selectedType === "document") {
    documentFields.classList.remove("hidden");
  }

  if (selectedType === "quiz") {
    quizFields.classList.remove("hidden");
  }

  if (selectedType === "slides") {
    slidesFields.classList.remove("hidden");
  }

  if (selectedType === "media") {
    mediaFields.classList.remove("hidden");
  }

  selectedTypeMessage.textContent =
    `Creating: ${formatTypeName(selectedType)}.`;
}

function setSelectedType(type) {
  selectedType = type;

  typeButtons.forEach(function (button) {
    const isSelected =
      button.dataset.type === selectedType;

    button.classList.toggle(
      "active-creator-type",
      isSelected
    );
  });

  showSelectedFields();
}

typeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setSelectedType(button.dataset.type);
  });
});

function readProjectContent() {
  if (selectedType === "document") {
    return {
      body: documentBody.value.trim()
    };
  }

  if (selectedType === "quiz") {
    return {
      questions: [
        {
          question: quizQuestion.value.trim(),
          answers: [
            quizAnswerA.value.trim(),
            quizAnswerB.value.trim(),
            quizAnswerC.value.trim(),
            quizAnswerD.value.trim()
          ],
          correctAnswer:
            Number(quizCorrectAnswer.value),
          explanation:
            quizExplanation.value.trim()
        }
      ]
    };
  }

  if (selectedType === "slides") {
    return {
      slides: [
        {
          title: slideTitle.value.trim(),
          text: slideText.value.trim()
        }
      ]
    };
  }

  return {
    url: mediaUrl.value.trim(),
    caption: mediaCaption.value.trim(),
    source: mediaSource.value.trim()
  };
}

function validateProject() {
  if (!projectTitle.value.trim()) {
    return "Enter a project title.";
  }

  if (!projectDescription.value.trim()) {
    return "Enter a short description.";
  }

  if (
    selectedType === "document" &&
    !documentBody.value.trim()
  ) {
    return "Write some document content.";
  }

  if (selectedType === "quiz") {
    const answers = [
      quizAnswerA.value.trim(),
      quizAnswerB.value.trim(),
      quizAnswerC.value.trim(),
      quizAnswerD.value.trim()
    ];

    if (!quizQuestion.value.trim()) {
      return "Enter the quiz question.";
    }

    if (answers.some(function (answer) {
      return !answer;
    })) {
      return "Complete all four quiz answers.";
    }
  }

  if (
    selectedType === "slides" &&
    (
      !slideTitle.value.trim() ||
      !slideText.value.trim()
    )
  ) {
    return "Complete the slide title and text.";
  }

  if (
    selectedType === "media" &&
    !mediaUrl.value.trim()
  ) {
    return "Enter an image or video URL.";
  }

  return "";
}

function saveProject() {
  const validationMessage = validateProject();

  if (validationMessage) {
    creatorMessage.textContent =
      validationMessage;

    return;
  }

  const projects = getProjects();
  const now = new Date().toISOString();

  const project = {
    id:
      editingProjectId || createProjectId(),
    title: projectTitle.value.trim(),
    type: selectedType,
    description:
      projectDescription.value.trim(),
    ageRating:
      projectAgeRating.value,
    visibility:
      projectVisibility.value,
    moderationStatus:
      projectVisibility.value ===
      "Submitted for review"
        ? "Pending review"
        : "Not submitted",
    creator:
      "OneSite Learner",
    content:
      readProjectContent(),
    createdAt:
      now,
    updatedAt:
      now
  };

  const existingIndex =
    projects.findIndex(function (item) {
      return item.id === editingProjectId;
    });

  if (existingIndex >= 0) {
    project.createdAt =
      projects[existingIndex].createdAt;

    projects[existingIndex] = project;

    creatorMessage.textContent =
      "Project updated.";
  } else {
    projects.unshift(project);

    creatorMessage.textContent =
      "Project saved.";
  }

  saveProjects(projects);
  clearForm(false);
  renderProjects();
}

function clearForm(showMessage = true) {
  editingProjectId = null;

  projectTitle.value = "";
  projectDescription.value = "";
  projectAgeRating.value = "7+";
  projectVisibility.value = "Draft";

  documentBody.value = "";

  quizQuestion.value = "";
  quizAnswerA.value = "";
  quizAnswerB.value = "";
  quizAnswerC.value = "";
  quizAnswerD.value = "";
  quizCorrectAnswer.value = "0";
  quizExplanation.value = "";

  slideTitle.value = "";
  slideText.value = "";

  mediaUrl.value = "";
  mediaCaption.value = "";
  mediaSource.value = "";

  saveProjectButton.textContent =
    "Save project";

  setSelectedType("document");

  if (showMessage) {
    creatorMessage.textContent =
      "Form cleared.";
  }
}

function deleteProject(projectId) {
  const projects = getProjects();

  const updatedProjects =
    projects.filter(function (project) {
      return project.id !== projectId;
    });

  saveProjects(updatedProjects);
  renderProjects();

  creatorMessage.textContent =
    "Project deleted.";
}

function editProject(projectId) {
  const projects = getProjects();

  const project = projects.find(function (item) {
    return item.id === projectId;
  });

  if (!project) {
    return;
  }

  editingProjectId = project.id;

  projectTitle.value = project.title;
  projectDescription.value =
    project.description;

  projectAgeRating.value =
    project.ageRating;

  projectVisibility.value =
    project.visibility;

  setSelectedType(project.type);

  if (project.type === "document") {
    documentBody.value =
      project.content.body || "";
  }

  if (project.type === "quiz") {
    const question =
      project.content.questions?.[0];

    if (question) {
      quizQuestion.value =
        question.question || "";

      quizAnswerA.value =
        question.answers?.[0] || "";

      quizAnswerB.value =
        question.answers?.[1] || "";

      quizAnswerC.value =
        question.answers?.[2] || "";

      quizAnswerD.value =
        question.answers?.[3] || "";

      quizCorrectAnswer.value =
        String(question.correctAnswer || 0);

      quizExplanation.value =
        question.explanation || "";
    }
  }

  if (project.type === "slides") {
    const slide =
      project.content.slides?.[0];

    if (slide) {
      slideTitle.value =
        slide.title || "";

      slideText.value =
        slide.text || "";
    }
  }

  if (project.type === "media") {
    mediaUrl.value =
      project.content.url || "";

    mediaCaption.value =
      project.content.caption || "";

    mediaSource.value =
      project.content.source || "";
  }

  saveProjectButton.textContent =
    "Update project";

  creatorMessage.textContent =
    `Editing "${project.title}".`;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderProjects() {
  const projects = getProjects();

  projectList.innerHTML = "";

  projectCount.textContent =
    `${projects.length} project${
      projects.length === 1 ? "" : "s"
    }`;

  if (projects.length === 0) {
    const emptyMessage =
      document.createElement("p");

    emptyMessage.id =
      "emptyProjectsMessage";

    emptyMessage.textContent =
      "You have not created any projects yet.";

    projectList.appendChild(emptyMessage);

    return;
  }

  projects.forEach(function (project) {
    const projectCard =
      document.createElement("article");

    projectCard.className =
      "project-card";

    const projectDetails =
      document.createElement("div");

    projectDetails.className =
      "project-card-details";

    const typeLabel =
      document.createElement("span");

    typeLabel.className =
      "project-type-label";

    typeLabel.textContent =
      formatTypeName(project.type);

    const title =
      document.createElement("h3");

    title.textContent =
      project.title;

    const description =
      document.createElement("p");

    description.textContent =
      project.description;

    const metadata =
      document.createElement("div");

    metadata.className =
      "project-metadata";

    metadata.innerHTML = `
      <span>${project.ageRating}</span>
      <span>${project.visibility}</span>
      <span>${project.moderationStatus}</span>
    `;

    projectDetails.appendChild(typeLabel);
    projectDetails.appendChild(title);
    projectDetails.appendChild(description);
    projectDetails.appendChild(metadata);

    const projectActions =
      document.createElement("div");

    projectActions.className =
      "project-card-actions";

    const editButton =
      document.createElement("button");

    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener(
      "click",
      function () {
        editProject(project.id);
      }
    );

    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className =
      "secondary-button";

    deleteButton.textContent =
      "Delete";

    deleteButton.addEventListener(
      "click",
      function () {
        const confirmed =
          window.confirm(
            `Delete "${project.title}"?`
          );

        if (confirmed) {
          deleteProject(project.id);
        }
      }
    );

    projectActions.appendChild(editButton);
    projectActions.appendChild(deleteButton);

    projectCard.appendChild(projectDetails);
    projectCard.appendChild(projectActions);

    projectList.appendChild(projectCard);
  });
}

saveProjectButton.addEventListener(
  "click",
  saveProject
);

clearProjectButton.addEventListener(
  "click",
  function () {
    clearForm(true);
  }
);

setSelectedType("document");
renderProjects();