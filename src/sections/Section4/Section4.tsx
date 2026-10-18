
import { useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Heart,
  Monitor,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Section4.css";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  index: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  url: string;
  category: string;
  tags: string[];
  variant: "commerce" | "personal";
  icon: "code" | "heart";
};

const projects: Project[] = [
  {
    id: "pure-sa",
    index: "01",
    name: "PURE SA",
    eyebrow: "FEATURED CLIENT PROJECT",
    description:
      "A modern South African product website supported by a custom administration dashboard and backend infrastructure. Designed to make product discovery feel effortless.",
    image: "/websites/Pure.png",
    url: "https://www.puresa.africa/",
    category: "WEB DEVELOPMENT / CLIENT WORK",
    tags: ["REACT", "EXPRESS", "RESPONSIVE DESIGN", "FULL STACK"],
    variant: "commerce",
    icon: "code",
  },
  {
    id: "for-my-baby",
    index: "02",
    name: "FOR MY BEAUTIFUL GIRL",
    eyebrow: "PERSONAL CREATIVE PROJECT",
    description:
      "A personal web experience created with a more expressive, emotional direction. A reminder that development can be about creating meaningful moments, not only solving business problems.",
    image: "/websites/love.png",
    url: "https://for-my-baby-ndmb.onrender.com/",
    category: "CREATIVE DEVELOPMENT / PERSONAL",
    tags: ["CREATIVE WEB", "INTERACTIVE EXPERIENCE", "PERSONAL PROJECT"],
    variant: "personal",
    icon: "heart",
  },
];

