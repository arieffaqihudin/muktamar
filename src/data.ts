/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgendaItem {
  id: string;
  time: string; // e.g. "08.00 - 10.30 WIB"
  title: string;
  location: string;
  status: 'Live' | 'Akan Berlangsung' | 'Selesai' | 'Tersedia Rekaman';
  access: 'Terbuka untuk Publik' | 'Khusus Peserta' | 'Terbuka untuk Media';
  description: string;
  day: 1 | 2 | 3 | 4;
}

export interface NewsItem {
  id: string;
  category: 'Rilis Resmi' | 'Pengumuman' | 'Update Harian' | 'Sorotan' | 'Konferensi Pers';
  date: string;
  title: string;
  summary: string;
  content: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'PDF' | 'ZIP' | 'PNG/SVG' | 'MP4';
  size: string;
  description: string;
}

export interface PressConference {
  id: string;
  time: string;
  title: string;
  speaker: string;
  location: string;
}

export interface HistoricalMilestone {
  year: string;
  title: string;
  description: string;
}

export const MOCK_AGENDA: AgendaItem[] = [
  // HARI 1
  {
    id: "a1",
    time: "08.00 - 10.00 WIB",
    title: "Registrasi dan Verifikasi Berkas Peserta",
    location: "Lobby Utama Exhibition Hall",
    status: "Selesai",
    access: "Khusus Peserta",
    description: "Proses registrasi akhir, pencetakan ID card RFID peserta muktamar, serta pembagian kelengkapan persidangan.",
    day: 1
  },
  {
    id: "a2",
    time: "10.00 - 12.30 WIB",
    title: "Pembukaan Akbar Muktamar NU ke-35",
    location: "Plenary Hall (Aula Utama)",
    status: "Live",
    access: "Terbuka untuk Publik",
    description: "Pembukaan resmi oleh Presiden RI bersama jajaran Syuriyah dan Tanfidziyah PBNU, dimeriahkan dengan koreografi budaya Nusantara dan lantunan Shalawat Asyghil Kolosal.",
    day: 1
  },
  {
    id: "a3",
    time: "14.30 - 17.30 WIB",
    title: "Sidang Pleno I: Pembahasan Jadwal dan Tata Tertib",
    location: "Plenary Hall (Aula Utama)",
    status: "Akan Berlangsung",
    access: "Khusus Peserta",
    description: "Sidang pleno pertama untuk mengesahkan tata tertib jalannya Muktamar NU ke-35 serta pemilihan komisi-komisi persidangan.",
    day: 1
  },
  {
    id: "a4",
    time: "19.30 - 21.00 WIB",
    title: "Konferensi Pers Pembukaan & Pengumuman Agenda",
    location: "Media Press Center - Room B",
    status: "Akan Berlangsung",
    access: "Terbuka untuk Media",
    description: "Pernyataan pers resmi panitia pengarah (SC) dan panitia pelaksana (OC) terkait dimulainya rangkaian persidangan Muktamar.",
    day: 1
  },
  // HARI 2
  {
    id: "a5",
    time: "08.00 - 12.00 WIB",
    title: "Sidang Pleno II: Laporan Pertanggungjawaban PBNU",
    location: "Sub-Hall A (Gedung Serbaguna)",
    status: "Akan Berlangsung",
    access: "Khusus Peserta",
    description: "Penyampaian Khidmah Laporan Pertanggungjawaban jajaran Pengurus Besar Nahdlatul Ulama periode berjalan serta tanggapan dari Pengurus Wilayah (PWNU).",
    day: 2
  },
  {
    id: "a6",
    time: "13.30 - 17.30 WIB",
    title: "Sidang Komisi A (Bahtsul Masail Diniyah Waqi'iyah)",
    location: "Sub-Hall B (Ruang Marwah)",
    status: "Akan Berlangsung",
    access: "Khusus Peserta",
    description: "Pembahasan mendalam persoalan keagamaan aktual kontemporer dari hukum fikih Islam, dipimpin oleh para kiai sepuh dan ahli hukum Islam nusantara.",
    day: 2
  },
  {
    id: "a7",
    time: "13.30 - 17.30 WIB",
    title: "Sidang Komisi B (Bahtsul Masail Maudhu'iyah & Qanuniyah)",
    location: "Sub-Hall C (Ruang Shafa)",
    status: "Akan Berlangsung",
    access: "Khusus Peserta",
    description: "Fokus pada tema-tema kebangsaan, reformasi hukum nasional, kelestarian lingkungan hidup, dan krisis iklim dalam bingkai hukum Islam.",
    day: 2
  },
  {
    id: "a8",
    time: "19.30 - 22.00 WIB",
    title: "Forum Dialog Global: Islam, Kebudayaan, dan Peradaban Baru",
    location: "Auditorium Hub",
    status: "Tersedia Rekaman",
    access: "Terbuka untuk Publik",
    description: "Diskusi panel menghadirkan tokoh perdamaian global mengenai peran Islam Moderat (Wasathiyah) dalam membangun masa depan abad kedua NU.",
    day: 2
  },
  // HARI 3
  {
    id: "a9",
    time: "08.00 - 11.30 WIB",
    title: "Sidang Pleno III: Pengesahan Hasil-hasil Sidang Komisi",
    location: "Plenary Hall (Aula Utama)",
    status: "Akan Berlangsung",
    access: "Khusus Peserta",
    description: "Pleno gabungan untuk membacakan dan menyepakati rekomendasi keagamaan, keorganisasian, serta rekomendasi kebangsaan dari masing-masing komisi.",
    day: 3
  },
  {
    id: "a10",
    time: "13.30 - 18.00 WIB",
    title: "Sidang Pleno IV: Pemilihan Syuriyah (Ahwa) & Ketua Umum Tanfidziyah",
    location: "Plenary Hall (Aula Utama)",
    status: "Akan Berlangsung",
    access: "Khusus Peserta",
    description: "Musyawarah mufakat Ahlul Halli wal Aqdi (AHWA) untuk menetapkan Rais 'Aam, dilanjutkan dengan pemilihan demokratis secara langsung Ketua Umum Tanfidziyah PBNU.",
    day: 3
  },
  {
    id: "a11",
    time: "20.00 - 22.00 WIB",
    title: "Konferensi Pers Pengurus Terpilih & Rekomendasi Muktamar",
    location: "Media Press Center - Room B",
    status: "Akan Berlangsung",
    access: "Terbuka untuk Media",
    description: "Pengumuman resmi susunan puncak kepemimpinan PBNU terpilih dan pembacaan Maklumat Muktamar NU ke-35.",
    day: 3
  },
  // HARI 4
  {
    id: "a12",
    time: "09.00 - 11.30 WIB",
    title: "Upacara Penutupan Muktamar NU ke-35",
    location: "Plenary Hall (Aula Utama)",
    status: "Akan Berlangsung",
    access: "Terbuka untuk Publik",
    description: "Pidato perdana Rais 'Aam dan Ketua Umum Tanfidziyah terpilih, dilanjutkan dengan amanat penutup dari Wakil Presiden RI serta tausiyah doa penutup.",
    day: 4
  },
  {
    id: "a13",
    time: "13.00 - 15.00 WIB",
    title: "Rilis Resmi Hasil Muktamar & Distribusi Dokumen",
    location: "Digital Station",
    status: "Akan Berlangsung",
    access: "Terbuka untuk Publik",
    description: "Penyebarluasan naskah keputusan muktamar secara utuh melalui media digital resmi untuk masyarakat dunia.",
    day: 4
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    category: "Rilis Resmi",
    date: "29 Mei 2026",
    title: "Panitia Menyiapkan Rangkaian Agenda Utama Muktamar NU ke-35",
    summary: "Segala kesiapan infrastruktur digital, pelayanan delegasi, dan kesiapan venue persidangan telah mencapai 100% untuk menyambut 3.500 muktamirin di seluruh nusantara.",
    content: `Semarang, PBNU — Panitia Pelaksana Muktamar Nahdlatul Ulama ke-35 menegaskan kesiapannya menyambut para muktamirin dari PWNU secara utuh di tempat pelaksanaan acara. Dalam rapat pleno persiapan akhir, Ketua SC menegaskan bahwa fokus utama Muktamar ke-35 adalah penguatan teknologi maslahat dan ekosistem keumatan di abad kedua NU.\n\nSistem pencatatan digital berbasis RFID nirkabel disiapkan agar tidak terjadi antrean pada pendaftaran, serta memastikan transparansi alur distribusi naskah kajian bahtsul masail keagamaan.`
  },
  {
    id: "n2",
    category: "Pengumuman",
    date: "28 Mei 2026",
    title: "Panduan Publikasi dan Akses Dokumentasi Resmi Muktamar Untuk Publik",
    summary: "Guna mencegah kesimpangsiuran berita, panitia membuka Pusat Informasi Live Hub dan merilis Press Kit resmi yang memuat seluruh identitas visual resmi muktamar.",
    content: `Jakarta — Panitia Publikasi Muktamar NU ke-35 mengumumkan rilis panduan pemanfaatan aset digital visual bagi jurnalis swasta, kreator konten, dan jemaah nahdliyin di seluruh dunia. Logo resolusi tinggi, pedoman warna khusyuk keemasan, serta arsip foto harian dapat diunduh bebas melalui portal Media Center.`
  },
  {
    id: "n3",
    category: "Update Harian",
    date: "27 Mei 2026",
    title: "Media Center Muktamar NU ke-35 Mulai Beroperasi Melayani Jurnalis",
    summary: "Dilengkapi internet kecepatan tinggi 10 Gbps, area siaran langsung mandiri, dan catering khas daerah, Media Center siap menampung ratusan perwakilan jurnalis.",
    content: `Muktamar Center — Panitia berkomitmen mempermudah awak media dalam menyampaikan kabar sahih dari garda terdepan arena Muktamar. Ruang pers terpusat ini menyuguhkan layar berukuran raksasa yang menyiarkan jalannya persidangan tertutup secara sepihak untuk kemudahan peliputan, tanpa mengganggu kekhusyukan jalannya sidang formatur.`
  },
  {
    id: "n4",
    category: "Sorotan",
    date: "26 Mei 2026",
    title: "Agenda Pembukaan Muktamar NU ke-35: Mengusung Tema Kemandirian Berkelanjutan",
    summary: "Sejalan dengan khidmah peradaban, Muktamar ke-35 akan memadukan tradisi keislaman Nusantara dengan agenda transisi energi global dan teknologi kemanusiaan.",
    content: `Yogyakarta — Muktamar kali ini memboyong isu kelestarian lingkungan dan transformasi digital ke meja bahtsul masail. Melalui tema persaudaraan kemanusiaan, kiai-kiai kharismatik akan meninjau kedaulatan digital bangsa dan hukum karbon dari preseden fikih klasik kearifan Islam moderat.`
  }
];

