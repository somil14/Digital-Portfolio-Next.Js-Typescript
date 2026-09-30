import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import { now } from "@/content/profile";

export function Now() {
  return (
    <Section id="now">
      <ul className="border-line max-w-[52rem] border-t">
        {now.map((item) => (
          <li
            key={item.label}
            className="border-line flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b py-5"
          >
            <div>
              <h3 className="text-lg font-medium">{item.label}</h3>
              <p className="text-muted">{item.detail}</p>
            </div>
            <Chip tone={item.state === "planned" ? "warn" : "ok"}>
              {item.state === "planned" ? "planned · not built" : "ongoing"}
            </Chip>
          </li>
        ))}
      </ul>
    </Section>
  );
}
