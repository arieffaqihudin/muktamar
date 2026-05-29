/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MOCK_AGENDA, MOCK_NEWS, MOCK_FAQ, MOCK_MEDIA_ASSETS, MOCK_PRESS_CONFERENCES, MOCK_MILESTONES, AgendaItem, NewsItem, FAQItem, MediaAsset, PressConference, HistoricalMilestone } from "./data";

// Key definitions for localStorage
const CODES = {
  AGENDA: "muktamar35_agenda",
  NEWS: "muktamar35_news",
  FAQ: "muktamar35_faq",
  HERO: "muktamar35_hero",
  LIVE_BAR: "muktamar35_live_bar",
  LIVE_STREAM: "muktamar35_live_stream",
  MEDIA_ASSETS: "muktamar35_media_assets",
  PRESS_CONFERENCES: "muktamar35_press_conferences",
  ANNOUNCEMENTS: "muktamar35_announcements",
  SETTINGS: "muktamar35_settings",
  USERS: "muktamar35_users",
  AUDIT_LOGS: "muktamar35_audit_logs",
  STAGE_STATUS: "muktamar35_stage_status"
};

// Initial state helpers
export function getSavedAgenda(): AgendaItem[] {
  try {
    const saved = localStorage.getItem(CODES.AGENDA);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to parse agenda state", err);
  }
  localStorage.setItem(CODES.AGENDA, JSON.stringify(MOCK_AGENDA));
  return MOCK_AGENDA;
}

export function saveAgenda(data: AgendaItem[]) {
  localStorage.setItem(CODES.AGENDA, JSON.stringify(data));
}

export function getSavedNews(): NewsItem[] {
  try {
    const saved = localStorage.getItem(CODES.NEWS);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to parse news state", err);
  }
  localStorage.setItem(CODES.NEWS, JSON.stringify(MOCK_NEWS));
  return MOCK_NEWS;
}

export function saveNews(data: NewsItem[]) {
  localStorage.setItem(CODES.NEWS, JSON.stringify(data));
}

export function getSavedFAQ(): FAQItem[] {
  try {
    const saved = localStorage.getItem(CODES.FAQ);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to parse FAQ state", err);
  }
  localStorage.setItem(CODES.FAQ, JSON.stringify(MOCK_FAQ));
  return MOCK_FAQ;
}

export function saveFAQ(data: FAQItem[]) {
  localStorage.setItem(CODES.FAQ, JSON.stringify(data));
}

export interface HeroConfig {
  label: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  currentStage: string; // e.g. "Pra-Muktamar", "Pembukaan", "Sidang Komisi", "Pleno", "Penutupan"
}

export const DEFAULT_HERO: HeroConfig = {
  label: "Pusat Informasi Resmi",
  title: "Muktamar NU ke-35",
  subtitle: "Ikuti agenda, siaran langsung, rilis resmi, dokumentasi, dan panduan publik Muktamar Nahdlatul Ulama ke-35.",
  date: "15 - 18 Juni 2026",
  location: "Semarang, Jawa Tengah",
  currentStage: "Pra-Muktamar"
};

export function getSavedHero(): HeroConfig {
  try {
    const saved = localStorage.getItem(CODES.HERO);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.HERO, JSON.stringify(DEFAULT_HERO));
  return DEFAULT_HERO;
}

export function saveHero(data: HeroConfig) {
  localStorage.setItem(CODES.HERO, JSON.stringify(data));
}

export interface LiveBarConfig {
  enabled: boolean;
  manualMode: boolean;
  manualText: string;
  linkTo: string;
}

export const DEFAULT_LIVE_BAR: LiveBarConfig = {
  enabled: true,
  manualMode: false,
  manualText: "Live sekarang: Registrasi Peserta Muktamar NU & Pameran Khazanah",
  linkTo: "live"
};

export function getSavedLiveBar(): LiveBarConfig {
  try {
    const saved = localStorage.getItem(CODES.LIVE_BAR);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.LIVE_BAR, JSON.stringify(DEFAULT_LIVE_BAR));
  return DEFAULT_LIVE_BAR;
}

export function saveLiveBar(data: LiveBarConfig) {
  localStorage.setItem(CODES.LIVE_BAR, JSON.stringify(data));
}

export interface LiveStreamConfig {
  cameraLabel: string;
  youtubeId: string;
  isLive: boolean;
  latestUpdateLabel: string;
  latestUpdateDesc: string;
  lastChanged: string;
}

export const DEFAULT_LIVE_STREAM: LiveStreamConfig = {
  cameraLabel: "Plenary Hall (Main Stage)",
  youtubeId: "8u1E6tE0hCg", // Dummy livestream video id placeholder
  isLive: true,
  latestUpdateLabel: "Pleno I Selesai",
  latestUpdateDesc: "Tata tertib persidangan resmi disahkan secara aklamasi oleh delegasi wilayah.",
  lastChanged: "Baru saja"
};

export function getSavedLiveStream(): LiveStreamConfig {
  try {
    const saved = localStorage.getItem(CODES.LIVE_STREAM);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.LIVE_STREAM, JSON.stringify(DEFAULT_LIVE_STREAM));
  return DEFAULT_LIVE_STREAM;
}

export function saveLiveStream(data: LiveStreamConfig) {
  localStorage.setItem(CODES.LIVE_STREAM, JSON.stringify(data));
}