export const MOCK_FAQ: FAQItem[] = [
  {
    id: "f1",
    question: "Apakah semua agenda Muktamar ke-35 dapat disaksikan oleh publik?",
    answer: "Siaran langsung (Live Streaming) disediakan untuk agenda-agenda penting seperti Acara Pembukaan Akbar, Dialog Peradaban, Pembacaan Rekomendasi, hingga Penutupan Muktamar. Agenda sidang komisi keorganisasian dan bahtsul masail internal bersifat tertutup bagi non-peserta resmi, namun rilis resmi keputusan akan diperbarui langsung setelah pleno selesai."
  },
  {
    id: "f2",
    question: "Di mana saya bisa menyaksikan siaran langsung resmi jalannya acara?",
    answer: "Seluruh siaran langsung terintegrasikan langsung pada menu 'Live' di website Live Information Hub ini. Siaran tersebut diproduksi secara langsung oleh tim penyiaran komite media Muktamar dan disinergikan melalui jaringan YouTube Official Nahdlatul Ulama."
  },
  {
    id: "f3",
    question: "Bagaimana cara mendapatkan dokumen resmi hasil keputusan bahtsul masail?",
    answer: "Setelah naskah keputusan ditandatangani oleh pimpinan sidang komisi dan disahkan dalam rapat pleno paripurna, draf digital dalam format PDF resmi akan diunggah ke halaman 'Media Center' di menu 'Rilis Resmi' untuk diunduh secara cuma-cuma."
  },
  {
    id: "f4",
    question: "Apakah masyarakat umum atau jemaah diperbolehkan hadir langsung di lokasi?",
    answer: "Masyarakat umum dipersilakan mengikuti kemeriahan festival, bazaar kuliner, pameran UMKM nusantara, serta tabligh akbar keagamaan yang diselenggarakan di zona lingkar luar venue utama. Akses ke dalam ruang sidang pleno utama (Plenary Hall) hanya diperuntukkan bagi utusan delegasi resmi PWNU/PCNU dan jurnalis terakreditasi."
  },
  {
    id: "f5",
    question: "Bagaimana jurnalis mandiri mendaftarkan peliputan di lokasi?",
    answer: "Pendaftaran jurnalis dapat diurus melalui formulir pendaftaran pers di menu 'Media Center'. Pers yang memenuhi berkas akan mendapatkan kartu pers eksklusif Muktamar yang memberikan akses ke ruang Media Center, konferensi pers harian, serta slot tanya-jawab langsung."
  }
];

