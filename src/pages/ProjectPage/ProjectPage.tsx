
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  GitBranch,
} from "lucide-react";
import "./ProjectPage.css";

export default function ProjectPage() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (slug !== "pure-sa") {
    return (
      <main className="case-study not-found">
        <span className="case-eyebrow">404 / NOT FOUND</span>

        <h1>
          LOST IN THE <em>VOID.</em>
        </h1>

        <p>That project doesn't exist yet.</p>

        <Link to="/#work" className="case-back">
          <ArrowLeft size={18} />
          BACK TO PORTFOLIO
        </Link>
      </main>
    );
  }

  return (
    <main className="case-study">
      <div className="case-top">
        <span className="case-eyebrow">CASE STUDY / 001</span>

        <Link className="case-back" to="/#work">
          <ArrowLeft size={17} />
          BACK TO WORK
        </Link>
      </div>

      <section className="case-hero">
        <p className="case-eyebrow">
          FULL-STACK WEB EXPERIENCE / 2026
        </p>

        <h1>
          PURE <em>SA.</em>
        </h1>

        <p>
          A modern, responsive digital storefront with a
          connected backend and a dedicated product management
          experience.
        </p>

        <div className="case-actions">
          <a
            href="https://www.puresa.africa"
            target="_blank"
            rel="noopener noreferrer"
          >
            VISIT LIVE WEBSITE
            <ArrowUpRight size={18} />
          </a>

          <a
            href="https://github.com/DonnyTheDealer07"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitBranch size={18} />
            GITHUB PROFILE
          </a>
        </div>
      </section>

      <div
        className="case-art"
        aria-label="Typographic Pure SA project artwork"
      >
        <span>PURE</span>
        <strong>SA.</strong>
      </div>

      <section className="case-body">
        <div>
          <span className="case-eyebrow">01 / OVERVIEW</span>

          <h2>
            COMMERCE,
            <br />
            <em>REIMAGINED.</em>
          </h2>
        </div>

        <div>
          <p>
            Pure SA is a production website project built
            around an accessible product browsing experience,
            a separate administration interface, and a
            Node.js/Express backend.
          </p>

          <p>
            The frontend is built with React and deployed on
            Vercel, while backend services run on Render.
            The project includes searchable products,
            categories, featured items, and dedicated
            product details.
          </p>
        </div>
      </section>

      <section className="case-facts">
        <div>
          <span>ROLE</span>
          <strong>WEB DEVELOPMENT</strong>
        </div>

        <div>
          <span>STACK</span>
          <strong>REACT / VITE / NODE.JS / EXPRESS</strong>
        </div>

        <div>
          <span>DEPLOYMENT</span>
          <strong>VERCEL / RENDER</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong>LIVE WEBSITE</strong>
        </div>
      </section>

      <section className="case-outro">
        <span className="case-eyebrow">NEXT UP</span>

        <h2>
          MORE TO <em>COME.</em>
        </h2>

        <Link to="/#work" className="case-back">
          <ArrowLeft size={18} />
          RETURN TO PROJECTS
        </Link>
      </section>
    </main>
  );
}
