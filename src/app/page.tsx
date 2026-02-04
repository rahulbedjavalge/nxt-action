"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="gradient-bg" />
        <div className="gradient-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="gradient-bg" />
      <div className="gradient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Mouse follower glow */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-300 ease-out hidden md:block"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link 
              href="/contact" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Hero Section */}
        <div className="text-center pt-8 sm:pt-16 pb-20">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">100% Private - Data in YOUR Google Drive</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-slide-up text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Never Forget a
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 text-glow">
              Follow-Up
            </span>{" "}
            Again
          </h1>

          {/* Subtitle */}
          <p className="animate-slide-up stagger-1 text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto opacity-0" style={{ animationFillMode: "forwards" }}>
            A dead-simple personal task manager for people who need to remember 
            to follow up on things. No complex features, just tasks and dates.
          </p>

          {/* AI Quick Add Demo (dev-only interactive demo) */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <input
              value={typeof window !== 'undefined' ? (window as any)._aiDemoInput || '' : ''}
              onChange={(e) => {(window as any)._aiDemoInput = e.target.value}}
              placeholder="Try: 'Call mom tomorrow at 3pm about her birthday'"
              className="w-full max-w-xl px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none"
              id="ai-demo-input"
            />
            <button
              onClick={async () => {
                const inputEl = document.getElementById('ai-demo-input') as HTMLInputElement | null;
                const val = inputEl?.value || '';
                if (!val.trim()) return;
                const previewEl = document.getElementById('ai-demo-preview');
                try {
                  if (previewEl) previewEl.textContent = 'Parsing...';
                  const res = await fetch('/api/ai/parse-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-ai-test': 'true' },
                    body: JSON.stringify({ input: val }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    previewEl!.textContent = 'AI error: ' + (data.error || res.status);
                    return;
                  }
                  previewEl!.textContent = JSON.stringify(data, null, 2);
                } catch (err) {
                  if (previewEl) previewEl.textContent = 'Request failed';
                }
              }}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium hover:opacity-90"
            >
              ✨ Parse
            </button>
          </div>

          <pre id="ai-demo-preview" className="mt-4 max-w-3xl mx-auto bg-black/30 p-4 rounded text-sm text-green-300 overflow-auto" />

          {/* Author */}
          <p className="animate-fade-in stagger-2 text-sm text-gray-500 opacity-0" style={{ animationFillMode: "forwards" }}>
            A personal project by{" "}
            <a 
              href="https://linkedin.com/in/rahul-bedjavalge" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Rahul Bedjavalge
            </a>
          </p>
        </div>

        {/* Problem Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The <span className="text-red-400">Problem</span>
            </h2>
            <p className="text-gray-400 text-lg">You have been there...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "📧",
                title: '"I\'ll reply to this later"',
                desc: "You read an important email, think 'I'll reply tomorrow'... and discover it 3 weeks later still in your inbox, unanswered.",
              },
              {
                emoji: "📞",
                title: '"I need to call them back"',
                desc: "Someone asked you to call them next week. You make a mental note. Two weeks later you suddenly remember at 11pm.",
              },
              {
                emoji: "📝",
                title: "Sticky notes everywhere",
                desc: "You write things on paper, in Notes app, in Slack DMs to yourself... Now you have reminders everywhere and trust none of them.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 border-l-2 border-red-500/50 animate-slide-up stagger-${i + 1} opacity-0`}
                style={{ animationFillMode: "forwards" }}
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