export const MOCK_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "asset1",
    title: "Official Press Kit Muktamar NU ke-35 Complete Bundle",
    type: "ZIP",
    size: "45.8 MB",
    description: "Berisi rilis resmi latar belakang muktamar, logo resolusi cetak, file vektor, infografis tema, serta pedoman media nasional."
  },
  {
    id: "asset2",
    title: "Logo Resmi Muktamar NU ke-35 (Vektor & Transparan)",
    type: "PNG/SVG",
    size: "4.2 MB",
    description: "Aset logo Muktamar berlatar warna transparan, putih hangat, emas, dan hijau tua digdaya untuk keperluan banner berita."
  },
  {
    id: "asset3",
    title: "Buku Saku & Panduan Delegasi Muktamar",
    type: "PDF",
    size: "18.5 MB",
    description: "Panduan penginapan syariah, peta letak auditorium, jadwal akomodasi bis antar-jemput, serta alur ketertiban sidang."
  },
  {
    id: "asset4",
    title: "Formulir Akreditasi Liputan Jurnalis Resmi",
    type: "PDF",
    size: "1.2 MB",
    description: "Formulir pengisian mandat institusi media untuk dibawa jurnalis lapangan menuju verifikasi meja resepsionis Media Center."
  }
];

export const MOCK_PRESS_CONFERENCES: PressConference[] = [
  {
    id: "p1",
    time: "Hari 1 - 19.30 WIB",
    title: "Laporan Kesiapan Infrastruktur Akhir dan Data Peserta Hadir",
    speaker: "Sekretaris Jenderal Panitia Pelaksana Muktamar",
    location: "Media Press Center - Room B"
  },
  {
    id: "p2",
    time: "Hari 2 - 17.45 WIB",
    title: "Pernyataan Hasil Awal Kajian Bahtsul Masail Waqi'iyah (Fikih Tematik)",
    speaker: "Katib Syuriyah PBNU & Ketua Lembaga Bahtsul Masail",
    location: "Media Press Center - Room A"
  },
  {
    id: "p3",
    time: "Hari 3 - 20.00 WIB",
    title: "Pengumuman Susunan Pengurus PBNU Baru Terpilih Periode 2026-2031",
    speaker: "Ketua Formatur / Ketua Panitia Pengarah Muktamar",
    location: "Plenary Hall Center Screen"
  }
];

