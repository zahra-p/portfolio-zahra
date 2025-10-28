"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Reveal";

// export const metadata = {
//   title: "Zahra Adelinia | Full-Stack Developer Portfolio",
//   description:
//     "Welcome to Zahra Adelinia's portfolio — Full-Stack Developer specialized in React, Next.js, and TypeScript. Explore modern projects and creative web experiences.",
//   openGraph: {
//     title: "Zahra Adelinia | Full-Stack Developer Portfolio",
//     description:
//       "Explore Zahra Adelinia's modern portfolio — React, Next.js, and creative web applications.",
//     url: "https://zahraadelinia.vercel.app",
//     siteName: "Zahra Adelinia Portfolio",
//     images: [
//       {
//         url: "/og-image-home.png",
//         width: 1200,
//         height: 630,
//         alt: "Zahra Adelinia Portfolio Preview",
//       },
//     ],
//     type: "website",
//   },
// };

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20 space-y-32">
      {/* 🌟 Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <Reveal>
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-purple-600 dark:text-purple-400"
            >
              Hi, I’m Zahra Adelinia 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8"
            >
              A passionate{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                Full-Stack Developer
              </span>{" "}
              specializing in
              <span className="font-semibold">
                {" "}
                React, Next.js, and TypeScript
              </span>
              . I love creating modern, responsive web experiences that bring
              ideas to life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/projects"
                className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-purple-700 transition"
              >
                View My Projects
              </Link>
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg ring-4 ring-purple-300 dark:ring-purple-700">
              <Image
                src="/profile.png" //(ابعاد پیشنهادی: 800×600)
                alt="Zahra Adelinia"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </Reveal>
      </section>

      {/* 🧠 Skills Section */}
      <Reveal>
        <section id="skills" className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-8">
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript",
              "TailwindCSS",
              "Node.js",
              "MongoDB",
              "Git / GitHub",
              "REST APIs",
            ].map((skill, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-full shadow-sm"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 💜 About Section */}
      <Reveal>
        <section
          id="about"
          className="text-center md:text-left md:flex md:items-center md:gap-10"
        >
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
              About Me
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              I’m a creative and detail-oriented developer who loves combining
              logic and design to build beautiful, efficient web applications.
              With a strong background in both front-end and back-end, I’m
              constantly learning new technologies and exploring ways to make
              user experiences more meaningful.
            </p>
          </div>
          <div className="flex-1 flex justify-center mt-8 md:mt-0">
            <Image
              src="/about-me.png"
              alt="About Zahra"
              width={400}
              height={300}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>
        </section>
      </Reveal>

      {/* ✉️ Contact Section */}
      <Reveal>
        <section id="contact" className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
            Get In Touch
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I’m open to freelance projects, collaborations, and remote
            opportunities. Feel free to reach out — I’d love to hear from you!
          </p>
          <Link
            href="/contact"
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-purple-700 transition"
          >
            Contact Me
          </Link>
        </section>
      </Reveal>
    </main>
  );
}
