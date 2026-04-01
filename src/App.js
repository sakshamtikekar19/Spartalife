import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

const facilities = [
  { title: "Fitness Gym", desc: "Hardcore and functional performance training.", type: "performance", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" },
  { title: "Neon Badminton Court", desc: "Premium lighting and tournament-grade play.", type: "performance", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200" },
  { title: "Professional Turf", desc: "Built for football and cricket intensity.", type: "performance", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200" },
  { title: "Aerobics", desc: "Dynamic cardio conditioning for endurance.", type: "performance", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200" },
  { title: "Zumba", desc: "High-energy movement and rhythm-driven workouts.", type: "performance", image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&q=80&w=1200" },
  { title: "Pilates", desc: "Core precision and controlled strength.", type: "performance", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b6?auto=format&fit=crop&q=80&w=1200" },
  { title: "Skin-Friendly Pool", desc: "Advanced filtration for non-irritant swimming.", type: "wellness", image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=1200" },
  { title: "Infrared Sauna", desc: "Deep tissue detox and guided recovery.", type: "wellness", image: "https://images.unsplash.com/photo-1628162575403-7d5f8b0f9ca4?auto=format&fit=crop&q=80&w=1200" },
  { title: "Ice Bath", desc: "Cold plunge therapy for rapid restoration.", type: "wellness", image: "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&q=80&w=1200" },
  { title: "Meditation", desc: "Mind-body reset with calm immersive sessions.", type: "wellness", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" },
  { title: "Physiotherapy", desc: "Clinical movement care and rehabilitation.", type: "wellness", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" },
  { title: "Yoga", desc: "Mobility, breathwork, and flexibility training.", type: "wellness", image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=1200" },
  { title: "Massage Therapy", desc: "Targeted muscle release and relaxation.", type: "wellness", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200" },
  { title: "Healthy Cafe", desc: "Post-workout nutrition and curated menu.", type: "wellness", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200" },
  { title: "Banquet Hall", desc: "Lifestyle events in a premium social setting.", type: "wellness", image: "https://images.unsplash.com/photo-1519167758481-83f29c4f14a3?auto=format&fit=crop&q=80&w=1200" },
];

const facilitySlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function StackedCard({ item, idx, total, progress, onSelect }) {
  const start = idx / total;
  const end = (idx + 1) / total;
  const local = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(local, [0, 1], [idx * 10, -220]);
  const rotateX = useTransform(local, [0, 1], [0, 14]);
  const opacity = useTransform(local, [0, 0.8, 1], [1 - idx * 0.07, 0.6, 0]);
  const scale = useTransform(local, [0, 1], [1 - idx * 0.03, 0.88 - idx * 0.01]);

  return (
    <motion.article
      style={{ y, rotateX, opacity, scale, zIndex: total - idx }}
      className="absolute inset-0 m-auto h-fit w-[min(92vw,700px)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm md:rounded-3xl md:p-8 md:backdrop-blur-md will-change-transform lg:left-0 lg:right-auto lg:mx-0"
    >
      {idx === 0 && (
        <motion.div
          animate={{
            opacity: [0.35, 1, 0.35],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className={`pointer-events-none absolute inset-0 z-0 rounded-3xl border ${
            item.type === "performance" ? "border-emerald-400/70" : "border-amber-400/70"
          }`}
        />
      )}
      <div className="relative z-10">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-zinc-300">
          {item.type === "performance" ? "Performance" : "Wellness / Recovery"}
        </p>
        <h3 className="text-3xl font-black tracking-[-0.06em] text-white md:text-7xl">{item.title}</h3>
        <p className="mt-3 max-w-xl text-xs text-zinc-300 md:mt-4 md:text-base">{item.desc}</p>
        <button
          type="button"
          onClick={() => onSelect(item.title)}
          className="mt-5 rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-emerald-300 hover:text-emerald-200 md:text-sm"
        >
          View Details
        </button>
      </div>
    </motion.article>
  );
}

function PhotoSlide({ item, idx, total, progress }) {
  const start = idx / total;
  const end = (idx + 1) / total;
  const local = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(local, [0, 1], [idx * 10, -180]);
  const x = useTransform(local, [0, 1], [0, 40]);
  const opacity = useTransform(local, [0, 0.8, 1], [1 - idx * 0.08, 0.6, 0]);
  const scale = useTransform(local, [0, 1], [1 - idx * 0.025, 0.9 - idx * 0.01]);

  return (
    <motion.figure
      style={{ y, x, opacity, scale, zIndex: total - idx }}
      className="absolute inset-0 m-auto h-[420px] w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl"
    >
      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-zinc-200">
        {item.title}
      </figcaption>
    </motion.figure>
  );
}

function App() {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
          className="absolute inset-0 h-full w-full object-cover object-[center_68%] md:object-[center_60%]"
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
              <div className="relative h-full w-full">
                {facilities.map((item, idx) => (
                  <StackedCard
                    key={item.title}
                    item={item}
                    idx={idx}
                    total={facilities.length}
                    progress={scrollYProgress}
                    onSelect={handleFacilitySelect}
                  />
                ))}
              </div>
              <div className="hidden lg:block" />
            </div>
          </div>
          {isDesktop && (
            <div className="absolute right-6 top-1/2 hidden h-[440px] w-[300px] -translate-y-1/2 lg:block">
              {facilities.map((item, idx) => (
                <PhotoSlide key={`${item.title}-photo`} item={item} idx={idx} total={facilities.length} progress={scrollYProgress} />
              ))}
            </div>
          )}
          {!isDesktop && (
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 1 : mobilePreviewOpacity,
              }}
              className="absolute bottom-6 left-1/2 w-[88vw] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            >
              <img
                src={facilities[activeIndex].image}
                alt={facilities[activeIndex].title}
                loading="lazy"
                className="h-36 w-full object-cover"
              />
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
