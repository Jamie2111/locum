import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, Bot, Sparkles, BarChart3, ShieldCheck, PlayCircle } from "lucide-react";

// --- CONFIG ---
// Set this to your backend base URL (e.g. https://api.yourdomain.com). When empty, mock mode is used.
const API_BASE = import.meta.env.VITE_API_BASE || "";

// Simple async helper
async function postJSON(path, body) {
  try {
    if (!API_BASE) {
      // Mocked response for local preview w/o backend
      await new Promise(r => setTimeout(r, 600));
      return {
        ok: true,
        data: {
          subject: `Quick intro — ${body.company} × ${body.product}`,
          steps: [
            "Icebreaker referencing a recent post from the lead.",
            "Value prop: 2–3 lines tailored to their role.",
            "Soft CTA: 15-min intro next week?",
          ],
          score: 82,
        },
      };
    }
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return { ok: res.ok, data: json };
  } catch (e) {
    return { ok: false, data: { error: e.message } };
  }
}

export default function App() {
  const [emailIdea, setEmailIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    persona: "Revenue Ops Director",
    company: "Acme Robotics",
    product: "SailAI",
    goal: "improve reply rates",
  });

  const onTryAI = async () => {
    setLoading(true);
    const { ok, data } = await postJSON("/api/ai/generate-cadence", form);
    setLoading(false);
    if (ok) setEmailIdea(data);
    else setEmailIdea({ error: data?.error || "Something went wrong." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 grid place-items-center rounded-2xl bg-slate-900 text-white">
              <Sparkles size={18} />
            </div>
            <span className="font-semibold">SailAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-slate-600">Features</a>
            <a href="#how" className="hover:text-slate-600">How it works</a>
            <a href="#pricing" className="hover:text-slate-600">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#demo" className="text-sm">Live demo</a>
            <a href="#cta" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-slate-900 text-white text-sm shadow-sm hover:shadow">Get started <ArrowRight size={16}/></a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Outbound that writes itself — and actually gets replies.
            </motion.h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              SailAI researches each lead, drafts a 3‑step cadence tailored to their role, and syncs results back to your CRM. Go from list to meetings in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#demo" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-slate-900 text-white shadow-md hover:shadow-lg">
                <PlayCircle size={18}/> Try the AI demo
              </a>
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-slate-300 hover:border-slate-400 bg-white">See pricing</a>
            </div>
            <div className="mt-6 text-xs text-slate-500">No credit card required • {API_BASE ? "Connected to backend" : "Mock mode (no backend configured)"}</div>
          </div>

          {/* Mock dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/70 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">Today</div>
              <div className="text-xs text-slate-500">Cadence generator</div>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="text-sm text-slate-600">Persona</label>
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200" value={form.persona} onChange={e=>setForm({...form, persona:e.target.value})} />
              <label className="text-sm text-slate-600">Company</label>
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} />
              <label className="text-sm text-slate-600">Your product</label>
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.product} onChange={e=>setForm({...form, product:e.target.value})} />
              <label className="text-sm text-slate-600">Goal</label>
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.goal} onChange={e=>setForm({...form, goal:e.target.value})} />
              <button onClick={onTryAI} disabled={loading} className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-slate-900 text-white text-sm disabled:opacity-60">
                <Bot size={16}/> {loading ? "Thinking..." : "Generate 3‑step cadence"}
              </button>
              {emailIdea && (
                <div className="mt-4 rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  {emailIdea.error ? (
                    <div className="text-sm text-rose-600">{emailIdea.error}</div>
                  ) : (
                    <>
                      <div className="text-xs uppercase tracking-wide text-slate-500">Subject</div>
                      <div className="font-medium">{emailIdea.subject}</div>
                      <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">Steps</div>
                      <ul className="mt-1 space-y-2">
                        {emailIdea.steps.map((s, i)=> (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="mt-0.5" size={16}/>
                            <span className="text-sm">{s}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-xs text-slate-500">Fit score: {emailIdea.score}/100</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 opacity-70">
            {"HubSpot,SFDC,Salesloft,Outreach,Gmail,Outlook".split(",").map((x,i)=> (
              <div key={i} className="rounded-xl border border-slate-200 bg-white py-3 text-center text-xs">{x}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon: <Sparkles/>, title: "1:1 Personalization", desc: "Live web + CRM research to write like you did it yourself."},
              {icon: <BarChart3/>, title: "Prioritized leads", desc: "Fit + intent scoring to focus on warm prospects."},
              {icon: <ShieldCheck/>, title: "Enterprise-ready", desc: "SOC2 path, SSO, audit logs, and role controls."},
            ].map((f,i)=> (
              <div key={i} className="rounded-3xl p-6 bg-white ring-1 ring-slate-100 shadow-sm">
                <div className="h-10 w-10 grid place-items-center rounded-xl bg-slate-900 text-white">{f.icon}</div>
                <div className="mt-4 font-semibold">{f.title}</div>
                <div className="mt-2 text-sm text-slate-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {step: 1, title: "Import or connect", text: "Upload CSV or connect CRM/engagement tools."},
              {step: 2, title: "AI generates cadence", text: "Per‑lead icebreakers + 3‑step sequence with CTA."},
              {step: 3, title: "Launch & learn", text: "Send via Gmail/Salesloft; track replies & bookings."},
            ].map((s,i)=> (
              <div key={i} className="rounded-3xl p-6 ring-1 ring-slate-100">
                <div className="text-xs uppercase tracking-wide text-slate-500">Step {s.step}</div>
                <div className="mt-2 font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-slate-600">{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              name: "Starter", price: "$39/mo", features: ["1 user", "200 AI generations", "Email export"],
            },{
              name: "Team", price: "$149/mo", features: ["Up to 5 users", "Unlimited generations", "CRM sync"],
            },{
              name: "Enterprise", price: "Custom", features: ["SSO & RBAC", "On‑prem options", "Security review"],
            }].map((p,i)=> (
              <div key={i} className="rounded-3xl p-6 bg-white ring-1 ring-slate-100 shadow-sm flex flex-col">
                <div className="text-sm text-slate-500">{p.name}</div>
                <div className="mt-2 text-3xl font-bold">{p.price}</div>
                <ul className="mt-4 space-y-2 flex-1">
                  {p.features.map((f, j)=> (
                    <li key={j} className="flex items-start gap-2 text-sm"><Check size={16}/> {f}</li>
                  ))}
                </ul>
                <a href="#cta" className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 bg-slate-900 text-white text-sm">Choose {p.name}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to ship more meetings?</h2>
          <p className="mt-3 text-slate-300">Drop your email and we’ll send access.</p>
          <form className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 justify-center">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={16}/>
              <input required placeholder="you@company.com" className="w-full pl-10 pr-3 py-3 rounded-2xl text-slate-900"/>
            </div>
            <button className="rounded-2xl px-5 py-3 bg-white text-slate-900 font-medium">Request access</button>
          </form>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} SailAI, Inc.</footer>
    </div>
  );
}
