import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../App.css';

const videos = [
  {
    id: 2,
    category: 'YouTube',
    type: 'horizontal',
    render: (resetKey: number) => (
      <iframe key={`yt-${resetKey}`} src="https://www.youtube.com/embed/Z4994YQYvmY?si=w-tokBy27Qj2LBcx&amp;controls=0" title="YouTube video player" style={{width:'100%',height:'100%',border:0,position:'absolute',top:0,left:0}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    )
  },
  {
    id: 1,
    category: 'Facebook',
    type: 'horizontal',
    render: (resetKey: number) => (
      <iframe key={`fb-h-${resetKey}`} src="https://www.facebook.com/plugins/video.php?height=720&href=https%3A%2F%2Fwww.facebook.com%2FScienceThammasat%2Fvideos%2F287266127597525%2F&show_text=false&width=1280&t=0" style={{border:'none',overflow:'hidden',width:'100%',height:'100%',position:'absolute',top:0,left:0}} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
    )
  },
  {
    id: 3,
    category: 'Instagram',
    type: 'vertical-ig',
    render: (resetKey: number) => (
      <div key={`ig-${resetKey}`} style={{width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#000'}}>
         <iframe src="https://www.instagram.com/p/DCEQCAOBGsm/embed" style={{position:'absolute', top:'-54px', left:'-2px', width:'calc(100% + 4px)', height:'calc(100% + 188px)', border:0}} frameBorder="0" scrolling="no" allowTransparency={true}></iframe>
      </div>
    )
  },
  {
    id: 4,
    category: 'Facebook',
    type: 'vertical-fb',
    render: (resetKey: number) => (
      <iframe key={`fb-v-${resetKey}`} src="https://www.facebook.com/plugins/video.php?height=604&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2486829488420275%2F&show_text=false&width=340&t=0" style={{border:'none',overflow:'hidden',width:'100%',height:'100%',position:'absolute',top:0,left:0}} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
    )
  },
  {
    id: 5,
    category: 'YouTube',
    type: 'horizontal',
    render: (resetKey: number) => (
      <iframe key={`yt2-${resetKey}`} src="https://www.youtube.com/embed/Jd7se00Yl7Y?si=H_qUPuRwn9vDkKc3" title="YouTube video player" frameBorder="0" style={{width:'100%',height:'100%',border:0,position:'absolute',top:0,left:0}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={true}></iframe>
    )
  },
  {
    id: 6,
    category: 'YouTube',
    type: 'horizontal',
    render: (resetKey: number) => (
      <iframe key={`yt3-${resetKey}`} src="https://www.youtube.com/embed/z5rikj2yqLg?si=r5rfWHqV_wTkK4HI" title="YouTube video player" frameBorder="0" style={{width:'100%',height:'100%',border:0,position:'absolute',top:0,left:0}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={true}></iframe>
    )
  }
];

/**
 * Compute card dimensions for the active (centre) card based on screen tier.
 *
 * Tiers:
 *   mobile  < 640px
 *   tablet  640 – 1023px
 *   desktop ≥ 1024px
 */
function getCardDimensions(windowWidth: number, isHorizontal: boolean) {
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  if (isMobile) {
    // Fill available width inside glass-card (1rem padding each side = 32px, plus 2×16px outer = 64px total)
    const w = Math.min(windowWidth - 64, 400);
    const h = isHorizontal ? w * (9 / 16) : w * (16 / 9);
    return { w, h };
  }

  if (isTablet) {
    // Use ~65% of screen width, capped sensibly
    const w = isHorizontal
      ? Math.min(Math.round(windowWidth * 0.65), 580)
      : Math.min(Math.round(windowWidth * 0.35), 320);
    const h = isHorizontal ? Math.round(w * (9 / 16)) : Math.round(w * (16 / 9));
    return { w, h };
  }

  // Desktop — original design dimensions
  return isHorizontal ? { w: 640, h: 360 } : { w: 340, h: 604 };
}

/**
 * How far side cards are pushed left/right from centre.
 */
function getXOffset(windowWidth: number) {
  if (windowWidth < 640) return windowWidth * 0.55;
  if (windowWidth < 1024) return Math.min(windowWidth * 0.45, 380);
  return 400;
}

type OrientationFilter = 'landscape' | 'portrait';

export default function Carousel({ category }: { category: string }) {
  const baseVideos = category === 'All' ? videos : videos.filter(v => v.category === category);
  const [orientationFilter, setOrientationFilter] = useState<OrientationFilter>('landscape');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetKeys, setResetKeys] = useState<Record<number, number>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const filteredVideos = baseVideos.filter(v =>
    orientationFilter === 'landscape' ? v.type === 'horizontal' : v.type !== 'horizontal'
  );

  const handleOrientationChange = (val: OrientationFilter) => {
    setOrientationFilter(val);
    setCurrentIndex(0);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeIndex = Math.min(currentIndex, Math.max(0, filteredVideos.length - 1));

  const next = () => {
    if (filteredVideos.length > 0) {
      setResetKeys(prev => ({ ...prev, [filteredVideos[activeIndex].id]: (prev[filteredVideos[activeIndex].id] || 0) + 1 }));
    }
    setCurrentIndex(prev => (prev + 1) % filteredVideos.length);
  };

  const prev = () => {
    if (filteredVideos.length > 0) {
      setResetKeys(prev => ({ ...prev, [filteredVideos[activeIndex].id]: (prev[filteredVideos[activeIndex].id] || 0) + 1 }));
    }
    setCurrentIndex(prev => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      next();
    } else if (distance < -swipeThreshold) {
      prev();
    }
    setTouchStart(null);
  };

  if (filteredVideos.length === 0) {
    return <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No videos in this category.</div>;
  }

  // Derive wrapper height from the active card's dimensions
  const activeVideo = filteredVideos[activeIndex];
  const isHorizontal = activeVideo.type === 'horizontal';
  const { h: activeH } = getCardDimensions(windowWidth, isHorizontal);
  const xOffset = getXOffset(windowWidth);

  return (
    <div
      className="carousel-container"
    >
      {/* Orientation Filter Toggle */}
      <div className="orientation-toggle">
        <button
          className={`orient-btn ${orientationFilter === 'landscape' ? 'active' : ''}`}
          onClick={() => handleOrientationChange('landscape')}
          aria-label="Show landscape videos"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0.5" y="0.5" width="15" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="8" cy="6" r="2" fill="currentColor" opacity="0.5"/>
          </svg>
          Landscape
        </button>
        <button
          className={`orient-btn ${orientationFilter === 'portrait' ? 'active' : ''}`}
          onClick={() => handleOrientationChange('portrait')}
          aria-label="Show portrait videos"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0.5" y="0.5" width="9" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="5" cy="8" r="2" fill="currentColor" opacity="0.5"/>
          </svg>
          Portrait
        </button>
      </div>


      {/* Wrapper height animates smoothly when switching portrait ↔ landscape */}
      <motion.div
        className="cards-wrapper"
        animate={{ height: activeH }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, index) => {
            const isActive = index === activeIndex;
            const isPrev = index === (activeIndex - 1 + filteredVideos.length) % filteredVideos.length;
            const isNext = index === (activeIndex + 1) % filteredVideos.length;

            const { w: cardWidth, h: cardHeight } = getCardDimensions(windowWidth, video.type === 'horizontal');

            let x = 0;
            let zIndex = 0;
            let scale = 1;
            let opacity = 1;
            let boxShadow = '0 0 0 rgba(0,0,0,0)';

            if (isActive) {
              x = 0; zIndex = 10; scale = 1;
              boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            } else if (isPrev && filteredVideos.length > 1) {
              x = -xOffset; zIndex = 5; scale = 0.85; opacity = 1;
              boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            } else if (isNext && filteredVideos.length > 1) {
              x = xOffset; zIndex = 5; scale = 0.85; opacity = 1;
              boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            } else {
              opacity = 0; scale = 0.5; zIndex = 0;
            }

            return (
              <motion.div
                key={video.id}
                className="carousel-card"
                initial={false}
                animate={{
                  x,
                  scale,
                  zIndex,
                  opacity,
                  boxShadow,
                  width: cardWidth,
                  height: cardHeight
                }}
                transition={{
                  // Spring for position + scale — feels physical
                  x:     { type: 'spring', stiffness: 300, damping: 32, mass: 0.9 },
                  scale: { type: 'spring', stiffness: 300, damping: 32, mass: 0.9 },
                  // Smooth tween for size + opacity
                  width:     { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
                  height:    { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
                  opacity:   { duration: 0.25, ease: 'easeOut' },
                  boxShadow: { duration: 0.3,  ease: 'easeOut' },
                  zIndex:    { duration: 0 },
                }}
                onClick={() => {
                  if (isPrev) prev();
                  if (isNext) next();
                }}
                style={{ cursor: isActive ? 'default' : 'pointer' }}
              >
                {video.render(resetKeys[video.id] || 0)}
                {!isActive && <div className="card-overlay"></div>}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* ─── Swipe zones ──────────────────────────────────────────────────────
            Transparent strips at the left/right edges of the wrapper.
            They sit above the iframes (z-index 30) so Safari can capture
            touch events that would otherwise be swallowed by the iframe's
            separate browsing context.
        ──────────────────────────────────────────────────────────────────── */}
        {filteredVideos.length > 1 && (
          <>
            <div
              className="swipe-zone swipe-zone-left"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <div
              className="swipe-zone swipe-zone-right"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </>
        )}
      </motion.div>

      {/* Side arrows — tablet/desktop only (hidden on mobile via CSS) */}
      {filteredVideos.length > 1 && (
        <button onClick={prev} className="nav-btn left-arrow" aria-label="Previous video">
          <ChevronLeft size={22} />
        </button>
      )}
      {filteredVideos.length > 1 && (
        <button onClick={next} className="nav-btn right-arrow" aria-label="Next video">
          <ChevronRight size={22} />
        </button>
      )}

      {/* Bottom arrow row — mobile only */}
      {filteredVideos.length > 1 && (
        <div className="mobile-nav-row">
          <button onClick={prev} className="mobile-nav-btn" aria-label="Previous video">
            <ChevronLeft size={20} />
          </button>
          <span className="mobile-nav-counter">
            {activeIndex + 1} / {filteredVideos.length}
          </span>
          <button onClick={next} className="mobile-nav-btn" aria-label="Next video">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