export interface AnnouncementItem {
  id: string;
  title: string;
  desc: string;
  type: "Info" | "Penting" | "Perubahan Agenda" | "Live" | "Media";
  status: "Draft" | "Published";
  displayAsBanner: boolean;
  displayOnHome: boolean;
  dateStr: string;
}

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann1",
    title: "Alur registrasi dipercepat, sila gunakan QR Code",
    desc: "Seluruh utusan delegasi diharapkan membawa lembar kode batang digital untuk meminimalkan waktu tunggu cetak kartu identitas resmi.",
    type: "Penting",
    status: "Published",
    displayAsBanner: true,
    displayOnHome: true,
    dateStr: "29 Mei 2026"
  },
  {
    id: "ann2",
    title: "Bazaar Kuliner Nusantara & UMKM dibuka untuk Umum",
    desc: "Berlokasi di lingkar luar Exhibition Hall, ratusan stan makanan khas daerah Jawa Tengah siap melayani jemaah muhibbin.",
    type: "Info",
    status: "Published",
    displayAsBanner: false,
    displayOnHome: true,
    dateStr: "28 Mei 2026"
  }
];

export function getSavedAnnouncements(): AnnouncementItem[] {
  try {
    const saved = localStorage.getItem(CODES.ANNOUNCEMENTS);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  return INITIAL_ANNOUNCEMENTS;
}

export function saveAnnouncements(data: AnnouncementItem[]) {
  localStorage.setItem(CODES.ANNOUNCEMENTS, JSON.stringify(data));
}

export interface WebsiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFb: string;
  socialIg: string;
  socialYt: string;
  maintenanceMode: boolean;
  showCountdown: boolean;
  activeSections: { [key: string]: boolean };
}

export const DEFAULT_SETTINGS: WebsiteSettings = {
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
  }
};

export function getSavedSettings(): WebsiteSettings {
  try {
    const saved = localStorage.getItem(CODES.SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

export function saveSettings(data: WebsiteSettings) {
  localStorage.setItem(CODES.SETTINGS, JSON.stringify(data));
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Media Officer" | "Live Operator" | "Reviewer";
  status: "Aktif" | "Nonaktif";
  lastLogin: string;
}

export const INITIAL_USERS: UserItem[] = [
  { id: "usr1", name: "Muhammad Syamsuri", email: "syamsuri@pbnu.or.id", role: "Super Admin", status: "Aktif", lastLogin: "Hari ini, 08.42 WIB" },
  { id: "usr2", name: "Ahmad Choiruddin", email: "choir@pbnu.or.id", role: "Editor", status: "Aktif", lastLogin: "Kemarin, 14.15 WIB" },
  { id: "usr3", name: "Siti Fatimah", email: "fatimah@pbnu.or.id", role: "Media Officer", status: "Aktif", lastLogin: "Hari ini, 07.12 WIB" },
  { id: "usr4", name: "Gus Rahman", email: "rahman@pbnu.or.id", role: "Live Operator", status: "Aktif", lastLogin: "Hari ini, 09.00 WIB" },
  { id: "usr5", name: "Kiai Yusuf Hasyim", email: "yusuf@pbnu.or.id", role: "Reviewer", status: "Aktif", lastLogin: "2 hari yang lalu" }
];

export function getSavedUsers(): UserItem[] {
  try {
    const saved = localStorage.getItem(CODES.USERS);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.USERS, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
}

export function saveUsers(data: UserItem[]) {
  localStorage.setItem(CODES.USERS, JSON.stringify(data));
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  ip: string;
}

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: "log1", timestamp: "29 Mei 2026, 09.20 WIB", user: "Gus Rahman", role: "Live Operator", action: "Ubah Status Live", module: "Live Center", details: "Mengaktifkan feed streaming kamera Plenary Hall", ip: "192.168.1.14" },
  { id: "log2", timestamp: "29 Mei 2026, 08.45 WIB", user: "Muhammad Syamsuri", role: "Super Admin", action: "Update Settings", module: "Website Config", details: "Mengubah countdown menuju pembukaan", ip: "103.55.22.8" },
  { id: "log3", timestamp: "28 Mei 2026, 17.10 WIB", user: "Ahmad Choiruddin", role: "Editor", action: "Tambah Agenda", module: "Agenda", details: "Membuat agenda 'Sidang Pleno I' baru", ip: "192.168.1.53" },
  { id: "log4", timestamp: "28 Mei 2026, 14.30 WIB", user: "Siti Fatimah", role: "Media Officer", action: "Upload Asset", module: "Media Center", details: "Mengupload berkas Press Kit resmi v2.zip", ip: "103.44.1.9" }
];

export function getSavedAuditLogs(): AuditLog[] {
  try {
    const saved = localStorage.getItem(CODES.AUDIT_LOGS);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  localStorage.setItem(CODES.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  return INITIAL_AUDIT_LOGS;
}

export function saveAuditLogs(data: AuditLog[]) {
  localStorage.setItem(CODES.AUDIT_LOGS, JSON.stringify(data));
}

export function createAuditLog(user: string, role: string, action: string, module: string, details: string) {
  const currentLogs = getSavedAuditLogs();
  const date = new Date();
  const nowStr = `${date.getDate()} Mei 2026, ${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')} WIB`;
  const newLog: AuditLog = {
    id: "log_" + Date.now(),
    timestamp: nowStr,
    user,
    role,
    action,
    module,
    details,
    ip: "103.111.45.102 (Proxy)"
  };
  saveAuditLogs([newLog, ...currentLogs]);
}
