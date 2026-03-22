"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Mode = "terminal" | "normal";

export default function Home() {
  const [mode, setMode] = useState<Mode>("normal");
  const [hydrated, setHydrated] = useState(false);

  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (mode === "terminal") {
      setOutput([
        "Welcome to Benedek's portfolio",
        "Type 'help' to see available commands.",
        "Tip: you can switch to the normal site any time.",
      ]);
    }
  }, [mode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [output, mode]);

  const prompt = useMemo(() => "benedek@portfolio:~$", []);

  const stripTrailingPunct = (s: string) => {
    let t = s;
    while (t.length > 0 && ".,);:".includes(t[t.length - 1])) t = t.slice(0, -1);
    return t;
  };

  const tokenToLink = (token: string) => {
    const clean = stripTrailingPunct(token);
    const suffix = token.slice(clean.length);
    const lower = clean.toLowerCase();

    const isUrl =
      lower.startsWith("http://") ||
      lower.startsWith("https://") ||
      lower.startsWith("www.") ||
      lower.startsWith("github.com/");

    const at = clean.indexOf("@");
    const isEmail = at > 0 && clean.slice(at + 1).includes(".");

    if (isEmail) return { clean, href: `mailto:${clean}`, suffix };

    if (isUrl) {
      const href =
        lower.startsWith("http://") || lower.startsWith("https://") ? clean : `https://${clean}`;
      return { clean, href, suffix };
    }

    return { clean: token, href: "", suffix: "" };
  };

  const renderLine = (line: string) => {
    const parts = line.split(" ");
    return (
      <>
        {parts.map((p, i) => {
          const { clean, href, suffix } = tokenToLink(p);
          const lead = i === 0 ? "" : " ";

          if (!href) return <Fragment key={i}>{lead}{p}</Fragment>;

          const isMail = href.startsWith("mailto:");

          return (
            <Fragment key={i}>
              {lead}
              <motion.a
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.12 }}
                href={href}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noreferrer"}
                className="underline underline-offset-2 hover:text-green-100"
              >
                {clean}
              </motion.a>
              {suffix}
            </Fragment>
          );
        })}
      </>
    );
  };

  const runCommand = (cmdRaw: string) => {
    const cmd = cmdRaw.trim();
    const command = cmd.toLowerCase();
    let response: string[] = [];

    switch (command) {
      case "help":
        response = [
          "about      – short bio",
          "projects   – open-source work",
          "skills     – tech stack",
          "contact    – links",
          "normal     – switch to normal site",
          "clear      – clear terminal",
        ];
        break;
      case "about":
        response = [
          "DevOps Engineer and software developer.",
          "Focused on automation, CI/CD, cloud, and clean tooling.",
        ];
        break;
      case "projects":
        response = [
          "CLI Calculator: https://github.com/benedek553/cli-calculator",
          "Connections: https://github.com/zacharymk1213/connections",
          "More: https://github.com/Benedek553",
        ];
        break;
      case "skills":
        response = [
          "C++, Bash, Python",
          "Azure, GitHub Actions, Docker",
          "Linux, CMake",
        ];
        break;
      case "contact":
        response = [
          "GitHub: https://github.com/Benedek553",
          "Email: carnevalben@gmail.com",
          "X: https://x.com/Benedek553.com",
          "Reddit: https://www.reddit.com/user/JustAProgrammer25",
          "Dev.to: https://dev.to/benedek553",
        ];
        break;
      case "normal":
        setMode("normal");
        return;
      case "clear":
        setOutput([]);
        return;
      case "sudo rm -rf /":
        response = ["Nice try. Operation cancelled - I like this server."];
        break;
      default:
        response = cmd.length ? [`command not found: ${cmd}`] : [];
    }

    setOutput((prev) => [...prev, `${prompt} ${cmd}`, ...response]);
  };

  const ToggleButton = ({ className = "" }: { className?: string }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={() => setMode((m) => (m === "terminal" ? "normal" : "terminal"))}
      className={
        "inline-flex items-center justify-center rounded-lg border border-green-500/60 bg-black/40 px-3 py-2 text-sm text-green-200 hover:bg-black/60 hover:text-green-100 active:scale-[0.99] transition " +
        className
      }
      aria-label={mode === "terminal" ? "Switch to Normal" : "Switch to Terminal"}
    >
      {mode === "terminal" ? "Switch to Normal" : "Switch to Terminal"}
    </motion.button>
  );

  if (!hydrated) return null;

  const hoverCard = {
    scale: 1.02,
    boxShadow: "0 0 0 1px rgba(34,197,94,0.35), 0 10px 40px rgba(0,0,0,0.6)",
  } as const;

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono overflow-x-hidden">
      <AnimatePresence mode="wait">
        {mode === "terminal" ? (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl rounded-2xl border border-green-500/50 bg-black/50 shadow-[0_0_0_1px_rgba(34,197,94,0.1),0_20px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-green-500/30 px-3 sm:px-4 py-3">
                <motion.div
                  whileHover={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs opacity-80"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500/70" />
                  <span className="tracking-wide">{prompt}</span>
                </motion.div>
                <ToggleButton />
              </div>

              <div
                ref={scrollRef}
                className="max-h-[65vh] sm:max-h-[70vh] overflow-auto px-3 sm:px-4 py-4 space-y-1 text-sm"
              >
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-pre-wrap break-words"
                  >
                    {renderLine(line)}
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-green-500/30 px-3 sm:px-4 py-3 text-sm">
                <motion.span whileHover={{ scale: 1.05 }} transition={{ duration: 0.12 }} className="opacity-90">
                  $
                </motion.span>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.12 }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      runCommand(input);
                      setInput("");
                    }
                  }}
                  placeholder="help"
                  className="bg-transparent outline-none flex-1 placeholder:text-green-500/40"
                  autoFocus
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-5xl px-4 py-8 sm:py-14"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-green-300/80">Portfolio</p>
                <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-green-100">
                  Benedek Farsang
                </h1>
                <p className="mt-3 max-w-2xl text-green-200/80 leading-relaxed">
                  DevOps Engineer and software developer. I build automation-first workflows, cloud-ready apps, and clean,
                  fast tooling.
                </p>
              </div>
              <div className="shrink-0">
                <ToggleButton />
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <motion.section
                whileHover={hoverCard}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-green-500/30 bg-black/40 p-5"
              >
                <h2 className="text-lg text-green-100">About</h2>
                <p className="mt-2 text-sm text-green-200/75 leading-relaxed">
                  Linux-based dev, Azure-first, multicloud mindset. I like strong CI/CD, reproducible builds, and
                  contributor-friendly repos.
                </p>
              </motion.section>

              <motion.section
                whileHover={hoverCard}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-green-500/30 bg-black/40 p-5"
              >
                <h2 className="text-lg text-green-100">Tech</h2>
                <ul className="mt-3 text-sm text-green-200/75 space-y-1">
                  <li>• Cloud: Azure</li>
                  <li>• DevOps: GitHub Actions, Docker, CI/CD automation</li>
                  <li>• Languages: C++, Bash, Python</li>
                  <li>• Tooling: Linux, Git, CMake</li>
                </ul>
              </motion.section>

              <motion.section
                whileHover={{ ...hoverCard, scale: 1.015 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-green-500/30 bg-black/40 p-5 sm:col-span-2"
              >
                <h2 className="text-lg text-green-100">Projects</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <motion.a
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    href="https://benedek553.github.io/cli-calculator"
                    className="rounded-xl border border-green-500/30 bg-black/40 p-4 hover:bg-black/60 transition"
                  >
                    <div className="text-green-100">CLI Calculator</div>
                    <div className="mt-1 text-sm text-green-200/70">
                      Modern C++ CLI calculator with automation, CI, and frequent releases.
                    </div>
                  </motion.a>

                  <motion.a
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    href="https://github.com/Zacharymk1213/Connections"
                    className="rounded-xl border border-green-500/30 bg-black/40 p-4 hover:bg-black/60 transition"
                  >
                    <div className="text-green-100">Connections</div>
                    <div className="mt-1 text-sm text-green-200/70">
                      Contributed to Zacharymk1213/Connections. Original description: An app enabling people to sort their
                      connections in database format.
                    </div>
                  </motion.a>

                  <motion.a
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    href="https://github.com/Benedek553"
                    className="rounded-xl border border-green-500/30 bg-black/40 p-4 hover:bg-black/60 transition"
                  >
                    <div className="text-green-100">GitHub</div>
                    <div className="mt-1 text-sm text-green-200/70">More projects and contributions.</div>
                  </motion.a>
                </div>
              </motion.section>

              <motion.section
                whileHover={{ ...hoverCard, scale: 1.015 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-green-500/30 bg-black/40 p-5 sm:col-span-2"
              >
                <h2 className="text-lg text-green-100">Contact</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <motion.a
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg border border-green-500/30 bg-black/40 px-3 py-2 hover:bg-black/60 transition"
                    href="https://github.com/Benedek553"
                  >
                    GitHub
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg border border-green-500/30 bg-black/40 px-3 py-2 hover:bg-black/60 transition"
                    href="mailto:carnevalben@gmail.com"
                  >
                    Email
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg border border-green-500/30 bg-black/40 px-3 py-2 hover:bg-black/60 transition"
                    href="https://x.com/Benedek553"
                  >
                    X
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg border border-green-500/30 bg-black/40 px-3 py-2 hover:bg-black/60 transition"
                    href="https://reddit.com/user/JustAProgrammer25"
                  >
                    Reddit
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg border border-green-500/30 bg-black/40 px-3 py-2 hover:bg-black/60 transition"
                    href="https://dev.to/benedek553"
                  >
                    Dev
                  </motion.a>
                </div>
              </motion.section>
            </div>

            <footer className="mt-10 text-xs text-green-200/50">© {new Date().getFullYear()} Benedek Farsang</footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
