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
  Quote,
} from "lucide-react";
import {
  SiSlack,
  SiDiscord,
  SiNotion,
  SiStripe,
  SiMailchimp,
  SiAirtable,
  SiCalendly,
} from "react-icons/si";
import {
  PRO_PRICE,
  PRO_ORIGINAL_PRICE,
  PRO_DISCOUNT_PCT,
  formatNaira,
} from "@/entities/subscription";
import { Logo, LogoMark } from "@/shared/ui/logo";

/* ── Animation helpers ───────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
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
        className="absolute inset-0 bg-[#0d0b14]/95 backdrop-blur-md border-b border-white/8"
        style={{ opacity: bgOpacity }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo variant="light" markSize={24} />
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
            className="md:hidden bg-[#0d0b14]/98 backdrop-blur-md border-b border-white/8 px-4 pb-5 space-y-1"
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
      <div className="absolute inset-0 bg-primary/20 blur-3xl scale-90 -z-10" />
      <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0d0b14] border-b border-white/5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <div className="ml-3 h-5 flex-1 bg-white/5 rounded max-w-52 flex items-center px-2.5 gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="h-1.5 w-24 bg-white/15 rounded" />
          </div>
        </div>
        <div className="flex h-72">
          <div className="w-36 bg-[#0d0b14] border-r border-white/5 p-2.5 flex flex-col gap-0.5 shrink-0">
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <LogoMark size={16} />
              <div className="h-2 w-14 bg-white/25 rounded" />
            </div>
            {[
              { active: true },
              { active: false },
              { active: false },
              { active: false },
              { active: false },
            ].map(({ active }, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${active ? "bg-primary/20" : ""}`}
              >
                <div
                  className={`h-3 w-3 rounded-sm shrink-0 ${active ? "bg-primary/80" : "bg-white/15"}`}
                />
                <div className={`h-2 w-14 rounded ${active ? "bg-primary/40" : "bg-white/10"}`} />
              </div>
            ))}
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-32 bg-white/25 rounded" />
              <div className="h-3 w-3 bg-white/10 rounded" />
            </div>
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
            <div className="space-y-2">
              {[
                {
                  statusColor: "bg-emerald-500/20 text-emerald-400",
                  status: "active",
                  nameW: "w-28",
                },
                { statusColor: "bg-gray-500/20 text-gray-400", status: "draft", nameW: "w-36" },
                {
                  statusColor: "bg-emerald-500/20 text-emerald-400",
                  status: "active",
                  nameW: "w-24",
                },
              ].map(({ statusColor, status, nameW }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-2.5 py-2 bg-white/4 rounded-lg border border-white/5"
                >
                  <div className="h-6 w-6 rounded-lg bg-primary/20 shrink-0 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 bg-primary/60 rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className={`h-2 ${nameW} bg-white/25 rounded`} />
                    <div className="h-1.5 w-16 bg-white/10 rounded" />
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

const COMMUNITY_TYPES = [
  "Coding bootcamps",
  "Alumni networks",
  "Startup incubators",
  // "Dev communities",
  "Mentorship circles",
];

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0d0b14] overflow-hidden pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-24 left-1/4 h-[700px] w-[700px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute top-40 right-0 h-[280px] w-[280px] bg-amber-600/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[180px] w-[350px] bg-violet-800/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0d0b14] to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 lg:py-36 w-full">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.h1
              variants={fadeUp}
              className="text-[40px] sm:text-[50px] lg:text-[54px] font-bold text-white leading-[1.1] tracking-tight mb-5"
            >
              Your community <br /> deserves better than <br />
              <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                six browser tabs.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[16px] text-gray-400 max-w-lg mb-5 leading-relaxed"
            >
              IRB Forge brings org management, cohort programs, member invitations, and payments
              into one place your whole team can actually use.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5 mb-8">
              {COMMUNITY_TYPES.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full border border-white/8 bg-white/[0.03] text-gray-500 text-[11px] font-medium hover:bg-white/10 transition-colors"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-5">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-[15px] font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Start building — it&apos;s free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/12 text-gray-300 text-[15px] font-medium hover:bg-white/5 transition-colors"
              >
                Already have an account
              </Link>
            </motion.div>

            {/* <motion.p variants={fadeUp} className="text-[12px] text-gray-600">
              Takes about 60 seconds to set up. Seriously.
            </motion.p> */}
          </motion.div>

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

/* ── Problem section ─────────────────────────────────────────── */

