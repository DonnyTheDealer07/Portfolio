import { ArrowUpRight } from "lucide-react";
import "./Section3.css";

const technologies = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "Three.js",
  "GSAP",
  "Tailwind CSS",
  "REST APIs",
  "Git",
  "Vercel",
  "Responsive UI",
];



export default function Section3() {
  return (
    <section
        id="skills"
        className="portfolio-section skills-section"
      >
        <div className="section-heading" data-section-reveal>
          <span className="section-number">
            03 / EXPERTISE
          </span>
          <span className="section-rule" />
        </div>

        <p className="section-overline" data-section-reveal>
          MY TOOLKIT
        </p>

        <h2 className="section-display" data-section-reveal>
          BUILT WITH <em>INTENT.</em>
        </h2>

        <p className="section-intro" data-section-reveal>
          Technologies I use to design, develop and
          ship modern web experiences.
        </p>

        <div className="skills-grid">
          {technologies.map((technology, index) => (
            <div
              key={technology}
              className="skill-tile"
              data-section-reveal
            >
              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong>{technology}</strong>
              <ArrowUpRight size={18} />
            </div>
          ))}
        </div>
      </section>
  );
}

