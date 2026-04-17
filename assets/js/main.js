// ===== DARK MODE TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Cek saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ===== LANGUAGE TOGGLE =====
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'id';

const translations = {
  id: {
    nav_home: 'Beranda',
    nav_emergency: 'Darurat',
    nav_stories: 'Ruang Cerita',
    nav_education: 'Edukasi',
    nav_map: 'Safety Map',
    nav_community: 'Komunitas',
    nav_report: 'Panduan Lapor',
    nav_consult: 'Konsultasi',
    nav_donate: 'Donasi',
    nav_login: 'Masuk',
    nav_register: 'Daftar',
  },
  en: {
    nav_home: 'Home',
    nav_emergency: 'Emergency',
    nav_stories: 'Safe Space',
    nav_education: 'Education',
    nav_map: 'Safety Map',
    nav_community: 'Community',
    nav_report: 'Report Guide',
    nav_consult: 'Consultation',
    nav_donate: 'Donate',
    nav_login: 'Login',
    nav_register: 'Register',
  }
};

function applyLanguage(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  if (langToggle) {
    langToggle.textContent = lang === 'id' ? '🌐 EN' : '🌐 ID';
  }
  localStorage.setItem('lang', lang);
  currentLang = lang;
}

// Apply saved language
applyLanguage(currentLang);

langToggle?.addEventListener('click', () => {
  const newLang = currentLang === 'id' ? 'en' : 'id';
  applyLanguage(newLang);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle?.addEventListener('click', () => {
  navMenu?.classList.toggle('active');
  menuToggle.textContent = navMenu?.classList.contains('active') ? '✕' : '☰';
});

// ===== CLOSE MENU ON LINK CLICK =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('active');
    if (menuToggle) menuToggle.textContent = '☰';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});