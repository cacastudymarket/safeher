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

// ===== GEMINI BOT AI =====

const SYSTEM_PROMPT = `Kamu adalah SafeHer AI, asisten virtual platform SafeHer yang membantu perempuan Indonesia.

SafeHer adalah platform perlindungan dan pemberdayaan perempuan dengan fitur:
- 🆘 Tombol Darurat (SOS)
- 📖 Ruang Cerita (berbagi pengalaman anonim)
- 📚 Pusat Edukasi (artikel hak perempuan)
- 🗺️ Safety Map (laporan kejadian real-time)
- 🤝 Komunitas & Buddy System
- ⚖️ Panduan Lapor ke polisi
- 💬 Konsultasi ahli hukum & psikolog
- 💝 Donasi transparan
- 📊 Mood Tracker
- 🏅 Badge & Apresiasi

Tugasmu:
1. Panduan fitur SafeHer
2. Rekomendasi fitur sesuai kebutuhan user
3. Info hotline darurat
4. Generate tiket pengaduan error
5. Dukungan emosional ringan

Aturan:
- Selalu gunakan bahasa Indonesia yang hangat dan suportif
- Jangan memberikan diagnosis medis atau nasihat hukum spesifik
- Untuk kondisi darurat selalu arahkan ke fitur SOS atau hubungi 110/129
- Jawab singkat dan jelas, maksimal 3-4 kalimat
- Selalu akhiri dengan emoji 💜`;

async function sendToGemini(message) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AIzaSyAQEXVyXfxSlsVdv79JOSToRYTnHm4Ka7I}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT + '\n\nUser: ' + message }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
          }
        })
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, aku tidak bisa menjawab saat ini. Coba lagi ya 💜';
  } catch (error) {
    return 'Maaf, terjadi kesalahan koneksi. Pastikan kamu terhubung ke internet 💜';
  }
}

function addBotMessage(text, isUser = false) {
  const messages = document.getElementById('botMessages');
  if (!messages) return;

  const div = document.createElement('div');
  div.className = 'bot-message' + (isUser ? ' user' : '');
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function handleBotSend() {
  const input = document.getElementById('botInput');
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  input.value = '';
  addBotMessage(message, true);

  // Typing indicator
  const messages = document.getElementById('botMessages');
  const typing = document.createElement('div');
  typing.className = 'bot-message';
  typing.id = 'typingIndicator';
  typing.textContent = '⏳ Mengetik...';
  messages?.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  const reply = await sendToGemini(message);

  // Remove typing indicator
  document.getElementById('typingIndicator')?.remove();
  addBotMessage(reply);
}

// Bot send button & enter key
document.addEventListener('DOMContentLoaded', () => {
  const botSend = document.getElementById('botSend');
  const botInput = document.getElementById('botInput');

  botSend?.addEventListener('click', handleBotSend);
  botInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleBotSend();
  });
});