function MagneticCrimson({ text }: { text: string }) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLSpanElement>
  ) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      const word = wordRef.current;
      if (!word) return;

      const letters = word.querySelectorAll<HTMLElement>(
        ".work-magnetic-letter"
      );

      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();

        const currentX =
          Number(gsap.getProperty(letter, "x")) || 0;
        const currentY =
          Number(gsap.getProperty(letter, "y")) || 0;

        const centerX = rect.left + rect.width / 2 - currentX;
        const centerY = rect.top + rect.height / 2 - currentY;

        const distance = Math.hypot(
          pointerRef.current.x - centerX,
          pointerRef.current.y - centerY
        );

        const influence = Math.max(0, 1 - distance / 155);

        const direction = Math.max(
          -1,
          Math.min(
            1,
            (pointerRef.current.x - centerX) / 155
          )
        );

        gsap.to(letter, {
          x: direction * influence * 7,
          y: -influence * 13,
          rotation: -direction * influence * 4,
          scaleX: 1 + influence * 0.055,
          scaleY: 1 + influence * 0.085,
          textShadow:
            influence > 0.04
              ? `0 0 ${Math.round(influence * 30)}px rgba(255,48,79,${influence * 0.75})`
              : "0 0 0px rgba(255,48,79,0)",
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
  };

  const resetLetters = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const letters = wordRef.current?.querySelectorAll(
      ".work-magnetic-letter"
    );

    if (!letters) return;

    gsap.to(letters, {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      textShadow: "0 0 0px rgba(255,48,79,0)",
      duration: 0.75,
      stagger: 0.025,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const word = wordRef.current;

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      if (word) {
        gsap.killTweensOf(
          word.querySelectorAll(".work-magnetic-letter")
        );
      }
    };
  }, []);

  return (
    <span
      ref={wordRef}
      className="work-magnetic-word"
      aria-label={text}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetLetters}
    >
      {Array.from(text).map((letter, index) => (
        <span
          className="work-magnetic-letter"
          aria-hidden="true"
          key={`${letter}-${index}`}
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

function BrowserPreview({ project }: { project: Project }) {
  const browserRef = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const browser = browserRef.current;
    if (!browser) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const rect = browser.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(browser, {
      rotateY: x * 7,
      rotateX: -y * 6,
      x: x * 9,
      y: y * 9,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    if (!browserRef.current) return;

    gsap.to(browserRef.current, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div className={`work-visual work-visual--${project.variant}`}>
      <div className="work-visual-orbit work-visual-orbit--one" />
      <div className="work-visual-orbit work-visual-orbit--two" />
      <div className="work-visual-glow" />

      <div
        className="work-browser"
        ref={browserRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className="work-browser-toolbar">
          <div className="work-browser-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="work-browser-address">
            <span className="work-browser-lock">●</span>
            {new URL(project.url).hostname}
          </div>

          <Monitor size={15} aria-hidden="true" />
        </div>

        <div className="work-browser-viewport">
          {!imageFailed ? (
            <img
              className="work-browser-screenshot"
              src={project.image}
              alt={`${project.name} website screenshot`}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div
              className={`work-browser-placeholder work-browser-placeholder--${project.variant}`}
            >
              <div className="work-placeholder-symbol">
                {project.icon === "heart" ? (
                  <Heart size={43} strokeWidth={1.2} />
                ) : (
                  <Code2 size={43} strokeWidth={1.2} />
                )}
              </div>
              <span>PROJECT PREVIEW</span>
              <strong>{project.name}</strong>
              <small>LIVE WEBSITE AVAILABLE</small>
            </div>
          )}

          <div className="work-browser-shine" />
        </div>
      </div>

      <div className="work-visual-corner work-visual-corner--top" />
      <div className="work-visual-corner work-visual-corner--bottom" />

      <span className="work-visual-index">
        DW / PROJECT {project.index}
      </span>
    </div>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  return (
    <article
      className={`work-project work-project--${project.variant}`}
      data-work-project
      id={`work-${project.id}`}
    >
      <div className="work-project-watermark" aria-hidden="true">
        {project.index}
      </div>

      <div className="work-project-layout">
        <div className="work-project-copy">
          <div className="work-project-kicker" data-work-reveal>
            <span className="work-project-kicker-line" />
            <span>{project.eyebrow}</span>
          </div>

          <div className="work-project-number" data-work-reveal>
            <span>PROJECT</span>
            <strong>{project.index}</strong>
            <span>/ {String(projects.length).padStart(2, "0")}</span>
          </div>

          <h3 className="work-project-title" data-work-title>
            {project.name === "FOR MY BEAUTIFUL GIRL" ? (
              <>
                FOR MY
                <br />
                <span>BEAUTIFUL</span>
                <br />
                GIRL.
              </>
            ) : (
              <>
                PURE
                <br />
                <span>SA.</span>
              </>
            )}
          </h3>

          <p className="work-project-description" data-work-reveal>
            {project.description}
          </p>

          <div className="work-project-tags" data-work-reveal>
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <a
            className="work-project-link"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-work-reveal
          >
            <span className="work-project-link-icon">
              <ArrowUpRight size={25} strokeWidth={1.7} />
            </span>
            <span className="work-project-link-label">
              <strong>VISIT LIVE WEBSITE</strong>
              <small>{new URL(project.url).hostname}</small>
            </span>
            <ExternalLink
              size={17}
              className="work-project-external"
            />
          </a>
        </div>

        <div className="work-project-media" data-work-media>
          <BrowserPreview project={project} />
        </div>
      </div>

      <div className="work-project-bottom">
        <span>{project.category}</span>
        <span>
          <MousePointer2 size={13} />
          INTERACTIVE PREVIEW
        </span>
      </div>
    </article>
  );
}

export default function Section4() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".work-section-eyebrow",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-section-intro",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".work-section-heading .work-heading-line",
        {
          autoAlpha: 0,
          yPercent: 110,
          rotateX: -30,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.15,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".work-section-intro",
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".work-section-description",
        { autoAlpha: 0, y: 25 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-section-intro",
            start: "top 65%",
            once: true,
          },
        }
      );

      const panels = gsap.utils.toArray<HTMLElement>(
        "[data-work-project]"
      );

      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });

        const title = panel.querySelector("[data-work-title]");
        const media = panel.querySelector("[data-work-media]");
        const elements = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-work-reveal]")
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 78%",
            once: true,
          },
        });

        timeline
          .fromTo(
            title,
            {
              autoAlpha: 0,
              y: 90,
              rotateX: -16,
              filter: "blur(12px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 1.05,
              ease: "power4.out",
            }
          )
          .fromTo(
            media,
            {
              autoAlpha: 0,
              y: 100,
              scale: 0.85,
              rotateY: -12,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateY: 0,
              duration: 1.3,
              ease: "power4.out",
            },
            "-=0.8"
          )
          .fromTo(
            elements,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.095,
              ease: "power3.out",
            },
            "-=0.8"
          );

        const visual = panel.querySelector(".work-visual");

        if (visual) {
          gsap.fromTo(
            visual,
            { y: 45 },
            {
              y: -45,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      });

      gsap.fromTo(
        ".work-outro-title",
        { autoAlpha: 0, y: 65, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".work-outro",
            start: "top 78%",
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  const scrollToFirstProject = () => {
    document
      .getElementById("work-pure-sa")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="portfolio-section work-section"
    >
      <div className="work-section-intro">
        <div className="work-section-topline">
          <span>04 / SELECTED WORK</span>
          <span className="work-section-topline-rule" />
          <span>PORTFOLIO ARCHIVE</span>
        </div>

        <div className="work-section-eyebrow">
          <Sparkles size={16} />
          SELECTED PROJECTS /{" "}
          {String(projects.length).padStart(2, "0")}
        </div>

        <h2 className="work-section-heading">
          <span className="work-heading-clip">
            <span className="work-heading-line">
              PROOF IN
            </span>
          </span>

          <span className="work-heading-clip work-heading-clip--magnetic">
            <span className="work-heading-line work-heading-accent">
              <MagneticCrimson text="THE ACTION." />
            </span>
          </span>
        </h2>

        <div className="work-section-intro-bottom">
          <p className="work-section-description">
            Not just concepts. Real projects, real code,
            and experiences brought to life.
          </p>

          <button
            type="button"
            className="work-discover-button"
            onClick={scrollToFirstProject}
          >
            <span>EXPLORE THE WORK</span>
            <ArrowDown size={18} />
          </button>
        </div>
      </div>

      <div className="work-projects">
        {projects.map((project) => (
          <ProjectPanel key={project.id} project={project} />
        ))}
      </div>

      <div className="work-outro">
        <div className="work-outro-topline">
          <span>END OF SELECTED WORK</span>
          <span>
            {String(activeProject + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <h2 className="work-outro-title">
          MORE THAN
          <br />
          <MagneticCrimson text="JUST CODE." />
        </h2>

        <div className="work-outro-bottom">
          <p>
            Every project is an opportunity to make
            something memorable.
          </p>

          <span>
            THE JOURNEY CONTINUES
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </section>
  );
}
