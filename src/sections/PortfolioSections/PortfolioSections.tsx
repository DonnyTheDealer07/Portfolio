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

