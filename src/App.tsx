import { useState, useEffect } from 'react';
import './App.css';
import CategoryPills from './components/CategoryPills';
import Carousel from './components/Carousel';
import About from './components/About';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeCategory, setActiveCategory] = useState('Work');
  const [lang, setLang] = useState<'en' | 'th'>('en');
  const [showSplash, setShowSplash] = useState(true);

  const categories = ['Work', 'About', 'Contact'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ backgroundColor: '#000000', opacity: 1 }}
            animate={{ backgroundColor: 'rgba(0,0,0,0)', opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.img
              src="/oatjin_logo_wh.png"
              alt="OATJIN Logo"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ maxWidth: '250px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-container">
        <div className="ambient-background"></div>

        <motion.main
          className="glass-card"
          style={{ position: 'relative' }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'th' : 'en')}>
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          <header className="header">
            {/* Logo is placed here. Note that public folder assets are loaded relative to root in Vite */}
            <img src="/oatjin_logo_wh.png" alt="OATJIN Logo" className="logo" />
            <span className="subtitle">GALLERY</span>
            <h1 className="title">OATJIN's Video Works</h1>
            <p className="description" style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.1rem' }}>
              {lang === 'en'
                ? 'Professional works. Understanding comes first — the right moment follows.'
                : 'ผลิตงานอย่างมืออาชีพ เข้าใจโจทย์ก่อนลงมือ บันทึกทุกโมเมนต์สำคัญ'}
            </p>
          </header>

          <CategoryPills
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          {activeCategory === 'Work' && <Carousel category="All" />}
          {activeCategory === 'About' && <About lang={lang} />}
          {activeCategory === 'Contact' && (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-dark)' }}>
              <h2>{lang === 'en' ? 'Get in Touch' : 'ติดต่อสอบถาม'}</h2>
              <p style={{ marginTop: '1rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
                {lang === 'en' ? 'For inquiries and collaborations, reach out on my socials or send an email.' : 'สำหรับติดต่องานหรือสอบถามข้อมูล สามารถติดต่อได้ที่ช่องทางด้านล่างนี้'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="mailto:jinnawat.char@gmail.com"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: '#fff',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  jinnawat.char@gmail.com
                </a>
                <a
                  href="https://www.instagram.com/oatjin_gallery?igsh=MTVnYmVwdTAwdnR2dg=="
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'var(--accent)',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1K5rVmH5pt/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'var(--accent)',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
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
