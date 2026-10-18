import { ArrowUpRight, GitBranch, ExternalLink, Mail } from "lucide-react";
import "./Section6.css";

export default function Section6() {
  return (
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
          Have a role, a project or an idea?
          Let's start a conversation.
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
  );
}

