const games = [
  {
    id: "coding-puzzle",
    title: "Coding Puzzle",
    category: "Coding",
    ageRating: "7+",
    icon: "🧩",
    description:
      "Solve puzzles by arranging instructions in the correct order.",
    skills: ["Logic", "Sequencing", "Problem solving"],
    link: "https://example.com"
  },
  {
    id: "space-explorer-game",
    title: "Space Explorer",
    category: "Science",
    ageRating: "7+",
    icon: "🪐",
    description:
      "Explore planets and learn facts about the solar system.",
    skills: ["Space science", "Exploration", "Reading"],
    link: "https://example.com"
  },
  {
    id: "geography-challenge",
    title: "Geography Challenge",
    category: "Geography",
    ageRating: "10+",
    icon: "🌎",
    description:
      "Identify countries, continents, oceans, and famous landmarks.",
    skills: ["Geography", "Memory", "Map reading"],
    link: "https://example.com"
  },
  {
    id: "creative-builder",
    title: "Creative Builder",
    category: "Creativity",
    ageRating: "10+",
    icon: "🏗️",
    description:
      "Create structures while practicing planning and design.",
    skills: ["Creativity", "Planning", "Design"],
    link: "https://example.com"
  }
];

const gameList = document.getElementById("gameList");
const gameAgeFilter = document.getElementById("gameAgeFilter");
const gameLibraryMessage = document.getElementById(
  "gameLibraryMessage"
);

function renderGames() {
  const selectedRating = gameAgeFilter.value;

  const visibleGames = games.filter(function (game) {
    return (
      selectedRating === "all" ||
      game.ageRating === selectedRating
    );
  });

  gameList.innerHTML = "";

  if (visibleGames.length === 0) {
    gameLibraryMessage.textContent =
      "No games match this age rating.";
    return;
  }

  gameLibraryMessage.textContent = "";

  visibleGames.forEach(function (game) {
    const card = document.createElement("article");
    card.className = "game-card";

    const skillLabels = game.skills
      .map(function (skill) {
        return `<span>${skill}</span>`;
      })
      .join("");

    card.innerHTML = `
      <div class="game-icon">${game.icon}</div>

      <div class="game-card-labels">
        <span>${game.category}</span>
        <span>${game.ageRating}</span>
      </div>

      <h3>${game.title}</h3>

      <p>${game.description}</p>

      <div class="game-skills">
        ${skillLabels}
      </div>
    `;

    const openButton = document.createElement("a");

    openButton.href = game.link;
    openButton.target = "_blank";
    openButton.rel = "noopener noreferrer";
    openButton.className = "game-open-link";
    openButton.textContent = "Open external game ↗";

    openButton.addEventListener("click", function (event) {
      const confirmed = window.confirm(
        `You are leaving OneSite to open "${game.title}". Continue?`
      );

      if (!confirmed) {
        event.preventDefault();
      }
    });

    card.appendChild(openButton);
    gameList.appendChild(card);
  });
}

gameAgeFilter.addEventListener("change", renderGames);

renderGames();