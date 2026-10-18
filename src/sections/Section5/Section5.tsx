
import { useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Rocket,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Section5.css";

gsap.registerPlugin(ScrollTrigger);

type Milestone = {
  id: string;
  number: string;
  period: string;
  type: string;
  title: string;
  organization: string;
  description: string;
  highlights: string[];
  icon: "work" | "code" | "learn";
  side: "left" | "right";
};

const milestones: Milestone[] = [
  {
    id: "dev-craft",
    number: "01",
    period: "MAR 2025 — MAY 2026",
    type: "PROFESSIONAL EXPERIENCE",
    title: "WEB DEVELOPER",
    organization: "DEV CRAFT",
    description:
      "Gained professional experience in web development, building websites and developing my understanding of Material UI. A valuable chapter in strengthening my practical development skills.",
    highlights: [
      "WEBSITE DEVELOPMENT",
      "MATERIAL UI",
      "PRACTICAL EXPERIENCE",
    ],
    icon: "work",
    side: "left",
  },
  {
    id: "independent",
    number: "02",
    period: "INDEPENDENT DEVELOPMENT",
    type: "PERSONAL PROJECTS",
    title: "BUILDING BEYOND THE CLASSROOM",
    organization: "PERSONAL DEVELOPMENT",
    description:
      "Taking ideas from concept to working applications. Projects such as Pure SA have allowed me to explore frontend development, backend systems, responsive interfaces, and the complete development process.",
    highlights: ["PURE SA", "REACT", "FULL-STACK PROJECTS"],
    icon: "code",
    side: "right",
  },
  {
    id: "learning",
    number: "03",
    period: "CONTINUOUS DEVELOPMENT",
    type: "LEARNING & GROWTH",
    title: "NEVER STOP LEARNING",
    organization: "SELF-DIRECTED EDUCATION",
    description:
      "Building a stronger foundation through focused study and hands-on practice, including training in JavaScript, TypeScript, React, and full-stack web development.",
    highlights: ["JAVASCRIPT", "TYPESCRIPT", "REACT", "FULL STACK"],
    icon: "learn",
    side: "left",
  },
];

function MilestoneIcon({ type }: { type: Milestone["icon"] }) {
  if (type === "work") {
    return <BriefcaseBusiness size={22} strokeWidth={1.5} />;
  }

  if (type === "code") {
    return <Code2 size={22} strokeWidth={1.5} />;
  }

  return <GraduationCap size={23} strokeWidth={1.5} />;
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty(
      "--spotlight-x",
      `${event.clientX - rect.left}px`
    );
    card.style.setProperty(
      "--spotlight-y",
      `${event.clientY - rect.top}px`
    );
  };

  return (
    <article
      className={`journey-milestone journey-milestone--${milestone.side}`}
      data-journey-milestone
      id={`journey-${milestone.id}`}
    >
      <div className="journey-milestone-marker" aria-hidden="true">
        <span className="journey-marker-outer">
          <span className="journey-marker-inner" />
        </span>
      </div>

      <div className="journey-milestone-connector" aria-hidden="true" />

      <div
        className="journey-milestone-content"
        ref={cardRef}
        onMouseMove={handleMouseMove}
      >
        <div className="journey-card-spotlight" aria-hidden="true" />
        <div className="journey-card-scan" aria-hidden="true" />

        <div className="journey-card-body">
          <div className="journey-milestone-top">
            <span className="journey-milestone-number">
              MILESTONE / {milestone.number}
            </span>

            <span className="journey-milestone-status">
              <span />
              CHAPTER {milestone.number}
            </span>
          </div>

          <div className="journey-milestone-period">
            <span className="journey-period-line" />
            {milestone.period}
          </div>

          <div className="journey-milestone-icon">
            <MilestoneIcon type={milestone.icon} />
          </div>

          <span className="journey-milestone-type">
            {milestone.type}
          </span>

          <h3 className="journey-milestone-title">
            {milestone.title}
          </h3>

          <div className="journey-milestone-organization">
            <ArrowUpRight size={16} />
            {milestone.organization}
          </div>

          <p className="journey-milestone-description">
            {milestone.description}
          </p>

          <div className="journey-milestone-tags">
            {milestone.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>

          <div className="journey-milestone-footer">
            <span>
              <span className="journey-milestone-footer-dot" />
              EXPERIENCE RECORDED
            </span>
            <span>{milestone.number} / 03</span>
          </div>
        </div>
      </div>

      <div className="journey-milestone-watermark" aria-hidden="true">
        <span
          className="journey-watermark-outline"
          data-number={milestone.number}
        >
          {milestone.number}
        </span>
        <span
          className="journey-watermark-fill"
          data-number={milestone.number}
        >
          {milestone.number}
        </span>
        <span className="journey-watermark-glow">
          {milestone.number}
        </span>
      </div>
    </article>
  );
}

function CrimsonReactor() {
  const reactorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const reactor = reactorRef.current;
    if (!reactor) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const rect = reactor.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(reactor, {
      rotateY: x * 12,
      rotateX: -y * 12,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!reactorRef.current) return;

    gsap.to(reactorRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      className="journey-future-visual"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="journey-reactor-tilt" ref={reactorRef}>
        <div className="journey-reactor-glow" />

        <div className="journey-future-orbit journey-future-orbit-one">
          <span className="journey-orbit-particle" />
          <span className="journey-orbit-particle journey-orbit-particle--second" />
        </div>

        <div className="journey-future-orbit journey-future-orbit-two">
          <span className="journey-orbit-particle" />
        </div>

        <div className="journey-future-orbit journey-future-orbit-three">
          <span className="journey-orbit-particle" />
        </div>

        <div className="journey-reactor-shockwave journey-reactor-shockwave-one" />
        <div className="journey-reactor-shockwave journey-reactor-shockwave-two" />

        <div className="journey-future-core">
          <Rocket size={32} strokeWidth={1.2} />
        </div>
      </div>
    </div>
  );
}

export default function Section5() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      const milestoneElements = gsap.utils.toArray<HTMLElement>(
        "[data-journey-milestone]"
      );

      if (reducedMotion) {
        milestoneElements.forEach((milestone) => {
          milestone.classList.add("journey-milestone-active");
        });
        return;
      }

      gsap.fromTo(
        ".journey-intro-eyebrow",
        { autoAlpha: 0, y: 25 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".journey-intro",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".journey-heading-line",
        {
          autoAlpha: 0,
          yPercent: 110,
          rotateX: -35,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".journey-intro",
            start: "top 76%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".journey-intro-description",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".journey-intro",
            start: "top 65%",
            once: true,
          },
        }
      );

      // Crimson timeline drawing + traveling energy head
      gsap.fromTo(
        ".journey-timeline-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-timeline",
            start: "top 55%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        ".journey-timeline-energy",
        { top: "0%" },
        {
          top: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-timeline",
            start: "top 55%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );

      milestoneElements.forEach((milestone) => {
        const card = milestone.querySelector(
          ".journey-milestone-content"
        );

        const marker = milestone.querySelector(
          ".journey-milestone-marker"
        );

        const connector = milestone.querySelector(
          ".journey-milestone-connector"
        );

        const watermark = milestone.querySelector(
          ".journey-milestone-watermark"
        );

        const fill = milestone.querySelector(
          ".journey-watermark-fill"
        );

        const scan = milestone.querySelector(
          ".journey-card-scan"
        );

        const fromX = milestone.classList.contains(
          "journey-milestone--left"
        )
          ? -75
          : 75;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: milestone,
            start: "top 76%",
            once: true,
            onEnter: () => {
              milestone.classList.add("journey-milestone-active");
            },
          },
        });

        timeline
          .fromTo(
            marker,
            { scale: 0.3, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.65,
              ease: "back.out(2)",
            }
          )
          .fromTo(
            connector,
            { scaleX: 0, autoAlpha: 0 },
            {
              scaleX: 1,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.3"
          )
          .fromTo(
            card,
            {
              autoAlpha: 0,
              x: fromX,
              y: 45,
              filter: "blur(12px)",
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              duration: 1.05,
              ease: "power4.out",
            },
            "-=0.3"
          )
          .fromTo(
            watermark,
            {
              autoAlpha: 0,
              y: 55,
              scale: 0.82,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: "power4.out",
            },
            "-=0.9"
          )
          .fromTo(
            fill,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.45,
              ease: "power3.inOut",
            },
            "-=0.8"
          )
          .fromTo(
            scan,
            {
              yPercent: -110,
              autoAlpha: 0,
            },
            {
              yPercent: 110,
              autoAlpha: 1,
              duration: 1.25,
              ease: "power2.inOut",
            },
            "-=1.35"
          )
          .set(scan, { autoAlpha: 0 });

        gsap.fromTo(
          watermark,
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: milestone,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      gsap.fromTo(
        ".journey-reactor-tilt",
        {
          scale: 0.55,
          autoAlpha: 0,
          rotate: -25,
        },
        {
          scale: 1,
          autoAlpha: 1,
          rotate: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".journey-future",
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".journey-future-heading",
        {
          autoAlpha: 0,
          y: 70,
          filter: "blur(12px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".journey-future",
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".journey-future-description, .journey-future-footer",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".journey-future",
            start: "top 62%",
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="portfolio-section journey-section"
    >
      <div className="journey-intro">
        <div className="journey-section-topline">
          <span>05 / EXPERIENCE</span>
          <span className="journey-topline-rule" />
          <span>THE DEVELOPMENT JOURNEY</span>
        </div>

        <div className="journey-intro-eyebrow">
          <Sparkles size={16} />
          EVERY CHAPTER COUNTS
        </div>

        <h2 className="journey-heading">
          <span className="journey-heading-clip">
            <span className="journey-heading-line">
              THE ROAD
            </span>
          </span>

          <span className="journey-heading-clip">
            <span className="journey-heading-line journey-heading-accent">
              SO FAR.
            </span>
          </span>
        </h2>

        <div className="journey-intro-bottom">
          <p className="journey-intro-description">
            Every challenge, every project, every lesson.
            A journey shaped by curiosity, persistence,
            and the drive to keep building.
          </p>

          <div className="journey-intro-scroll">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDownRight size={21} />
          </div>
        </div>
      </div>

      <div className="journey-timeline">
        <div className="journey-timeline-track" aria-hidden="true">
          <div className="journey-timeline-progress" />
          <div className="journey-timeline-energy">
            <span className="journey-timeline-energy-core" />
          </div>
        </div>

        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
          />
        ))}
      </div>

      <div className="journey-future">
        <div className="journey-future-topline">
          <span>THE NEXT CHAPTER</span>
          <span>TO BE WRITTEN</span>
        </div>

        <CrimsonReactor />

        <div className="journey-future-content">
          <span className="journey-future-eyebrow">
            <BookOpen size={16} />
            WHAT COMES NEXT?
          </span>

          <h2 className="journey-future-heading">
            THE NEXT
            <br />
            <span>CHAPTER.</span>
          </h2>

          <p className="journey-future-description">
            I'm ready to bring my skills, creativity, and
            determination to a professional development team.
            The journey is only getting started.
          </p>
        </div>

        <div className="journey-future-footer">
          <span>
            <span className="journey-future-status-dot" />
            OPEN TO OPPORTUNITIES
          </span>

          <span>
            LET'S BUILD WHAT'S NEXT
            <ArrowRight size={17} />
          </span>
        </div>
      </div>
    </section>
  );
}
