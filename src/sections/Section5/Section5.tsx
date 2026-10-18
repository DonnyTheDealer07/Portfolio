import { ArrowUpRight } from "lucide-react";
import "./Section5.css";

export default function Section5() {
  return (
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
          <div className="experience-item" data-section-reveal>
            <span>01 / PRESENT</span>

            <div>
              <h3>React &amp; Web Development</h3>

              <p>
                Building modern, responsive websites
                and full-stack web experiences,
                including production client work.
              </p>
            </div>

            <ArrowUpRight size={21} />
          </div>

          <div className="experience-item" data-section-reveal>
            <span>02 / NEXT</span>

            <div>
              <h3>What's Next</h3>

              <p>
                Looking for opportunities to
                collaborate, contribute and grow
                with ambitious teams.
              </p>
            </div>

            <ArrowUpRight size={21} />
          </div>
        </div>

        <p className="experience-note" data-section-reveal>
          Qualifications, certificates and employment
          history will be incorporated in the next
          customization pass.
        </p>
      </section>
  );
}