const TOOLS = [
  { name: "Slack", Icon: SiSlack, color: "#E01E5A" },
  { name: "Discord", Icon: SiDiscord, color: "#5865F2" },
  { name: "Notion", Icon: SiNotion, color: "#FFFFFF" },
  { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
  { name: "Mailchimp", Icon: SiMailchimp, color: "#FFE01B" },
  { name: "Airtable", Icon: SiAirtable, color: "#18BFFF" },
  { name: "Calendly", Icon: SiCalendly, color: "#006BFF" },
];

function ProblemSection() {
  return (
    <section className="bg-[#0d0b14] border-t border-white/6 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-[13px] text-gray-500 uppercase tracking-widest font-medium mb-4">
            Sound familiar?
          </p>
          <p className="text-[26px] sm:text-[30px] font-semibold text-white leading-snug">
            &ldquo;It&apos;s 11pm on a Sunday. Your cohort starts Monday. You&apos;ve got six tabs
            open and a spreadsheet you&apos;re not proud of.&rdquo;
          </p>
          <p className="text-[16px] text-gray-500 mt-4">
            We built IRB Forge because we lived that Sunday night too.
          </p>
        </FadeUp>

        <div className="mb-12 overflow-hidden marquee-fade">
          <div className="flex gap-3 w-max marquee-track">
            {[...TOOLS, ...TOOLS].map(({ name, Icon, color }, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/3 shrink-0"
              >
                <Icon size={15} style={{ color }} className="shrink-0" />
                <span className="text-[13px] font-medium text-gray-400 hover:text-gray-100">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <FadeUp delay={0.1}>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-white/10" />
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10">
              <span className="text-[14px] font-semibold text-primary">
                IRB Forge is the one app that replaces all of this
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
    title: "One home. However many communities.",
    description:
      "Each org is fully isolated — its own members, programs, and billing. Run three communities without your brain running three separate mental loops.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Everyone knows what they’re here to do.",
    description:
      "Owners own. Admins admin. Mentors mentor. Members show up and learn. No one accidentally clicks the wrong button or lands in the wrong place.",
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: BookOpen,
    title: "Cohorts that don’t fall apart.",
    description:
      "Create a program, open enrollment, track who’s active, mark completions. The whole program lifecycle — one screen, no spreadsheet.",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Mail,
    title: "Inviting people shouldn’t be a project.",
    description:
      "Type an email, pick a role, hit send. They get a proper invitation, click accept, and they’re in with the right permissions. That’s it.",
    color: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: CreditCard,
    title: "Get paid without the chaos.",
    description:
      "Set up Stripe, set your price, let members pay. You’ll know who’s current and who isn’t — without checking three different places to find out.",
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: Megaphone,
    title: "Say something. Reach everyone.",
    description:
      "Send an update to your entire org without a mailing list, a pinned Discord message, or hoping people check Notion. Just send it.",
    color: "bg-indigo-500/10 text-indigo-400",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-[#fafaf8] py-24 sm:py-32 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            What you get
          </p>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-gray-950 leading-tight mb-4">
            The tools you actually wanted.
            <br className="hidden sm:block" />
            <span className="text-gray-500">Built the way they should have been.</span>
          </h2>
          <p className="text-[17px] text-gray-500 max-w-xl mx-auto">
            No integrations. No workarounds. Just one product that handles the full lifecycle of
            your community.
          </p>
        </FadeUp>

        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <StaggerItem key={title}>
              <div className="group p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default h-full">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-950 mb-2 leading-snug">
                  {title}
                </h3>
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
    title: "Spin up your org in 90 seconds",
    description:
      "Not 90 minutes. Give it a name, write a sentence about it, and you’re already inside the dashboard. It’s genuinely that fast.",
  },
  {
    step: "02",
    icon: Users,
    title: "Invite your people properly",
    description:
      "Send a real email invitation. Your mentors, admins, and members each land in the right role automatically. No onboarding doc required.",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Run your programs and go to bed on time",
    description:
      "Launch cohorts, track who enrolled, collect payments, send updates. IRB Forge handles the admin so you can handle the community.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#f4f2ec] py-24 sm:py-32 border-t border-gray-200/60 scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-gray-950 leading-tight">
            Simple enough to explain
            <br className="hidden sm:block" /> in one conversation.
          </h2>
        </FadeUp>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-primary/15 via-primary/35 to-primary/15" />
          <StaggerGrid className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map(({ step, icon: Icon, title, description }) => (
              <StaggerItem key={step}>
                <div className="text-center lg:text-left">
                  <div className="inline-flex lg:flex items-center justify-center lg:justify-start gap-3 mb-5">
                    <div className="relative h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/25">
                      <Icon size={22} className="text-white" strokeWidth={1.8} />
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white border-2 border-primary text-primary text-[10px] font-bold flex items-center justify-center">
                        {step.slice(1)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[18px] font-semibold text-gray-950 mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    quote:
      "I used to spend my Sunday nights updating three spreadsheets and sending manual welcome emails. Now I actually rest on Sundays. That alone was worth it.",
    name: "Amara O.",
    role: "Founder, Dev Mentorship Nigeria",
    initials: "AO",
    color: "bg-violet-500",
  },
  {
    quote:
      "Finally — my mentors can actually mentor instead of answering ‘how do I join the program?’ every Monday morning. The invitation flow alone changed everything.",
    name: "Tunde B.",
    role: "Tech Community Lead, Lagos",
    initials: "TB",
    color: "bg-primary",
  },
  {
    quote:
      "We enrolled 40 members in our last cohort. Zero emails back-and-forth. Zero Stripe dashboard confusion. I genuinely don’t know what I did before this.",
    name: "Kemi A.",
    role: "Women in Tech, Abuja",
    initials: "KA",
    color: "bg-emerald-600",
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-white py-24 sm:py-32 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            From the community
          </p>
          <h2 className="text-[34px] sm:text-[42px] font-bold text-gray-950 leading-tight">
            Real people. Real communities.
            <br className="hidden sm:block" />
            <span className="text-gray-400">Real Sunday nights reclaimed.</span>
          </h2>
        </FadeUp>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, initials, color }) => (
            <StaggerItem key={name}>
              <div className="group p-7 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                <Quote size={20} className="text-primary/30 mb-4 shrink-0" />
                <p className="text-[15px] text-gray-700 leading-relaxed flex-1 mb-6">{quote}</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-full ${color} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white text-[12px] font-bold">{initials}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{name}</p>
                    <p className="text-[12px] text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

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
    <section
      id="pricing"
      className="bg-[#fafaf8] py-24 sm:py-32 border-t border-gray-200/60 scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-gray-950 leading-tight mb-4">
            Honest pricing. No games.
          </h2>
          <p className="text-[17px] text-gray-500 max-w-xl mx-auto">
            Start free. Upgrade when your community grows and you&apos;re ready to scale it
            properly. Cancel anytime — no awkward emails required.
          </p>
        </FadeUp>

        <StaggerGrid className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <StaggerItem>
            <div className="p-8 rounded-2xl border border-gray-200 bg-white h-full flex flex-col">
              <p className="text-[15px] font-semibold text-gray-950 mb-1">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[42px] font-bold text-gray-950 leading-none">₦0</span>
              </div>
              <p className="text-[13px] text-gray-400 mb-6">No card. No catch. Seriously.</p>
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
                className="block w-full py-3 rounded-xl border border-gray-200 text-center text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Start for free
              </Link>
            </div>
          </StaggerItem>

          {/* Pro */}
          <StaggerItem>
            <div className="relative p-8 rounded-2xl border-2 border-primary bg-primary/[0.015] h-full flex flex-col shadow-xl shadow-primary/8">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="px-4 py-1 rounded-full bg-amber-500 text-white text-[12px] font-semibold whitespace-nowrap">
                  🎉 Launch offer — {PRO_DISCOUNT_PCT}% off
                </span>
              </div>
              <p className="text-[15px] font-semibold text-gray-950 mb-1">Pro</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[15px] text-gray-400 line-through">
                  {formatNaira(PRO_ORIGINAL_PRICE)}
                </span>
                <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Save {formatNaira(PRO_ORIGINAL_PRICE - PRO_PRICE)}
                </span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[42px] font-bold text-gray-950 leading-none">
                  {formatNaira(PRO_PRICE)}
                </span>
                <span className="text-[15px] text-gray-400 mb-2">/mo</span>
              </div>
              <p className="text-[13px] text-gray-400 mb-6">Billed monthly · cancel any time</p>
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
                className="block w-full py-3 rounded-xl bg-primary text-center text-[14px] font-semibold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Upgrade to Pro
              </Link>
            </div>
          </StaggerItem>
        </StaggerGrid>

        <FadeUp delay={0.2} className="text-center mt-8">
          <p className="text-[13px] text-gray-400">
            Running a bigger operation?{" "}
            <a href="mailto:hello@irbforge.com" className="text-primary hover:underline">
              Let&apos;s talk
            </a>{" "}
            about what you need. We don&apos;t bite.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="bg-[#f4f2ec] py-24 border-t border-gray-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="relative rounded-3xl bg-[#0d0b14] overflow-hidden px-8 py-16 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-96 bg-primary/15 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 h-32 w-64 bg-violet-600/10 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <p className="text-[13px] font-semibold text-primary/70 uppercase tracking-widest mb-4">
                You&apos;ve been running on duct tape long enough
              </p>
              <h2 className="text-[34px] sm:text-[44px] font-bold text-white leading-tight mb-4">
                Your next cohort could run itself.
                <br />
                <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                  Let&apos;s make that happen.
                </span>
              </h2>
              <p className="text-[17px] text-gray-400 mb-10 max-w-xl mx-auto">
                Start free. Bring your team. Launch your first program. Come back and tell us how
                the Sunday night felt.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white text-[16px] font-semibold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/25"
              >
                Build your community — it&apos;s free
                <ArrowRight size={18} />
              </Link>
              <p className="mt-4 text-[13px] text-gray-600">
                No card. No contract. Just your community, finally in one place.
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
    <footer className="bg-[#0d0b14] border-t border-white/6 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo variant="light" markSize={24} />
            </Link>
            <p className="text-[13px] text-gray-600 leading-relaxed max-w-44">
              Built by someone who got tired of the six-tab Sunday night. Here for you.
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
          <p className="text-[12px] text-gray-800">
            Made with genuine care for community builders. ✦
          </p>
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
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}
