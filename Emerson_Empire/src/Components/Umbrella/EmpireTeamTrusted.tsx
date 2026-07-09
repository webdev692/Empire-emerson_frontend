import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Handshake, Users, Globe, ExternalLink } from "lucide-react";
import Helena2 from "../../assets/Helena.jpeg";
 
import { Jonathan, Matheous, Vincent } from "../../assets";
const ACHIEVEMENTS = [
  { icon: Award,     value: "12+",  label: "Certifications Issued" },
  { icon: Handshake, value: "8",    label: "Active Partnerships"   },
  { icon: Users,     value: "500+", label: "Students Trained"      },
  { icon: Globe,     value: "4",    label: "Countries Reached"     },
];

const TEAM = [
  {
    photo:  Helena2,
    name: "Lyric Helena Emerson",
    role: "Founder & CEO",
    bio: "Visionary leader with over a decade of experience bridging the gap between talent and opportunity across underserved communities.",
    linkedin: "#",
  },
  {
    photo: Vincent ,
    name: "Vincent Majembe",
    role: "Head of web Development",
    bio: "Architecting fast, scalable web experiences from frontend to backend â€” turning complex ideas into clean, functional products that work.",
    linkedin: "#",
  },
  {
    photo: Matheous ,
    name: "Matheus Alves",
    role: " Web Design",
    bio: "Designing web experiences that don't just look good â€” they guide users, build trust, and turn visitors into customers.",
    linkedin: "#",
  },
  {
    photo: Jonathan ,
    name: " Jonathan Smith",
    role: " Web Design",
    bio: "From color theory to user flow, I break down the principles of great web design into practical skills you can apply from day one.",
    linkedin: "#",
  },
];

function parseValue(raw: string) {
  const match = raw.match(/^(\d+)(.*)$/);
  return match ? { num: parseInt(match[1]), suffix: match[2] } : { num: 0, suffix: raw };
}

function CountUp({ raw, className }: { raw: string; className: string }) {
  const { num, suffix } = parseValue(raw);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const totalFrames = Math.round((1400 / 1000) * 60);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const eased = 1 - Math.pow(1 - frame / totalFrames, 3);
      setCount(Math.round(eased * num));
      if (frame >= totalFrames) clearInterval(timer);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, num]);

  return (
    <p ref={ref} className={className}>
      {count}{suffix}
    </p>
  );
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type TeamMember = typeof TEAM[0];

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group flex flex-col shadow-sm hover:shadow-[#4B1E91]/15 hover:shadow-lg border border-[#1C1336]/08 rounded-2xl overflow-hidden transition-shadow duration-300"
    >
      {/* Photo area */}
      <div className="relative flex justify-center items-center bg-[#1C1336] h-56 sm:h-64 overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center items-center bg-[#4B1E91] border-[#C9A84C]/40 border-2 rounded-full w-24 h-24">
              <span className="font-bold text-[28px] text-white select-none heading">
                {getInitials(member.name)}
              </span>
            </div>
            <span className="text-[#F5F0E8]/30 text-xs uppercase tracking-[2px]">
              Photo coming soon
            </span>
          </div>
        )}
        <div className="right-0 bottom-0 left-0 absolute bg-[#C9A84C] h-0.75" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 bg-white px-6 py-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-[#1C1336] text-xl sm:text-2xl leading-tight heading">
            {member.name}
          </h3>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="mt-1 ml-3 text-[#1C1336]/25 hover:text-[#4B1E91] transition-colors duration-200 shrink-0"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
        <p className="mb-4 font-semibold text-[#4B1E91] text-sm uppercase tracking-[2px]">
          {member.role}
        </p>
        <p className="flex-1 text-[#1C1336]/55 text-sm leading-[1.8]">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

const EmpireTeamTrusted: React.FC = () => {
  const firstRow = TEAM.slice(0, 3);
  const lastRow  = TEAM.slice(3);

  return (
    <section id="team">
      {/* â”€â”€ ACHIEVEMENTS â”€â”€ */}
      <div className="bg-[#4B1E91] px-6 sm:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
            className="mb-4 font-semibold text-[#C9A84C] text-sm sm:text-base text-center uppercase tracking-[4px]"
          >
            By the Numbers
          </motion.p>

          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.07 }}
            className="mb-14 font-bold text-[32px] text-white sm:text-[48px] text-center uppercase leading-none tracking-tight heading"
          >
            Our Achievements
          </motion.h2>

          <div className="gap-5 grid grid-cols-2 lg:grid-cols-4">
            {ACHIEVEMENTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex flex-col items-center gap-4 bg-[#1C1336]/40 px-6 py-10 border border-[#C9A84C]/20 rounded-2xl"
                >
                  <Icon size={36} className="text-[#C9A84C]" />
                  <CountUp
                    raw={item.value}
                    className="font-bold text-[40px] text-white sm:text-[52px] leading-none heading"
                  />
                  <p className="text-[#F5F0E8]/60 text-sm sm:text-sm text-center uppercase tracking-[2px]">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* â”€â”€ TEAM â”€â”€ */}
      <div className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16">
            <motion.p
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45 }}
              className="mb-4 font-semibold text-[#4B1E91] text-sm sm:text-base uppercase tracking-[4px]"
            >
              The People Behind It
            </motion.p>

            <motion.h2
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.07 }}
              className="max-w-2xl font-bold text-[#1C1336] text-[36px] sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
            >
              Meet the Team.
            </motion.h2>

            <motion.div
              whileInView={{ scaleX: 1 }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ originX: 0 }}
              className="bg-[#C9A84C] mt-8 w-24 h-0.75"
            />
          </div>

          {/* First row â€” 3 cards */}
          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {firstRow.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>

          {/* Last row â€” centered */}
          {lastRow.length > 0 && (
            <div
              className={`gap-6 grid mt-6 mx-auto ${
                lastRow.length === 1
                  ? 'max-w-sm'
                  : 'sm:grid-cols-2 max-w-2xl'
              }`}
            >
              {lastRow.map((member, i) => (
                <TeamCard key={member.name} member={member} index={i + firstRow.length} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmpireTeamTrusted;
