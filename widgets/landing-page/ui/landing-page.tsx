"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Users,
  BookOpen,
  Mail,
  CreditCard,
  Megaphone,
  ShieldCheck,
  Menu,
  X,
  Check,
  Zap,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { PRO_PRICE } from "@/entities/subscription";

/* ── Animation helpers ───────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" as const, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Marketing Nav ───────────────────────────────────────────── */

function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="absolute inset-0 bg-gray-950/95 backdrop-blur-md border-b border-white/8"
        style={{ opacity: bgOpacity }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-sm bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-[13px]">F</span>
          </div>
          <span className="text-[15px] font-bold text-white">IRB Forge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] text-gray-400 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] text-gray-400 hover:text-white transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary/90 transition-colors"
          >
            Get started free
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-gray-950/98 backdrop-blur-md border-b border-white/8 px-4 pb-5 space-y-1"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-[14px] text-gray-300 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-white/8">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-[14px] text-gray-400 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg bg-primary text-white text-[14px] font-medium text-center"
              >
                Get started free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ── App Mockup ──────────────────────────────────────────────── */

function AppMockup() {
  return (
    <div className="relative select-none">
      <div className="absolute inset-0 bg-primary/25 blur-3xl scale-90 -z-10" />
      <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-950 border-b border-white/5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <div className="ml-3 h-5 flex-1 bg-white/5 rounded max-w-52 flex items-center px-2.5 gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="h-1.5 w-24 bg-white/15 rounded" />
          </div>
        </div>

        <div className="flex h-72">
          {/* Sidebar */}
          <div className="w-36 bg-gray-950 border-r border-white/5 p-2.5 flex flex-col gap-0.5 shrink-0">
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="h-5 w-5 rounded-sm bg-primary/80 flex items-center justify-center shrink-0">
                <span className="text-white text-[9px] font-bold">F</span>
              </div>
              <div className="h-2 w-14 bg-white/25 rounded" />
            </div>
            {[
              { label: "Overview", active: true, color: "bg-primary/20" },
              { label: "Members", active: false, color: "" },
              { label: "Programs", active: false, color: "" },
              { label: "Billing", active: false, color: "" },
              { label: "Settings", active: false, color: "" },
            ].map(({ label, active, color }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${color}`}
              >
                <div
                  className={`h-3 w-3 rounded-sm shrink-0 ${active ? "bg-primary/80" : "bg-white/15"}`}
                />
                <div className={`h-2 w-14 rounded ${active ? "bg-primary/40" : "bg-white/10"}`} />
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-32 bg-white/25 rounded" />
              <div className="h-3 w-3 bg-white/10 rounded" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "24", color: "bg-blue-500/15 border-blue-500/20" },
                { value: "5", color: "bg-violet-500/15 border-violet-500/20" },
                { value: "3", color: "bg-emerald-500/15 border-emerald-500/20" },
              ].map(({ value, color }, i) => (
                <div key={i} className={`${color} border rounded-lg p-2.5`}>
                  <div className="text-[15px] font-bold text-white/80">{value}</div>
                  <div className="h-1.5 w-10 bg-white/15 rounded mt-1.5" />
                </div>
              ))}
            </div>

            {/* Program list */}
            <div className="space-y-2">
              {[
                {
                  status: "active",
                  statusColor: "bg-emerald-500/20 text-emerald-400",
                  nameW: "w-28",
                  metaW: "w-20",
                },
                {
                  status: "draft",
                  statusColor: "bg-gray-500/20 text-gray-400",
                  nameW: "w-36",
                  metaW: "w-16",
                },
                {
                  status: "active",
                  statusColor: "bg-emerald-500/20 text-emerald-400",
                  nameW: "w-24",
                  metaW: "w-24",
                },
              ].map(({ status, statusColor, nameW, metaW }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-2.5 py-2 bg-white/4 rounded-lg border border-white/5"
                >
                  <div className="h-6 w-6 rounded-lg bg-primary/20 shrink-0 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 bg-primary/60 rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className={`h-2 ${nameW} bg-white/25 rounded`} />
                    <div className={`h-1.5 ${metaW} bg-white/10 rounded`} />
                  </div>
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${statusColor}`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gray-950 overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[700px] w-[700px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[12px] font-medium mb-8">
                <Sparkles size={11} strokeWidth={2} />
                Built for mentorship communities
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[48px] sm:text-[58px] lg:text-[66px] font-bold text-white leading-[1.08] tracking-tight mb-6"
            >
              Build.{" "}
              <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                Connect.
              </span>
              <br />
              Scale.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[18px] text-gray-400 max-w-xl mb-8 leading-relaxed"
            >
              Manage organizations, run cohort programs, track enrollment, and collect payments —
              without stitching together five different tools.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-[15px] font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-white text-[15px] font-medium hover:bg-white/5 transition-colors"
              >
                Sign in
                <ChevronRight size={15} className="text-gray-500" />
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-[13px] text-gray-600">
              Free forever · No credit card required · Setup in 60 seconds
            </motion.p>
          </motion.div>

          {/* Mockup */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" as const }}
          >
            <AppMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Problem strip ───────────────────────────────────────────── */

const TOOLS = [
  "Slack / Discord",
  "Notion",
  "Airtable",
  "Stripe",
  "Mailchimp",
  "Calendly",
  "Google Sheets",
];

function ProblemSection() {
  return (
    <section className="bg-gray-950 border-t border-white/6 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-10">
          <p className="text-[14px] text-gray-500 uppercase tracking-widest font-medium">
            The fragmentation problem
          </p>
          <p className="text-[22px] sm:text-[26px] font-semibold text-white mt-3 max-w-2xl mx-auto leading-snug">
            Running a mentorship community means juggling{" "}
            <span className="text-gray-500 line-through decoration-white/30">all of these</span>
          </p>
        </FadeUp>

        <StaggerGrid className="flex flex-wrap justify-center gap-3 mb-10">
          {TOOLS.map((tool) => (
            <StaggerItem key={tool}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/3 text-gray-500 text-[13px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500/60 shrink-0" />
                {tool}
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeUp delay={0.1}>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-white/10" />
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[14px] font-semibold text-primary">
                IRB Forge replaces all of them
              </span>
            </div>
            <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Building2,
    title: "Multi-tenant Organizations",
    description:
      "Create unlimited organizations, each with its own members, programs, and billing. Fully isolated. No configuration required.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    description:
      "Four purpose-built roles — Owner, Admin, Mentor, Member. Precise permissions designed for how mentorship communities actually work.",
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: BookOpen,
    title: "Cohort Programs & Enrollment",
    description:
      "Create programs, open enrollment, track progress, mark completions. The full program lifecycle in one place.",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Mail,
    title: "Email Invitations",
    description:
      "Invite members with a single click. Customized email, auto role assignment, expiring invite links.",
    color: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: CreditCard,
    title: "Subscription Billing",
    description:
      "Stripe-powered billing built in. Free and Pro plans managed for you — no Stripe Dashboard wrangling needed.",
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: Megaphone,
    title: "Org Announcements",
    description:
      "Broadcast updates to your entire organization instantly. No Slack integration, no mailing list — just send.",
    color: "bg-indigo-500/10 text-indigo-400",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-gray-950 leading-tight mb-4">
            Everything you need to run
            <br className="hidden sm:block" /> a world-class mentorship community
          </h2>
          <p className="text-[17px] text-gray-500 max-w-2xl mx-auto">
            No integrations. No workarounds. Just a purpose-built platform that handles every part
            of your community lifecycle.
          </p>
        </FadeUp>

        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <StaggerItem key={title}>
              <div className="group p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-950 mb-2">{title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────── */

const STEPS = [
  {
    step: "01",
    icon: Building2,
    title: "Create your organization",
    description:
      "Sign up and create your community in under 60 seconds. Name it, describe it, and you're ready to go.",
  },
  {
    step: "02",
    icon: Users,
    title: "Build your team",
    description:
      "Invite mentors, admins, and members by email. Everyone gets the right role and access automatically.",
  },
  {
    step: "03",
    icon: Zap,
    title: "Run programs and grow",
    description:
      "Launch cohort programs, track enrollment, send announcements, and collect subscription payments — all from one dashboard.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-24 sm:py-32 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-gray-950 leading-tight">
            Up and running in minutes
          </h2>
        </FadeUp>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          <StaggerGrid className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map(({ step, icon: Icon, title, description }) => (
              <StaggerItem key={step}>
                <div className="relative text-center lg:text-left">
                  <div className="inline-flex lg:flex items-center justify-center lg:justify-start gap-3 mb-5">
                    <div className="relative h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                      <Icon size={22} className="text-white" strokeWidth={1.8} />
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white border-2 border-primary text-primary text-[10px] font-bold flex items-center justify-center">
                        {step.slice(1)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[18px] font-semibold text-gray-950 mb-2">{title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────── */

const FREE_PLAN_FEATURES = [
  "1 organization",
  "Up to 20 members",
  "Up to 3 programs",
  "Email invitations",
  "Org announcements",
];

const PRO_PLAN_FEATURES = [
  "Unlimited organizations",
  "Unlimited members",
  "Unlimited programs",
  "Everything in Free",
  "Priority support",
  "Analytics (coming soon)",
];

function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-gray-950 leading-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[17px] text-gray-500 max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready to scale. No contracts, cancel anytime.
          </p>
        </FadeUp>

        <StaggerGrid className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <StaggerItem>
            <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 h-full flex flex-col">
              <p className="text-[15px] font-semibold text-gray-950 mb-1">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[42px] font-bold text-gray-950 leading-none">$0</span>
              </div>
              <p className="text-[13px] text-gray-400 mb-6">No credit card required</p>
              <ul className="space-y-3 flex-1 mb-8">
                {FREE_PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-gray-600">
                    <Check size={15} className="text-gray-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 rounded-xl border border-gray-300 text-center text-[14px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Get started free
              </Link>
            </div>
          </StaggerItem>

          {/* Pro */}
          <StaggerItem>
            <div className="relative p-8 rounded-2xl border-2 border-primary bg-primary/[0.02] h-full flex flex-col shadow-xl shadow-primary/10">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-[12px] font-semibold">
                Recommended
              </span>
              <p className="text-[15px] font-semibold text-gray-950 mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[42px] font-bold text-gray-950 leading-none">
                  ${PRO_PRICE}
                </span>
                <span className="text-[15px] text-gray-400 mb-2">/mo</span>
              </div>
              <p className="text-[13px] text-gray-400 mb-6">Billed monthly · cancel anytime</p>
              <ul className="space-y-3 flex-1 mb-8">
                {PRO_PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-gray-700">
                    <Check size={15} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 rounded-xl bg-primary text-center text-[14px] font-semibold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Upgrade to Pro
              </Link>
            </div>
          </StaggerItem>
        </StaggerGrid>

        <FadeUp delay={0.2} className="text-center mt-8">
          <p className="text-[13px] text-gray-400">
            Need more?{" "}
            <a href="mailto:hello@irbforge.com" className="text-primary hover:underline">
              Contact us
            </a>{" "}
            for Enterprise pricing with custom limits and SLA.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── CTA Banner ──────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="bg-gray-50 py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="relative rounded-3xl bg-gray-950 overflow-hidden px-8 py-16 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-96 bg-primary/20 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-[36px] sm:text-[46px] font-bold text-white leading-tight mb-4">
                Ready to build your
                <br />
                <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                  mentorship community?
                </span>
              </h2>
              <p className="text-[17px] text-gray-400 mb-10 max-w-xl mx-auto">
                Join the platform built for serious community leaders. Start free, upgrade when
                you&apos;re ready.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white text-[16px] font-semibold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30"
              >
                Start building for free
                <ArrowRight size={18} />
              </Link>
              <p className="mt-4 text-[13px] text-gray-600">
                Free forever · No credit card · Up and running in 60 seconds
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

function MarketingFooter() {
  return (
    <footer className="bg-gray-950 border-t border-white/6 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-sm bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-[13px]">F</span>
              </div>
              <span className="text-[15px] font-bold text-white">IRB Forge</span>
            </Link>
            <p className="text-[13px] text-gray-600 leading-relaxed max-w-48">
              The platform built for mentorship communities. Build. Connect. Scale.
            </p>
          </div>

          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {title}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[13px] text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-gray-700">
            © {new Date().getFullYear()} IRB Forge. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-800">Built for builders. ✦</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main export ─────────────────────────────────────────────── */

export function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      <MarketingNav />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}
