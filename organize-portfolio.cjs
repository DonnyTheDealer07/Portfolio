
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const src = path.join(root, "src");
const sections = path.join(src, "sections");
const oldDir = path.join(sections, "PortfolioSections");
const backupDir = path.join(root, "portfolio-backup");

function read(file) {
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

function write(relative, content) {
  const destination = path.join(src, relative);
  fs.mkdirSync(path.dirname(destination), {
    recursive: true,
  });
  fs.writeFileSync(destination, content.trimStart() + "\n");
  console.log("Created:", relative);
}

function copy(source, destination) {
  const target = path.join(src, destination);
  fs.mkdirSync(path.dirname(target), {
    recursive: true,
  });
  fs.copyFileSync(source, target);
  console.log("Copied:", destination);
}

function between(source, start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);

  if (a === -1 || b === -1) {
    throw new Error(`Could not find section: ${start}`);
  }

  return source.slice(a, b);
}

const originalTSX = path.join(
  oldDir,
  "PortfolioSections.tsx"
);
const originalCSS = path.join(
  oldDir,
  "PortfolioSections.css"
);

if (!fs.existsSync(originalTSX)) {
  throw new Error("Original PortfolioSections.tsx not found.");
}

const tsx = read(originalTSX);
const css = read(originalCSS);

const markers = [
  "SECTION 03 — EXPERTISE",
  "SECTION 04 — PROJECTS",
  "SECTION 05 — EXPERIENCE",
  "SECTION 06 — CONTACT",
];

for (const marker of markers) {
  if (!tsx.includes(marker)) {
    throw new Error(`Missing marker: ${marker}`);
  }
}

const cssNames = [
  "CINEMATIC HORIZONTAL ABOUT EXPERIENCE",
  "EXPERTISE",
  "PROJECTS",
  "EXPERIENCE",
  "CONTACT",
  "RESPONSIVE",
];

const cssPositions = cssNames.map((name) => {
  const marker = new RegExp(
    `/\\* =+\\n\\s*${name}\\n=+ \\*/`
  );
  const match = marker.exec(css);

  if (!match) {
    throw new Error(`CSS section missing: ${name}`);
  }

  return match.index;
});

// Back up the original files before changing anything.
fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(
  originalTSX,
  path.join(backupDir, "PortfolioSections.tsx")
);
fs.copyFileSync(
  originalCSS,
  path.join(backupDir, "PortfolioSections.css")
);

console.log("Original files backed up.");

// SECTION 2 — ABOUT
const aboutStart = tsx.indexOf("const chapters =");
const aboutEnd = tsx.indexOf(
  "export default function PortfolioSections"
);

if (aboutStart < 0 || aboutEnd < 0) {
  throw new Error("Could not extract About component.");
}

const aboutLogic = tsx
  .slice(aboutStart, aboutEnd)
  .replace(
    "function AboutExperience()",
    "export default function Section2()"
  );

const aboutImports = `
import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, MoveRight, Code2, Layers3, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CrimsonTypography from "./CrimsonTypography";
import AboutAtmosphere from "./AboutAtmosphere";
import "./Section2.css";

gsap.registerPlugin(ScrollTrigger);
`;

write(
  "sections/Section2/Section2.tsx",
  aboutImports + "\n" + aboutLogic
);

write(
  "sections/Section2/Section2.css",
  css.slice(cssPositions[1] > 0 ? cssPositions[0] : 0, cssPositions[1])
);

// Copy the supporting About components.
for (const filename of [
  "AboutAtmosphere.tsx",
  "AboutAtmosphere.css",
  "CrimsonTypography.tsx",
  "CrimsonTypography.css",
]) {
  copy(
    path.join(oldDir, filename),
    `sections/Section2/${filename}`
  );
}

// EXTRACT JSX FOR SECTIONS 3–6
const starts = markers.map((marker) => {
  const index = tsx.indexOf(marker);
  return tsx.lastIndexOf("      {/*", index);
});

const sectionEnd = tsx.lastIndexOf("      </section>");

