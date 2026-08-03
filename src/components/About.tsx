import { motion } from 'framer-motion';
import '../App.css';

export default function About({ lang }: { lang: 'en' | 'th' }) {
  return (
    <div className="about-container">
      {/* Photo Composition */}
      <div className="about-images">
        {/* Main Photo */}
        <motion.div
          className="about-main-photo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img src="/my-photo/main-profile.jpg" alt="Oatjin" />
        </motion.div>

        {/* Bubble 1: Photographer */}
        <motion.div
          className="about-bubble bubble-left"
          initial={{ opacity: 0, x: -30, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <img src="/my-photo/photographer.jpg" alt="Photographer" />
        </motion.div>

        {/* Bubble 2: Videographer */}
        <motion.div
          className="about-bubble bubble-right"
          initial={{ opacity: 0, x: 30, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <img src="/my-photo/videographer.jpg" alt="Videographer" />
        </motion.div>
      </div>

      {/* Bio Text */}
      <motion.div
        className="about-text"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <h2>{lang === 'en' ? 'Jinnawat Charoensin' : 'จิณณวัตร เจริญศิลป์'}</h2>
        <h3>{lang === 'en' ? 'Cinematographer, Video Editor & Creator' : 'ช่างภาพ วิดีโอกราฟเฟอร์ เอดิเตอร์ และครีเอเตอร์'}</h3>

        {lang === 'en' ? (
          <>
            <p>
              Photographer, videographer, editor, and creator based between Bangkok and Phetchabun. What started as something I loved doing became a second career, built on experience and time spent in the field.
            </p>
            <p>
              Whether I'm directing, shooting, or editing, I care most about understanding the client's brief, capturing the moment, and creating a feeling worth remembering.
            </p>
          </>
        ) : (
          <>
            <p>
              ช่างภาพ วิดีโอกราฟเฟอร์ เอดิเตอร์ และครีเอเตอร์ ประจำอยู่ระหว่างกรุงเทพฯ และเพชรบูรณ์ เริ่มจากความชอบส่วนตัว ค่อยๆ กลายเป็นอาชีพที่สอง สั่งสมจากประสบการณ์จากการทำงานจริง
            </p>
            <p>
              ไม่ว่าจะกำกับ ถ่ายทำ หรือตัดต่อ ให้ความสำคัญกับความเข้าใจและใส่ใจ โจทย์ของลูกค้า โมเมนต์ หรือความรู้สึกที่อยากส่งต่อ และความรู้สึกที่อยากให้คนดูจดจำ
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
