
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  MoveRight,
  Code2,
  Layers3,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CrimsonTypography from "./CrimsonTypography";
import AboutAtmosphere from "./AboutAtmosphere";
import CyberPortrait from "./CyberPortrait";
import "./Section2.css";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  "THE PERSON",
  "THE MINDSET",
  "THE CRAFT",
  "THE VISION",
];

function animateCrimson(
  panel: HTMLElement,
  timeline: gsap.core.Timeline
) {
  const words = panel.querySelectorAll<HTMLElement>(
    "[data-crimson-effect]"
  );

  words.forEach((word) => {
    const effect = word.dataset.crimsonEffect;
    const letters = word.querySelectorAll<HTMLElement>(
      ".crimson-letter"
    );

    if (effect === "glitch") {
      const ghosts = word.querySelectorAll<HTMLElement>(
        ".crimson-glitch-ghost"
      );

      timeline.fromTo(
        letters,
        {
          opacity: 0,
          y: 28,
          skewX: -12,
        },
        {
          opacity: 1,
          y: 0,
          skewX: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: "power3.out",
        },
        0.1
      );

      const glitch = gsap.timeline({
        paused: true,
      });

      glitch
        .set(ghosts, { opacity: 0 })
        .to(
          ghosts,
          {
            opacity: 0.75,
            x: (index) => (index === 0 ? -7 : 7),
            duration: 0.055,
          },
          0
        )
        .to(word, { x: -3, duration: 0.055 }, 0)
        .to(
          ghosts,
          {
            x: (index) => (index === 0 ? 5 : -5),
            duration: 0.055,
          },
          0.08
        )
        .to(word, { x: 3, duration: 0.055 }, 0.08)
        .to(
          ghosts,
          {
            opacity: 0,
            x: 0,
            duration: 0.12,
          },
          0.18
        )
        .to(word, { x: 0, duration: 0.12 }, 0.18);

      timeline.call(
        () => {
          glitch.restart();
        },
        undefined,
        0.65
      );
    }

    if (effect === "assemble") {
      timeline.fromTo(
        letters,
        {
          opacity: 0,
          x: (index) => (index % 2 === 0 ? -65 : 65),
          y: (index) => (index % 2 === 0 ? -75 : 75),
          rotate: (index) =>
            index % 2 === 0 ? -25 : 25,
          scale: 0.6,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.95,
          stagger: 0.065,
          ease: "back.out(1.5)",
        },
        0.1
      );
    }

    if (effect === "focus") {
      timeline.fromTo(
        letters,
        {
          opacity: 0,
          y: 35,
          scale: 1.35,
          filter: "blur(15px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.045,
          ease: "power3.out",
          clearProps: "filter",
        },
        0.1
      );
    }

    if (effect === "wave") {
      timeline.fromTo(
        letters,
        {
          opacity: 0,
          y: 90,
          rotateX: -65,
          scale: 0.75,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "back.out(1.4)",
        },
        0.1
      );

      const sweep = word.querySelector<HTMLElement>(
        ".crimson-light-sweep"
      );

      if (sweep) {
        timeline.fromTo(
          sweep,
          {
            left: "-40%",
            opacity: 0,
          },
          {
            left: "125%",
            opacity: 0.9,
            duration: 1.1,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(sweep, { opacity: 0 });
            },
          },
          0.8
        );
      }
    }
  });
}

