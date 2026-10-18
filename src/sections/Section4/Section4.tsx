import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./Section4.css";

export default function Section4() {
  return (
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

        <p className="project-disclaimer" data-section-reveal>
          More detailed project walkthroughs and
          screenshots will be added as we customize
          each case study.
        </p>
      </section>
  );
}

