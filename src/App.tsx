import { useState, useEffect, useRef } from 'react';
import './App.css';
import CategoryPills from './components/CategoryPills';
import Carousel from './components/Carousel';
import About from './components/About';
import { motion, AnimatePresence } from 'framer-motion';

/** Critical images that must be cached before the page reveals. */
const PRELOAD_ASSETS = [
  '/oatjin_logo_wh.png',
  '/my-photo/main-profile.jpg',
  '/my-photo/photographer.jpg',
  '/my-photo/videographer.jpg',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop',
];

const MIN_SPLASH_MS = 2800; // minimum time the splash is shown (logo animation feels complete)
const FALLBACK_MS = 7000;   // absolute max wait in case an asset fails/stalls

function App() {
  const [activeCategory, setActiveCategory] = useState('Work');
  const [lang, setLang] = useState<'en' | 'th'>('en');
  const [showSplash, setShowSplash] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0); // 0 → 1
  const [assetsReady, setAssetsReady] = useState(false); // triggers color burst

  const minTimeElapsed = useRef(false);

  // Dismiss splash only when BOTH minimum time has passed AND assets are loaded
  const tryDismiss = (ready: boolean) => {
    if (minTimeElapsed.current && ready) {
      setShowSplash(false);
    }
  };

  useEffect(() => {
    const total = PRELOAD_ASSETS.length;
    let loaded = 0;

    // 1. Preload all assets, update progress bar as each finishes
    PRELOAD_ASSETS.forEach((src) => {
      const img = new Image();
      const onFinish = () => {
        loaded += 1;
        setLoadProgress(loaded / total);
        if (loaded === total) {
          setAssetsReady(true);
          tryDismiss(true);
        }
      };
      img.onload = onFinish;
      img.onerror = onFinish; // don't block on broken assets
      img.src = src;
    });

    // 2. Minimum display timer — ensures the logo animation plays fully
    const minTimer = setTimeout(() => {
      minTimeElapsed.current = true;
      // assetsReady might already be true by now; check via closure
      setAssetsReady(prev => {
        if (prev) setShowSplash(false);
        return prev;
      });
    }, MIN_SPLASH_MS);

    // 3. Hard fallback — dismiss no matter what after FALLBACK_MS
    const fallbackTimer = setTimeout(() => {
      setShowSplash(false);
    }, FALLBACK_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            {/* Colorful ambient burst — fades in when assets are ready */}
            <motion.div
              className="splash-color-burst"
              initial={{ opacity: 0 }}
              animate={{ opacity: assetsReady ? 1 : 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />

            {/* Logo */}
            <motion.img
              src="/oatjin_logo_wh.png"
              alt="OATJIN Logo"
              className="splash-logo"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />

            {/* Progress bar */}
            <div className="splash-progress-track">
              <motion.div
                className="splash-progress-bar"
                initial={{ width: '0%' }}
                animate={{ width: `${loadProgress * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* "Loading…" label — fades out when done */}
            <motion.span
              className="splash-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: assetsReady ? 0 : 0.5 }}
              transition={{ delay: assetsReady ? 0 : 0.6, duration: 0.5 }}
            >
              Loading…
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-container">
        <div className="ambient-background"></div>

        <motion.main
          className="glass-card"
          style={{ position: 'relative' }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={!showSplash ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'th' : 'en')}>
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          <header className="header">
            <img src="/oatjin_logo_wh.png" alt="OATJIN Logo" className="logo" />
            <span className="subtitle">GALLERY</span>
            <h1 className="title">OATJIN's Video Works</h1>
            <p className="description">
              {lang === 'en'
                ? 'Professional works. Understanding comes first — the right moment follows.'
                : 'ผลิตงานอย่างมืออาชีพ เข้าใจโจทย์ก่อนลงมือ บันทึกทุกโมเมนต์สำคัญ'}
            </p>
          </header>

          <CategoryPills
            categories={['Work', 'About', 'Contact']}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          {activeCategory === 'Work' && <Carousel category="All" />}
          {activeCategory === 'About' && <About lang={lang} />}
          {activeCategory === 'Contact' && (
            <div className="contact-section">
              <h2>{lang === 'en' ? 'Get in Touch' : 'ติดต่อสอบถาม'}</h2>
              <p>
                {lang === 'en' ? 'For inquiries and collaborations, reach out on my socials or send an email.' : 'สำหรับติดต่องานหรือสอบถามข้อมูล สามารถติดต่อได้ที่ช่องทางด้านล่างนี้'}
              </p>
              <div className="contact-links">
                <a
                  href="mailto:jinnawat.char@gmail.com"
                  className="contact-link-btn email"
                >
                  jinnawat.char@gmail.com
                </a>
                <a
                  href="https://www.instagram.com/oatjin_gallery?igsh=MTVnYmVwdTAwdnR2dg=="
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-btn social"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1K5rVmH5pt/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-btn social"
                >
                  Facebook
                </a>
              </div>
            </div>
          )}

        </motion.main>
      </div>
    </>
  );
}

export default App;