export default function Section2() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const context = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(
        ".about-panel",
        track
      );

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) return;

      const updateProgress = (progress: number) => {
        if (progressRef.current) {
          progressRef.current.style.transform =
            `scaleX(${progress})`;
        }

        const index = Math.min(
          chapters.length - 1,
          Math.floor(progress * chapters.length)
        );

        if (counterRef.current) {
          counterRef.current.textContent =
            `${String(index + 1).padStart(2, "0")} / 04`;
        }

        if (labelRef.current) {
          labelRef.current.textContent = chapters[index];
        }
      };

      const animatePanel = (
        panel: HTMLElement,
        triggerConfig: ScrollTrigger.Vars
      ) => {
        const regular = panel.querySelectorAll<HTMLElement>(
          "[data-about-animate]"
        );

        gsap.set(regular, {
          opacity: 0,
          y: 55,
        });

        const crimsonLetters =
          panel.querySelectorAll<HTMLElement>(
            ".crimson-letter"
          );

        gsap.set(crimsonLetters, {
          opacity: 0,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            ...triggerConfig,
            once: true,
          },
        });

        timeline.to(regular, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        });

        animateCrimson(panel, timeline);
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        // Keep the opening portrait stationary first.
        // This uses scroll distance, not a timer.
        const holdDistance = () =>
          window.innerHeight * 0.95;

        const totalDistance = () =>
          holdDistance() + distance();

        const horizontal = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () =>
              `+=${Math.max(1, totalDistance())}`,
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const hold = holdDistance();
              const travel = distance();
              const travelled =
                self.progress * (hold + travel);

              const chapterProgress =
                travel > 0
                  ? Math.max(
                      0,
                      Math.min(
                        1,
                        (travelled - hold) / travel
                      )
                    )
                  : 0;

              updateProgress(chapterProgress);
            },
          },
        });

        // PHASE 1: Portrait stays in place.
        horizontal.to(track, {
          x: 0,
          duration: holdDistance,
        });

        // PHASE 2: Horizontal About journey.
        horizontal.to(track, {
          x: () => -distance(),
          duration: distance,
        });

        panels.forEach((panel, index) => {
          if (index === 0) {
            animatePanel(panel, {
              trigger: section,
              start: "top 65%",
            });
          } else {
            animatePanel(panel, {
              trigger: panel,
              containerAnimation: horizontal,
              start: "left 85%",
            });
          }
        });

        return () => updateProgress(0);
      });

      mm.add("(max-width: 768px)", () => {
        gsap.set(track, {
          clearProps: "transform",
        });

        panels.forEach((panel) => {
          animatePanel(panel, {
            trigger: panel,
            start: "top 85%",
          });
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-experience"
      aria-label="About Corné Carelse"
    >
      <div className="about-fixed-header">
        <span className="about-section-index">
          02 / ABOUT
        </span>

        <span className="about-header-line" />

        <span className="about-header-caption">
          A STORY IN FOUR CHAPTERS
        </span>
      </div>

      <div ref={trackRef} className="about-track">
        {/* PANEL 01 — THE PERSON */}
        <article className="about-panel about-panel-person">
          <div className="about-person-image">
            <CyberPortrait />
          </div>

          <div className="about-person-content">
            <div className="about-content-inner">
              <p
                className="about-eyebrow"
                data-about-animate
              >
                01 / THE PERSON
              </p>

              <h2 className="about-big-title">
                <span data-about-animate>
                  THE DEVELOPER
                  <br />
                  BEHIND
                  <br />
                </span>

                <CrimsonTypography
                  text="THE CODE."
                  effect="glitch"
                />
              </h2>

              <div
                className="about-copy-block"
                data-about-animate
              >
                <span className="about-copy-accent" />

                <p>
                  I'm Corné Carelse. A React developer
                  based in South Africa, driven by a
                  simple idea: the web should be more
                  than something you look at.
                </p>

                <p>
                  It should be something you experience.
                </p>
              </div>

              <div
                className="about-scroll-hint"
                data-about-animate
              >
                <span>SCROLL TO DISCOVER</span>
                <MoveRight size={23} />
              </div>
            </div>
          </div>
        </article>

        {/* PANEL 02 — THE MINDSET */}
        <article className="about-panel about-panel-mindset">
          <AboutAtmosphere mode="network" />

          <div className="about-chapter-grid">
            <div className="about-chapter-main">
              <p
                className="about-eyebrow"
                data-about-animate
              >
                02 / THE MINDSET
              </p>

              <h2 className="about-chapter-title">
                <span data-about-animate>
                  I DON'T
                  <br />
                  JUST{" "}
                </span>

                <CrimsonTypography
                  text="BUILD."
                  effect="assemble"
                />

                <br />

                <span data-about-animate>
                  I CREATE.
                </span>
              </h2>

              <p
                className="about-chapter-description"
                data-about-animate
              >
                Every interaction, transition and
                detail has a purpose. I approach
                development with the mindset of both
                an engineer and a creative.
              </p>

              <div
                className="about-quote"
                data-about-animate
              >
                "Good websites work.
                <br />
                Great websites make you feel something."
              </div>
            </div>

            <div
              className="about-mindset-visual"
              data-about-animate
              aria-hidden="true"
            >
              <div className="mindset-orbit mindset-orbit-one" />
              <div className="mindset-orbit mindset-orbit-two" />
              <div className="mindset-orbit mindset-orbit-three" />

              <div className="mindset-core">
                <Sparkles size={42} strokeWidth={1} />
              </div>

              <span className="mindset-orbit-label label-one">
                DESIGN
              </span>

              <span className="mindset-orbit-label label-two">
                DEVELOPMENT
              </span>

              <span className="mindset-orbit-label label-three">
                EXPERIENCE
              </span>
            </div>
          </div>
        </article>

        {/* PANEL 03 — THE CRAFT */}
        <article className="about-panel about-panel-craft">
          <div className="about-chapter-grid">
            <div className="about-chapter-main">
              <p
                className="about-eyebrow"
                data-about-animate
              >
                03 / THE CRAFT
              </p>

              <h2 className="about-chapter-title">
                <span data-about-animate>
                  IDEAS INTO
                  <br />
                </span>

                <CrimsonTypography
                  text="REALITY."
                  effect="focus"
                />
              </h2>

              <p
                className="about-chapter-description"
                data-about-animate
              >
                From responsive React interfaces to
                connected full-stack applications,
                I build digital products with
                performance, usability and personality
                at their core.
              </p>

              <div
                className="about-capability-list"
                data-about-animate
              >
                <div>
                  <Code2 size={19} />
                  <span>FRONTEND ENGINEERING</span>
                  <ArrowUpRight size={16} />
                </div>

                <div>
                  <Layers3 size={19} />
                  <span>FULL-STACK DEVELOPMENT</span>
                  <ArrowUpRight size={16} />
                </div>

                <div>
                  <Sparkles size={19} />
                  <span>CREATIVE INTERACTIONS</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>

            <div
              className="about-code-visual"
              data-about-animate
            >
              <div className="about-code-window">
                <div className="about-code-topbar">
                  <div className="about-code-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>developer.tsx</span>
                  <Code2 size={16} />
                </div>

                <div className="about-code-body">
                  <div>
                    <span className="code-line-number">01</span>
                    <span className="code-purple">const</span>
                    {" developer = {"}
                  </div>

                  <div>
                    <span className="code-line-number">02</span>
                    {"  "}
                    <span className="code-red">name</span>
                    {": "}
                    <span className="code-green">
                      "Corné Carelse"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="code-line-number">03</span>
                    {"  "}
                    <span className="code-red">focus</span>
                    {": "}
                    <span className="code-green">
                      "React Development"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="code-line-number">04</span>
                    {"  "}
                    <span className="code-red">mindset</span>
                    {": "}
                    <span className="code-green">
                      "Always evolving"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="code-line-number">05</span>
                    {"  "}
                    <span className="code-red">passion</span>
                    {": "}
                    <span className="code-green">
                      "Digital experiences"
                    </span>
                  </div>

                  <div>
                    <span className="code-line-number">06</span>
                    {"};"}
                  </div>

                  <div className="code-spacer" />

                  <div>
                    <span className="code-line-number">07</span>
                    <span className="code-purple">
                      export default
                    </span>
                    {" developer;"}
                  </div>
                </div>

                <div className="about-code-status">
                  <span className="code-status-dot" />
                  ALL SYSTEMS OPERATIONAL
                </div>
              </div>

              <span className="about-code-decor">
                {"< / >"}
              </span>
            </div>
          </div>
        </article>

        {/* PANEL 04 — THE VISION */}
        <article className="about-panel about-panel-vision">
          <AboutAtmosphere mode="singularity" />

          <div className="about-vision-content">
            <p
              className="about-eyebrow"
              data-about-animate
            >
              04 / THE VISION
            </p>

            <h2 className="about-vision-title">
              <span data-about-animate>
                ALWAYS
                <br />
              </span>

              <CrimsonTypography
                text="EVOLVING."
                effect="wave"
              />
            </h2>

            <p
              className="about-vision-description"
              data-about-animate
            >
              Technology never stands still.
              Neither do I.
              <br />
              <br />
              I'm here to keep learning, push
              creative boundaries and build
              experiences worth remembering.
            </p>

            <div
              className="about-vision-footer"
              data-about-animate
            >
              <span>THE STORY CONTINUES</span>
              <ArrowRight size={28} />
              <span>03 / EXPERTISE</span>
            </div>
          </div>
        </article>
      </div>

      {/* HORIZONTAL PROGRESS INDICATOR */}
      <div className="about-bottom-bar">
        <div className="about-bottom-info">
          <span ref={labelRef}>THE PERSON</span>
          <span ref={counterRef}>01 / 04</span>
        </div>

        <div className="about-progress-track">
          <div
            ref={progressRef}
            className="about-progress-fill"
          />
        </div>
      </div>
    </section>
  );
}
