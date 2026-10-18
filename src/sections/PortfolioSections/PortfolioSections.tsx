
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  Mail,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./PortfolioSections.css";

gsap.registerPlugin(ScrollTrigger);

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

export default function PortfolioSections() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

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
      <section
        id="about"
        className="portfolio-section about-section"
      >
        <div className="section-heading" data-section-reveal>
          <span className="section-number">02 / ABOUT</span>
          <span className="section-rule" />
        </div>

        <div className="about-layout">
          <div data-section-reveal>
            <p className="section-overline">
              BEHIND THE CODE
            </p>

            <h2 className="section-display">
              NOT JUST <em>CODE.</em>
              <br />
              AN EXPERIENCE.
            </h2>
          </div>

          <div className="about-copy" data-section-reveal>
            <p>
              I'm Corné Carelse, a React developer based in
              South Africa. I turn ideas into purposeful,
              expressive digital experiences — from polished
              interfaces to complete web applications.
            </p>

            <p>
              I care about how a product feels just as much
              as how it works: clean architecture, responsive
              design, performance, and the details people
              remember.
            </p>

            <a href="#work" className="section-text-link">
              EXPLORE MY WORK
              <ArrowDownRight size={17} />
            </a>
          </div>
        </div>

        <span
          className="section-watermark"
          aria-hidden="true"
        >
          ABOUT
        </span>
      </section>

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
          Technologies I use to design, develop and ship
          modern web experiences.
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

      <section
        id="work"
        className="portfolio-section projects-section"
      >
        <div className="section-heading" data-section-reveal>
          <span className="section-number">
            04 / SELECTED WORK
          </span>
          <span className="section-rule" />
        </div>

        <p className="section-overline" data-section-reveal>
          FEATURED PROJECT
        </p>

        <h2 className="section-display" data-section-reveal>
          WORK THAT <em>SPEAKS.</em>
        </h2>

        <Link
          to="/projects/pure-sa"
          className="project-feature"
          data-section-reveal
        >
          <div className="project-feature-art">
            <span className="project-art-kicker">
              01 / FEATURED CASE STUDY
            </span>

            <strong>
              PURE<span>SA.</span>
            </strong>

            <span className="project-art-bottom">
              DIGITAL COMMERCE / FULL-STACK
            </span>
          </div>

          <div className="project-feature-details">
            <div>
              <span className="project-meta">
                REACT / NODE.JS / E-COMMERCE
              </span>

              <h3>PURE SA</h3>

              <p>
                A responsive storefront with product
                browsing, an admin dashboard and a
                connected backend.
              </p>
            </div>

            <span className="project-feature-arrow">
              <ArrowUpRight size={26} />
            </span>
          </div>
        </Link>

        <p
          className="project-disclaimer"
          data-section-reveal
        >
          More detailed project walkthroughs and screenshots
          will be added as we customize each case study.
        </p>
      </section>

      <section
        id="experience"
        className="portfolio-section experience-section"
      >
        <div className="section-heading" data-section-reveal>
          <span className="section-number">
            05 / EXPERIENCE
          </span>
          <span className="section-rule" />
        </div>

        <p className="section-overline" data-section-reveal>
          THE JOURNEY
        </p>

        <h2 className="section-display" data-section-reveal>
          ALWAYS <em>BUILDING.</em>
        </h2>

        <div className="experience-list">
          <div
            className="experience-item"
            data-section-reveal
          >
            <span>01 / PRESENT</span>

            <div>
              <h3>React &amp; Web Development</h3>

              <p>
                Building modern, responsive websites and
                full-stack web experiences, including
                production client work.
              </p>
            </div>

            <ArrowUpRight size={21} />
          </div>

          <div
            className="experience-item"
            data-section-reveal
          >
            <span>02 / NEXT</span>

            <div>
              <h3>What's Next</h3>

              <p>
                Looking for opportunities to collaborate,
                contribute and grow with ambitious teams.
              </p>
            </div>

            <ArrowUpRight size={21} />
          </div>
        </div>

        <p className="experience-note" data-section-reveal>
          We'll add your verified qualifications,
          certificates and employment history in the next
          customization pass.
        </p>
      </section>

      <section
        id="contact"
        className="portfolio-section final-section"
      >
        <div className="section-heading" data-section-reveal>
          <span className="section-number">
            06 / CONTACT
          </span>
          <span className="section-rule" />
        </div>

        <p className="section-overline" data-section-reveal>
          HAVE SOMETHING IN MIND?
        </p>

        <h2 className="section-display" data-section-reveal>
          LET'S MAKE
          <br />
          <em>IT REAL.</em>
        </h2>

        <p className="section-intro" data-section-reveal>
          Have a role, a project or an idea? Let's start
          a conversation.
        </p>

        <a
          href="mailto:codingcorne@gmail.com"
          className="contact-big-link"
          data-section-reveal
        >
          LET'S TALK
          <ArrowUpRight size={38} />
        </a>

        <footer className="portfolio-footer">
          <span>
            © {new Date().getFullYear()} CORNÉ CARELSE
          </span>

          <div>
            <a
              href="https://github.com/DonnyTheDealer07"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitBranch size={16} />
              GITHUB
              <ExternalLink size={12} />
            </a>

            <a href="mailto:codingcorne@gmail.com">
              <Mail size={16} />
              EMAIL
            </a>
          </div>

          <span>BUILT WITH INTENT.</span>
        </footer>
      </section>
    </div>
  );
}
