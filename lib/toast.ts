let region: HTMLDivElement | undefined;
let timer: number | undefined;

/** Minimal toast: one polite live region, replaced on each call. */
export function toast(message: string) {
  if (!region) {
    region = document.createElement("div");
    region.className = "toast";
    region.setAttribute("role", "status");
    document.body.append(region);
  }
  region.hidden = false;
  region.textContent = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    if (region) region.hidden = true;
  }, 2600);
}

export async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`${label} copied`);
  } catch {
    toast(`Could not copy. ${text}`);
  }
}
