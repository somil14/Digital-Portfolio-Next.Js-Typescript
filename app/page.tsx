import { CaseStudy } from "@/components/sections/CaseStudy";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Now } from "@/components/sections/Now";
import { Pipeline } from "@/components/sections/Pipeline";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Whoami } from "@/components/sections/Whoami";

export default function Home() {
  return (
    <>
      <Hero />
      <Whoami />
      <CaseStudy />
      <Pipeline />
      <Projects />
      <Experience />
      <Stack />
      <Now />
      <Contact />
    </>
  );
}
