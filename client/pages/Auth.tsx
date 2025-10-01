import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CursorCanvas from "@/components/CursorCanvas";

export default function Auth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = (params.get("role") || "learner").toLowerCase() as Role;
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => setRole(initialRole), [initialRole]);

  const roles: { key: Role; label: string; hint: string }[] = useMemo(
    () => [
      { key: "admin", label: "Admin", hint: "Control center" },
      { key: "tutor", label: "Tutor", hint: "Create & teach" },
      { key: "learner", label: "Learner", hint: "Study & earn" },
    ],
    [],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || (mode === "register" && !name)) {
      setMessage("Please fill all required fields.");
      return;
    }
    if (mode === "register" && password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    // Demo-only local persistence
    const user = { email, role, name: name || email.split("@")[0] };
    localStorage.setItem("bl_user", JSON.stringify(user));
    setMessage(`${mode === "login" ? "Welcome back" : "Welcome"}, ${user.name}!`);
    setTimeout(() => navigate("/"), 600);
  }

  return (
    <div className="auth-root">
      <CursorCanvas />
      <div className="auth-shell">
        <a className="brand mark" href="/">Brieffers <strong>Learn</strong></a>
        <div className="auth-card">
          <div className="tabs" role="tablist" aria-label="Authentication tabs">
            <button
              role="tab"
              aria-selected={mode === "login"}
              className={"tab " + (mode === "login" ? "active" : "")}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              role="tab"
              aria-selected={mode === "register"}
              className={"tab " + (mode === "register" ? "active" : "")}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form className="form" onSubmit={onSubmit} noValidate>
            {mode === "register" && (
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
            </div>

            {mode === "register" && (
              <div className="field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            <fieldset className="segmented" aria-label="Choose your role">
              <legend>Role</legend>
              <div className="segments">
                {roles.map((r) => (
                  <label key={r.key} className={"segment " + (role === r.key ? "active" : "")}
                    aria-pressed={role === r.key}>
                    <input
                      type="radio"
                      name="role"
                      value={r.key}
                      checked={role === r.key}
                      onChange={() => setRole(r.key)}
                    />
                    <span className="seg-label">{r.label}</span>
                    <span className="seg-hint">{r.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {message && <div className="message" role="status">{message}</div>}

            <button className="btn primary wide" type="submit">
              {mode === "login" ? "Login" : "Create account"}
            </button>

            {mode === "login" ? (
              <p className="muted">
                New here? <button type="button" className="link" onClick={() => setMode("register")}>Create an account</button>
              </p>
            ) : (
              <p className="muted">
                Already have an account? <button type="button" className="link" onClick={() => setMode("login")}>Login</button>
              </p>
            )}
          </form>
        </div>
        <p className="footer-note">By continuing you agree to our Terms and acknowledge our Privacy Policy.</p>
      </div>
    </div>
  );
}

type Role = "admin" | "tutor" | "learner";
