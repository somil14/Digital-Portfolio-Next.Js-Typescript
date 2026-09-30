import type { RepoEntry } from "./types";

/**
 * Smaller public repositories that are finished and fine to show. Forks,
 * templates, course exercises, company work and unfinished projects are left
 * out on purpose.
 */
export const repos: RepoEntry[] = [
  {
    slug: "book-search",
    name: "Book-Search-NextJs",
    summary:
      "Search books by title or author, open a detail page per book, and add new ones through an API route.",
    stack: ["Next.js", "TypeScript"],
    year: 2025,
    source: "https://github.com/somil14/Book-Search-NextJs",
    group: "recent",
  },
  {
    slug: "weather",
    name: "Weather Forecast",
    summary:
      "Current temperature, wind speed and humidity for any city, from the OpenWeather API.",
    stack: ["JavaScript", "HTML", "CSS"],
    year: 2024,
    source: "https://github.com/somil14/Weather_forcast_app",
    live: "https://weather-forcast-app-somil.netlify.app",
    group: "early",
  },
  {
    slug: "todo",
    name: "To-Do List",
    summary:
      "Add, check off and delete tasks; the list persists in local storage.",
    stack: ["JavaScript", "HTML", "CSS"],
    year: 2024,
    source: "https://github.com/somil14/To-Do-List-App",
    live: "https://to-do-list-app-somil.netlify.app",
    group: "early",
  },
  {
    slug: "quiz",
    name: "Quiz App",
    summary: "Multiple-choice quiz with a running score and play-again.",
    stack: ["JavaScript", "HTML", "CSS"],
    year: 2024,
    source: "https://github.com/somil14/Quiz-App",
    live: "https://simple-quiz-somil.netlify.app",
    group: "early",
  },
  {
    slug: "password",
    name: "Random Password Generator",
    summary:
      "Generates 16-character random passwords and copies them to the clipboard.",
    stack: ["JavaScript", "HTML", "CSS"],
    year: 2024,
    source: "https://github.com/somil14/Random-Password-Generator",
    live: "https://random-password-generator-somil.netlify.app",
    group: "early",
  },
];
