import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const features = useMemo(
    () => [
      {
        title: "Admin Center",
        desc: "Manage courses, tutors, payouts and site settings with powerful controls.",
      },
      {
        title: "Tutor Studio",
        desc: "Create lessons, schedule live classes, grade assignments and track results.",
      },
      {
        title: "Learner Experience",
        desc: "Enroll, learn with video + notes, ask questions and earn certificates.",
      },
    ],
    [],
  );

  const goAuth = (role: "admin" | "tutor" | "learner") => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="home-root">
      <header className="home-header">
        <div className="container">
          <div className="brand">
            <span className="brand-dot" /> Brieffers <strong>Learn</strong>
          </div>
          <nav className="nav">
            <Link className="nav-link" to="/auth">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Online learning that scales with you</h1>
              <p>
                A modern platform for Admins, Tutors and Learners. Create, teach and learn with live
                classes, interactive lessons, assessments and certificates.
              </p>
              <div className="cta-row">
                <button className="btn primary" onClick={() => goAuth("learner")}>
                  Get started
                </button>
                <Link to="/auth" className="btn ghost">
                  Sign in
                </Link>
              </div>
              <div className="role-quick">
                <span>Continue as</span>
                <button className="chip" onClick={() => goAuth("admin")}>Admin</button>
                <button className="chip" onClick={() => goAuth("tutor")}>Tutor</button>
                <button className="chip" onClick={() => goAuth("learner")}>Learner</button>
              </div>
            </div>
            <div className="hero-card">
              <div className="glass-card">
                <div className="stats">
                  <div className="stat">
                    <div className="stat-k">24k+</div>
                    <div className="stat-l">Active learners</div>
                  </div>
                  <div className="stat">
                    <div className="stat-k">1.2k</div>
                    <div className="stat-l">Live sessions</div>
                  </div>
                  <div className="stat">
                    <div className="stat-k">4.9★</div>
                    <div className="stat-l">Avg rating</div>
                  </div>
                </div>
                <div className="preview">
                  <div className="preview-video" />
                  <div className="preview-timeline">
                    <div className="bar" style={{ width: "64%" }} />
                  </div>
                  <div className="preview-actions">
                    <div className="pill">Ch. 03 • Quizzes</div>
                    <div className="pill">1.25x</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="backdrop" aria-hidden="true" />
        </section>

        <section className="features">
          <div className="container">
            <ul className="feature-grid">
              {features.map((f) => (
                <li className="feature-card" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Brieffers Learn</span>
          <a href="/auth" className="nav-link">
            Join now
          </a>
        </div>
      </footer>
    </div>
  );
}
