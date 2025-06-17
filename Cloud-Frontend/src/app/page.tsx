"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  // État des champs, typés string
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  // On précise que c'est un formulaire HTML
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const utilisateursAutorises: { email: string; password: string }[] = [
      { email: "admin@gmail.com", password: "aaaaaa" },
    ];

    const utilisateurValide = utilisateursAutorises.find(
      (u) => u.email === email && u.password === password
    );

    if (!utilisateurValide) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    setError("");
    console.log("Connexion réussie avec", { email });

    router.push("/home");
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        {error && <div className="error">{error}</div>}

        <label htmlFor="email">Adresse email</label>
        <input
          type="email"
          id="email"
          placeholder="exemple@domaine.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          minLength={6}
        />

        <button type="submit">Se connecter</button>
      </form>

      <style>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f4f4f4;
        }

        .login-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-form h2 {
          margin-bottom: 1.5rem;
        }

        .login-form label {
          display: block;
          margin-top: 1rem;
        }

        .login-form input {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.25rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .login-form .error {
          color: red;
          margin-bottom: 1rem;
        }

        .login-form button {
          margin-top: 1.5rem;
          width: 100%;
          padding: 0.75rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .login-form button:hover {
          background: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Login;
