"use client";

import Image from "next/image";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiGithub,
} from "react-icons/si";
import Link from "next/link";
import { useEffect, useState } from "react";

const skills = [
  { icon: <SiReact />, label: "React", offset: 5 },
  { icon: <SiNextdotjs />, label: "Next.js", offset: 10 },
  { icon: <SiTypescript />, label: "TypeScript", offset: 15 },
  { icon: <SiTailwindcss />, label: "TailwindCSS", offset: 7 },
  { icon: <SiFramer />, label: "Framer Motion", offset: 12 },
  { icon: <SiGithub />, label: "Git & GitHub", offset: 8 },
];

// ======= SkillItem Component =======
function SkillItem({ skill, scrollY, mouseX, mouseY, windowSize }: any) {
  const ySkill = useTransform(scrollY, [0, 1], [0, skill.offset]);
  const rotateX = useTransform(mouseY, [0, windowSize.height || 1], [6, -6]);
  const rotateY = useTransform(mouseX, [0, windowSize.width || 1], [-6, 6]);

  const fadeUpSoft: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      style={{ y: ySkill, rotateX, rotateY }}
      variants={fadeUpSoft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      whileHover={{ scale: 1.08 }}
      className="flex flex-col items-center text-purple-600 dark:text-purple-400 cursor-pointer"
    >
      <div className="text-4xl mb-2">{skill.icon}</div>
      <p className="text-sm font-medium">{skill.label}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  // ======= Variants =======
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, when: "beforeChildren" } },
  };
  const fadeUpSoft: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // ======= Motion Values =======
  const scrollY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindow = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateWindow();

    const handleScroll = () =>
      scrollY.set(Math.min(window.scrollY / window.innerHeight, 1));
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("resize", updateWindow);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("resize", updateWindow);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [scrollY, mouseX, mouseY]);

  // Hero transforms
  const yHero = useTransform(scrollY, [0, 1], [0, 10]);
  const rotateHeroX = useTransform(
    mouseY,
    [0, windowSize.height || 1],
    [10, -10]
  );
  const rotateHeroY = useTransform(
    mouseX,
    [0, windowSize.width || 1],
    [-10, 10]
  );

  // CTA transforms
  const yCTA = useTransform(scrollY, [0, 1], [0, 6]);
  const rotateCTA = useTransform(mouseX, [0, windowSize.width || 1], [-3, 3]);
  const xCTA = useTransform(mouseX, [0, windowSize.width || 1], [-8, 8]);
  const yMouseCTA = useTransform(mouseY, [0, windowSize.height || 1], [4, -4]);
  const yCTACombined = useMotionTemplate`${yCTA} + ${yMouseCTA}`;

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      {/* ======= Hero Section ======= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          style={{ y: yHero, rotateX: rotateHeroX, rotateY: rotateHeroY }}
          variants={fadeUpSoft}
          className="w-40 h-40 rounded-full overflow-hidden shadow-xl mb-6 border-4 border-purple-500"
        >
          <Image
            src="/avatar.png"
            alt="Zahra Adelinia Avatar"
            width={200}
            height={200}
            className="object-cover"
          />
        </motion.div>

        <motion.h1
          variants={fadeUpSoft}
          className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-3"
        >
          Hi, I'm Zahra Adelinia 👋
        </motion.h1>

        <motion.p
          variants={fadeUpSoft}
          className="text-gray-700 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed"
        >
          I'm a passionate full-stack developer focused on creating clean,
          efficient, and meaningful digital experiences. I specialize in React,
          Next.js, and modern front-end ecosystems — turning ideas into fast,
          elegant, and accessible web applications.
        </motion.p>
      </motion.div>

      {/* ======= About Philosophy ======= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="text-center mb-16"
      >
        <motion.h2
          variants={fadeUpSoft}
          className="text-2xl font-semibold text-purple-500 mb-4"
        >
          My Approach
        </motion.h2>
        <motion.p
          variants={fadeUpSoft}
          className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          I believe in the power of simplicity and purpose. Every project I
          build aims to solve real problems with clarity, empathy, and aesthetic
          precision. Clean code, thoughtful design, and a human touch — that’s
          my formula.
        </motion.p>
      </motion.div>

      {/* ======= Skills Grid ======= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="mb-20"
      >
        <motion.h2
          variants={fadeUpSoft}
          className="text-2xl font-semibold text-purple-500 text-center mb-10"
        >
          My Skills
        </motion.h2>

        <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
          {skills.map((skill) => (
            <SkillItem
              key={skill.label}
              skill={skill}
              scrollY={scrollY}
              mouseX={mouseX}
              mouseY={mouseY}
              windowSize={windowSize}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ======= CTA Section ======= */}
      <motion.div
        style={{ y: yCTACombined, rotateY: rotateCTA, x: xCTA }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{
          scale: 1.02,
          transition: { type: "spring", stiffness: 200, damping: 18 },
        }}
        className="text-center"
      >
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200"
        >
          Interested in collaborating or hiring me?
        </motion.h3>

        <motion.div
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
        >
          <Link
            href="/contact"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-purple-500 transition-colors"
          >
            Let’s Work Together
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
