/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Home,
  Calendar,
  Tv,
  FileText,
  Image as ImageIcon,
  FolderKanban,
  Map,
  HelpCircle,
  Megaphone,
  Settings,
  Users,
  History,
  Search,
  Plus,
  Trash,
  Edit2,
  Check,
  X,
  Lock,
  Shield,
  Activity,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Camera,
  CheckCircle2,
  Globe,
  Sliders
} from "lucide-react";

import {
  getSavedAgenda,
  saveAgenda,
  getSavedNews,
  saveNews,
  getSavedFAQ,
  saveFAQ,
  getSavedHero,
  saveHero,
  getSavedLiveBar,
  saveLiveBar,
  getSavedLiveStream,
  saveLiveStream,
  getSavedAnnouncements,
  saveAnnouncements,
  getSavedSettings,
  saveSettings,
  getSavedUsers,
  saveUsers,
  getSavedAuditLogs,
  createAuditLog,
  HeroConfig,
  LiveBarConfig,
  LiveStreamConfig,
  AnnouncementItem,
  WebsiteSettings,
  UserItem,
  AuditLog
} from "./state";

import { AgendaItem, NewsItem, FAQItem } from "./data";

interface CmsControllerProps {
  onBackToPortal: () => void;
}

export default function CmsController({ onBackToPortal }: CmsControllerProps) {
  // Authentication & Role
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("muktamar35_cms_is_logged_in") === "true";
  });
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Core CMS Data States loaded from LocalStorage
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [liveBar, setLiveBar] = useState<LiveBarConfig | null>(null);
  const [liveStream, setLiveStream] = useState<LiveStreamConfig | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Active Selected User Role for Previewing Permission Matrix
  const [currentUserRole, setCurrentUserRole] = useState<string>("Super Admin");

  // Selection/Input Edit states
  const [editingAgenda, setEditingAgenda] = useState<Partial<AgendaItem> | null>(null);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [editingAnn, setEditingAnn] = useState<Partial<AnnouncementItem> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<UserItem> | null>(null);

  // Search/Filters in CMS tables
  const [agendaSearch, setAgendaSearch] = useState("");
  const [agendaFilterDay, setAgendaFilterDay] = useState<string>("Semua");
  const [newsSearch, setNewsSearch] = useState("");
  const [newsFilterCat, setNewsFilterCat] = useState<string>("Semua");

  // Load everything on mount
  useEffect(() => {
    setAgendas(getSavedAgenda());
    setNews(getSavedNews());
    setFaqs(getSavedFAQ());
    setHero(getSavedHero());
    setLiveBar(getSavedLiveBar());
    setLiveStream(getSavedLiveStream());
    setAnnouncements(getSavedAnnouncements());
    setSettings(getSavedSettings());
    setUsers(getSavedUsers());
    setAuditLogs(getSavedAuditLogs());
  }, []);

  const triggerAlert = (text: string, type: "success" | "error" = "success") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const currentActiveUser = useMemo(() => {
    return users.find(u => u.role === currentUserRole) || { name: "Operator Panitia", email: "panitia@pbnu.or.id" };
  }, [users, currentUserRole]);

  // Log activity wrapper
  const logActivity = (action: string, module: string, details: string) => {
    createAuditLog(currentActiveUser.name, currentUserRole, action, module, details);
    setAuditLogs(getSavedAuditLogs());
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      localStorage.setItem("muktamar35_cms_is_logged_in", "true");
      logActivity("Login", "Autentikasi", "Pengendali masuk ke sistem event control");
      triggerAlert("Selamat datang di Muktamar NU ke-35 Event Control Panel!");
    } else {
      setLoginError("Kombinasi surel / sandi tidak terdaftar sebagai panitia.");
    }
  };

  const handleLogout = () => {
    logActivity("Logout", "Autentikasi", "Pengendali keluar dari sistem");
    setIsLoggedIn(false);
    localStorage.removeItem("muktamar35_cms_is_logged_in");
  };

  // CHECK PERMISSIONS helper
  const canPerform = (action: "view" | "create" | "edit" | "publish" | "delete" | "approve") => {
    if (currentUserRole === "Super Admin") return true;
    if (currentUserRole === "Reviewer") {
      return ["view", "approve", "publish"].includes(action);
    }
    if (currentUserRole === "Editor") {
      return ["view", "create", "edit"].includes(action);
    }
    if (currentUserRole === "Media Officer") {
      return ["view", "create", "edit"].includes(action); // Can edit media center resources
    }
    if (currentUserRole === "Live Operator") {
      return ["view", "edit", "publish"].includes(action); // Focus on active live statuses
    }
    return false;
  };

  // UPDATE ACTIONS: Agenda
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgenda) return;
    if (!canPerform("edit")) {
      triggerAlert("Akses ditolak: Peran Anda tidak memiliki izin mengedit agenda.", "error");
      return;
    }

    let updatedList: AgendaItem[];
    const isNew = !editingAgenda.id;

    if (isNew) {
      const newItem: AgendaItem = {
        id: "agenda_" + Date.now(),
        time: editingAgenda.time || "08.00 - 10.00 WIB",
        title: editingAgenda.title || "Agenda Baru",
        location: editingAgenda.location || "Aula Utama",
        status: editingAgenda.status || "Akan Berlangsung",
        access: editingAgenda.access || "Terbuka untuk Publik",
        description: editingAgenda.description || "",
        day: editingAgenda.day || 1
      };
      updatedList = [...agendas, newItem];
      logActivity("Tambah Agenda", "Agenda", `Menambahkan agenda baru: ${newItem.title}`);
    } else {
      updatedList = agendas.map((item) =>
        item.id === editingAgenda.id ? { ...item, ...editingAgenda } as AgendaItem : item
      );
      logActivity("Ubah Agenda", "Agenda", `Mengubah data agenda: ${editingAgenda.title}`);
    }

    setAgendas(updatedList);
    saveAgenda(updatedList);
    setEditingAgenda(null);
    triggerAlert("Agenda berhasil diperbarui!");
  };

  const handleDeleteAgenda = (id: string, title: string) => {
    if (!canPerform("delete")) {
      triggerAlert("Akses ditolak: Anda tidak diizinkan menghapus agenda.", "error");
      return;
    }
    const updated = agendas.filter(item => item.id !== id);
    setAgendas(updated);
    saveAgenda(updated);
    logActivity("Hapus Agenda", "Agenda", `Menghapus agenda: ${title}`);
    triggerAlert("Agenda berhasil dihapus.");
  };

  const handleSetNowHappening = (item: AgendaItem) => {
    if (!canPerform("edit")) {
      triggerAlert("Akses ditolak karena batasan peran.", "error");
      return;
    }
    // Set all other items currently "Live" to "Selesai" or "Akan Berlangsung" and this item to "Live"
    const nextAgendas = agendas.map(a => {
      if (a.id === item.id) {
        return { ...a, status: "Live" as const };
      }
      if (a.status === "Live") {
        return { ...a, status: "Selesai" as const };
      }
      return a;
    });
    setAgendas(nextAgendas);
    saveAgenda(nextAgendas);

    // Sync live bar text too!
    if (liveBar) {
      const updatedBar = {
        ...liveBar,
        manualText: `Live Sekarang: ${item.title} — saksikan di menu Live`
      };
      setLiveBar(updatedBar);
      saveLiveBar(updatedBar);
    }

    logActivity("Set Agenda Sebagai Live", "Agenda", `Menetapkan '${item.title}' sebagai agenda utama yang sedang berlangsung`);
    triggerAlert(`'${item.title}' sekarang diset sedang berlangsung (Live)!`);
  };

  // UPDATE ACTIONS: News
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    if (!canPerform("edit")) {
      triggerAlert("Akses ditolak karena kebijakan peran.", "error");
      return;
    }

    let updatedNews: NewsItem[];
    const isNew = !editingNews.id;

    if (isNew) {
      const newItem: NewsItem = {
        id: "news_" + Date.now(),
        category: editingNews.category || "Rilis Resmi",
        date: "29 Mei 2026",
        title: editingNews.title || "Rilis Konten Baru",
        summary: editingNews.summary || "",
        content: editingNews.content || ""
      };
      updatedNews = [newItem, ...news];
      logActivity("Tambah Rilis Berita", "Rilis Resmi", `Menulis rilis baru: ${newItem.title}`);
    } else {
      updatedNews = news.map(item =>
        item.id === editingNews.id ? { ...item, ...editingNews } as NewsItem : item
      );
      logActivity("Edit Rilis Berita", "Rilis Resmi", `Mengupdate rilis berita: ${editingNews.title}`);
    }

    setNews(updatedNews);
    saveNews(updatedNews);
    setEditingNews(null);
    triggerAlert("Naskah berita/rilis berhasil diterbitkan!");
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (!canPerform("delete")) {
      triggerAlert("Akses ditolak.", "error");
      return;
    }
    const updated = news.filter(item => item.id !== id);
    setNews(updated);
    saveNews(updated);
    logActivity("Hapus Rilis Berita", "Rilis Resmi", `Menghapus artikel: ${title}`);
    triggerAlert("Artikel rilis berhasil diarsipkan.");
  };

  // UPDATE ACTIONS: LIVE CENTER CONTROL
  const handleUpdateLiveStreamState = (isLive: boolean) => {
    if (!canPerform("edit")) {
      triggerAlert("Akses ditolak.", "error");
      return;
    }
    if (liveStream) {
      const updated = { ...liveStream, isLive };
      setLiveStream(updated);
      saveLiveStream(updated);
      logActivity("Ubah Status Penyiaran", "Live Center", `Mengubah status pemancar video live menjadi: ${isLive ? 'Aktif' : 'Nonaktif'}`);
      triggerAlert(isLive ? "Pemancar live streaming diaktifkan" : "Pemancar live streaming diistirahatkan");
    }
  };

  const handleSaveLiveStreamConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveStream || !canPerform("edit")) return;
    saveLiveStream(liveStream);
    logActivity("Update Live Broadcast URL", "Live Center", `Memperbarui ID YouTube Streaming: ${liveStream.youtubeId}`);
    triggerAlert("Konfigurasi live streaming disimpan.");
  };

  // UPDATE ACTIONS: FAQ
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !canPerform("edit")) return;
    let nextList: FAQItem[];
    if (!editingFaq.id) {
      const newItem = {
        id: "faq_" + Date.now(),
        question: editingFaq.question || "Pertanyaan Baru?",
        answer: editingFaq.answer || "Jawaban resmi terkait hal tersebut."
      };
      nextList = [...faqs, newItem];
      logActivity("Tambah FAQ", "Panduan Publik", `Menambahkan FAQ baru: ${newItem.question}`);
    } else {
      nextList = faqs.map(f => f.id === editingFaq.id ? { ...f, ...editingFaq } as FAQItem : f);
      logActivity("Ubah FAQ", "Panduan Publik", `Mengubah FAQ: ${editingFaq.question}`);
    }
    setFaqs(nextList);
    saveFAQ(nextList);
    setEditingFaq(null);
    triggerAlert("Tanya-jawab publik diperbarui!");
  };

  const handleDeleteFaq = (id: string, q: string) => {
    const next = faqs.filter(f => f.id !== id);
    setFaqs(next);
    saveFAQ(next);
    logActivity("Hapus FAQ", "Panduan Publik", `Menghapus FAQ: ${q}`);
    triggerAlert("Tanya jawab berhasil dihapus.");
  };

  // UPDATE ACTIONS: HOMEPAGE CONTROL & HERO
  const handleUpdateHeroConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero || !canPerform("edit")) return;
    saveHero(hero);
    logActivity("Update Visual Hero", "Homepage Control", `Mengubah judul hero menjadi '${hero.title}' dan tahap: ${hero.currentStage}`);
    triggerAlert("Konfigurasi banner utama berhasil disimpan ke situs publik!");
  };

  const handleToggleSection = (sectionKey: string) => {
    if (!settings || !canPerform("edit")) return;
    const nextActive = {
      ...settings.activeSections,
      [sectionKey]: !settings.activeSections[sectionKey]
    };
    const nextSettings = { ...settings, activeSections: nextActive };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    logActivity("Toggle Section Tampilan", "Homepage Control", `Mengubah visibilitas modul '${sectionKey}' ke status: ${nextActive[sectionKey] ? 'Aktif' : 'Mati'}`);
    triggerAlert(`Visibilitas section '${sectionKey}' berhasil disimpan.`);
  };

  // UPDATE ACTIONS: LIVE BAR
  const handleSaveLiveBarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveBar || !canPerform("edit")) return;
    saveLiveBar(liveBar);
    logActivity("Update Live Bar Pengumuman", "Homepage Control", `Mengubah bar berjalan: ${liveBar.manualText}`);
    triggerAlert("Sticky notification bar berhasil disimpan.");
  };

  // Switch role visual trigger
  const handleRoleChange = (role: string) => {
    setCurrentUserRole(role);
    triggerAlert(`Pratinjau keamanan beralih ke peran: ${role}`);
  };

  // Filtered Agendas
  const cmsFilteredAgendas = useMemo(() => {
    return agendas.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(agendaSearch.toLowerCase()) || item.location.toLowerCase().includes(agendaSearch.toLowerCase());
      const matchesDay = agendaFilterDay === "Semua" || item.day.toString() === agendaFilterDay;
      return matchesSearch && matchesDay;
    });
  }, [agendas, agendaSearch, agendaFilterDay]);

  // Filtered News
  const cmsFilteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(newsSearch.toLowerCase()) || item.summary.toLowerCase().includes(newsSearch.toLowerCase());
      const matchesCat = newsFilterCat === "Semua" || item.category === newsFilterCat;
      return matchesSearch && matchesCat;
    });
  }, [news, newsSearch, newsFilterCat]);

  // 1. IF NOT LOGGED IN: View LOGIN CMS
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex font-plus selection:bg-brand-gold selection:text-brand-darkgreen">
        <div className="flex w-full">
          
          {/* Left panel - Prestige Dark Green NU Theme */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-darkgreen via-teal-950 to-emerald-950 items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-repeat pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23cba358' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none"></div>
            
            <div className="max-w-md relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-brand-green border border-brand-gold flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" />
                  <path d="M3 12h18" />
                  <path d="m11 11 1-2 1 2M8 8V7M16 8V7" />
                </svg>
              </div>

              <div>
                <span className="text-brand-gold font-mono text-xs font-bold tracking-widest uppercase block mb-1">MUKTAMAR CONTROL SYSTEM</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white leading-tight">
                  Muktamar NU ke-35 <br />
                  Event Control Panel
                </h1>
              </div>

              <div className="h-0.5 bg-brand-gold/30"></div>

              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Pusat komando digital panitia pelaksana. Kelola data siaran langsung, berita kepengurusan, panduan wisatawan, jurnalis terdaftar, dan status agenda sidang secara real-time dari satu gerbang komando.
              </p>

              <div className="text-xs text-brand-gold bg-brand-green/40 border border-brand-gold/20 p-3 rounded">
                💡 <span className="font-semibold">Akses Demonstrasi Resmi:</span> Gunakan nama akun dan kata sandi <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">admin</code> untuk bypass otomatis ke panel.
              </div>
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="w-full lg:w-1/2 bg-[#FAF9F5] flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              
              <div className="text-center">
                <div className="lg:hidden mx-auto w-12 h-12 rounded-full bg-brand-green border border-brand-gold flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m11 11 1-2 1 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold font-display text-slate-900">Gerbang Layanan Panitia</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Masuk untuk memperbarui alur informasi publik acara</p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">ID Pengguna / Email</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Contoh: admin"
                    className="w-full text-sm px-3.5 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-slate-50"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi</label>
                    <button type="button" className="text-[11px] text-brand-green hover:underline">Lupa sandi?</button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukan sandi"
                    className="w-full text-sm px-3.5 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-slate-50"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="remember" className="ml-2 block text-xs text-slate-600">
                    Ingat sesi masuk saya di perangkat panitia ini
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-darkgreen hover:bg-brand-green text-brand-gold font-extrabold text-xs uppercase py-3.5 rounded shadow transition-transform active:scale-95 border border-[#ecc175]/30 cursor-pointer"
                >
                  Masuk Ke Control Panel
                </button>
              </form>

              <div className="border-t border-slate-250 pt-4 flex justify-between items-center text-xs">
                <button
                  onClick={onBackToPortal}
                  className="text-slate-500 hover:text-brand-green block text-left"
                >
                  &larr; Portal Publik Muktamar
                </button>
                <span className="text-[10px] text-slate-400">PBNU IT Committee &copy; 2026</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // 2. LOGGED IN: Render full EVENT CMS layout
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 flex font-plus">
      
      {/* SIDEBAR NAVIGATION Panel */}
      <aside 
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-brand-darkgreen text-white min-h-screen transition-all duration-300 shrink-0 border-r border-[#cba358]/20 flex flex-col justify-between`}
      >
        <div>
          {/* Logo Brand top area */}
          <div className="h-20 border-b border-[#cba358]/20 flex items-center justify-between px-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-green border border-brand-gold flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xs font-bold font-display text-white uppercase tracking-wider">Muktamar ke-35</h2>
                  <p className="text-[9px] text-[#cbb585] font-mono font-bold tracking-widest leading-none">CMS HUB</p>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-8 h-8 rounded-full bg-brand-green border border-[#cba358] flex items-center justify-center">
                <span className="text-[10px] text-[#cba358] font-black">X</span>
              </div>
            )}
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-emerald-100 hover:text-white p-1 hover:bg-brand-green/20 rounded"
              title={sidebarCollapsed ? "Perluas Sidebar" : "Lipat Sidebar"}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard CMS", icon: LayoutDashboard },
              { id: "homepage", label: "Homepage Control", icon: Home },
              { id: "agenda", label: "Agenda & Ruang Sidang", icon: Calendar },
              { id: "live", label: "Live Center Studio", icon: Tv },
              { id: "rilis", label: "Rilis Resmi & Berita", icon: FileText },
              { id: "faq", label: "FAQ & Tanya Jawab", icon: HelpCircle },
              { id: "users", label: "User & Role Keamanan", icon: Users },
              { id: "logs", label: "Audit Log Sistem", icon: History }
            ].map((navItem) => {
              const Icon = navItem.icon;
              const isActive = activeTab === navItem.id;
              return (
                <button
                  key={navItem.id}
                  onClick={() => {
                    setActiveTab(navItem.id);
                    setEditingAgenda(null);
                    setEditingNews(null);
                    setEditingFaq(null);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs tracking-wider uppercase font-semibold transition-all ${
                    isActive 
                      ? "bg-brand-gold text-brand-darkgreen shadow font-bold" 
                      : "text-emerald-100 hover:bg-brand-green/30 hover:text-white"
                  }`}
                  title={navItem.label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{navItem.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions inside Sidebar */}
        <div className="p-4 border-t border-brand-gold/10 space-y-2">
          {!sidebarCollapsed && (
            <div className="bg-black/20 p-2 rounded text-[10px] text-emerald-200">
              <span className="font-bold text-white block">Status Operator</span>
              Role: <strong className="text-[#cba358]">{currentUserRole}</strong>
            </div>
          )}
          <button
            onClick={onBackToPortal}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-900/60 hover:bg-emerald-950 text-white text-[11px] py-1.5 rounded border border-brand-green/30 font-semibold"
          >
            <Globe className="w-3.5 h-3.5" />
            {!sidebarCollapsed && <span>Buka Situs Publik</span>}
          </button>
        </div>
      </aside>

      {/* CORE CONTENT LAYOUT RIGHT SIDE */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top bar with user panel */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-100 border border-slate-250 px-2.5 py-1 rounded font-mono text-slate-600 font-bold hidden sm:inline-block">
              SERANG: OK/ONLINE
            </span>
            <div className="bg-emerald-500/10 text-brand-green text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Website Publik Live</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Switcheble preview model credentials */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-1.5 rounded">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">PREVIEW AS:</span>
              <select
                value={currentUserRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="text-xs font-bold bg-white text-brand-darkgreen border border-slate-300 rounded px-2 py-1 outline-none"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Editor">Editor (Konten)</option>
                <option value="Media Officer">Media Officer</option>
                <option value="Live Operator">Live Operator</option>
                <option value="Reviewer">Reviewer (Approver)</option>
              </select>
            </div>

            <div className="h-8 w-px bg-slate-250"></div>

            {/* Profile Avatar Trigger dropdown mockup */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-[#FAF9F5] text-brand-darkgreen border border-brand-gold flex items-center justify-center font-bold text-sm">
                {currentActiveUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800">{currentActiveUser.name}</div>
                <div className="text-[9px] text-slate-400 font-mono font-medium uppercase leading-none">{currentUserRole}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-700 font-bold border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded transition-colors"
            >
              Keluar
            </button>
          </div>
        </header>

        {/* Dynamic Inner body content view wrapper */}
        <main className="p-6 sm:p-8 flex-grow overflow-y-auto space-y-6">

          {/* Trigger Alert Messages UI */}
          {alertMessage && (
            <div className={`p-4 rounded-md border text-xs sm:text-sm font-semibold flex items-center gap-2 shadow animate-bounce ${
              alertMessage.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-red-50 border-red-250 text-red-800"
            }`}>
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{alertMessage.text}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 1. DASHBOARD OVERVIEW            */}
          {/* ========================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-emerald-950 to-brand-darkgreen text-white p-6 rounded-xl border border-brand-gold/30 shadow relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-repeat bg-[size:16px]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0l15 15-15 15L0 15z' fill='%23fff' fill-opacity='0.2'/%3E%3C/svg%3E")` }}></div>
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] text-[#cbb689] font-mono tracking-widest font-extrabold uppercase">MUKTAMAR COMANDER CENTER ACTIVATED</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-display">Selamat datang kembali, {currentActiveUser.name}!</h2>
                  <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                    Sistem bekerja optimal. Anda sedang menyimulasikan akses sebagai operator <strong className="text-brand-gold uppercase">{currentUserRole}</strong>. Seluruh proses perubahan pengumuman, pengeditan agenda sidang, ataupun pengarsipan foto pameran terindeks otomatis ke penjelajah web pengunjung.
                  </p>
                </div>
              </div>

              {/* Status statistics top grid widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-1">Status Web Resmi</div>
                  <div className="text-xl font-bold text-brand-green flex items-center gap-1.5 font-display">
                    <span className="w-3 h-3 bg-brand-green rounded-full animate-ping"></span>
                    <span>ONLINE (AKTIF)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1.5">Akses URL: Semarang Hub</span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-1">Tahap Acara Aktif</div>
                  <div className="text-xl font-bold text-slate-800 font-display">
                    {hero?.currentStage || "Pra-Muktamar"}
                  </div>
                  <span className="text-[10px] text-brand-gold font-bold block mt-1.5 hover:underline cursor-pointer" onClick={() => setActiveTab("homepage")}>
                    Ubah di Homepage Control &rarr;
                  </span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-1">Total Agenda Acara</div>
                  <div className="text-xl font-bold text-slate-800 font-display">
                    {agendas.length} Sidang / Kegiatan
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1.5">{agendas.filter(a => a.status === "Selesai").length} telah dirampungkan</span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-1">Siaran Langsung</div>
                  <div className="text-xl font-bold text-red-600 flex items-center gap-1.5 font-display">
                    <Tv className="w-4 h-4 shrink-0" />
                    <span>{liveStream?.isLive ? "SEDANG LIVE" : "OFFAIR"}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1.5">YouTube ID: {liveStream?.youtubeId}</span>
                </div>
              </div>

              {/* QUICK COMMAND BAR CONTROLLER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Emergency & Status Command Center Room (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <div className="border-b border-slate-150 pb-3 flex justify-between items-center">
                    <h3 className="font-extrabold font-display text-slate-900 text-sm tracking-wider uppercase flex items-center gap-2">
                      <Camera className="text-brand-green w-5 h-5" />
                      PENGENDALI UTAMA ACARA HARI INI
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Pembaruan Kilat</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Live stream switch */}
                    <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">VISUAL BROADCAST TRANSMITTER</span>
                        <h4 className="text-xs font-bold text-slate-800">Status Pemancar Streaming</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateLiveStreamState(true)}
                          className={`text-xs px-3 py-2 rounded font-bold cursor-pointer transition-all flex-1 ${
                            liveStream?.isLive ? "bg-red-600 text-white" : "bg-white border border-slate-300 text-slate-700"
                          }`}
                        >
                          Aktifkan Live
                        </button>
                        <button
                          onClick={() => handleUpdateLiveStreamState(false)}
                          className={`text-xs px-3 py-2 rounded font-bold cursor-pointer transition-all flex-1 ${
                            !liveStream?.isLive ? "bg-slate-700 text-white" : "bg-white border border-slate-300 text-slate-700"
                          }`}
                        >
                          Matikan Live
                        </button>
                      </div>
                    </div>

                    {/* Quick stage settings switcher */}
                    <div className="bg-[#FAF9F5] p-4 rounded border border-[#ecc175]/30 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-brand-gold block font-bold uppercase">EVENT PROGRESS TRACKER</span>
                        <h4 className="text-xs font-bold text-brand-darkgreen">Pondasi Tahap Muktamar</h4>
                      </div>
                      <select
                        value={hero?.currentStage || "Pra-Muktamar"}
                        onChange={(e) => {
                          if (hero) {
                            const nextHero = { ...hero, currentStage: e.target.value };
                            setHero(nextHero);
                            saveHero(nextHero);
                            logActivity("Ubah Tahap Acara", "Konfigurasi Utama", `Mengubah tahap visual ke ${e.target.value}`);
                            triggerAlert(`Tahapan visual diatur ke: ${e.target.value}`);
                          }
                        }}
                        className="w-full text-xs font-bold bg-white text-slate-800 border border-slate-250 p-2 rounded outline-none"
                      >
                        {["Pra-Muktamar", "Pembukaan", "Sidang Komisi", "Pleno", "Penutupan"].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fast Action Shortcuts */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">AKSES PENDATAAN SCHEDULER</span>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => {
                          setActiveTab("agenda");
                          setEditingAgenda({ day: 1, status: "Akan Berlangsung", access: "Terbuka untuk Publik" });
                        }}
                        className="bg-brand-green hover:bg-brand-lightgreen text-white text-[11px] font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Tambahkan Agenda Sidang</span>
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab("rilis");
                          setEditingNews({ category: "Rilis Resmi" });
                        }}
                        className="bg-brand-darkgreen hover:bg-emerald-900 border border-[#cba358]/30 text-brand-gold text-[11px] font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Tulis Rilis Humas Baru</span>
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab("faq");
                          setEditingFaq({});
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded flex items-center gap-1.5 border border-slate-300 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Tambah Tanya-Jawab</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secure Audit Trail brief (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <div className="border-b border-slate-150 pb-2.5 flex justify-between items-center">
                    <h3 className="font-extrabold font-display text-slate-900 text-sm tracking-wider uppercase flex items-center gap-2">
                      <Activity className="text-slate-500 w-4 h-4" />
                      ALUR AKTIVITAS PANITIA (LOGS)
                    </h3>
                    <button onClick={() => setActiveTab("logs")} className="text-[10px] font-bold text-brand-green hover:underline">Semua &rarr;</button>
                  </div>

                  <div className="space-y-3 divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="pt-2.5 first:pt-0 text-[11px] text-slate-600 block">
                        <div className="flex justify-between font-mono text-[9px] text-slate-400">
                          <span>{log.timestamp}</span>
                          <span className="font-bold text-brand-darkgreen bg-brand-gold/15 px-1 rounded">{log.user}</span>
                        </div>
                        <p className="mt-1 font-semibold text-slate-800">{log.action} - {log.module}</p>
                        <p className="text-[10px] text-slate-405 italic">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 2. HOMEPAGE CONTROL              */}
          {/* ========================================================= */}
          {activeTab === "homepage" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-brand-darkgreen font-display">Homepage Section Management</h2>
                  <p className="text-slate-500 text-xs">Atur teks utama situs, data countdown, visibilitas bar berita berjalan, dan penyusunan urutan section halaman depan.</p>
                </div>
                <Globe className="text-brand-gold w-8 h-8 opacity-40" />
              </div>

              {/* Form editing Hero & progress */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left - Hero Settings (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2">Edit Banner Utama Publik (Hero)</h3>
                  
                  {hero ? (
                    <form onSubmit={handleUpdateHeroConfig} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase mb-1">Label Hero Kecil</label>
                        <input
                          type="text"
                          value={hero.label}
                          onChange={(e) => setHero({ ...hero, label: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-brand-green"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Judul Utama</label>
                          <input
                            type="text"
                            value={hero.title}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Tahap Progress Saat Ini</label>
                          <select
                            value={hero.currentStage}
                            onChange={(e) => setHero({ ...hero, currentStage: e.target.value })}
                            className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded outline-none"
                          >
                            <option value="Pra-Muktamar">Pra-Muktamar (Aktif)</option>
                            <option value="Pembukaan">Pembukaan</option>
                            <option value="Sidang Komisi">Sidang Komisi</option>
                            <option value="Pleno">Pleno</option>
                            <option value="Penutupan">Penutupan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase mb-1">Sub-Deskripsi Hero</label>
                        <textarea
                          rows={3}
                          value={hero.subtitle}
                          onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded outline-none font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Placeholder Tanggal</label>
                          <input
                            type="text"
                            value={hero.date}
                            onChange={(e) => setHero({ ...hero, date: e.target.value })}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Placeholder Tempat</label>
                          <input
                            type="text"
                            value={hero.location}
                            onChange={(e) => setHero({ ...hero, location: e.target.value })}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-brand-darkgreen hover:bg-brand-green text-[#cba358] text-[11px] font-extrabold uppercase px-4 py-2.5 rounded shadow cursor-pointer transition-all"
                      >
                        Simpan & Terapkan Perubahan Banner
                      </button>
                    </form>
                  ) : (
                    <div className="text-xs text-slate-500 italic">Memuat konfigurasi...</div>
                  )}
                </div>

                {/* Right - Live Sticky Bar & Sections Visibility (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
                  
                  {/* Live Bar editor */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2">Situs Live Announcement Bar</h3>
                    
                    {liveBar ? (
                      <form onSubmit={handleSaveLiveBarConfig} className="space-y-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="live_bar_enabled"
                            checked={liveBar.enabled}
                            onChange={(e) => setLiveBar({ ...liveBar, enabled: e.target.checked })}
                            className="h-4 w-4 text-brand-green"
                          />
                          <label htmlFor="live_bar_enabled" className="font-bold text-slate-700">Tampilkan Sticky Bar Di Halaman Utama</label>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 uppercase mb-1 text-[10px]">Teks Alert Berjalan</label>
                          <input
                            type="text"
                            value={liveBar.manualText}
                            onChange={(e) => setLiveBar({ ...liveBar, manualText: e.target.value })}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded outline-none"
                            placeholder="Muktamar ke-35 segera dimulai..."
                          />
                        </div>

                        <button type="submit" className="bg-brand-green hover:bg-brand-lightgreen text-white font-bold px-3 py-1.5 rounded text-[10px] uppercase">
                          Simpan Live Bar
                        </button>
                      </form>
                    ) : null}
                  </div>

                  {/* Section Visibilities lists */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2">Kontrol Visibilitas Section</h3>
                    <p className="text-[11px] text-slate-500 leading-normal">Aktifkan atau nonaktifkan section di bawah ini secara instan pada halaman publik.</p>
                    
                    {settings ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {[
                          { key: "hero", label: "Banner Utama (Hero)" },
                          { key: "liveBar", label: "Floating Live Bar Alert" },
                          { key: "nowHappening", label: "Section Sedang Berlangsung" },
                          { key: "programme", label: "Timeline Agenda Hari Ini" },
                          { key: "liveSection", label: "Muktamar TV Streaming Section" },
                          { key: "explore", label: "Jelajah Esensi Nusantara" },
                          { key: "updates", label: "Rilis Resmi Newsfeed" },
                          { key: "highlights", label: "Muktamar Gallery & Highlights" },
                          { key: "media", label: "Press Room Media Center Brief" },
                          { key: "visitor", label: "Panduan Lokasi Wisatawan" }
                        ].map((sec) => {
                          const isShowing = settings.activeSections[sec.key] !== false;
                          return (
                            <div key={sec.key} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                              <span className="text-xs font-semibold text-slate-700">{sec.label}</span>
                              <button
                                onClick={() => handleToggleSection(sec.key)}
                                className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                                  isShowing 
                                    ? "bg-brand-green text-white" 
                                    : "bg-slate-200 text-slate-650"
                                }`}
                              >
                                {isShowing ? "AKTIF" : "NONAKTIF"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 3. AGENDA & RUANG SIDANG         */}
          {/* ========================================================= */}
          {activeTab === "agenda" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-brand-darkgreen font-display">Ruang Sidang & Agenda Program</h2>
                  <p className="text-slate-500 text-xs">Publikasikan lini masa agenda persidangan. Anda dapat menambahkan agenda baru atau menetapkannya sebagai yang sedang berlangsung.</p>
                </div>
                {canPerform("create") && (
                  <button
                    onClick={() => setEditingAgenda({ day: 1, status: "Akan Berlangsung", access: "Terbuka untuk Publik" })}
                    className="bg-brand-darkgreen hover:bg-[#072a17] text-brand-gold font-bold text-xs uppercase px-4 py-2.5 rounded shadow flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Agenda Baru</span>
                  </button>
                )}
              </div>

              {/* LIST / FORM SPLIT */}
              {editingAgenda ? (
                <div className="bg-white p-6 rounded-lg border border-brand-gold/30 shadow-md">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="font-extrabold text-brand-darkgreen text-xs tracking-wider uppercase flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-gold" />
                      {editingAgenda.id ? "Form EDIT Agenda Sidang" : "Tambah Agenda Persidangan Baru"}
                    </h3>
                    <button onClick={() => setEditingAgenda(null)} className="text-slate-400 hover:text-slate-800"><X className="w-5 h-5" /></button>
                  </div>

                  <form onSubmit={handleSaveAgenda} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Nama Agenda / Kegiatan</label>
                        <input
                          type="text"
                          required
                          value={editingAgenda.title || ""}
                          onChange={(e) => setEditingAgenda({ ...editingAgenda, title: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                          placeholder="Contoh: Sidang Pleno Komisi Bahtsul Masail"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Hari Pelaksanaan (Muktamar)</label>
                        <select
                          value={editingAgenda.day || 1}
                          onChange={(e) => setEditingAgenda({ ...editingAgenda, day: Number(e.target.value) as 1|2|3|4 })}
                          className="w-full bg-white p-2.5 border border-slate-300 rounded text-xs"
                        >
                          <option value={1}>Hari 1 - Pembukaan Akbar</option>
                          <option value={2}>Hari 2 - Sidang Komisi</option>
                          <option value={3}>Hari 3 - Pleno & Pemilihan</option>
                          <option value={4}>Hari 4 - Penutupan</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Jam Kegiatan (Format WIB)</label>
                        <input
                          type="text"
                          required
                          value={editingAgenda.time || ""}
                          onChange={(e) => setEditingAgenda({ ...editingAgenda, time: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                          placeholder="Contoh: 13.00 - 15.30 WIB"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Tempat / Ruang Sidang</label>
                        <input
                          type="text"
                          required
                          value={editingAgenda.location || ""}
                          onChange={(e) => setEditingAgenda({ ...editingAgenda, location: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                          placeholder="Contoh: Aula Serbaguna Lantai 2"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Status Publikasi Sinyal</label>
                        <select
                          value={editingAgenda.status || "Akan Berlangsung"}
                          onChange={(e) => setEditingAgenda({ ...editingAgenda, status: e.target.value as any })}
                          className="w-full bg-white p-2.5 border border-slate-300 rounded text-xs"
                        >
                          <option value="Akan Berlangsung">Akan Berlangsung (Scheduled)</option>
                          <option value="Live">Live (Berlangsung)</option>
                          <option value="Selesai">Selesai (Completed)</option>
                          <option value="Tersedia Rekaman">Tersedia Rekaman</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Akses Masuk & Otoritas</label>
                        <select
                          value={editingAgenda.access || "Terbuka untuk Publik"}
                          onChange={(e) => setEditingAgenda({ ...editingAgenda, access: e.target.value as any })}
                          className="w-full bg-white p-2.5 border border-slate-300 rounded text-xs"
                        >
                          <option value="Terbuka untuk Publik">Terbuka Untuk Publik Nusantara</option>
                          <option value="Khusus Peserta">Khusus Peserta / Muktamir Utusan</option>
                          <option value="Terbuka untuk Media">Terbuka Khusus Jurnalis Resmi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Bypass live streaming YouTube ID (Opsional)</label>
                        <input
                          type="text"
                          value={editingAgenda.id ? "8u1E6tE0hCg" : ""}
                          disabled
                          placeholder="Menggunakan standard livestream id"
                          className="w-full p-2.5 bg-slate-100 border border-slate-250 text-slate-500 rounded text-xs cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Ringkasan Materi Acara (Tampil Di Publik)</label>
                      <textarea
                        rows={3}
                        required
                        value={editingAgenda.description || ""}
                        onChange={(e) => setEditingAgenda({ ...editingAgenda, description: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                        placeholder="Deskripsikan secara lugas tujuan kegiatan serta ketentuan bagi hadirin."
                      />
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingAgenda(null)}
                        className="bg-slate-100 hover:bg-slate-205 text-slate-700 px-4 py-2 rounded font-bold uppercase text-[10px]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-darkgreen hover:bg-brand-green text-brand-gold px-5 py-2.5 rounded font-extrabold uppercase text-[10.5px]"
                      >
                        Simpan Perubahan Agenda
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Filters bar */}
                  <div className="p-4 border-b bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Cari berdasarkan judul/tempat..."
                        value={agendaSearch}
                        onChange={(e) => setAgendaSearch(e.target.value)}
                        className="bg-white border rounded px-2 py-1.5 outline-none max-w-xs focus:ring-1 focus:ring-brand-green"
                      />
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto">
                      <span className="font-bold text-slate-500 self-center">Filter Hari:</span>
                      <select
                        value={agendaFilterDay}
                        onChange={(e) => setAgendaFilterDay(e.target.value)}
                        className="border bg-white rounded px-2.5 py-1 text-slate-800 text-xs outline-none"
                      >
                        <option value="Semua">Semua Hari</option>
                        <option value="1">Hari 1 - Pembukaan</option>
                        <option value="2">Hari 2 - Bahtsul Masail</option>
                        <option value="3">Hari 3 - Pleno Pemilihan</option>
                        <option value="4">Hari 4 - Penutupan</option>
                      </select>
                    </div>
                  </div>

                  {/* Responsive Grid/Table */}
                  <div className="overflow-x-auto min-w-full">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-[#FAF9F5] text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Jam & Hari</th>
                          <th className="px-6 py-4">Judul Sidang / Tempat</th>
                          <th className="px-6 py-4">Aksesibilitas</th>
                          <th className="px-6 py-4">Status Sinyal</th>
                          <th className="px-6 py-4 text-right">Aksi Manajemen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {cmsFilteredAgendas.map((item) => {
                          const isNowHappening = item.status === "Live";
                          return (
                            <tr key={item.id} className={`hover:bg-slate-50 ${isNowHappening ? "bg-red-50/20" : ""}`}>
                              <td className="px-6 py-4">
                                <span className="font-mono font-bold text-brand-darkgreen block">{item.time}</span>
                                <span className="text-[10px] text-slate-450 block uppercase font-semibold">Muktamar Hari {item.day}</span>
                              </td>
                              <td className="px-6 py-4 max-w-xs">
                                <span className="font-bold text-slate-900 block truncate" title={item.title}>{item.title}</span>
                                <span className="text-[10px] text-slate-500 block">{item.location}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.access === "Terbuka untuk Publik" 
                                    ? "bg-emerald-50 text-brand-green" 
                                    : item.access === "Terbuka untuk Media" 
                                      ? "bg-blue-50 text-blue-700" 
                                      : "bg-amber-50 text-amber-800"
                                }`}>
                                  {item.access}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                  item.status === "Live" 
                                    ? "bg-red-600 text-white animate-pulse" 
                                    : item.status === "Selesai" 
                                      ? "bg-slate-200 text-slate-650" 
                                      : "bg-brand-gold/20 text-brand-darkgreen"
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                {!isNowHappening && item.status !== "Selesai" && (
                                  <button
                                    onClick={() => handleSetNowHappening(item)}
                                    className="bg-brand-green hover:bg-brand-lightgreen text-white text-[10px] font-bold py-1 px-2.5 rounded uppercase"
                                    title="Set sebagai Sedang Berlangsung di website publik"
                                  >
                                    LIVE NOW
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingAgenda(item)}
                                  className="text-slate-600 hover:text-brand-darkgreen p-1 hover:bg-slate-100 rounded inline-block"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAgenda(item.id, item.title)}
                                  className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded inline-block"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 4. LIVE CENTER STUDIO            */}
          {/* ========================================================= */}
          {activeTab === "live" && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h2 className="text-lg font-bold text-brand-darkgreen font-display">Broadcast Command & Live Center</h2>
                <p className="text-slate-500 text-xs">Simulasi pusat penyiaran media resmi. Atur URL feed stream youtube, modifikasi timeline live updates, dan simulasikan moderasi obrolan jemaah.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left - Visual Monitor Video Player (8 Cols) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-xs border-b pb-2">
                    <span className="font-bold text-slate-700 uppercase">Live Preview Panel</span>
                    <span className="font-mono text-[10px] bg-red-600 text-white font-bold px-1.5 rounded uppercase">
                      🖥️ MONITOR FEED
                    </span>
                  </div>

                  {/* Simulated monitor card image */}
                  <div className="bg-slate-950 aspect-video rounded-xl border-2 border-brand-gold overflow-hidden relative flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-between items-start">
                      <span className="bg-black/40 text-xs px-2.5 py-1 rounded backdrop-blur">
                        Kanal: <strong className="text-brand-gold">{liveStream?.cameraLabel || "Plenary Hall"}</strong>
                      </span>
                      <span className="text-[10px] bg-red-600 font-bold font-mono px-2 py-0.5 rounded animate-pulse uppercase">
                        {liveStream?.isLive ? "● BROADCASTING" : "OFF-AIR"}
                      </span>
                    </div>

                    <div className="self-center flex flex-col items-center space-y-2 text-center text-slate-300">
                      <Tv className="w-12 h-12 text-brand-gold" />
                      <p className="text-sm font-bold text-white">Pratinjau Live Video Player</p>
                      <p className="text-xs text-slate-400">Stream Source URL: https://youtube.com/watch?v={liveStream?.youtubeId}</p>
                    </div>

                    <div className="bg-black/60 p-2.5 rounded border border-white/10 text-[11px] text-slate-100 italic">
                      "Pastikan koneksi satelit dan decoder audio lancar sebelum masa peralihan tausiyah kiai."
                    </div>
                  </div>

                  {/* Form config Stream source */}
                  {liveStream ? (
                    <form onSubmit={handleSaveLiveStreamConfig} className="text-xs space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">Judul Kamera / Lokasi Siaran</label>
                          <input
                            type="text"
                            value={liveStream.cameraLabel}
                            onChange={(e) => setLiveStream({ ...liveStream, cameraLabel: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">YouTube Video ID</label>
                          <input
                            type="text"
                            value={liveStream.youtubeId}
                            onChange={(e) => setLiveStream({ ...liveStream, youtubeId: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs outline-none font-mono"
                          />
                        </div>
                      </div>

                      <button type="submit" className="bg-brand-darkgreen hover:bg-brand-green text-[#cba358] font-extrabold uppercase px-4 py-2.5 rounded shadow">
                        Update Parameter Feed
                      </button>
                    </form>
                  ) : null}
                </div>

                {/* Right - Live Chat Moderation Simulator (4 Cols) */}
                <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Simulasi Moderasi Obrolan</h3>
                    <p className="text-[10px] text-slate-450">Tinjau saring komentar jemaah nahdliyin dari gerbang web publik.</p>
                  </div>

                  {/* Chat messages mockup */}
                  <div className="space-y-3 bg-slate-50 border p-3 rounded h-64 overflow-y-auto text-[11px]">
                    <div className="text-slate-650 italic text-[10px] border-b pb-1">Menampilkan percakapan terenkripsi:</div>
                    {[
                      { name: "M. Sholihin", msg: "Semoga berkah kumpul-kumpul ulama kiai di Semarang." },
                      { name: "Ning Annisa", msg: "Siaran sangat jernih! Terima kasih panitia media center." },
                      { name: "Khadim NU", msg: "Bahtsul masail membahas legalitas karbon sangat representatif." }
                    ].map((ch, idx) => (
                      <div key={idx} className="bg-white p-2 rounded shadow-xs border border-slate-200">
                        <div className="flex justify-between font-bold text-brand-darkgreen mb-0.5">
                          <span>{ch.name}</span>
                          <span className="text-red-500 hover:underline cursor-pointer text-[9px]">Sembunyikan</span>
                        </div>
                        <p className="text-slate-700">{ch.msg}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-100 p-2.5 rounded border text-[10.5px] text-slate-500">
                     💡 Obrolan publik disaring otomatis menggunakan filter kata kunci sensitif yang diatur tim cyber PBNU secara eksternal.
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 5. RILIS RESMI & BERITA          */}
          {/* ========================================================= */}
          {activeTab === "rilis" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-brand-darkgreen font-display">Newsroom & Rilis Resmi Humas</h2>
                  <p className="text-slate-500 text-xs">Kelola seluruh rilis pers, maklumat kepanitiaan, berita update harian untuk konsumsi pers nasional.</p>
                </div>
                {canPerform("create") && (
                  <button
                    onClick={() => setEditingNews({ category: "Rilis Resmi" })}
                    className="bg-brand-darkgreen hover:bg-[#072a17] text-brand-gold font-bold text-xs uppercase px-4 py-2.5 rounded shadow flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tulis Artikel Baru</span>
                  </button>
                )}
              </div>

              {editingNews ? (
                <div className="bg-white p-6 rounded-lg border border-brand-gold/30 shadow-md">
                  <div className="flex justify-between items-center border-b pb-3 mb-4 text-xs">
                    <h3 className="font-extrabold text-brand-darkgreen tracking-wider uppercase flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-gold" />
                      {editingNews.id ? "Edit Artikel Rilis Berita" : "Tulis Artikel Rilis Berita Baru"}
                    </h3>
                    <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-slate-800"><X className="w-5 h-5" /></button>
                  </div>

                  <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Judul Utama Berita</label>
                        <input
                          type="text"
                          required
                          value={editingNews.title || ""}
                          onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-brand-green outline-none"
                          placeholder="Masukkan judul artikel rilis yang representatif"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Kategori Rilis</label>
                        <select
                          value={editingNews.category || "Rilis Resmi"}
                          onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                          className="w-full bg-white p-2.5 border border-slate-300 rounded text-xs outline-none"
                        >
                          <option value="Rilis Resmi">Rilis Resmi (Press Release)</option>
                          <option value="Pengumuman">Pengumuman (Announce)</option>
                          <option value="Update Harian">Update Harian Persidangan</option>
                          <option value="Sorotan">Sorotan / Editorial</option>
                          <option value="Konferensi Pers">Konferensi Pers</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Ringkasan Pendek (Tingkat Sorotan Depan)</label>
                      <input
                        type="text"
                        required
                        value={editingNews.summary || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                        placeholder="Ringkasan 1-2 kalimat pendek yang memikat pembaca"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Naskah Lengkap Artikel</label>
                      <textarea
                        rows={10}
                        required
                        value={editingNews.content || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                        placeholder="FORMAT JURNALIK: Semarang, PBNU — Tuliskan naskah laporan berita lengkap di sini secara utuh."
                      />
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingNews(null)}
                        className="bg-slate-100 hover:bg-slate-205 text-slate-700 px-4 py-2 rounded font-bold uppercase text-[10px]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-darkgreen hover:bg-brand-green text-brand-gold px-5 py-2.5 rounded font-extrabold uppercase text-[10.5px]"
                      >
                        Terbitkan Berita Ke Publik
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Filters */}
                  <div className="p-4 border-b bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Cari rilis resmi..."
                        value={newsSearch}
                        onChange={(e) => setNewsSearch(e.target.value)}
                        className="bg-white border rounded px-2.5 py-1.5 outline-none max-w-xs focus:ring-1 focus:ring-brand-green"
                      />
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto">
                      <select
                        value={newsFilterCat}
                        onChange={(e) => setNewsFilterCat(e.target.value)}
                        className="border bg-white rounded px-2.5 py-1 text-xs outline-none"
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

                  {/* News Table */}
                  <div className="overflow-x-auto min-w-full">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-[#FAF9F5] text-slate-500 font-bold uppercase">
                        <tr>
                          <th className="px-6 py-4">Kategori & Publikasi</th>
                          <th className="px-6 py-4">Judul Rilis Hub</th>
                          <th className="px-6 py-4">Ringkasan Sorotan</th>
                          <th className="px-6 py-4 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {cmsFilteredNews.map((article) => (
                          <tr key={article.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 text-[9px] font-bold block bg-brand-gold/15 text-brand-darkgreen rounded text-center mb-1">
                                {article.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium block text-center font-mono">{article.date}</span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate" title={article.title}>
                              {article.title}
                            </td>
                            <td className="px-6 py-4 max-w-sm text-slate-500 truncate" title={article.summary}>
                              {article.summary}
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => setEditingNews(article)}
                                className="text-slate-600 hover:text-brand-darkgreen p-1 hover:bg-slate-100 rounded inline-block"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteNews(article.id, article.title)}
                                className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded inline-block"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 6. FAQ & TANYA JAWAB             */}
          {/* ========================================================= */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-brand-darkgreen font-display">FAQ & Tanya Jawab Pengunjung</h2>
                  <p className="text-slate-500 text-xs">Pembaruan naskah bantuan seputar penginapan syariah, akreditasi liputan jurnalis, serta tata tertib kedatangan jemaah muhibbin.</p>
                </div>
                {canPerform("create") && (
                  <button
                    onClick={() => setEditingFaq({})}
                    className="bg-brand-darkgreen hover:bg-[#072a17] text-brand-gold font-bold text-xs uppercase px-4 py-2.5 rounded shadow flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat FAQ Baru</span>
                  </button>
                )}
              </div>

              {editingFaq ? (
                <div className="bg-white p-6 rounded-lg border border-brand-gold/30 shadow">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="font-extrabold text-brand-darkgreen tracking-wider uppercase flex items-center gap-2 text-xs">
                      <HelpCircle className="w-4 h-4 text-brand-gold animate-bounce" />
                      Form Input Data FAQ
                    </h3>
                    <button onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-slate-800"><X className="w-5 h-5" /></button>
                  </div>

                  <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Pertanyaan Publik</label>
                      <input
                        type="text"
                        required
                        value={editingFaq.question || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                        placeholder="Contoh: Apakah masyarakat umum diperbolehkan memasuki aula sidang utama?"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Jawaban Resmi (Harus Netral & Aman)</label>
                      <textarea
                        rows={4}
                        required
                        value={editingFaq.answer || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs"
                        placeholder="Tuliskan petunjuk operasional / jawaban resmi panitia."
                      />
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingFaq(null)}
                        className="bg-slate-100 hover:bg-slate-205 text-slate-700 px-4 py-2 rounded font-bold uppercase text-[10px]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-darkgreen hover:bg-brand-green text-brand-gold px-5 py-2.5 rounded font-extrabold uppercase text-[10.5px]"
                      >
                        Simpan FAQ
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqs.map((f) => (
                      <div key={f.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-brand-darkgreen mb-1.5">Q: {f.question}</h4>
                          <p className="text-[11px] text-slate-650 leading-relaxed">A: {f.answer}</p>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-200/50">
                          <button
                            onClick={() => setEditingFaq(f)}
                            className="bg-white hover:bg-slate-100 p-1.5 rounded border border-slate-250 text-slate-700 inline-flex items-center"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(f.id, f.question)}
                            className="bg-white hover:bg-red-50 p-1.5 rounded border border-red-205 text-red-650 inline-flex items-center"
                            title="Hapus"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 7. USER & ROLE KEAMANAN         */}
          {/* ========================================================= */}
          {activeTab === "users" && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-brand-darkgreen font-display">User Management & Permissions Matrix</h2>
                <p className="text-slate-500 text-xs">Tinjau daftar personel operator situs resmi Muktamar. Anda dapat beralih preview otorisasi di atas untuk mencoba hak akses.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Users List (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b">
                    <h3 className="font-bold text-slate-800 text-xs uppercase">Daftar Panitia Akreditasi CMS</h3>
                  </div>

                  <div className="overflow-x-auto min-w-full">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-[#FAF9F5] text-slate-500 font-bold">
                        <tr>
                          <th className="px-6 py-3">Nama</th>
                          <th className="px-6 py-3">Peran / Otoritas</th>
                          <th className="px-6 py-3">Login Terakhir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-900 block">{u.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono font-medium block">{u.email}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 text-[9px] font-bold bg-brand-gold/15 text-brand-darkgreen rounded">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">{u.lastLogin}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Permissions Matrix (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="text-brand-green w-4 h-4" />
                      Matriks Keamanan CMS
                    </h3>
                    <p className="text-[10px] text-slate-450 leading-normal">Berikut alokasi fitur berdasarkan penunjukan peran operasional.</p>
                  </div>

                  <div className="space-y-3 pt-1 text-xs">
                    {[
                      { roleName: "Super Admin", modules: "Akses mutlak (Agenda, Blog, Live, User, Logs)" },
                      { roleName: "Reviewer", modules: "Menyetujui rilis berita & kelayakan timeline publik" },
                      { roleName: "Editor", modules: "Mengisi draft agenda, FAQ, dan news feed harian" },
                      { roleName: "Live Operator", modules: "Mengubah status streaming pembuka / pleno" },
                      { roleName: "Media Officer", modules: "Mengurus kit jurnalis, brand asset pameran" }
                    ].map((per, index) => (
                      <div key={index} className="p-2.5 rounded bg-[#FAF9F5] border border-slate-200/60">
                        <span className="font-bold text-brand-darkgreen block text-[11px] mb-0.5">{per.roleName}</span>
                        <p className="text-[10px] text-slate-500 leading-normal">{per.modules}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/*                 SUBVIEW: 8. AUDIT LOG SISTEM              */}
          {/* ========================================================= */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-brand-darkgreen font-display">Sistem Audit Log Terenkripsi</h2>
                <p className="text-slate-500 text-xs">Catatan mutlak setiap manipulasi data publik yang dilakukan oleh akun operasional panitia demi akuntabilitas informasi nasional.</p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase">RIWAYAT AKTIVITAS LIVE BARU</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250 font-bold">SECURE CHANNEL ACTIVE</span>
                </div>

                <div className="overflow-x-auto min-w-full">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-[11px]">
                    <thead className="bg-[#FAF9F5] text-slate-500 font-bold uppercase font-mono">
                      <tr>
                        <th className="px-6 py-3">Waktu Log</th>
                        <th className="px-6 py-3">Personel</th>
                        <th className="px-6 py-3">Modul / Aksi</th>
                        <th className="px-6 py-3">Catatan Detail Perubahan</th>
                        <th className="px-6 py-3">Alamat IP / Perangkat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800 block text-xs">{log.user}</span>
                            <span className="text-[9px] text-[#cba358] font-mono font-bold leading-none">{log.role}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-darkgreen whitespace-nowrap">
                            {log.action} <br />
                            <span className="text-[9px] text-slate-400 font-medium font-sans uppercase">[{log.module}]</span>
                          </td>
                          <td className="px-6 py-4 text-slate-650 font-sans italic max-w-sm">{log.details}</td>
                          <td className="px-6 py-4 font-mono text-slate-400">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
