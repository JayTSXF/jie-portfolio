import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, FileText, ExternalLink, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const EMAIL = 'jhuang09@villanova.edu';
const LINKEDIN = 'https://www.linkedin.com/in/jie-huang-nb';
const GITHUB = 'https://github.com/JayTSXF';

// EmailJS keys are public by design (they are visible in any browser build).
// The real protection is the domain allowlist in your EmailJS dashboard:
// Account -> Security -> "Allowed origins". Add jaytsxf.github.io there.
const EMAILJS = {
  serviceId: 'service_8tq8xjl',
  templateId: 'template_gz4s5ue',
  publicKey: 'uvWiNhqJbdHLFIU5T',
};

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const SKILL_GROUPS = [
  {
    label: 'Languages',
    items: [
      { name: 'Python', icon: `${DEVICON}/python/python-original.svg` },
      { name: 'R', icon: `${DEVICON}/r/r-original.svg` },
      { name: 'SQL', icon: `${DEVICON}/mysql/mysql-original.svg` },
      { name: 'Java', icon: `${DEVICON}/java/java-original.svg` },
      { name: 'C', icon: `${DEVICON}/c/c-original.svg` },
      { name: 'C#', icon: `${DEVICON}/csharp/csharp-original.svg` },
      { name: 'JavaScript', icon: `${DEVICON}/javascript/javascript-original.svg` },
      { name: 'HTML', icon: `${DEVICON}/html5/html5-original.svg` },
      { name: 'CSS', icon: `${DEVICON}/css3/css3-original.svg` },
    ],
  },
  {
    label: 'Frameworks & Runtime',
    items: [
      { name: 'React', icon: `${DEVICON}/react/react-original.svg` },
      { name: 'Node.js', icon: `${DEVICON}/nodejs/nodejs-original.svg` },
    ],
  },
  {
    label: 'Data & Cloud',
    items: [
      { name: 'MongoDB', icon: `${DEVICON}/mongodb/mongodb-original.svg` },
      { name: 'Firebase', icon: `${DEVICON}/firebase/firebase-plain.svg` },
      { name: 'Supabase', icon: `${DEVICON}/supabase/supabase-original.svg` },
      { name: 'AWS', icon: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
    ],
  },
  {
    label: 'Platforms & Tools',
    items: [
      { name: 'Salesforce', icon: `${DEVICON}/salesforce/salesforce-original.svg` },
      { name: 'Airtable', icon: null }, // no devicon asset -> text tile
      { name: 'Zapier', icon: null }, // no devicon asset -> text tile
      { name: 'RStudio', icon: `${DEVICON}/rstudio/rstudio-original.svg` },
      { name: 'VS Code', icon: `${DEVICON}/vscode/vscode-original.svg` },
      { name: 'Git', icon: `${DEVICON}/git/git-original.svg` },
      { name: 'Linux', icon: `${DEVICON}/linux/linux-original.svg` },
      { name: 'Excel', icon: null },
    ],
  },
];

const EDUCATION = [
  {
    school: 'Villanova University',
    degree: 'M.S. Applied Statistics and Data Science',
    location: 'Villanova, PA',
    period: 'Expected May 2028',
    note: 'In progress',
  },
  {
    school: 'Temple University',
    degree: 'B.S. Computer Science and Data Science',
    location: 'Philadelphia, PA',
    period: 'May 2025',
    note: 'GPA 3.52',
  },
];

const EXPERIENCES = [
  {
    period: 'May 2026 – Aug 2026',
    title: 'Technologist in Residence',
    company: 'Philly AI Lab',
    location: 'Philadelphia, PA',
    points: [
      'Built a full-stack AI CRM that captures contacts from voice, images, PDFs, and QR codes',
      'Developed AI search across 5,000+ contacts using keyword retrieval with LLM reranking',
      'Integrated Groq, Gemini, Airtable, PDL, and Clerk APIs for automated contact management',
    ],
    tags: ['Full-Stack', 'LLM', 'Groq', 'Gemini', 'Airtable API', 'Clerk'],
  },
  {
    period: 'May 2024 – Aug 2024',
    title: 'IT Intern',
    company: 'The Welcoming Center for New Pennsylvanians',
    location: 'Philadelphia, PA',
    link: 'https://www.linkedin.com/posts/jie-huang-nb_last-week-i-finished-my-internship-at-the-activity-7232550885933957120-nPaW',
    points: [
      'Extracted 100+ survey and 400+ collector records from SurveyMonkey via Python and Zapier',
      'Structured Salesforce objects and tables to organize survey data through API integration',
      'Wrote SOQL queries and APEX trigger handlers to strengthen Salesforce data integration for ESOL',
    ],
    tags: ['Python', 'Zapier', 'Salesforce', 'SOQL', 'APEX'],
  },
  {
    period: 'Jan 2024 – Apr 2024',
    title: 'Database Intern',
    company: 'Philadelphia Chinatown Development Corporation',
    location: 'Philadelphia, PA',
    points: [
      'Supported the VITA team during tax season by diagnosing database issues and resolving inquiries',
      'Optimized Airtable automation workflows and refined trigger conditions for reliable data processing',
      'Redesigned database schema and UI to streamline client verification and tax preparation',
    ],
    tags: ['Airtable', 'Database Design', 'Automation'],
  },
  {
    period: 'Jun 2023 – Aug 2023',
    title: 'Database Assistant Intern',
    company: 'Philadelphia Chinatown Development Corporation',
    location: 'Philadelphia, PA',
    points: [
      'Architected relational schemas and configured Airtable automation workflows for VITA databases',
      'Linked tables via primary/foreign keys and improved reporting efficiency through data matching',
      'Secured tax records for 600+ clients using conditional trigger filters and intake form design',
    ],
    tags: ['Airtable', 'Relational Schema', 'Data Integrity'],
  },
];

const PROJECTS = [
  {
    period: 'Jul 2026 – Aug 2026',
    title: 'Massachusetts Health Care Access Analysis',
    type: 'Independent Research',
    location: 'Philadelphia, PA',
    link: null, // TODO: add a GitHub repo or write-up link when available
    points: [
      'Analyzed 457 Massachusetts ZCTAs in R to evaluate language barriers and healthcare access',
      'Combined CDC and ACS datasets through APIs while resolving Census data anomalies',
      'Found strong correlations between uninsurance and limited English proficiency across income groups',
    ],
    tags: ['R', 'CDC PLACES', 'ACS / Census API', 'Statistical Analysis'],
  },
  {
    period: 'Jul 2025 – Oct 2025',
    title: 'Smart MathCalc',
    type: 'Chrome Extension',
    location: 'Philadelphia, PA',
    link: 'https://chromewebstore.google.com/detail/smart-mathcalc/ecjmjnemmpkadompcmmkakcmciibopoc',
    points: [
      'Detects math content on any webpage through regex matching and surfaces a floating calculator',
      'Integrated the WolframAlpha API for arithmetic, algebra, calculus, and linear algebra queries',
      'Built a draggable UI with 50+ function buttons and debounced MutationObserver DOM monitoring',
    ],
    tags: ['JavaScript', 'Chrome API', 'WolframAlpha API'],
  },
  {
    period: 'Jan 2025 – May 2025',
    title: 'Lux AI',
    type: 'Kaggle Competition',
    location: 'Philadelphia, PA',
    link: 'https://github.com/JayTSXF/Lux-AI',
    points: [
      'Trained a PPO reinforcement learning agent for Lux AI Season 3 under partial observability',
      'Designed custom reward shaping and observation masking to stabilize early-iteration training',
      'Ran thousands of episodes on a cloud VM using JAX and Flax for parallel environment simulation',
    ],
    tags: ['Python', 'Reinforcement Learning', 'PPO', 'JAX', 'Flax'],
  },
  {
    period: 'Oct 2024 – Dec 2024',
    title: 'Grind Daily',
    type: 'Web Application',
    location: 'Philadelphia, PA',
    link: 'https://grinddaily.onrender.com/',
    points: [
      'Designed the MongoDB schema behind user data storage and retrieval for the whole application',
      'Built the "Forgot Password" flow with EmailJS to automate verification and password resets',
      'Implemented the "Friend" feature backend in Node.js for requests, accepts, declines, and lookups',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'EmailJS'],
  },
  {
    period: 'Jan 2024 – May 2024',
    title: 'NLP for Disaster Tweets',
    type: 'Machine Learning Model',
    location: 'Philadelphia, PA',
    link: 'https://github.com/AndyWang506/NLP-for-Disaster-Tweet',
    points: [
      'Classified tweets as disaster-related or not to speed up triage of emergency information',
      'Preprocessed and normalized text with TF-IDF to improve downstream model accuracy',
      'Compared k-NN, Logistic Regression, and k-means to evaluate accuracy across data conditions',
    ],
    tags: ['Python', 'Machine Learning', 'NLP', 'TF-IDF', 'scikit-learn'],
  },
];

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

/* ------------------------------------------------------------------ */
/*  Background canvas                                                  */
/* ------------------------------------------------------------------ */

const CURVES = [
  { name: 'Normal Distribution', fn: (x) => Math.exp(-Math.pow(x - 0.5, 2) / (2 * 0.15 * 0.15)) },
  { name: 'Exponential Decay', fn: (x) => Math.exp(-x * 3) },
  { name: 'Sigmoid', fn: (x) => 1 / (1 + Math.exp(-12 * (x - 0.5))) },
  { name: 'Exponential Growth', fn: (x) => Math.exp(x * 3) / Math.exp(3) },
  { name: 'Logarithmic', fn: (x) => (x > 0 ? Math.log(x * 10 + 1) / Math.log(11) : 0) },
  { name: 'Polynomial Cubic', fn: (x) => Math.pow(x, 3) },
  { name: 'Sine Wave', fn: (x) => 0.5 + 0.4 * Math.sin(x * Math.PI * 4) },
  { name: 'Damped Oscillation', fn: (x) => Math.exp(-x * 2) * Math.cos(x * Math.PI * 6) * 0.5 + 0.5 },
];

const MARGIN = 0.15;
const NEG_RATIO = 0.15;
const NUM_POINTS = 100;
const DRAW_MS = 2200;
const HOLD_MS = 1000;
const ERASE_MS = 1500;

function useCurveCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let geo = null;
    let rafId = null;
    let lastTs = null;
    let elapsed = 0;
    let phase = 'drawing';
    let curveIndex = 0;
    let points = generatePoints(CURVES[0].fn);

    function generatePoints(fn) {
      const out = [];
      for (let i = 0; i <= NUM_POINTS; i++) {
        const x = i / NUM_POINTS;
        out.push({ x, y: fn(x) });
      }
      return out;
    }

    // Recomputes BOTH the backing-store size (with devicePixelRatio) and the
    // chart geometry. The old version only resized the canvas, so the axes and
    // curve stayed at their original coordinates after a window resize.
    function computeGeometry() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const chartWidth = cssW * 0.7;
      const chartHeight = cssH * 0.7;
      geo = {
        cssW,
        cssH,
        chartWidth,
        chartHeight,
        originX: cssW * MARGIN + chartWidth * NEG_RATIO,
        originY: cssH * (1 - MARGIN) - chartHeight * NEG_RATIO,
      };
    }

    function drawAxes() {
      const { chartWidth, chartHeight, originX, originY } = geo;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 2;

      const negLen = chartWidth * NEG_RATIO;
      const xRight = originX + chartWidth * (1 - NEG_RATIO);
      const yTop = originY - chartHeight * (1 - NEG_RATIO);

      ctx.beginPath();
      ctx.moveTo(originX - negLen, originY);
      ctx.lineTo(xRight, originY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(xRight, originY);
      ctx.lineTo(xRight - 10, originY - 5);
      ctx.lineTo(xRight - 10, originY + 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(originX, originY + negLen);
      ctx.lineTo(originX, yTop);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX, yTop);
      ctx.lineTo(originX - 5, yTop + 10);
      ctx.lineTo(originX + 5, yTop + 10);
      ctx.closePath();
      ctx.fill();
    }

    function drawCurve(from, to) {
      if (to <= from) return;
      const { chartWidth, chartHeight, originX, originY } = geo;
      const slice = points.slice(
        Math.floor(from * points.length),
        Math.ceil(to * points.length)
      );
      if (slice.length < 2) return;

      const w = chartWidth * (1 - NEG_RATIO);
      const h = chartHeight * (1 - NEG_RATIO);
      const px = (p) => originX + p.x * w;
      const py = (p) => originY - p.y * h;

      ctx.beginPath();
      ctx.moveTo(px(slice[0]), originY);
      slice.forEach((p) => ctx.lineTo(px(p), py(p)));
      ctx.lineTo(px(slice[slice.length - 1]), originY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(px(slice[0]), py(slice[0]));
      slice.forEach((p) => ctx.lineTo(px(p), py(p)));
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    function clear() {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, geo.cssW, geo.cssH);
    }

    function renderStatic() {
      clear();
      drawAxes();
      drawCurve(0, 1);
    }

    // Time-based rather than frame-count based. The old `holdTime = 60` assumed
    // 60fps, so the whole animation ran at double speed on a 120Hz display.
    function frame(now) {
      const dt = lastTs === null ? 0 : Math.min(now - lastTs, 50);
      lastTs = now;
      elapsed += dt;

      clear();
      drawAxes();

      if (phase === 'drawing') {
        const t = Math.min(elapsed / DRAW_MS, 1);
        drawCurve(0, t);
        if (t >= 1) {
          phase = 'holding';
          elapsed = 0;
        }
      } else if (phase === 'holding') {
        drawCurve(0, 1);
        if (elapsed >= HOLD_MS) {
          phase = 'erasing';
          elapsed = 0;
        }
      } else {
        const t = Math.min(elapsed / ERASE_MS, 1);
        drawCurve(t, 1);
        if (t >= 1) {
          curveIndex = (curveIndex + 1) % CURVES.length;
          points = generatePoints(CURVES[curveIndex].fn);
          phase = 'drawing';
          elapsed = 0;
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (rafId !== null || motionQuery.matches) return;
      lastTs = null;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Don't burn battery repainting a full-screen canvas in a hidden tab.
    const handleVisibility = () => (document.hidden ? stop() : start());

    const handleResize = () => {
      computeGeometry();
      if (motionQuery.matches) renderStatic();
    };

    const handleMotionChange = () => {
      stop();
      if (motionQuery.matches) renderStatic();
      else start();
    };

    computeGeometry();
    if (motionQuery.matches) renderStatic();
    else start();

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotionChange);

    // The original effect never cancelled its rAF loop, so React StrictMode's
    // double-invoke left two loops fighting over the same canvas in dev.
    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [canvasRef]);
}

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */

function SkillTile({ name, icon }) {
  const [failed, setFailed] = useState(false);
  const showImage = icon && !failed;
  return (
    <div className="flex flex-col items-center w-24">
      <div className="w-20 h-20 bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-cyan-500/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/40 hover:border-cyan-400 flex items-center justify-center">
        {showImage ? (
          <img
            src={icon}
            alt=""
            loading="lazy"
            width="56"
            height="56"
            className="w-full h-full object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          // Fallback for skills with no icon asset, and for CDN failures.
          <span className="text-cyan-300 font-semibold text-sm text-center leading-tight">
            {name}
          </span>
        )}
      </div>
      <p className="mt-3 text-slate-300 font-medium text-sm text-center">{name}</p>
    </div>
  );
}

function TimelineCard({ heading, link, title, meta, location, points, tags }) {
  const Tag = link ? 'a' : 'div';
  const linkProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag
      {...linkProps}
      className={`group block bg-slate-800/20 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20 transition-all duration-300 hover:border-cyan-400/50 ${
        link ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-1 mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-cyan-300">{heading}</h3>
          {link && (
            <ExternalLink
              size={16}
              aria-hidden="true"
              className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>
        <p className="text-cyan-400 text-sm">{location}</p>
      </div>
      <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-1 mb-3">
        <h4 className="text-base font-bold text-cyan-100">{title}</h4>
        <p className="text-cyan-400 text-sm">{meta}</p>
      </div>
      <ul className="space-y-2 mb-4">
        {points.map((point, i) => (
          <li key={i} className="text-slate-200 text-sm flex items-start">
            <span className="text-cyan-400 mr-2 mt-1" aria-hidden="true">
              •
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-cyan-500/10 text-cyan-200 rounded-full text-xs border border-cyan-400/30 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </Tag>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-4xl font-bold text-center mb-14 text-white drop-shadow-lg">
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Portfolio() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '', // honeypot, hidden from humans
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }
  const canvasRef = useRef(null);

  useCurveCanvas(canvasRef);

  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.website) return; // bot filled the honeypot
    if (sending) return;

    setStatus(null);
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
        },
        EMAILJS.publicKey
      );
      setStatus({ type: 'success', text: 'Thanks — your message is on its way. I usually reply within a couple of days.' });
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      console.error('EmailJS send failed:', error);
      setStatus({
        type: 'error',
        text: `Something went wrong. Please email me directly at ${EMAIL}.`,
      });
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    'w-full px-6 py-4 bg-slate-800/50 text-white rounded-lg border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-slate-400 backdrop-blur-sm disabled:opacity-60';

  return (
    // overflow-x-hidden instead of overflow-hidden: the latter silently breaks
    // position:sticky for every descendant.
    <div className="min-h-screen text-white overflow-x-hidden relative bg-black">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-900 focus:rounded-lg"
      >
        Skip to content
      </a>

      <header className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <a href="#top" className="text-2xl font-bold text-cyan-400 shrink-0">
            JH
          </a>

          <nav aria-label="Sections" className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-200 hover:text-cyan-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5 shrink-0">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="hover:text-cyan-400 transition-colors"
            >
              <Linkedin size={22} aria-hidden="true" />
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="hover:text-cyan-400 transition-colors"
            >
              <Github size={22} aria-hidden="true" />
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Résumé (PDF)"
              className="hover:text-cyan-400 transition-colors"
            >
              <FileText size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="relative z-10">
        {/* Hero */}
        <section id="top" className="min-h-screen flex items-center px-6 pt-28 pb-16">
          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <p className="text-cyan-400 text-lg mb-3">Hello, I am</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
                Jie Huang
              </h1>
              <h2 className="text-2xl md:text-3xl text-cyan-300 mb-6 font-light">
                Data Science &amp; Applied Statistics
              </h2>

              <p className="text-slate-200 text-base leading-relaxed max-w-xl mb-6">
                I turn messy public and organizational data into things people can act on —
                from healthcare access across 457 Massachusetts ZIP code areas, to AI search
                over a 5,000-contact CRM. Currently pursuing an M.S. in Applied Statistics
                and Data Science at Villanova.
              </p>

              <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-slate-300 mb-8">
                <span className="px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10">
                  Philadelphia, PA
                </span>
                <span className="px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10">
                  M.S. Villanova &apos;28
                </span>
                <span className="px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10">
                  B.S. Temple &apos;25
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
                >
                  <Mail size={18} aria-hidden="true" />
                  Email me
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 font-semibold rounded-lg transition-colors"
                >
                  <FileText size={18} aria-hidden="true" />
                  View résumé
                </a>
              </div>
            </div>

            <div className="flex justify-center order-first md:order-last">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-cyan-400 overflow-hidden shadow-2xl shadow-cyan-500/40">
                <picture>
                  <source
                    srcSet={`${import.meta.env.BASE_URL}profile.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}profile.jpg`}
                    alt="Jie Huang"
                    width="320"
                    height="320"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading>About</SectionHeading>
            <div className="space-y-5 text-slate-200 leading-relaxed">
              <p>
                I immigrated from China to the U.S. during high school. Learning to navigate
                a new language while keeping up in math and science taught me that technology
                is one of the few things that translates cleanly across cultures — and it is
                why I keep gravitating toward work where data serves people who are easy to
                overlook.
              </p>
              <p>
                That thread runs through most of what I have built: tax database systems for
                600+ VITA clients in Philadelphia Chinatown, Salesforce pipelines for an
                immigrant workforce nonprofit, and a study of how limited English proficiency
                predicts uninsurance across Massachusetts. I work in both Chinese and English,
                which has been less a line on a résumé than a practical requirement of
                every one of those projects.
              </p>
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-6">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.school}
                  className="bg-slate-800/20 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20"
                >
                  <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-1 mb-1">
                    <h3 className="text-lg font-semibold text-cyan-300">{edu.school}</h3>
                    <p className="text-cyan-400 text-sm">{edu.location}</p>
                  </div>
                  <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-1">
                    <h4 className="text-base font-bold text-cyan-100">{edu.degree}</h4>
                    <p className="text-cyan-400 text-sm">{edu.period}</p>
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{edu.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeading>Skills</SectionHeading>
            <div className="space-y-12">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label}>
                  <h3 className="text-center text-sm uppercase tracking-[0.2em] text-cyan-400 mb-7">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-6">
                    {group.items.map((skill) => (
                      <SkillTile key={skill.name} {...skill} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-8">
              {EXPERIENCES.map((exp) => (
                <TimelineCard
                  key={`${exp.company}-${exp.period}`}
                  heading={exp.company}
                  link={exp.link}
                  title={exp.title}
                  meta={exp.period}
                  location={exp.location}
                  points={exp.points}
                  tags={exp.tags}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading>Projects</SectionHeading>
            <div className="space-y-8">
              {PROJECTS.map((project) => (
                <TimelineCard
                  key={project.title}
                  heading={project.type}
                  link={project.link}
                  title={project.title}
                  meta={project.period}
                  location={project.location}
                  points={project.points}
                  tags={project.tags}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading>Contact</SectionHeading>

            <p className="text-center text-slate-200 mb-10">
              The fastest way to reach me is email:{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200 break-words"
              >
                {EMAIL}
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
              <div>
                <label htmlFor="name" className="sr-only">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Name"
                  value={formData.name}
                  disabled={sending}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  value={formData.email}
                  disabled={sending}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Message"
                  value={formData.message}
                  disabled={sending}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-12 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-cyan-500"
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </div>

              {/* Inline status replaces the old alert() popups. */}
              <p
                role="status"
                aria-live="polite"
                className={`text-center text-sm min-h-[1.25rem] ${
                  status?.type === 'error' ? 'text-red-300' : 'text-cyan-300'
                }`}
              >
                {status?.text ?? ''}
              </p>
            </form>
          </div>
        </section>

        <footer className="py-12 px-6 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Jie Huang. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}