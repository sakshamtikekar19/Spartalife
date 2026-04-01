import React, { useEffect, useRef, useState } from "react";
import {
  Battery,
  Droplet,
  Dumbbell,
  Package,
  Target,
  UserCheck,
  Utensils,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const facilities = [
  { title: "Fitness Gym", desc: "Hardcore and functional performance training.", type: "performance", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" },
  { title: "Neon Badminton Court", desc: "Premium lighting and tournament-grade play.", type: "performance", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200" },
  { title: "Professional Turf", desc: "Built for football and cricket intensity.", type: "performance", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200" },
  { title: "Aerobics", desc: "Dynamic cardio conditioning for endurance.", type: "performance", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200" },
  { title: "Zumba", desc: "High-energy movement and rhythm-driven workouts.", type: "performance", image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&q=80&w=1200" },
  { title: "Pilates", desc: "Core precision and controlled strength.", type: "performance", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b6?auto=format&fit=crop&q=80&w=1200" },
  { title: "Skin-Friendly Pool", desc: "Advanced filtration for non-irritant swimming.", type: "wellness", image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=1200" },
  { title: "Infrared Sauna", desc: "Deep tissue detox and guided recovery.", type: "wellness", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1200" },
  { title: "Ice Bath", desc: "Cold plunge therapy for rapid restoration.", type: "wellness", image: "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&q=80&w=1200" },
  { title: "Meditation", desc: "Mind-body reset with calm immersive sessions.", type: "wellness", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" },
  { title: "Physiotherapy", desc: "Clinical movement care and rehabilitation.", type: "wellness", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" },
  { title: "Yoga", desc: "Mobility, breathwork, and flexibility training.", type: "wellness", image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=1200" },
  { title: "Massage Therapy", desc: "Targeted muscle release and relaxation.", type: "wellness", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200" },
  { title: "Healthy Cafe", desc: "Post-workout nutrition and curated menu.", type: "wellness", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200" },
  { title: "Banquet Hall", desc: "Lifestyle events in a premium social setting.", type: "wellness", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200" },
];

const topAmenities = [
  {
    title: "AI Fitness Gym",
    desc: "Experience the future of fitness in India's first AI smart gym. We offer a comprehensive training environment where all your fitness needs are met on a single floor.",
  },
  {
    title: "Skin Friendly Pool",
    desc: "95% less chlorine, no tanning, fully indoor. Dive into India's first skin-friendly pool, designed for comfort, safety, and better recovery.",
  },
  {
    title: "Neon Badminton Court",
    desc: "A scientific approach to your goals. Our coaching and match environment are designed to remove guesswork and improve performance consistently.",
  },
];

const eliteProtocolSteps = [
  {
    title: "Blood Report",
    desc: "Science-backed baseline for personalized nutrition.",
    Icon: Droplet,
  },
  {
    title: "Full Body Assessment",
    desc: "Mobility, strength, and posture analysis.",
    Icon: UserCheck,
  },
  {
    title: "Goal Setting",
    desc: "Defining clear, achievable milestones.",
    Icon: Target,
  },
  {
    title: "Workout Plan",
    desc: "Customized high-performance programming.",
    Icon: Dumbbell,
  },
  {
    title: "Diet Plan",
    desc: "Precision macros designed for your specific physiology.",
    Icon: Utensils,
  },
  {
    title: "Meal Subscription",
    desc: "Chef-prepared, nutrient-dense meals delivered to your door.",
    Icon: Package,
  },
  {
    title: "Optimal Recovery Time",
    desc: "Structured rest, sleep tracking, and infrared therapy integration.",
    Icon: Battery,
  },
];

const whyChoose = [
  {
    title: "Youth Development",
    desc: "Structured coaching for kids (6-18 yrs) in football, cricket, and more.",
  },
  {
    title: "Transformation Packages",
    desc: "Specialized packages for weight loss, muscle gain, anti-aging, and pre-wedding transformations.",
  },
  {
    title: "Corporate Wellness",
    desc: "Tailored solutions for employee health and events.",
  },
  {
    title: "Sim-Racing",
    desc: "Visit the first Sim-racing academy in town.",
  },
];

const facilitySlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Softer spacing for higher indices so tail cards (e.g. Meditation → Banquet) do not drift too far apart. */
function stackDepthY(idx, gap) {
  if (idx <= 0) return 0;
  return gap * Math.pow(idx, 0.82);
}

function useStackGap() {
  const [gap, setGap] = useState(32);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setGap(mq.matches ? 46 : 28);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return gap;
}

function StackedCard({ item, idx, total, progress, onSelect, stackGap }) {
  const start = idx / total;
  const end = (idx + 1) / total;
  const local = useTransform(progress, [start, end], [0, 1]);
  const baseY = stackDepthY(idx, stackGap);
  const y = useTransform(local, [0, 1], [baseY, -260 - stackGap]);
  const rotateX = useTransform(local, [0, 1], [0, 11]);
  const opacity = useTransform(local, [0, 0.8, 1], [Math.max(0.12, 1 - idx * 0.095), 0.45, 0]);
  const scale = useTransform(local, [0, 1], [1 - idx * 0.045, 0.82 - idx * 0.012]);

  const accent =
    item.type === "performance"
      ? "border-l-emerald-500/70 shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_20px_50px_-15px_rgba(0,0,0,0.9)]"
      : "border-l-amber-500/55 shadow-[0_0_0_1px_rgba(245,158,11,0.1),0_20px_50px_-15px_rgba(0,0,0,0.9)]";

  return (
    <motion.article
      style={{ y, rotateX, opacity, scale, zIndex: total - idx }}
      className={`absolute inset-0 m-auto h-fit w-full max-w-[min(92vw,700px)] overflow-hidden rounded-2xl border border-white/[0.06] border-l-[3px] bg-gradient-to-br from-zinc-900/95 via-[#0c0c0c] to-black p-6 shadow-2xl backdrop-blur-md md:rounded-3xl md:p-9 lg:max-w-full lg:backdrop-blur-sm will-change-transform lg:left-0 lg:right-auto lg:mx-0 ${accent}`}
    >
      {idx === 0 && (
        <motion.div
          animate={{
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className={`pointer-events-none absolute inset-0 z-0 rounded-3xl ring-1 ring-inset ${
            item.type === "performance" ? "ring-emerald-500/35" : "ring-amber-500/30"
          }`}
        />
      )}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/[0.03] to-transparent" />
      <div className="relative z-10">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500 md:text-xs">
          {item.type === "performance" ? "Performance" : "Wellness / Recovery"}
        </p>
        <h3 className="text-3xl font-black tracking-[-0.07em] text-white drop-shadow-sm md:text-6xl lg:text-7xl">{item.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed tracking-tight text-zinc-400 md:mt-4 md:text-base">
          {item.desc}
        </p>
        <button
          type="button"
          onClick={() => onSelect(item.title)}
          className={`mt-6 rounded-full px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition md:text-xs ${
            item.type === "performance"
              ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]"
              : "border border-amber-500/35 bg-amber-500/10 text-amber-50 hover:bg-amber-500/18 hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]"
          }`}
        >
          View Details
        </button>
      </div>
    </motion.article>
  );
}

function PhotoSlide({ item, idx, total, progress, stackGap }) {
  const start = idx / total;
  const end = (idx + 1) / total;
  const local = useTransform(progress, [start, end], [0, 1]);
  const photoStep = stackGap * 0.38;
  const basePhotoY = stackDepthY(idx, photoStep);
  const y = useTransform(local, [0, 1], [basePhotoY, -190]);
  const x = useTransform(local, [0, 1], [0, 36]);
  const opacity = useTransform(local, [0, 0.8, 1], [Math.max(0.15, 1 - idx * 0.09), 0.5, 0]);
  const scale = useTransform(local, [0, 1], [1 - idx * 0.035, 0.88 - idx * 0.012]);

  return (
    <motion.figure
      style={{ y, x, opacity, scale, zIndex: total - idx }}
      className="absolute inset-0 m-auto isolate h-[420px] w-[280px] overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.95)] ring-1 ring-white/5"
    >
      <img
        src={item.image}
        alt={item.title}
        className="relative z-[1] h-full w-full object-cover brightness-[0.6] contrast-[1.1] saturate-[0.85]"
      />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-black/25" />
      <figcaption className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pb-4 pt-10 text-sm font-semibold tracking-tight text-zinc-100">
        {item.title}
      </figcaption>
    </motion.figure>
  );
}

function ProtocolStepCard({ step, index, activeStep, setActiveStep }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4, margin: "-36% 0px -36% 0px" });
  const isActive = index === activeStep;

  useEffect(() => {
    if (isInView) {
      setActiveStep(index);
    }
  }, [isInView, index, setActiveStep]);

  const Icon = step.Icon;

  return (
    <motion.article
      ref={ref}
      animate={{
        scale: isActive ? 1.04 : 1,
        opacity: isActive ? 1 : 0.22,
      }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className={`relative mx-auto w-full max-w-xl scroll-mt-24 rounded-2xl border border-white/[0.06] border-l-[3px] bg-gradient-to-br from-zinc-900/95 via-[#0c0c0c] to-black p-5 shadow-xl backdrop-blur-xl md:p-6 lg:mx-0 ${
        isActive
          ? "z-10 border-l-emerald-400/80 shadow-[0_0_32px_rgba(16,185,129,0.28),0_16px_40px_-12px_rgba(0,0,0,0.85)] ring-1 ring-emerald-500/20"
          : "z-0 border-l-white/15 ring-1 ring-white/[0.04]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent" />
      <div className="relative flex items-start gap-3 md:gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border md:h-11 md:w-11 ${
            isActive ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-300" : "border-white/10 bg-white/5 text-zinc-500"
          }`}
        >
          <Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-emerald-400/85 md:text-[11px]">
            Step {String(index + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-1.5 text-lg font-black tracking-[-0.05em] text-white md:text-xl">{step.title}</h4>
          <p className="mt-2 text-xs leading-relaxed tracking-tight text-zinc-400 md:text-sm">{step.desc}</p>
        </div>
      </div>
    </motion.article>
  );
}

function WhyChooseCard({ item, index }) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px", amount: 0.2 }}
      transition={{
        duration: 1.05,
        delay: index * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.article
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 7 + index * 0.35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
        className="relative h-full rounded-2xl border border-white/[0.06] border-l-[3px] border-l-amber-500/60 bg-gradient-to-br from-zinc-900/95 via-[#0c0c0c] to-black p-5 shadow-xl backdrop-blur-xl ring-1 ring-amber-500/15 md:p-6"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/[0.04] to-transparent" />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400/90 md:text-[11px]">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-lg font-black tracking-[-0.05em] text-white md:text-xl">{item.title}</h4>
          <p className="mt-2 text-xs leading-relaxed tracking-tight text-zinc-400 md:text-sm">{item.desc}</p>
        </div>
      </motion.article>
    </motion.div>
  );
}

function ElitePerformanceProtocol() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.2", "end 0.75"],
  });

  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const fillWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="elite-performance-protocol"
      className="scroll-mt-24 border-t border-white/10 bg-black py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">Success Map</p>
        <h3 className="mt-4 text-4xl font-black tracking-[-0.06em] text-white md:text-6xl">
          Elite Performance Protocol
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed tracking-tight text-zinc-400 md:text-base">
          From testing to recovery — seven locked-in phases that turn data into execution, and execution into measurable
          evolution.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(220px,300px)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-8 flex items-center gap-4 lg:hidden">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
                  style={{ width: fillWidth }}
                />
              </div>
              <span className="font-black tabular-nums text-3xl tracking-[-0.08em] text-emerald-400 drop-shadow-[0_0_18px_rgba(16,185,129,0.45)]">
                {String(activeStep + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="hidden flex-col items-center gap-8 lg:flex">
              <motion.span
                key={activeStep}
                initial={{ opacity: 0.65, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-7xl font-black tabular-nums tracking-[-0.1em] text-emerald-400 drop-shadow-[0_0_28px_rgba(16,185,129,0.45)] md:text-8xl"
              >
                {String(activeStep + 1).padStart(2, "0")}
              </motion.span>
              <div className="relative h-[min(58vh,420px)] w-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute left-0 right-0 top-0 rounded-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 shadow-[0_0_26px_rgba(16,185,129,0.65)]"
                  style={{ height: fillHeight }}
                />
              </div>
              <p className="max-w-[220px] text-center text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Scroll the protocol
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-5">
            {eliteProtocolSteps.map((step, index) => (
              <ProtocolStepCard
                key={step.title}
                step={step}
                index={index}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const stackGap = useStackGap();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const bgA = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(16,185,129,0.18)", "rgba(16,185,129,0.04)", "rgba(245,158,11,0.18)"]
  );
  const bgB = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(6,8,9,0.9)", "rgba(6,8,9,0.95)", "rgba(10,8,5,0.9)"]
  );
  const mobilePreviewOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.9, 1, 0.9]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(facilities.length - 1, Math.floor(latest * facilities.length));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const handleFacilitySelect = (title) => {
    const sectionId = facilitySlug(title);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="noise-overlay hidden md:block" />

      <section className="relative z-20 flex min-h-[85vh] items-center border-b border-white/10 md:min-h-screen">
        <video
          className="absolute inset-0 h-full w-full object-cover object-[center_55%] sm:object-[center_62%] md:object-[center_60%]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1594737625785-c68f88650967?auto=format&fit=crop&q=80&w=1600"
        >
          <source
            src={`${process.env.PUBLIC_URL}/videos/hero.mp4`}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/25" />
        <motion.div style={{ backgroundColor: bgA }} className="absolute inset-0 opacity-80" />
        <motion.div style={{ backgroundColor: bgB }} className="absolute inset-0 opacity-55" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">
            Sparta Life · The Ultimate Luxury Wellness & Performance Hub
          </p>
          <h1 className="mt-6 text-4xl font-thin tracking-[-0.06em] md:text-8xl">Sparta Life</h1>
          <h2 className="text-4xl font-black tracking-[-0.06em] md:text-8xl">AI Powered Gym</h2>
          <p className="mt-4 max-w-2xl text-sm text-zinc-300 md:mt-6 md:text-base">
            Scroll to walk through every pillar - from neon sport intensity to luxury recovery rituals.
          </p>
        </div>
      </section>

      <section ref={sectionRef} className="relative z-10 h-[700vh] md:h-[900vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <motion.div
            style={{
              background: useTransform(
                scrollYProgress,
                [0, 0.5, 1],
                [
                  "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.24), transparent 50%)",
                  "radial-gradient(circle at 60% 30%, rgba(16,185,129,0.14), transparent 55%)",
                  "radial-gradient(circle at 80% 50%, rgba(245,158,11,0.24), transparent 50%)",
                ]
              ),
            }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 px-2 lg:px-6">
            <div className="mx-auto grid h-full w-full max-w-7xl place-items-center lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
              <div className="relative h-full w-full min-w-0 overflow-hidden lg:pr-1">
                {facilities.map((item, idx) => (
                  <StackedCard
                    key={item.title}
                    item={item}
                    idx={idx}
                    total={facilities.length}
                    progress={scrollYProgress}
                    onSelect={handleFacilitySelect}
                    stackGap={stackGap}
                  />
                ))}
              </div>
              <div className="hidden lg:block" />
            </div>
          </div>
          {isDesktop && (
            <div className="absolute right-6 top-1/2 z-20 hidden h-[440px] w-[300px] -translate-y-1/2 lg:block">
              {facilities.map((item, idx) => (
                <PhotoSlide
                  key={`${item.title}-photo`}
                  item={item}
                  idx={idx}
                  total={facilities.length}
                  progress={scrollYProgress}
                  stackGap={stackGap}
                />
              ))}
            </div>
          )}
          {!isDesktop && (
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 1 : mobilePreviewOpacity,
              }}
              className="absolute bottom-6 left-1/2 w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-xl ring-1 ring-white/5"
            >
              <div className="relative">
                <img
                  src={facilities[activeIndex].image}
                  alt={facilities[activeIndex].title}
                  loading="lazy"
                  className="relative z-[1] block h-auto w-full max-h-[min(42vh,380px)] object-contain object-center brightness-[0.65] contrast-[1.06] saturate-90"
                />
                <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/35 to-black/45" />
              </div>
              <p className="relative z-10 border-t border-white/10 bg-black/90 px-3 py-2.5 text-center text-xs font-semibold tracking-wide text-zinc-100">
                {facilities[activeIndex].title}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-black tracking-[-0.05em]">Book Your Sparta Life Experience</h3>
          <p className="mt-4 text-zinc-300">
            Opposite Shell Petrol Pump, Kolegaon, Khoni (Dombivli East), Thane.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-emerald-500 px-10 py-3 font-semibold text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] transition hover:brightness-110">
              Book a Free Trial Session
            </button>
            <button className="rounded-full border border-white px-10 py-3 font-semibold text-white transition hover:bg-white hover:text-black">
              Enquire for Membership
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">Our Amenities</h3>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Sparta Life offers a complete range of fitness and wellness services designed to help you build strength,
            improve performance, and elevate your lifestyle.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {topAmenities.map((amenity) => (
              <article key={amenity.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-2xl font-bold tracking-[-0.03em]">{amenity.title}</h4>
                <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base">{amenity.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ElitePerformanceProtocol />

      <section className="border-t border-white/10 bg-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">Why Choose Sparta Life?</h3>
          <div className="mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-5">
            {whyChoose.map((item, idx) => (
              <WhyChooseCard key={item.title} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">Facility Details</h3>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Explore every Sparta Life zone with a quick overview of what you get, who it is for, and how it supports your
            performance or recovery journey.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {facilities.map((facility) => (
              <article
                id={facilitySlug(facility.title)}
                key={`${facility.title}-details`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm scroll-mt-24"
              >
                <p
                  className={`text-xs uppercase tracking-[0.2em] ${
                    facility.type === "performance" ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {facility.type === "performance" ? "Performance Zone" : "Wellness / Recovery Zone"}
                </p>
                <h4 className="mt-3 text-2xl font-bold tracking-[-0.03em]">{facility.title}</h4>
                <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base">{facility.desc}</p>
                <p className="mt-4 text-sm text-zinc-400">
                  Includes guided support, premium-grade equipment, and coach-assisted personalization based on your goals.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
