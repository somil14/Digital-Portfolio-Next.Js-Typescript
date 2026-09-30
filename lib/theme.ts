export const THEME_STORAGE_KEY = "theme";

export type Theme = "dark" | "light";

/**
 * Runs in <head> before first paint so the right theme is set without a
 * flash. Also marks the document as JS-enabled, which is what gates every
 * hidden "pre-reveal" state. It also sends ?mode=tldr to the summary page,
 * as a fallback for hosts where the redirect rule is not applied.
 */
export const themeInitScript = `(function(){if(/[?&]mode=tldr(&|$)/.test(location.search)){location.replace("/tldr/");return}var d=document.documentElement;d.classList.add("js");var t=null;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.dataset.theme=t})()`;