export const MOCK_MILESTONES: HistoricalMilestone[] = [
  {
    year: "1926",
    title: "Muktamar NU ke-1 (Surabaya)",
    description: "Pendirian Nahdlatul Ulama secara de facto dipelopori oleh Khasratussyaikh KH Hasyim Asy'ari dan Kiai Wahab Chasbullah untuk mereformulasikan hukum fikih bermazhab kearifan nusantara."
  },
  {
    year: "1984",
    title: "Muktamar NU ke-27 (Situbondo)",
    description: "Momen bersejarah pemulihan Khittah NU 1926, membawa NU keluar dari partai politik praktis, menegaskan posisi Pancasila berasaskan prinsip keserasian keumatan."
  },
  {
    year: "2021",
    title: "Muktamar NU ke-34 (Lampung)",
    description: "Menghadirkan era baru penguatan kemandirian ekonomi umat secara murni dalam teknologi informasi dan meluncurkan program pembiayaan maslahah."
  },
  {
    year: "2026",
    title: "Muktamar NU ke-35 (Menuju Digdaya)",
    description: "Langkah terpadu di awal abad kedua NU, menekankan pada kedaulatan digital, transisi hijau ramah alam, kesetaraan hak sipil, serta sinergi ukhuwah internasional."
  }
];