if (starts.some((n) => n < 0) || sectionEnd < 0) {
  throw new Error("Could not locate section JSX boundaries.");
}

const blocks = starts.map((start, index) => {
  const end =
    index < starts.length - 1
      ? starts[index + 1]
      : sectionEnd + "      </section>".length;

  return tsx
    .slice(start, end)
    .replace(/^\s*\{\/\*.*?\*\/\}\s*/s, "")
    .trim();
});

// SECTION 3 — EXPERTISE
const technologyStart = tsx.indexOf(
  "const technologies ="
);
const technologyEnd = tsx.indexOf(
  "const chapters ="
);

const technologies = tsx.slice(
  technologyStart,
  technologyEnd
);

write(
  "sections/Section3/Section3.tsx",
  `
import { ArrowUpRight } from "lucide-react";
import "./Section3.css";

${technologies}

export default function Section3() {
  return (
    ${blocks[0]}
  );
}
`
);

write(
  "sections/Section3/Section3.css",
  css.slice(cssPositions[1], cssPositions[2])
);

// SECTION 4 — PROJECTS
write(
  "sections/Section4/Section4.tsx",
  `
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./Section4.css";

export default function Section4() {
  return (
    ${blocks[1]}
  );
}
`
);

write(
  "sections/Section4/Section4.css",
  css.slice(cssPositions[2], cssPositions[3])
);

// SECTION 5 — EXPERIENCE
write(
  "sections/Section5/Section5.tsx",
  `
import { ArrowUpRight } from "lucide-react";
import "./Section5.css";

export default function Section5() {
  return (
    ${blocks[2]}
  );
}
`
);

write(
  "sections/Section5/Section5.css",
  css.slice(cssPositions[3], cssPositions[4])
);

// SECTION 6 — CONTACT
write(
  "sections/Section6/Section6.tsx",
  `
import { ArrowUpRight, GitBranch, ExternalLink, Mail } from "lucide-react";
import "./Section6.css";

export default function Section6() {
  return (
    ${blocks[3]}
  );
}
`
);

write(
  "sections/Section6/Section6.css",
  css.slice(cssPositions[4], cssPositions[5])
);

// Shared typography, layout and responsive rules.
write(
  "sections/sections-shared.css",
  css.slice(0, cssPositions[0]) +
    "\n" +
    css.slice(cssPositions[5])
);

// SHARED SCROLL REVEAL CONTROLLER
const wrapper = `
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Section2 from "../Section2/Section2";
import Section3 from "../Section3/Section3";
import Section4 from "../Section4/Section4";
import Section5 from "../Section5/Section5";
import Section6 from "../Section6/Section6";

import "../sections-shared.css";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioSections() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>("[data-section-reveal]")
        .forEach((element) => {
          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              y: 55,
              filter: "blur(8px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.05,
              ease: "power3.out",
              clearProps:
                "filter,transform,opacity,visibility",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                once: true,
              },
            }
          );
        });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="portfolio-sections">
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
    </div>
  );
}
`;

write(
  "sections/PortfolioSections/PortfolioSections.tsx",
  wrapper
);

// Remove the old stylesheet after backing it up.
// Each section now imports its own styles.
fs.unlinkSync(originalCSS);

// Remove the duplicate supporting components.
// Their new copies live in Section2.
for (const filename of [
  "AboutAtmosphere.tsx",
  "AboutAtmosphere.css",
  "CrimsonTypography.tsx",
  "CrimsonTypography.css",
]) {
  fs.unlinkSync(path.join(oldDir, filename));
}

// Remove unused placeholder stylesheet.
for (const folder of ["Section2", "Section3"]) {
  const placeholder = path.join(
    sections,
    folder,
    "Section.css"
  );

  if (fs.existsSync(placeholder)) {
    fs.unlinkSync(placeholder);
  }
}

console.log("");
console.log("Portfolio organization complete!");
console.log("Original files saved in portfolio-backup/");
console.log("Run: npm run build");
