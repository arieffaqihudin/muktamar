/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Tv,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Radio,
  Info,
  Users,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  BookOpen,
  Phone,
  Mail,
  Share2,
  Play,
  Volume2,
  Compass,
  Menu,
  X,
  ExternalLink,
  Award,
  AlertCircle,
  HelpCircle,
  Globe,
  Bell,
  Check,
  FileArchive,
  ChevronRight
} from "lucide-react";

import {
  MOCK_AGENDA,
  MOCK_NEWS,
  MOCK_FAQ,
  MOCK_MEDIA_ASSETS,
  MOCK_PRESS_CONFERENCES,
  MOCK_MILESTONES,
  AgendaItem,
  NewsItem,
  FAQItem
} from "./data";

import CmsController from "./CmsController";

export default function App() {
  // Navigation / Routing state: 'beranda' | 'agenda' | 'live' | 'jelajah' | 'rilis-resmi' | 'media-center' | 'panduan'
  const [currentPage, setCurrentPage] = useState<string>("beranda");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [liveBarVisible, setLiveBarVisible] = useState<boolean>(true);

  // Dynamic States reflecting CMS / localStorage data
  const [agendas, setAgendas] = useState<AgendaItem[]>(MOCK_AGENDA);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [faqs, setFaqs] = useState<FAQItem[]>(MOCK_FAQ);
  
  const [hero, setHero] = useState({
    label: "Pusat Informasi Resmi",
    title: "Muktamar NU ke-35",
    subtitle: "Ikuti agenda, siaran langsung, rilis resmi, dokumentasi, dan panduan publik Muktamar Nahdlatul Ulama ke-35.",
    date: "15 - 18 Juni 2026",
    location: "Semarang, Jawa Tengah",
    currentStage: "Pra-Muktamar"
  });

  const [liveBar, setLiveBar] = useState({
    enabled: true,
    manualMode: false,
    manualText: "Live sekarang: Registrasi Peserta Muktamar NU & Pameran Khazanah",
    linkTo: "live"
  });

  const [liveStream, setLiveStream] = useState({
    cameraLabel: "Plenary Hall (Main Stage)",
    youtubeId: "8u1E6tE0hCg",
    isLive: true,
    latestUpdateLabel: "Pleno I Selesai",
    latestUpdateDesc: "Tata tertib persidangan resmi disahkan secara aklamasi oleh delegasi wilayah.",
    lastChanged: "Baru saja"
  });

  const [settings, setSettings] = useState({
    siteName: "Muktamar NU ke-35 Semarang",
    siteTagline: "Menuju Digdaya NU Menjemput Abad Kedua",
    contactEmail: "muktamar35@nu.or.id",
    contactPhone: "+62 812-3456-7890",
    contactAddress: "Islamic Center Semarang, Jawa Tengah, Indonesia",
    socialFb: "facebook.com/pbnu",
    socialIg: "instagram.com/nahdlatululama",
    socialYt: "youtube.com/nuonline",
    maintenanceMode: false,
    showCountdown: true,
    activeSections: {
      hero: true,
      liveBar: true,
      nowHappening: true,
      programme: true,
      liveSection: true,
      explore: true,
      updates: true,
      highlights: true,
      media: true,
      visitor: true
    } as Record<string, boolean>
  });

  // Load custom operational parameters
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedA = localStorage.getItem("muktamar35_agenda");
        if (savedA) setAgendas(JSON.parse(savedA));
        
        const savedN = localStorage.getItem("muktamar35_news");
        if (savedN) setNews(JSON.parse(savedN));
        
        const savedF = localStorage.getItem("muktamar35_faq");
        if (savedF) setFaqs(JSON.parse(savedF));
        
        const savedH = localStorage.getItem("muktamar35_hero");
        if (savedH) setHero(JSON.parse(savedH));
        
        const savedLb = localStorage.getItem("muktamar35_live_bar");
        if (savedLb) setLiveBar(JSON.parse(savedLb));
        
        const savedLs = localStorage.getItem("muktamar35_live_stream");
        if (savedLs) setLiveStream(JSON.parse(savedLs));
        
        const savedS = localStorage.getItem("muktamar35_settings");
        if (savedS) setSettings(JSON.parse(savedS));
      } catch (err) {
        console.error("Local state recovery error", err);
      }
    };
    loadSavedData();
  }, [currentPage]);

  // FAQ states
  const [openFaqId, setOpenFaqId] = useState<string | null>("f1");

  // Search and Filter states for Agenda page
  const [agendaFilter, setAgendaFilter] = useState<string>("Semua");
  const [selectedAgendaDetail, setSelectedAgendaDetail] = useState<AgendaItem | null>(null);

  // Search and Filter states for News page
  const [newsSearch, setNewsSearch] = useState<string>("");
  const [newsCategory, setNewsCategory] = useState<string>("Semua");
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<NewsItem | null>(null);

  // Live page Simulation states
  const [activeCamera, setActiveCamera] = useState<string>("plenary");
  const [isSimulatedStreaming, setIsSimulatedStreaming] = useState<boolean>(true);
  const [simulatedChatText, setSimulatedChatText] = useState<string>("");
  const [simulatedChats, setSimulatedChats] = useState<Array<{ name: string; message: string; time: string }>>([
    { name: "Samsul Ma'arif", message: "Bismillah, semoga Muktamar ke-35 berjalan khidmat dan berkah.", time: "10.02" },
    { name: "Fatimatuz Zahra", message: "Aamiin. Tema kemandirian teknologi sangat cocok dicanangkan.", time: "10.05" },
    { name: "Kiai Ahmad", message: "Menunggu siaran Bahtsul Masail Waqi'iyah, bahasan hukum karbon.", time: "10.08" },
    { name: "Nur Hadi", message: "Semarang aman, jemaah dari ranting siap meramaikan bazaar!", time: "10.12" }
  ]);

  // Media Center State
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [contactFormName, setContactFormName] = useState<string>("");
  const [contactFormEmail, setContactFormEmail] = useState<string>("");
  const [contactFormMsg, setContactFormMsg] = useState<string>("");
  const [contactFormSubmitted, setContactFormSubmitted] = useState<boolean>(false);

  // Countdown timer calculation coordinates
  const simulatedTargetDate = new Date("2026-06-15T09:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 17,
    hours: 8,
    minutes: 57,
    seconds: 49
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = simulatedTargetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync hash with current page state for absolute URL integrity
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "");
      if (["beranda", "agenda", "live", "jelajah", "rilis-resmi", "media-center", "panduan"].includes(hash)) {
        setCurrentPage(hash);
      } else if (hash.startsWith("cms")) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial load check
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const currentRunningAgenda = useMemo(() => {
    return agendas.find((item) => item.status === "Live") || agendas[1];
  }, [agendas]);

  const nextUpcomingAgenda = useMemo(() => {
    return agendas.find((item) => item.status === "Akan Berlangsung") || agendas[2];
  }, [agendas]);

  // Filter Agenda lists based on selected tabs
  const filteredAgendas = useMemo(() => {
    return agendas.filter((item) => {
      if (agendaFilter === "Semua") return true;
      if (agendaFilter === "Hari 1") return item.day === 1;
      if (agendaFilter === "Hari 2") return item.day === 2;
      if (agendaFilter === "Hari 3") return item.day === 3;
      if (agendaFilter === "Hari 4") return item.day === 4;
      if (agendaFilter === "Live") return item.status === "Live";
      if (agendaFilter === "Terbuka untuk Publik") return item.access === "Terbuka untuk Publik";
      if (agendaFilter === "Tersedia Rekaman") return item.status === "Tersedia Rekaman";
      return true;
    });
  }, [agendaFilter, agendas]);

  // Filter News lists based on search & category tabs
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.content.toLowerCase().includes(newsSearch.toLowerCase());
      const matchesCategory = newsCategory === "Semua" || item.category === newsCategory;
      return matchesSearch && matchesCategory;
    });
  }, [newsSearch, newsCategory, news]);

  const handleDownloadAsset = (title: string) => {
    setDownloadSuccess(title);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleSimulateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedChatText.trim()) return;
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
    setSimulatedChats((prev) => [
      ...prev,
      { name: "Ananda Nahdliyin (Anda)", message: simulatedChatText, time: formattedTime }
    ]);
    setSimulatedChatText("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactFormName || !contactFormEmail || !contactFormMsg) return;
    setContactFormSubmitted(true);
    setContactFormName("");
    setContactFormEmail("");
    setContactFormMsg("");
    setTimeout(() => setContactFormSubmitted(false), 5000);
  };

  if (currentPage.startsWith("cms")) {
    return <CmsController onBackToPortal={() => navigateTo("beranda")} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-plus bg-[#FAF9F5] text-[#1F2933] pattern-gold-glow">
      
      {/* ----------------- NAVBAR ----------------- */}
      <header className="sticky top-0 z-50 py-3.5 px-4 sm:px-6 lg:px-8 bg-transparent max-w-7xl mx-auto w-full transition-all">
        <div className="bg-white/95 backdrop-blur-md border border-brand-border rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-7xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center h-12">
            {/* Logo and Brand Title Grid */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer" 
              onClick={() => navigateTo("beranda")}
              id="brand-logo-section"
            >
              {/* Custom SVG logo mimicking official NU golden star elements */}
              <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-deepgreen to-brand-green opacity-95"></div>
                {/* Visual globe representation with stars */}
                <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] tracking-wider text-brand-green font-bold uppercase font-display">MUKTAMAR NU</span>
                  <span className="text-[8px] px-1 bg-brand-gold text-brand-darkgreen font-mono font-bold rounded">Ke-35</span>
                </div>
                <h1 className="text-xs font-black text-brand-darkgreen tracking-wide font-display">
                  {settings.siteName || "Semarang 2026"}
                </h1>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-1 items-center" id="nav-desktop-links">
              {[
                { key: "beranda", label: "Beranda" },
                { key: "agenda", label: "Agenda" },
                { key: "live", label: "Live" },
                { key: "jelajah", label: "Jelajah" },
                { key: "rilis-resmi", label: "Rilis Resmi" },
                { key: "media-center", label: "Media" },
                { key: "panduan", label: "Panduan" }
              ].map((tab) => {
                const isActive = currentPage === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => navigateTo(tab.key)}
                    id={`nav-link-${tab.key}`}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-brand-softgreen text-brand-green font-bold"
                        : "text-[#667085] hover:text-brand-green hover:bg-brand-softgreen/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Navbar Action Button */}
            <div className="hidden md:flex items-center space-x-2.5">
              <button
                onClick={() => navigateTo("cms")}
                id="btn-nav-action-cms"
                className="text-[#667085] hover:text-brand-green font-bold text-[10px] uppercase px-3 py-1.5 rounded-full hover:bg-brand-softgreen/40 transition-all cursor-pointer"
              >
                CMS Portal
              </button>
              <button
                onClick={() => navigateTo("live")}
                id="btn-nav-action-live"
                className="bg-brand-green hover:bg-brand-deepgreen text-white font-bold text-[10px] uppercase px-4 py-2.5 rounded-full shadow-sm flex items-center space-x-1.5 transition-all duration-300 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                <span>Ikuti Live</span>
              </button>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-brand-green hover:bg-brand-softgreen/40 p-2 rounded-full focus:outline-none cursor-pointer"
                id="mobile-hamburger-btn"
                aria-label="Open navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-md border border-brand-border rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-3.5 space-y-1.5 animate-fadeIn" id="nav-mobile-dropdown">
            {[
              { key: "beranda", label: "Beranda" },
              { key: "agenda", label: "Agenda" },
              { key: "live", label: "Live" },
              { key: "jelajah", label: "Jelajah Muktamar" },
              { key: "rilis-resmi", label: "Rilis Resmi" },
              { key: "media-center", label: "Media Center" },
              { key: "panduan", label: "Panduan" }
            ].map((tab) => {
              const isActive = currentPage === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    navigateTo(tab.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                    isActive
                      ? "bg-brand-softgreen text-brand-green"
                      : "text-slate-600 hover:bg-brand-mint hover:text-brand-green"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  navigateTo("live");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 bg-brand-green hover:bg-brand-deepgreen text-white font-bold py-2 rounded-full flex items-center justify-center space-x-1.5 text-[10px] uppercase cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                <span>Ikuti Live</span>
              </button>
              <button
                onClick={() => {
                  navigateTo("cms");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 bg-brand-softgreen border border-brand-green/20 text-brand-green font-bold py-2 rounded-full flex items-center justify-center text-[10px] uppercase cursor-pointer"
              >
                <span>CMS Portal</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ----------------- FLOATING/STICKY LIVE BAR ----------------- */}
      {liveBarVisible && liveBar.enabled && settings.activeSections.liveBar !== false && (
        <div 
          className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-1 mb-4 pointer-events-auto"
          id="sticky-now-live-bar"
        >
          <div className="bg-gradient-to-r from-brand-deepgreen to-brand-darkgreen border border-brand-green/10 rounded-full py-2.5 px-6 shadow-[0_4px_15px_rgba(0,107,69,0.15)] text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="font-semibold tracking-wide text-[11px] sm:text-xs">
                <span className="text-brand-gold font-bold uppercase mr-1.5">
                  {liveBar.manualMode ? "[PENGUMUMAN]" : "[NOW STREAMING]"}
                </span>
                {liveBar.manualMode ? (
                  <span className="text-brand-softgreen">{liveBar.manualText}</span>
                ) : (
                  <>
                    Berlangsung Sekarang: <strong className="text-white font-extrabold">{currentRunningAgenda?.title || "Persidangan Musyawarah"}</strong>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3.5 self-end sm:self-auto">
              <button
                onClick={() => navigateTo(liveBar.linkTo || "live")}
                className="bg-white hover:bg-brand-softgreen text-brand-green font-bold text-[10px] uppercase px-3.5 py-1.5 rounded-full shadow-sm transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setLiveBarVisible(false)}
                className="text-white/70 hover:text-white p-1 rounded-full cursor-pointer"
                title="Sembunyikan Bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MAIN VIEW / PAGES SITEMAP ----------------- */}
      <main className="flex-grow">
        
        {/* ======================================================== */}
        {/*                       1. BERANDA                         */}
        {/* ======================================================== */}
        {currentPage === "beranda" && (
          <div id="page-beranda" className="animate-fadeIn">
            
            {/* HERO SECTION - PUBLIC EVENT COMMAND CENTER BOARD */}
            <section className="bg-[#FAF9F5] text-[#1F2933] py-16 md:py-24 relative overflow-hidden" id="hero-command-board">
              {/* Elegant Subtle Pattern overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0l15 15-15 15L0 15z' fill='%23006B45' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
              <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-brand-softgreen/50 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-brand-softgreen/40 blur-3xl pointer-events-none"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Hero Copy (7 Cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-brand-softgreen border border-brand-green/10 px-3.5 py-1.5 rounded-full text-[10px] text-brand-green uppercase tracking-widest font-mono font-bold">
                      <Globe className="w-3.5 h-3.5 animate-spin-slow-subtle text-brand-green" />
                      <span>{hero.label}</span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-brand-darkgreen leading-tight">
                      {hero.title === "Muktamar NU ke-35" ? (
                        <>
                          Muktamar <br />
                          <span className="text-brand-green bg-clip-text text-transparent bg-gradient-to-r from-brand-green to-brand-deepgreen">
                            Nahdlatul Ulama
                          </span> <br />
                          ke-35
                        </>
                      ) : (
                        hero.title
                      )}
                    </h2>
                    
                    <p className="text-slate-650 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
                      {hero.subtitle}
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
                      <div className="bg-white border border-brand-border p-3.5 rounded-2xl shadow-sm">
                        <div className="text-[9px] text-[#828282] uppercase tracking-widest font-mono font-bold">Tanggal Acara</div>
                        <p className="text-brand-darkgreen text-xs font-extrabold mt-0.5">{hero.date}</p>
                      </div>
                      <div className="bg-white border border-brand-border p-3.5 rounded-2xl shadow-sm">
                        <div className="text-[9px] text-[#828282] uppercase tracking-widest font-mono font-bold">Lokasi Terpusat</div>
                        <p className="text-brand-darkgreen text-xs font-extrabold mt-0.5">{hero.location}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <button 
                        onClick={() => navigateTo("agenda")} 
                        className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                      >
                        Lihat Agenda
                      </button>
                      <button 
                        onClick={() => navigateTo("live")} 
                        className="bg-white hover:bg-brand-softgreen text-brand-green font-extrabold text-xs uppercase px-6 py-3.5 rounded-full shadow-sm border border-brand-green/20 transition-all hover:-translate-y-0.5"
                      >
                        Tonton Live
                      </button>
                      <button 
                        onClick={() => navigateTo("rilis-resmi")} 
                        className="text-[#667085] hover:text-brand-green text-xs uppercase font-extrabold tracking-wider self-center px-4 hover:underline transition-colors"
                      >
                        Baca Rilis Resmi &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Hero Action Command / Status Board (5 Cols) */}
                  <div className="lg:col-span-5 bg-white border border-brand-border rounded-[28px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
                    <div className="absolute top-4 right-4 flex items-center space-x-1 bg-red-50 text-red-600 border border-red-150 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                      <span>MONITOR LIVE</span>
                    </div>

                    <h3 className="text-xs font-mono font-bold text-brand-green uppercase tracking-wider border-b border-slate-100 pb-3.5 mb-4">
                      TAHAPAN MUKTAMAR HUB
                    </h3>

                    {/* Step Tracker with bullet levels */}
                    <div className="space-y-2.5 mb-6">
                      {[
                        { label: "Pra-Muktamar", desc: "Konsolidasi regional & pra-acara", active: hero.currentStage === "Pra-Muktamar", step: "01", status: hero.currentStage === "Pra-Muktamar" ? "AKTIF" : "15 JUNI" },
                        { label: "Pembukaan Akbar", desc: "Amanat Presiden & Syuriyah PBNU", active: hero.currentStage === "Pembukaan Akbar", step: "02", status: hero.currentStage === "Pembukaan Akbar" ? "AKTIF" : "15 JUNI" },
                        { label: "Sidang Komisi", desc: "Bahtsul Masail & perumusan kebijakan", active: hero.currentStage === "Sidang Komisi", step: "03", status: hero.currentStage === "Sidang Komisi" ? "AKTIF" : "16 JUNI" },
                        { label: "Pleno Keputusan", desc: "Pemilihan Rais 'Aam & Ketua Umum", active: hero.currentStage === "Pleno Keputusan", step: "04", status: hero.currentStage === "Pleno Keputusan" ? "AKTIF" : "17 JUNI" },
                        { label: "Penutupan", desc: "Pidato maklumat & pembagian naskah", active: hero.currentStage === "Penutupan", step: "05", status: hero.currentStage === "Penutupan" ? "AKTIF" : "18 JUNI" }
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className={`flex items-start justify-between p-3 rounded-2xl transition-all border ${
                            item.active 
                              ? "bg-brand-softgreen/60 border-brand-green/20" 
                              : "opacity-45 hover:opacity-75 bg-transparent border-transparent"
                          }`}
                        >
                          <div className="flex space-x-3">
                            <span className="font-mono text-xs font-black text-brand-green pt-0.5">{item.step}</span>
                            <div>
                              <div className="text-xs font-extrabold text-brand-darkgreen flex items-center space-x-1.5">
                                <span>{item.label}</span>
                                {item.active && (
                                  <span className="text-[8px] bg-brand-green text-white font-mono font-bold px-1.5 rounded-full">STAGE SEKARANG</span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#667085] mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-brand-green text-right pt-0.5">{item.status}</span>
                        </div>
                      ))}
                    </div>

                    {/* Countdown Timer Widget Block */}
                    <div className="bg-brand-mint border border-brand-green/10 p-4 rounded-2xl text-center">
                      <div className="text-[9px] text-brand-green uppercase tracking-widest font-mono font-extrabold mb-2.5">
                        HITUNG MUNDUR ACARA PEMBUKAAN
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-brand-darkgreen">{timeLeft.days}</div>
                          <div className="text-[8px] text-[#828282] font-semibold uppercase">Hari</div>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-brand-darkgreen">{timeLeft.hours}</div>
                          <div className="text-[8px] text-[#828282] font-semibold uppercase">Jam</div>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-brand-darkgreen">{timeLeft.minutes}</div>
                          <div className="text-[8px] text-[#828282] font-semibold uppercase">Menit</div>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-brand-darkgreen">{timeLeft.seconds}</div>
                          <div className="text-[8px] text-[#828282] font-semibold uppercase">Detik</div>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION 3 - NOW HAPPENING / SEDANG BERLANGSUNG */}
            <section className="py-12 bg-[#FAF9F5]" id="now-happening-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-brand-border pb-4">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-brand-green font-bold flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                      STATUS SEKARANG
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black font-display text-brand-darkgreen">
                      Sedang Berlangsung di Lapangan
                    </h3>
                  </div>
                  <p className="text-xs text-[#667085] mt-2 md:mt-0 max-w-sm">
                    Sistem pemantau arus persidangan otomatis. Jadwal diperbarui secara instan oleh panitia Humas PBNU.
                  </p>
                </div>

                <div className="bg-white border border-brand-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* Visual left pane pointing stage (5 Cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-brand-green to-brand-deepgreen text-white p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                      {/* Subtle ornament background */}
                      <div className="absolute inset-x-0 bottom-0 opacity-5 pointer-events-none text-right translate-y-6">
                        <Radio className="w-40 h-40 text-white inline-block" />
                      </div>
                      <div className="absolute top-0 right-0 p-6 z-10">
                        <Radio className="w-5 h-5 text-brand-gold animate-pulse" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="inline-block bg-red-600 font-mono font-bold text-[9px] tracking-widest text-white px-3 py-1 rounded-full mb-4 uppercase">
                          STUDIO LIVE FEED
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black font-display leading-snug">
                          {currentRunningAgenda.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-brand-gold mt-2 font-mono text-xs font-bold">
                          <Clock className="w-4 h-4" />
                          <span>{currentRunningAgenda.time}</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-white/10 relative z-10 mt-8">
                        <div className="flex items-center space-x-2 text-xs">
                          <MapPin className="text-brand-gold w-4 h-4 shrink-0" />
                          <span>Muktamar Venue: <strong className="text-yellow-100">{currentRunningAgenda.location}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Users className="text-brand-gold w-4 h-4 shrink-0" />
                          <span>Aksesibilitas: <strong className="text-yellow-100">{currentRunningAgenda.access}</strong></span>
                        </div>
                        <div className="bg-black/20 p-3 rounded-2xl text-[11px] text-emerald-100 italic font-medium leading-relaxed">
                          "Dimohon seluruh delegasi untuk senantiasa menempati kursi sesuai instruksi panitia keamanan."
                        </div>
                      </div>
                    </div>

                    {/* Interactive video simulator & right actions (7 Cols) */}
                    <div className="lg:col-span-7 p-7 sm:p-8 flex flex-col justify-between bg-white">
                      <div>
                        <span className="text-xs font-mono font-bold text-brand-green tracking-widest uppercase">DETAIL AGENDA AKTIF</span>
                        <h4 className="text-lg font-black text-brand-darkgreen mt-1">Deskripsi & Pokok Bahasan</h4>
                        <p className="text-slate-650 text-xs sm:text-sm mt-2 leading-relaxed">
                          {currentRunningAgenda.description}
                        </p>

                        <div className="mt-5 p-4 bg-brand-mint/60 border border-brand-green/5 rounded-2xl text-xs space-y-1.5 text-slate-700">
                          <div className="font-extrabold text-brand-darkgreen flex items-center space-x-1">
                            <Info className="w-4 h-4 text-brand-green shrink-0" />
                            <span>Materi Yang Dibahas:</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-650 font-medium">
                            <li>Penyelarasan teknologi maslahah menyambut visi abad kedua</li>
                            <li>Toleransi global dan ketahanan pangan masyarakat pedesaan</li>
                            <li>Sanksi administratif pelanggaran etika berorganisasi</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 mt-6">
                        <button 
                          onClick={() => navigateTo("live")} 
                          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase px-5 py-3 rounded-full flex items-center space-x-2 shadow-sm transition-all hover:-translate-y-0.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Tonton Siaran Langsung</span>
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAgendaDetail(currentRunningAgenda);
                          }}
                          className="bg-white hover:bg-brand-softgreen text-brand-green border border-brand-green/20 font-extrabold text-xs uppercase px-5 py-3 rounded-full transition-all hover:-translate-y-0.5"
                        >
                          Lihat Alur Agenda Lengkap
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 4 - AGENDA HARI INI TIMELINE */}
            <section className="py-16 bg-[#FAF9F5] border-y border-brand-border" id="agenda-hari-ini">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-xs uppercase font-mono tracking-widest text-brand-green font-bold">TIMELINES</span>
                  <h3 className="text-2xl sm:text-3xl font-black font-display text-brand-darkgreen mt-1">
                    Sorotan Hari Pertama Muktamar
                  </h3>
                  <p className="text-[#667085] text-xs sm:text-sm mt-2">
                    Visualisasi program berjalan selayaknya pameran global. Pilih detail untuk informasi akses tamu umum.
                  </p>
                </div>

                {/* Timeline Layout */}
                <div className="relative border-l-2 border-brand-softgreen/80 ml-4 md:ml-32 space-y-8" id="today-program-timeline">
                  {agendas.filter(item => item.day === 1).map((item, index) => {
                    const isSelesai = item.status === "Selesai";
                    const isLive = item.status === "Live";
                    return (
                      <div key={item.id} className="relative pl-6 md:pl-8 group">
                        
                        {/* Time side banner (Visible on desktop) */}
                        <div className="absolute -left-6 md:-left-36 top-0 hidden md:block text-right w-28">
                          <span className="font-mono text-xs font-bold text-brand-green bg-brand-softgreen border border-brand-green/5 px-2.5 py-1 rounded-full block">
                            {item.time.split(" ")[0]}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1">WIB</span>
                        </div>

                        {/* Node point marker */}
                        <span className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                          isLive 
                            ? "border-red-600 ring-4 ring-red-100 scale-125" 
                            : isSelesai 
                              ? "border-brand-green bg-brand-green text-white" 
                              : "border-brand-green bg-white text-brand-green"
                        }`}>
                          {isSelesai && <Check className="w-2.5 h-2.5" />}
                        </span>

                        <div className="bg-white border border-brand-border rounded-2xl p-5 hover:border-brand-green/30 hover:shadow-sm transition-all duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="md:hidden font-mono text-xs text-brand-green font-bold bg-brand-softgreen px-2.5 py-1 rounded-full">
                              {item.time}
                            </span>
                            
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* Status Badge */}
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                                isLive 
                                  ? "bg-red-600 text-white animate-pulse" 
                                  : isSelesai 
                                    ? "bg-slate-150 text-slate-500" 
                                    : "bg-brand-softgreen text-brand-green border border-brand-green/10"
                              }`}>
                                {item.status}
                              </span>

                              {/* Access Badge */}
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                                item.access === "Terbuka untuk Publik"
                                  ? "bg-brand-softgreen text-brand-green border border-brand-green/10"
                                  : item.access === "Terbuka untuk Media"
                                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                                    : "bg-amber-50 text-amber-800 border border-amber-100"
                              }`}>
                                {item.access}
                              </span>
                            </div>

                            <span className="text-[11px] text-slate-500 font-mono font-medium flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
                              <span>{item.location}</span>
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-black text-brand-darkgreen font-display group-hover:text-brand-green transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-slate-650 text-xs mt-1.5 leading-relaxed line-clamp-2 md:line-clamp-none">
                            {item.description}
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedAgendaDetail(item)}
                              className="text-brand-green hover:text-brand-deepgreen font-extrabold text-xs flex items-center space-x-1 hover:underline"
                            >
                              <span>Lihat Deskripsi Lengkap</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            
                            {isLive && (
                              <button
                                onClick={() => navigateTo("live")}
                                className="bg-red-600 text-white hover:bg-red-700 text-[10px] font-extrabold py-1.5 px-3 rounded-full tracking-wider uppercase flex items-center space-x-1"
                              >
                                <Tv className="w-3 h-3" />
                                <span>Tonton Live Now</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-8">
                  <button 
                    onClick={() => navigateTo("agenda")}
                    className="bg-white hover:bg-brand-softgreen text-brand-green font-extrabold text-xs uppercase px-6 py-3.5 rounded-full border border-brand-green/20 shadow-sm transition-all inline-flex items-center space-x-2"
                  >
                    <span>Jelajahi Rangkaian Agenda Semua Hari</span>
                    <ArrowRight className="w-4 h-4 text-brand-green" />
                  </button>
                </div>

              </div>
            </section>

            {/* SECTION 5 - WATCH LIVE PREVIEW */}
            <section className="py-16 bg-gradient-to-br from-brand-darkgreen to-brand-deepgreen text-white relative overflow-hidden" id="watch-live-preview">
              {/* Geometric Grid overlay inside live section */}
              <div className="absolute inset-0 opacity-10 bg-repeat bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left (7 Cols) - Custom Video Player Mockup */}
                  <div className="lg:col-span-7">
                    <div className="bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative aspect-video group">
                      
                      {/* Video Simulated Poster image & overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/40 to-transparent flex flex-col justify-between p-6">
                        <div className="flex justify-between items-start">
                          <span className="bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            <span>MUKTAMAR TV BROADCAST</span>
                          </span>
                          <span className="text-[10px] text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur">
                            Kamera 01 - Plenary Hall
                          </span>
                        </div>

                        {/* Mid Play button */}
                        <div className="self-center my-auto">
                          <button 
                            onClick={() => navigateTo("live")}
                            className="w-16 h-16 rounded-full bg-brand-green hover:bg-brand-deepgreen text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                            aria-label="Play broadcast stream"
                          >
                            <Play className="w-6 h-6 fill-current translate-x-0.5 ml-0.5" />
                          </button>
                        </div>

                        {/* Bottom Bar Info */}
                        <div className="flex justify-between items-center bg-black/70 p-3.5 rounded-2xl backdrop-blur-sm border border-white/5">
                          <div className="flex items-center space-x-3">
                            <span className="text-brand-gold"><Volume2 className="w-4 h-4" /></span>
                            <span className="text-xs text-white/90">Sinyal Penyiaran Resmi PBNU (Resolusi Tinggi 1080p)</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">● MENGHUBUNGKAN...</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right (5 Cols) - Broadcast Details */}
                  <div className="lg:col-span-12 xl:col-span-5 space-y-6 lg:mt-6 xl:mt-0">
                    <span className="text-xs font-mono text-[#A7F3D0] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                      DIGITAL TRANSMISSION
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight text-white">
                      Saksikan Siaran Langsung Muktamar Live
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                      Komite Humas menyediakan kanal khusus digital untuk jemaah nahdliyin yang tidak dapat hadir langsung di Semarang agar senantiasa berkumpul menyerap tausiyah khidmat para pemimpin rujukan.
                    </p>

                    <div className="p-4.5 bg-white/5 border border-white/10 rounded-2xl space-y-3 text-xs leading-relaxed">
                      <div className="text-brand-gold font-black uppercase tracking-wider text-[10px] font-mono">Kebijakan Hak Siar</div>
                      <p className="text-slate-300 text-[11px]">
                        Siaran langsung bebas disebarluaskan oleh media terafiliasi dengan mencantumkan kredit resmi panitia pelaksana. Rekaman arsip penuh akan diperbarui di menu Live.
                      </p>
                    </div>

                    <div className="pt-2 flex">
                      <button 
                        onClick={() => navigateTo("live")}
                        className="bg-white hover:bg-brand-softgreen text-brand-green font-extrabold text-xs uppercase px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all inline-flex items-center space-x-2"
                      >
                        <span>Buka Studio Siaran & Hub Live</span>
                        <ArrowRight className="w-4 h-4 text-brand-green" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SECTION 6 - EXPLORE MUKTAMAR (Not simple text, Bento grid) */}
            <section className="py-16 bg-[#FAF9F5]" id="explore-muktamar-bento">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-xs uppercase font-mono tracking-widest text-brand-green font-bold">EXHIBITION HALL</span>
                  <h3 className="text-3xl font-black font-display text-brand-darkgreen">
                    Jelajah Esensi Muktamar
                  </h3>
                  <p className="text-[#667085] text-xs sm:text-sm mt-2">
                    Kenali latar pemikiran mulia, kearifan historis persatuan bangsa, serta asas tema kedaulatan abad kedua NU.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white border border-brand-border rounded-[24px] p-6 sm:p-8 flex flex-col justify-between hover:border-brand-green/20 hover:shadow-sm transition-all duration-300">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-brand-softgreen text-brand-green flex items-center justify-center mb-6 border border-brand-green/10">
                        <Award className="w-6 h-6 text-brand-green" />
                      </div>
                      <h4 className="text-lg font-black text-brand-darkgreen font-display">Tujuan & Makna Muktamar</h4>
                      <p className="text-slate-650 text-xs sm:text-sm mt-3 leading-relaxed">
                        Muktamar Nahdlatul Ulama merupakan forum permusyawaratan tertinggi dalam jam'iyah NU. Forum ini merundingkan arah strategis organisasi dalam pengabdian kemainan di tatanan global.
                      </p>
                    </div>
                    <button 
                      onClick={() => navigateTo("jelajah")}
                      className="text-brand-green hover:text-brand-deepgreen text-xs font-extrabold uppercase tracking-wider mt-6 inline-flex items-center space-x-1 group"
                    >
                      <span>Pelajari Makna</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-brand-green to-brand-deepgreen text-white border border-brand-green/10 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Globe className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/10 text-brand-gold flex items-center justify-center mb-6 border border-white/5">
                        <Compass className="w-6 h-6 text-brand-gold" />
                      </div>
                      <h4 className="text-lg font-black text-white font-display">Tema & Arah Khidmah</h4>
                      <p className="text-emerald-100 text-xs sm:text-sm mt-3 leading-relaxed">
                        Mengusung kedaulatan digital terpadu, penegakan keadilan iklim, pemberdayaan ekonomi riil santri, serta penyeimbangan perdamaian antarbangsa demi merajut peradaban abadi yang kokoh.
                      </p>
                    </div>
                    <button 
                      onClick={() => navigateTo("jelajah")}
                      className="text-brand-gold hover:text-yellow-300 text-xs font-extrabold uppercase tracking-wider mt-6 inline-flex items-center space-x-1 group relative z-10"
                    >
                      <span>Lihat Pokok Tema</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white border border-brand-border rounded-[24px] p-6 sm:p-8 flex flex-col justify-between hover:border-brand-green/20 hover:shadow-sm transition-all duration-300">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-brand-softgreen text-brand-green flex items-center justify-center mb-6 border border-brand-green/10">
                        <BookOpen className="w-6 h-6 text-brand-green" />
                      </div>
                      <h4 className="text-lg font-black text-brand-darkgreen font-display">Sejarah Lintasan Abad</h4>
                      <p className="text-slate-650 text-xs sm:text-sm mt-3 leading-relaxed">
                        Menapaki jejak ikhtiar sejarah NU sejak deklarasi 1926 di Surabaya, Khittah Agung Situbondo 1984, revitalisasi ekonomi Lampung 2021 hingga perhelatan monumental ke-35 hari ini.
                      </p>
                    </div>
                    <button 
                      onClick={() => navigateTo("jelajah")}
                      className="text-brand-green hover:text-brand-deepgreen text-xs font-extrabold uppercase tracking-wider mt-6 inline-flex items-center space-x-1 group"
                    >
                      <span>Lihat Peta Kilas Balik</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>

                <div className="text-center pt-10">
                  <button 
                    onClick={() => navigateTo("jelajah")}
                    className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-8 py-4 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5 inline-flex items-center space-x-2"
                  >
                    <span>Buka Halaman Jelajah Muktamar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </section>

            {/* SECTION 7 - GENERAL NEWS EXCERPT */}
            <section className="py-16 bg-white border-y border-brand-border" id="news-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-brand-green font-bold">INFO AKURAT</span>
                    <h3 className="text-2xl sm:text-3xl font-black font-display text-brand-darkgreen mt-1">
                      Pusat Rilis & Kabar Resmi
                    </h3>
                  </div>
                  <button 
                    onClick={() => navigateTo("rilis-resmi")}
                    className="text-brand-green hover:text-brand-deepgreen font-extrabold text-xs uppercase hover:underline inline-flex items-center mt-2 md:mt-0"
                  >
                    <span>Buka Seluruh Berita</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 text-brand-green" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {news.slice(0, 3).map((item) => (
                    <article 
                      key={item.id} 
                      className="bg-[#FAF9F5] border border-brand-border rounded-[24px] overflow-hidden flex flex-col justify-between hover:border-brand-green/20 hover:shadow-sm transition-all duration-300 group"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="bg-brand-softgreen text-brand-green font-mono font-bold text-[9px] px-3 py-1 rounded-full tracking-wider uppercase border border-brand-green/5">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">{item.date}</span>
                        </div>
                        <h4 className="text-base font-black text-brand-darkgreen font-display leading-snug line-clamp-2 group-hover:text-brand-green transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#667085] mt-2 line-clamp-3 leading-relaxed font-light">
                          {item.summary}
                        </p>
                      </div>
                      
                      <div className="p-6 pt-0 border-t border-slate-100/50">
                        <button
                          onClick={() => setSelectedNewsDetail(item)}
                          className="w-full bg-white hover:bg-brand-softgreen text-brand-green font-extrabold text-[11px] uppercase py-2.5 rounded-full text-center border border-brand-green/20 transition-all block"
                        >
                          Baca Kabar Selengkapnya &rarr;
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

              </div>
            </section>            {/* SECTION 8 - DOCUMENTATION EXHIBITION GALLERY */}
            <section className="py-16 bg-[#FAF9F5]" id="gallery-highlights">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs uppercase font-mono tracking-widest text-brand-green font-bold">FOTO & VIDEO</span>
                  <h3 className="text-2xl sm:text-3xl font-black font-display text-brand-darkgreen mt-1">
                    Galeri Sorotan Visual Resmi
                  </h3>
                  <p className="text-[#667085] text-xs mt-2 font-light">
                    Aset visual langsung dari lensa fotografer terbaik Humas Muktamar. Bebas dimanfaatkan untuk publikasi pers.
                  </p>
                </div>

                {/* Editorial Visual Mosaic Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Sesi Koordinasi Pra-Muktamar", desc: "Konsolidasi PCNU Jawa Tengah", type: "Foto" },
                    { title: "Kesiapan Layar Kontrol", desc: "Konfigurasi Media Center 10 Gbps", type: "Foto" },
                    { title: "Instalasi Plenary Hall", desc: "Dekorasi panggung khusyuk bernuansa emas", type: "Video" },
                    { title: "Tumpengan Syukuran Panitia", desc: "Doa bersama kelancaran hajat agung", type: "Foto" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-brand-border rounded-2xl overflow-hidden group cursor-pointer hover:border-brand-green/20 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="aspect-video bg-emerald-950 flex items-center justify-center relative overflow-hidden">
                        {/* Custom visual geometric placeholder simulating photography */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-darkgreen/40 to-brand-green/85 opacity-90 group-hover:scale-105 transition-transform duration-550"></div>
                        <div className="absolute inset-0 bg-repeat bg-[radial-gradient(#006B45_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                        
                        <div className="relative z-10 text-center p-3 text-white">
                          <ImageIcon className="w-8 h-8 text-brand-gold mx-auto opacity-75 group-hover:scale-110 transition-transform" />
                          <span className="text-[8px] font-mono tracking-widest px-2.5 py-0.5 bg-brand-green text-white rounded-full mt-2 inline-block font-extrabold uppercase">
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        <h4 className="text-xs font-bold text-brand-darkgreen line-clamp-1 group-hover:text-brand-green transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-slate-550 line-clamp-1 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* SECTION 9 - BOTH VISITOR AND MEDIA SPLIT */}
            <section className="py-16 bg-white border-t border-brand-border" id="split-visitor-media">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Pane - Media Box */}
                  <div className="bg-gradient-to-br from-brand-green to-brand-deepgreen text-white rounded-[28px] p-6 sm:p-8 flex flex-col justify-between border border-brand-green/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <FileText className="w-32 h-32 text-white" />
                    </div>
                    
                    <div className="relative z-10">
                      <span className="text-[9px] font-mono font-black text-brand-gold uppercase tracking-widest">FOR JOURNALISTS</span>
                      <h4 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                        Portal Ruang Media Center
                      </h4>
                      <p className="text-emerald-100 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                        Bagi jurnalis nasional dan daerah yang ingin mengunduh siaran pers harian, berkas brand kit lengkap, buku saku persidangan, serta foto visual resolusi tinggi.
                      </p>
                      
                      <div className="mt-5 space-y-2 text-xs text-emerald-100 pl-0.5">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                          <span>Press kit resmi terlengkap (ZIP)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                          <span>Pendaftaran akreditasi peliputan mandiri</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 relative z-10 flex">
                      <button 
                        onClick={() => navigateTo("media-center")}
                        className="bg-white hover:bg-brand-softgreen text-brand-green font-extrabold text-xs uppercase px-5 py-3 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                      >
                        Akses Media Center &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Right Pane - Visitor Box */}
                  <div className="bg-[#FAF9F5] border border-brand-border rounded-[28px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-brand-green/10 transition-all duration-300">
                    <div>
                      <span className="text-[9px] font-mono font-black text-brand-green uppercase tracking-widest">FOR PUBLIC VISITORS</span>
                      <h4 className="text-xl sm:text-2xl font-black font-display text-brand-darkgreen mt-1">
                        Panduan Undangan & Publik Umum
                      </h4>
                      <p className="text-slate-650 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                        Temukan petunjuk navigasi arah rincian akomodasi wisma, jadwal sirkulasi bis antar-jemput, daftar masjid terdekat, serta tata tertib kunjungan bazaar nusantara.
                      </p>

                      <div className="mt-5 space-y-2 text-xs text-slate-650 pl-0.5">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                          <span>Pedoman ketertiban masyarakat & parkir</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                          <span>Jawaban pertanyaan FAQ penyiaran acara</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex">
                      <button 
                        onClick={() => navigateTo("panduan")}
                        className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-5 py-3 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                      >
                        Buka Buku Panduan &rarr;
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}

        {/* ======================================================== */}
        {/*                       2. AGENDA                          */}
        {/* ======================================================== */}
        {currentPage === "agenda" && (
          <div id="page-agenda" className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header section */}
            <div className="border-b border-brand-border/80 pb-6 mb-8">
              <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest block mb-1">
                EXHIBITION SCHEDULE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-darkgreen">
                Jadwal & Komisi Persidangan
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                Gunakan tab penyaring di bawah untuk menggolongkan agenda hari tertentu, menyaring agenda terbuka yang bisa dihadiri publik, atau mencari agenda yang sedang memiliki penyiaran langsung.
              </p>
            </div>

            {/* Filter Tabs - Horizontal scroll on mobile */}
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar" id="agenda-filter-row">
              {[
                "Semua",
                "Hari 1",
                "Hari 2",
                "Hari 3",
                "Hari 4",
                "Live",
                "Terbuka untuk Publik",
                "Tersedia Rekaman"
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAgendaFilter(filter)}
                  className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                    agendaFilter === filter
                      ? "bg-brand-green text-white border border-brand-green shadow-xs"
                      : "bg-brand-softgreen/50 text-brand-green hover:bg-brand-softgreen border border-brand-green/5"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-[#667085] font-mono mt-4 mb-6">
              Menampilkan {filteredAgendas.length} agenda berdasarkan filter <strong className="text-brand-green font-extrabold">"{agendaFilter}"</strong>
            </div>

            {/* Grid display of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="agenda-grid-container">
              {filteredAgendas.map((item) => {
                const isLive = item.status === "Live";
                const isSelesai = item.status === "Selesai";
                return (
                  <div 
                    key={item.id} 
                    className="bg-white border border-brand-border rounded-[24px] p-6 hover:border-brand-green/20 hover:shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-1.5 mb-3">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                          isLive 
                            ? "bg-red-600 text-white animate-pulse" 
                            : isSelesai 
                              ? "bg-slate-150 text-slate-500" 
                              : "bg-brand-softgreen text-brand-green border border-brand-green/10"
                        }`}>
                          {item.status}
                        </span>

                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                          item.access === "Terbuka untuk Publik"
                            ? "bg-brand-softgreen text-brand-green border border-brand-green/10"
                            : item.access === "Terbuka untuk Media"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-amber-50 text-amber-800 border border-amber-100"
                        }`}>
                          {item.access}
                        </span>
                      </div>

                      {/* Day Label */}
                      <div className="text-[10px] text-brand-gold font-bold font-mono tracking-widest mb-1.5">
                        HARI KE-{item.day} OF MUKTAMAR
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-brand-darkgreen font-display line-clamp-2 group-hover:text-brand-green transition-colors">
                        {item.title}
                      </h3>

                      <div className="space-y-2 mt-3 text-xs text-slate-650">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-green shrink-0" />
                          <span className="font-mono">{item.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
                          <span>Venue: <strong className="text-slate-800 font-semibold">{item.location}</strong></span>
                        </div>
                      </div>

                      <p className="text-xs text-[#667085] mt-3 line-clamp-3 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedAgendaDetail(item)}
                        className="text-brand-green hover:text-brand-deepgreen font-extrabold text-xs"
                      >
                        Detail & Rincian &rarr;
                      </button>

                      {isLive && (
                        <button
                          onClick={() => navigateTo("live")}
                          className="bg-red-600 hover:bg-red-750 text-white text-[9px] uppercase font-extrabold py-1.5 px-3.5 rounded-full shadow-sm"
                        >
                          Tonton Live
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/*                         3. LIVE                          */}
        {/* ======================================================== */}
        {currentPage === "live" && (
          <div id="page-live" className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header section */}
            <div className="border-b border-brand-border/80 pb-6 mb-8">
              <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest block mb-1">
                STUDIO LIVE HUB
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-darkgreen">
                Muktamar Live Stream Center
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                Ikuti seluruh persidangan resmi, amanat kiai sepuh, serta forum dialog peradaban dunia secara langsung. Gunakan selector di bawah untuk mengubah arah sorotan kamera digital.
              </p>
            </div>

            {/* Broadcast Layout: Video Player + Chat Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Columns 1 & 2: Video display */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Simulated Stream Player Container */}
                <div className="bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative aspect-video">
                  
                  {isSimulatedStreaming ? (
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {/* Top Bar */}
                      <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center text-white z-10">
                        <div className="flex items-center space-x-2">
                          <span className="bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            <span>SIARAN AKTIF</span>
                          </span>
                          <span className="text-xs font-semibold">
                            {activeCamera === "plenary" 
                              ? "Kamera 01 - Plenary Hall Utama" 
                              : activeCamera === "bahtsul" 
                                ? "Kamera 02 - Forum Bahtsul Masail"
                                : "Kamera 03 - Media Press Room B"}
                          </span>
                        </div>
                        <span className="text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur font-mono">
                          1080p HD
                        </span>
                      </div>
 
                      {/* Video graphic middle content */}
                      <div className="absolute inset-0 bg-emerald-950/40 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-center space-y-3 p-4">
                          <Tv className="w-16 h-16 text-brand-green animate-bounce mx-auto" />
                          <div className="text-[10px] font-mono font-bold text-white tracking-widest bg-black/55 px-3.5 py-1.5 rounded-full inline-block">
                            {activeCamera === "plenary" 
                              ? "MENAMPILKAN: REKAMAN SIARAN PLENARY HALL UTAMA" 
                              : activeCamera === "bahtsul" 
                                ? "MENAMPILKAN: REKAMAN FORUM BAHTSUL MASAIL"
                                : "MENAMPILKAN: REKAMAN MEDIA PRESS ROOM B"}
                          </div>
                          <p className="text-[10px] text-slate-350">Hub digital aman & terenkripsi oleh Humas PBNU.</p>
                        </div>
                      </div>

                      {/* Bottom Bar Controls */}
                      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center text-white z-10 mt-auto">
                        <div className="flex items-center space-x-3">
                          <button 
                            className="text-white hover:text-brand-gold"
                            onClick={() => setIsSimulatedStreaming(false)}
                            title="Hentikan Siaran"
                          >
                            <span className="text-[10px] bg-red-650 hover:bg-red-700 font-extrabold px-3 py-1.5 rounded-full transition-all">HENTIKAN TEST</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">● SIGNAL EXCELLENT</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
                      <AlertCircle className="w-12 h-12 text-slate-400 mb-2" />
                      <h4 className="text-lg font-bold">Siaran Belum Dimulai / Dijeda</h4>
                      <p className="text-slate-405 text-xs mt-1 max-w-sm mb-4">
                        Siaran langsung hanya diaktifkan oleh panitia publikasi sesuai jadwal persidangan yang berhak dipublikasikan.
                      </p>
                      <button
                        onClick={() => setIsSimulatedStreaming(true)}
                        className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-5 py-3 rounded-full shadow-sm"
                      >
                        Mulai Simulasi Penyiaran
                      </button>
                    </div>
                  )}

                </div>

                {/* Camera Selector Buttons */}
                <div className="bg-[#FAF9F5] border border-brand-border rounded-[24px] p-5">
                  <span className="text-[10px] font-mono text-brand-green uppercase tracking-widest font-extrabold block mb-3">
                    Ganti Jalur Sudut Pandang Kamera (Camera Feeds)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "plenary", label: "01. Plenary Hall" },
                      { id: "bahtsul", label: "02. Bahtsul Masail" },
                      { id: "media", label: "03. Press Room" }
                    ].map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => {
                          setActiveCamera(cam.id);
                          setIsSimulatedStreaming(true);
                        }}
                        className={`px-3 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                          activeCamera === cam.id
                            ? "bg-brand-green text-white border-brand-green shadow-xs"
                            : "bg-white text-slate-650 border-brand-border hover:bg-brand-softgreen/50"
                        }`}
                      >
                        {cam.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Now broadcasting text content info */}
                <div className="bg-white border border-brand-border rounded-[24px] p-6 space-y-4 shadow-sm">
                  <div>
                    <span className="text-[10px] font-mono text-brand-green font-bold uppercase">SEDANG DISIARKAN</span>
                    <h3 className="text-lg font-black text-brand-darkgreen mt-0.5">{currentRunningAgenda.title}</h3>
                    <p className="text-slate-655 mt-1 text-xs">{currentRunningAgenda.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-[11px]">
                    <div>
                      <strong className="text-slate-800">Waktu Mulai:</strong> {currentRunningAgenda.time}
                    </div>
                    <div>
                      <strong className="text-slate-800">Koordinat Tempat:</strong> {currentRunningAgenda.location}
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 3: Live chat simulator with jemaah reactions */}
              <div className="bg-white border border-brand-border rounded-[24px] overflow-hidden flex flex-col justify-between h-[450px] lg:h-auto shadow-xs hover:shadow-sm transition-all duration-300">
                
                {/* Header */}
                <div className="bg-brand-green text-white p-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">OPINION LIVE BAR CHAT</span>
                  </div>
                  <p className="text-[10px] text-emerald-100 mt-0.5">Umpan balik publik interaktif nusantara</p>
                </div>

                {/* Chat items list wrapper */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs" id="chat-scroller">
                  {simulatedChats.map((chat, idx) => (
                    <div key={idx} className="bg-[#FAF9F5] border border-brand-border p-3 rounded-2xl">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-brand-green font-extrabold text-[11px] truncate">{chat.name}</strong>
                        <span className="text-[9px] text-slate-400 font-mono">{chat.time}</span>
                      </div>
                      <p className="text-slate-650 leading-tight">{chat.message}</p>
                    </div>
                  ))}
                </div>

                {/* Form to submit simulated chat reaction */}
                <form onSubmit={handleSimulateChat} className="p-4 border-t border-brand-border bg-[#FAF9F5]">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="flex-grow bg-white border border-brand-border rounded-full px-4 py-2.5 text-xs focus:ring-1 focus:ring-brand-green focus:outline-none"
                      placeholder="Tinggalkan pesan anda..."
                      value={simulatedChatText}
                      onChange={(e) => setSimulatedChatText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-full"
                    >
                      Kirim
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono mt-1.5 w-full text-center">
                    Gunakan bahasa santun & khusyuk mencerminkan adab nahdliyin.
                  </p>
                </form>

              </div>

            </div>

            {/* Simulated Live broadcast Archives */}
            <div className="mt-12">
              <h3 className="text-xl font-black text-brand-darkgreen font-display mb-6 pb-2 border-b border-brand-border/80">
                Arsip Rekaman Siaran Selesai (Broadcast Archives)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Sidang Paripurna I", duration: "2 jam 45 menit", date: "Hari 1", tag: "Pleno" },
                  { title: "Penyampaian Sumpah Jabatan Syuriyah", duration: "1 jam 20 menit", date: "Hari 2", tag: "Syuriyah" },
                  { title: "Konferensi Pers Bahtsul Masail", duration: "45 menit", date: "Hari 2", tag: "Media" },
                  { title: "Upacara Menyanyikan Ya Lal Wathan", duration: "12 menit", date: "Hari 1", tag: "Pembukaan" }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-brand-border rounded-[24px] p-5 flex flex-col justify-between hover:border-brand-green/20 hover:shadow-xs cursor-pointer transition-all duration-300 group"
                  >
                    <div>
                      <div className="aspect-video bg-emerald-950 flex items-center justify-center rounded-2xl relative overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-black/40"></div>
                        <Play className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[9px] font-mono tracking-wider px-2.5 py-0.5 bg-brand-softgreen text-brand-green rounded-full border border-brand-green/15 font-bold uppercase">
                        {item.tag}
                      </span>
                      <h4 className="text-xs font-black text-brand-darkgreen mt-2 leading-tight group-hover:text-brand-green transition-colors">{item.title}</h4>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-100">
                      <span>Durasi: {item.duration}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/*                    4. JELAJAH MUKTAMAR                  */}
        {/* ======================================================== */}
        {currentPage === "jelajah" && (
          <div id="page-jelajah" className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header section */}
            <div className="border-b border-brand-border/80 pb-6 mb-8">
              <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest block mb-1">
                EXHIBITION STATE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-darkgreen">
                Jelajah Pengetahuan Muktamar NU
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                Mengenal lebih dalam peranan luhur para muktamirin, makna historis keagamaan moderat di Nusantara, serta tema-tema digital berkelanjutan yang digaungkan dalam Muktamar NU ke-35 Semarang.
              </p>
            </div>

            {/* Layout Grid details */}
            <div className="space-y-12">
              
              {/* Row 1 - Narrative and Mission split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-brand-darkgreen font-display">
                    Apa itu Muktamar Nahdlatul Ulama?
                  </h3>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-light">
                    Muktamar Nahdlatul Ulama merupakan forum permusyawaratan tertinggi dalam jam’iyah NU. Diadakan secara berkala, forum monumental ini mempertemukan ribuan delegasi dari Pengurus Wilayah (PWNU), Pengurus Cabang (PCNU), serta jemaah internasional untuk bersama menetapkan kemudi strategis kemaslahatan umat.
                  </p>
                  <p className="text-slate-655 text-xs sm:text-sm leading-relaxed font-light">
                    Melalui rujukan keagamaan moderat (Ahlussunnah wal Jama'ah An-Nahdliyah), Muktamar tidak sekadar berfokus pada dinamika struktural organisasi, namun merembukkan isu keadilan perundang-undangan nasional, ketimpangan ekonomi kerakyatan, kesenjangan energi hijau daerah, hingga kedaulatan teknologi informasi.
                  </p>
                </div>
                <div className="lg:col-span-5 bg-gradient-to-br from-brand-deepgreen to-brand-darkgreen text-white p-6 sm:p-8 rounded-[32px] border border-brand-gold/15 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Award className="w-48 h-48 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-brand-gold font-mono">TEMA & KEY CONCEPTS</h4>
                  <ul className="space-y-3.5 mt-4 text-xs">
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                      <span><strong>Kedaulatan Digital Terpadu:</strong> Mengukuhkan ekosistem perangkat lunak maslahah nasional besutan kader internal.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                      <span><strong>Transisi Energi dan Karbon:</strong> Meninjau kesesuaian ekologis melestarikan alam dalam rujukan hukum fikih warisan kiai sepuh.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                      <span><strong>Sinergi Kesejahteraan Santri:</strong> Pemberdayaan jaringan UMKM daerah menopang daya hidup umat.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Historical Timeline Map */}
              <div className="bg-[#FAF9F5] border border-brand-border rounded-[32px] p-6 sm:p-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h3 className="text-xl sm:text-2xl font-black text-brand-darkgreen font-display">
                    Muktamar dalam Lintasan Kilasan Sejarah PBNU
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Evolusi Khidmah perjuangan Nahdlatul Ulama dari masa pendirian pra-kemerdekaan hingga loncatan modern.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {MOCK_MILESTONES.map((milestone, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-brand-border rounded-[24px] p-6 relative hover:border-brand-green/20 hover:shadow-xs transition-all duration-300 group"
                    >
                      <div className="text-2xl font-black font-mono text-brand-green border-b border-slate-105 pb-2 mb-3.5">
                        {milestone.year}
                      </div>
                      <h4 className="text-xs font-black text-brand-darkgreen leading-tight group-hover:text-brand-green transition-colors">{milestone.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/*                     5. RILIS RESMI                       */}
        {/* ======================================================== */}
        {currentPage === "rilis-resmi" && (
          <div id="page-rilis-resmi" className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header section */}
            <div className="border-b border-brand-border/80 pb-6 mb-8">
              <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest block mb-1">
                OFFICIAL PRESSROOM
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-darkgreen">
                Rilis Resmi & Kabar Terverifikasi
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                Portal rilis pers pusat informasi Muktamar NU ke-35. Menyajikan pernyataan otentik resmi dari jajaran pengurus pengarah (SC) guna menangkal sebaran berita bohong.
              </p>
            </div>

            {/* Interactivity Control Hub: Search and category filters */}
            <div className="bg-[#FAF9F5] border border-brand-border rounded-[24px] p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Search Term Input */}
                <div className="relative md:col-span-2">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Search className="w-4 h-4 text-brand-green" />
                  </span>
                  <input
                    type="text"
                    className="w-full bg-white border border-brand-border rounded-full px-4 py-2.5 pl-11 text-xs sm:text-sm focus:ring-1 focus:ring-brand-green focus:outline-none focus:border-brand-green"
                    placeholder="Masukkan kata kunci judul rilis..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                  />
                  {newsSearch && (
                    <button 
                      onClick={() => setNewsSearch("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {/* Category Selection Dropdown */}
                <div>
                  <select
                    className="w-full bg-white border border-brand-border rounded-full px-4 py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-brand-green focus:outline-none font-mono font-bold text-brand-darkgreen"
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Rilis Resmi">Rilis Resmi</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Update Harian">Update Harian</option>
                    <option value="Sorotan">Sorotan</option>
                    <option value="Konferensi Pers">Konferensi Pers</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Total count display */}
            <div className="text-xs text-[#667085] font-mono mb-6">
              Ditemukan {filteredNews.length} rilis kabar resmi dari pencarian & kategori yang disaring.
            </div>

            {/* News Grid Column layout */}
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="news-grid-container-page">
                {filteredNews.map((news) => (
                  <article 
                    key={news.id} 
                    className="bg-white border border-brand-border rounded-[24px] overflow-hidden flex flex-col justify-between hover:border-brand-green/20 hover:shadow-sm transition-all duration-350 group"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-brand-softgreen text-brand-green font-mono font-extrabold text-[9px] px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-brand-green/10">
                          {news.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{news.date}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-brand-darkgreen font-display leading-snug line-clamp-2 group-hover:text-brand-green transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-[#64748B] text-xs mt-2 line-clamp-3 leading-relaxed font-light">
                        {news.summary}
                      </p>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => setSelectedNewsDetail(news)}
                        className="w-full bg-[#FAF9F5] hover:bg-brand-softgreen/50 text-slate-700 hover:text-brand-green font-extrabold text-xs py-3 rounded-full text-center border border-brand-border transition-all duration-200 block"
                      >
                        Mulai Baca Selengkapnya
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-brand-border rounded-[32px]">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Rilis Kabar Tidak Ditemukan</h4>
                <p className="text-xs text-slate-450 mt-1">Coba saring kembali menggunakan kata kunci atau tipe kategori lainnya.</p>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/*                    6. MEDIA CENTER                       */}
        {/* ======================================================== */}
        {currentPage === "media-center" && (
          <div id="page-media-center" className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header section */}
            <div className="border-b border-brand-border/80 pb-6 mb-8">
              <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest block mb-1">
                JOURNALIST DESK
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-darkgreen">
                Media Center & Akreditasi Liputan
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed font-light">
                Pusat pengunduhan berkas media kit resmi Muktamar, formulir akreditasi peliputan mandiri di Semarang, serta koordinat hubungan kontak humas komite.
              </p>
            </div>

            {/* Asset Download Panel Grid */}
            <div className="space-y-12">
              
              <div>
                <h3 className="text-lg font-black text-brand-green font-display mb-4 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-brand-green" />
                  <span>Aset Digital Publikasi (Official Assets)</span>
                </h3>
                
                {downloadSuccess && (
                  <div className="bg-brand-softgreen border border-brand-green/20 text-brand-green p-3.5 rounded-full text-xs mb-4 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sukses menginisiasi pengunduhan: <strong>{downloadSuccess}</strong></span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_MEDIA_ASSETS.map((asset) => (
                    <div 
                      key={asset.id} 
                      className="bg-white border border-brand-border rounded-[24px] p-5 flex flex-col justify-between hover:border-brand-green/20 hover:shadow-xs transition-all duration-300 group"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="bg-brand-softgreen text-brand-green font-mono font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-brand-green/10">
                            {asset.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{asset.size}</span>
                        </div>
                        <h4 className="text-xs font-black text-brand-darkgreen leading-tight group-hover:text-brand-green transition-colors">{asset.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-light">
                          {asset.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleDownloadAsset(asset.title)}
                          className="w-full bg-[#FAF9F5] hover:bg-brand-softgreen/50 hover:text-brand-green text-slate-700 font-extrabold text-[10px] py-2.5 rounded-full text-center border border-brand-border transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Download className="w-3 h-3 text-brand-green" />
                          <span>Mulai Mengunduh</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Press Conference Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Press Schedule Table (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-lg font-black text-brand-darkgreen font-display mb-4">
                    Jadwal Konferensi Pers Harian (Humas Unit)
                  </h3>
                  
                  <div className="space-y-3.5">
                    {MOCK_PRESS_CONFERENCES.map((conf) => (
                      <div key={conf.id} className="bg-white border border-brand-border rounded-[24px] p-5 flex flex-col justify-between hover:border-brand-green/10 hover:shadow-3xs transition-shadow">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="bg-brand-softgreen text-brand-green font-mono font-extrabold text-[9px] px-3 py-1 rounded-full uppercase border border-brand-green/10">
                            {conf.time}
                          </span>
                          <span className="text-[10px] text-[#A37B24] font-bold font-mono">{conf.location}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-brand-darkgreen leading-tight">
                          {conf.title}
                        </h4>
                        <p className="text-[11px] text-[#475467] mt-1 font-light">
                          Narasumber Utama: <strong className="text-slate-800 font-semibold">{conf.speaker}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Media / Help Form (5 Cols) */}
                <div className="lg:col-span-5 bg-[#FAF9F5] border border-brand-border rounded-[32px] p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-black text-brand-darkgreen font-display mb-2">
                    Pengajuan Bantuan Liputan
                  </h3>
                  <p className="text-xs text-slate-605 mb-4 leading-relaxed font-light">
                    Ajukan kendala penyiaran pers atau slot pertanyaan konferensi langsung kepada asisten humas panitia:
                  </p>

                  {contactFormSubmitted ? (
                    <div className="bg-brand-green text-white p-4 rounded-3xl text-xs text-center space-y-1">
                      <strong className="block text-sm">✓ Permintaan Dikirim!</strong>
                      <span>Hub panitia media akan menghubungi pers bersangkutan via email segera.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4.5">
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-brand-green font-bold mb-1">Nama Jurnalis / Media</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-brand-border text-xs text-slate-705 rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                          placeholder="Contoh: Media Santri Utama"
                          value={contactFormName}
                          onChange={(e) => setContactFormName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-brand-green font-bold mb-1">Email Profesional</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-white border border-brand-border text-xs text-slate-705 rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                          placeholder="nama@institusi.com"
                          value={contactFormEmail}
                          onChange={(e) => setContactFormEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-brand-green font-bold mb-1">Pertanyaan / Pesan Kebutuhan</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full bg-white border border-brand-border text-xs text-slate-705 rounded-[18px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                          placeholder="Sebutkan slot liputan khusus yang dibutuhkan..."
                          value={contactFormMsg}
                          onChange={(e) => setContactFormMsg(e.target.value)}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase py-3.5 rounded-full shadow-sm hover:shadow transition-all"
                      >
                        Kirim Pengajuan
                      </button>
                    </form>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-150 text-[10px] text-slate-450 font-mono space-y-1">
                    <div>EMAIL UTAMA: media.center@nu.or.id</div>
                    <div>WHATSAPP UNIT: +62 812-3456-7890</div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/*                       7. PANDUAN                         */}
        {/* ======================================================== */}
        {currentPage === "panduan" && (
          <div id="page-panduan" className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header section */}
            <div className="border-b border-brand-border/80 pb-6 mb-8">
              <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest block mb-1">
                VISITOR GUIDE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-darkgreen">
                Panduan Publik & Kunjungan
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed font-light">
                Pusat informasi logistik lapangan. Temukan FAQ penyiaran, ketetapan kedatangan, rute akses umum, serta akomodasi wisma rujukan di sekitar lokasi Semarang.
              </p>
            </div>

            {/* Layout Split: FAQ with locations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* FAQ Section (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-black text-brand-green font-display mb-4 flex items-center gap-1.5">
                  <HelpCircle className="w-5 h-5 text-brand-green" />
                  <span>Pertanyaan Sering Diajukan (FAQ Publik)</span>
                </h3>

                <div className="space-y-3.5" id="faq-accordion-group">
                  {faqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div 
                        key={faq.id} 
                        className="bg-white border border-brand-border rounded-[20px] overflow-hidden transition-all duration-300 shadow-3xs group"
                      >
                        <button
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full text-left p-5 flex justify-between items-center hover:bg-[#FAF9F5]/70 transition-colors focus:outline-none"
                        >
                          <span className="text-xs sm:text-sm font-black text-brand-darkgreen leading-snug group-hover:text-brand-green transition-colors">
                            {faq.question}
                          </span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-brand-green shrink-0 animate-fadeIn" /> : <ChevronDown className="w-4 h-4 text-brand-green shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="p-5 pt-0 border-t border-brand-border/50 text-xs text-slate-650 leading-relaxed bg-[#FAF9F5] font-light">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map/Travel Section (5 Cols) */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                
                {/* Location Grid Box */}
                <div className="bg-[#FAF9F5] border border-brand-border rounded-[32px] p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-brand-green uppercase tracking-wider font-mono border-b border-brand-border pb-2.5">
                    LOKASI VENUE TERPUSAT
                  </h3>

                  <div className="flex space-x-3 text-xs">
                    <MapPin className="text-brand-green w-6 h-6 shrink-0 pt-0.5" />
                    <div>
                      <strong className="text-slate-800 font-extrabold text-[13px]">Aula Utama Islamic Center</strong>
                      <p className="text-slate-500 mt-1 leading-snug font-light">
                        Jl. Abdulrahman Saleh No.285, Kalipancur, Kec. Ngaliyan, Kota Semarang, Jawa Tengah 50183
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic simulated coordinates Map block */}
                  <div className="aspect-video bg-emerald-950/5 rounded-2xl border border-brand-border flex items-center justify-center p-4 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-repeat bg-[radial-gradient(#11693c_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                    <div className="relative z-10 text-xs p-3">
                      <Globe className="w-8 h-8 text-brand-green animate-spin mx-auto opacity-70 mb-2" />
                      <strong className="text-brand-green block text-[11px] font-bold">KOORDINAT PRESISI MAPS:</strong>
                      <span className="text-[10px] text-slate-600 font-mono">-7.012543, 110.375620</span>
                      <p className="text-[9px] text-slate-500 mt-1">Gunakan perangkat eksternal menuju arah di atas secara lancar.</p>
                    </div>
                  </div>
                </div>

                {/* Transport and Accommodation recommendation details */}
                <div className="bg-gradient-to-br from-brand-deepgreen to-brand-darkgreen text-white rounded-[28px] p-6 border border-brand-gold/15">
                  <h4 className="text-xs font-extrabold text-brand-gold font-mono uppercase mb-3">AKOMODASI & TRANSPORTASI</h4>
                  <div className="space-y-4 text-xs font-light">
                    <div>
                      <strong className="text-brand-gold font-bold">Kedatangan Kereta/Pesawat:</strong>
                      <p className="text-emerald-100 text-[11px] leading-relaxed mt-0.5">
                        Tersedia Bis Shuttle Muktamar khusus delegasi berstiker resmi dari Stasiun Semarang Poncol, Stasiun Tawang, dan Bandara Ahmad Yani sepanjang hari.
                      </p>
                    </div>
                    <div>
                      <strong className="text-brand-gold font-bold">Keamanan Parkir Jemaah:</strong>
                      <p className="text-emerald-100 text-[11px] leading-relaxed mt-0.5">
                        Penempatan kantong parkir motor dan bus carteran disentralkan di area Kampus UIN Walisongo dengan sirkulasi bis pengumpan menuju ring luar lokasi muktamar.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* ----------------- MODAL DRAWER: AGENDA DETAILS ----------------- */}
      {selectedAgendaDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-brand-border rounded-[28px] w-full max-w-xl overflow-hidden shadow-2xl">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-brand-deepgreen to-brand-darkgreen text-white p-6 flex justify-between items-start border-b border-brand-border/10">
              <div>
                <span className="text-[10px] font-mono text-brand-gold font-bold uppercase tracking-widest block mb-1">
                  RINCIAN PROGRAM PERSIDANGAN
                </span>
                <h3 className="text-lg sm:text-xl font-black font-display leading-tight">
                  {selectedAgendaDetail.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAgendaDetail(null)}
                className="text-emerald-100 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content pane */}
            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-650">
              
              <div className="grid grid-cols-2 gap-4 bg-[#FAF9F5] border border-brand-border p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Status Acara</span>
                  <strong className="text-brand-green font-extrabold">{selectedAgendaDetail.status}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Ketentuan Akses</span>
                  <strong className="text-brand-darkgreen font-bold">{selectedAgendaDetail.access}</strong>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Jadwal Alur</span>
                  <strong className="text-slate-800 font-extrabold font-mono">{selectedAgendaDetail.time}</strong>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Kode Tempat</span>
                  <strong className="text-[#A37B24] font-extrabold">{selectedAgendaDetail.location}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-brand-green font-extrabold block">Gambaran Agenda Lengkap</span>
                <p className="leading-relaxed text-slate-600 text-xs sm:text-sm font-light">
                  {selectedAgendaDetail.description}
                </p>
                <p className="leading-relaxed text-slate-500 text-[11px] font-light">
                  Seluruh hasil perumusan draf awal kiai rujukan pada pokok bahasan terkait akan disebarkan berbentuk naskah digital pasca rapat pleno gabungan berhasil menemui mufakat sah.
                </p>
              </div>

              {selectedAgendaDetail.status === "Live" && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-center">
                  <p className="text-xs text-red-700 font-bold">Siaran langsung sedang berjalan aktif saat ini!</p>
                  <button
                    onClick={() => {
                      setSelectedAgendaDetail(null);
                      navigateTo("live");
                    }}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full inline-block tracking-wide shadow-sm transition-colors"
                  >
                    Masuk Studio Siaran & Tonton
                  </button>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-5 bg-[#FAF9F5]/50 border-t border-brand-border/70 text-right">
              <button
                onClick={() => setSelectedAgendaDetail(null)}
                className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-6 py-3 rounded-full transition-colors"
              >
                Kembali
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- MODAL DRAWER: NEWS DETAILS ----------------- */}
      {selectedNewsDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-brand-border rounded-[28px] w-full max-w-2xl overflow-hidden shadow-2xl">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-brand-deepgreen to-brand-darkgreen text-white p-6 flex justify-between items-start border-b border-brand-border/10">
              <div>
                <span className="text-[10px] font-mono text-brand-gold font-bold uppercase tracking-widest block mb-1">
                  KABAR & STATEMENT PERS RESMI
                </span>
                <h3 className="text-base sm:text-lg lg:text-xl font-black font-display leading-tight">
                  {selectedNewsDetail.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedNewsDetail(null)}
                className="text-emerald-100 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content pane */}
            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-650 max-h-[400px] overflow-y-auto">
              
              <div className="flex justify-between items-center text-xs text-slate-500 border-b pb-2 mb-4">
                <span>Kategori: <strong className="text-brand-green font-bold">{selectedNewsDetail.category}</strong></span>
                <span>Tanggal Rilis: <strong className="font-mono">{selectedNewsDetail.date}</strong></span>
              </div>

              <div className="italic text-slate-600 bg-[#FAF9F5] border-l-4 border-brand-green px-4 py-3 rounded-r-2xl text-xs leading-relaxed border border-brand-border border-y-brand-border border-r-brand-border">
                "{selectedNewsDetail.summary}"
              </div>

              <div className="whitespace-pre-line leading-relaxed text-[#334155] text-xs sm:text-sm pt-2 space-y-4 font-light">
                {selectedNewsDetail.content}
              </div>

              <div className="bg-brand-softgreen/50 border border-brand-green/10 p-5 rounded-2xl text-xs mt-6">
                <strong className="text-brand-green block mb-1.5 font-bold font-mono text-[9px] tracking-wider uppercase">Disclaimer Informasi Terverifikasi:</strong>
                <p className="text-[#344054] leading-relaxed text-[11px] font-light">
                  Rilis kabar resmi ini diterbitkan secara tunggal oleh jajaran Komite Publikasi Humas PBNU untuk wilayah Muktamar Nahdlatul Ulama ke-35 Semarang. Penyebaran ulang naskah disarankan senantiasa mematuhi regulasi media siber indonesia.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 bg-[#FAF9F5]/50 border-t border-brand-border/70 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">Penerbit: Humas Panitia Muktamar</span>
              <button
                onClick={() => setSelectedNewsDetail(null)}
                className="bg-brand-green hover:bg-brand-deepgreen text-white font-extrabold text-xs uppercase px-6 py-3 rounded-full transition-colors"
              >
                Tutup Batas Baca
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-brand-darkgreen text-white border-t-2 border-brand-gold pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Logo and brief (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-brand-green border border-brand-gold flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" />
                    <path d="M3 12h18" />
                    <path d="m11 11 1-2 1 2M8 8V7M16 8V7M9 16l3-1 3 1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-display uppercase tracking-wider">
                    Muktamar NU ke-35
                  </h3>
                  <p className="text-[11px] text-brand-gold font-semibold uppercase tracking-widest font-mono">
                    Pusat Informasi Hub Resmi
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Portal komunikasi digital independen yang menyajikan rangkaian data agenda aktual terakreditasi, siaran audio-visual jernih, rilisan kabar sahih, serta berkas media kit penunjang jurnalis nasional di Semarang.
              </p>

              <div className="pt-2 text-xs text-brand-gold font-semibold">
                "Menuju Digdaya NU Menjemput Abad Kedua."
              </div>
            </div>

            {/* Quick links sitemap (3 Cols) */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold font-mono border-b border-brand-gold/15 pb-2">
                PETA SITUS HUB
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { key: "beranda", label: "Utama Beranda" },
                  { key: "agenda", label: "Program & Agenda" },
                  { key: "live", label: "Broadcast Live TV" },
                  { key: "jelajah", label: "Jelajah Sejarah NU" },
                  { key: "rilis-resmi", label: "Daftar Rilis Resmi" },
                  { key: "media-center", label: "Kanal Media Center" },
                  { key: "panduan", label: "Panduan Lokasi & FAQ" }
                ].map((item) => (
                  <li key={item.key}>
                    <button 
                      onClick={() => navigateTo(item.key)}
                      className="text-slate-300 hover:text-brand-gold transition-colors block text-left hover:underline"
                    >
                      &rarr; {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hub Contact details (4 Cols) */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold font-mono border-b border-brand-gold/15 pb-2">
                KONTAK UTAMA PANITIA
              </h4>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>
                    Sekretariat Pelaksana Muktamar ke-35, Islamic Center, Semarang, Jawa Tengah.
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>muktamar35@nu.or.id</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>+62 812-3456-7890 (Humas)</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block uppercase font-mono mb-2">SOSIAL MEDIA RESMI</span>
                <div className="flex space-x-3.5 text-slate-305">
                  {["Instagram", "YouTube", "Twitter / X", "Facebook"].map((soc, idx) => (
                    <span 
                      key={idx}
                      className="text-[11px] text-slate-300 hover:text-brand-gold cursor-pointer transition-colors hover:underline"
                      title={`Portal ${soc}`}
                    >
                      {soc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Legal Bar */}
          <div className="pt-8 border-t border-brand-gold/15 text-center text-xs text-slate-400 space-y-2">
            <p>
              Hak Cipta Terpelihara &copy; 2026 Pengurus Besar Nahdlatul Ulama (PBNU). Seluruh rujukan konten sah mutlak diproduksi berkala oleh Komite Pelaksana Muktamar NU ke-35.
            </p>
            <p className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5 flex-wrap">
              <span>Situs ini dikembangkan secara murni dan disebarluaskan untuk pusat informasi publik nasional.</span>
              <span>•</span>
              <button 
                onClick={() => navigateTo("cms")} 
                className="text-brand-gold hover:text-yellow-400 underline font-semibold transition-colors cursor-pointer"
              >
                Kemudi Admin Room (CMS)
              </button>
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
