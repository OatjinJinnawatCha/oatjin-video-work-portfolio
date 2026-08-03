import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../App.css'; // Make sure styles are applied

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

export default function Carousel({ category }: { category: string }) {
  const filteredVideos = category === 'All' ? videos : videos.filter(v => v.category === category);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetKeys, setResetKeys] = useState<Record<number, number>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      next(); // Swiped left
    } else if (distance < -swipeThreshold) {
      prev(); // Swiped right
    }
    setTouchStart(null);
  };

  if (filteredVideos.length === 0) {
    return <div style={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>No videos in this category.</div>;
  }

  return (
    <div 
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Arrow outside wrapper so it's not affected by mask dissolve */}
      {filteredVideos.length > 1 && (
        <button onClick={prev} className="nav-btn left-arrow">
          <ChevronLeft size={24}/>
        </button>
      )}

      <div className="cards-wrapper">

        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, index) => {
            const isActive = index === activeIndex;
            const isPrev = index === (activeIndex - 1 + filteredVideos.length) % filteredVideos.length;
            const isNext = index === (activeIndex + 1) % filteredVideos.length;
            // Dynamic width/height based on true aspect ratio
            const isMobile = windowWidth < 768;
            const isHorizontal = video.type === 'horizontal';
            
            // Glass card padding is 1rem each side (32px), app-container padding is 1rem (32px)
            // Available width = windowWidth - 64px
            const maxCardWidth = isMobile ? windowWidth - 64 : 640; 
            
            let cardWidth = isHorizontal ? 640 : 340;
            let cardHeight = isHorizontal ? 360 : 604; // 16:9 and 9:16 exactly
            
            if (isMobile) {
              cardWidth = maxCardWidth;
              cardHeight = isHorizontal ? cardWidth * (9/16) : cardWidth * (16/9);
            }

            let x = 0;
            let zIndex = 0;
            let scale = 1;
            let opacity = 1;
            let blur = 0;
            
            // On mobile, the side cards should be pushed further away or overlap more
            const xOffset = isMobile ? windowWidth * 0.5 : 400;
            let boxShadow = '0 0 0 rgba(0,0,0,0)';

            if (isActive) {
              x = 0; zIndex = 10; scale = 1; blur = 0;
              boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            } else if (isPrev && filteredVideos.length > 1) {
              x = -xOffset; zIndex = 5; scale = 0.85; opacity = 1; blur = 0;
              boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            } else if (isNext && filteredVideos.length > 1) {
              x = xOffset; zIndex = 5; scale = 0.85; opacity = 1; blur = 0;
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
                  filter: `blur(${blur}px)`,
                  width: cardWidth,
                  height: cardHeight
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
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

      </div>

      {/* Right Arrow outside wrapper so it's not affected by mask dissolve */}
      {filteredVideos.length > 1 && (
        <button onClick={next} className="nav-btn right-arrow">
          <ChevronRight size={24}/>
        </button>
      )}
    </div>
  );
}
