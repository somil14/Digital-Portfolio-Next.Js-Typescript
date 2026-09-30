import { codeToHtml, createCssVariablesTheme } from "shiki";
import { Panel } from "./Panel";

// Colours come from CSS variables (see .shiki in globals.css), so the same
// markup works in both themes.
const theme = createCssVariablesTheme({
  name: "signal",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

interface CodePanelProps {
  title: string;
  code: string;
  lang: "typescript" | "json" | "bash";
  note?: string;
  className?: string;
}

/** Build-time syntax highlighting. Server component: ships no JavaScript. */
export async function CodePanel({
  title,
  code,
  lang,
  note,
  className,
}: CodePanelProps) {
  const html = await codeToHtml(code, { lang, theme });
  return (
    <Panel title={title} note={note} className={className}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Panel>
  );
}
