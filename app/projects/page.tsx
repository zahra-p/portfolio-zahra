"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import ProjectModal from "../../components/ProjectModal";

// export const metadata = {
//   title: "Projects | Zahra Adelinia — React & Next.js Developer",
//   description:
//     "Explore featured projects by Zahra Adelinia: dashboards, SaaS apps, and creative web experiences built with React, Next.js, and TypeScript.",
//   openGraph: {
//     title: "Projects | Zahra Adelinia",
//     description:
//       "Showcase of Zahra Adelinia’s modern React and Next.js projects.",
//     url: "https://zahraadelinia.vercel.app/projects",
//     images: [{ url: "/og-image-projects.png", width: 1200, height: 630 }],
//   },
// };

// ===============================
//  PROJECTS DATA (Case Study Version)
// ===============================
const projects = [
  {
    title: "Dashboard Analytics",
    overview:
      "A responsive admin dashboard that visualizes user activity, sales metrics, and performance KPIs in real time. Built with Next.js, Chart.js, and TailwindCSS for speed and clarity.",
    challenges: [
      "Ensuring smooth rendering of multiple charts without performance lag.",
      "Designing a dashboard layout that remains clean and readable across devices.",
      "Synchronizing chart colors and UI elements with dark/light mode automatically.",
    ],
    solutions: [
      "Implemented lazy data fetching and memoized components to improve rendering speed.",
      "Used CSS grid + Tailwind utilities for an adaptive and flexible layout.",
      "Integrated Chart.js custom theme tied to Tailwind’s color palette.",
    ],
    tech: ["Next.js", "TypeScript", "Chart.js", "TailwindCSS", "SWR"],
    screenshots: [
      "/projects/dashboard1.png",
      "/projects/dashboard2.png",
      "/projects/dashboard3.png",
    ],
    github: "https://github.com/yourusername/dashboard-analytics",
    demo: "https://dashboard-demo.vercel.app",
    image: "/projects/dashboard1.png",
  },
  {
    title: "Creative Portfolio",
    overview:
      "A personal portfolio showcasing projects, animations, and UI transitions. Designed for both visual impact and technical precision using Framer Motion and Next.js.",
    challenges: [
      "Creating a consistent animation flow across multiple components.",
      "Managing dark/light mode transitions without visual flicker.",
      "Designing a fully responsive layout that feels dynamic and modern.",
    ],
    solutions: [
      "Developed reusable motion variants for all sections (hero, skills, projects, contact).",
      "Applied Next.js ThemeProvider with Tailwind’s dark mode to synchronize color transitions.",
      "Used Framer Motion’s staggered reveal and parallax effects to enhance page depth.",
    ],
    tech: ["Next.js", "React", "Framer Motion", "TailwindCSS"],
    screenshots: ["/projects/portfolio1.png", "/projects/portfolio2.png"],
    github: "https://github.com/yourusername/creative-portfolio",
    demo: "https://creative-portfolio.vercel.app",
    image: "/projects/portfolio1.png",
  },
  {
    title: "Task Manager App",
    overview:
      "A full-stack task management tool where users can create, edit, and track tasks with authentication and persistent storage.",
    challenges: [
      "Implementing secure JWT authentication with user sessions.",
      "Synchronizing local UI state with database updates in real time.",
      "Designing an intuitive UX for managing task status and priorities.",
    ],
    solutions: [
      "Set up NextAuth.js with JWT tokens and protected API routes.",
      "Integrated MongoDB with Prisma ORM for fast, reliable data queries.",
      "Used optimistic UI updates with React state to make task interactions instant.",
    ],
    tech: ["Next.js", "Node.js", "MongoDB", "Prisma", "TailwindCSS"],
    screenshots: ["/projects/taskmanager1.png", "/projects/taskmanager2.jpg"],
    github: "https://github.com/yourusername/task-manager",
    demo: "https://task-manager-demo.vercel.app",
    image: "/projects/taskmanager.jpg",
  },
];

// ===============================
//  PAGE COMPONENT
// ===============================
export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold text-center text-purple-500 mb-12"
      >
        My Projects
      </motion.h1>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            whileHover={{
              y: -6,
              boxShadow: "0 12px 30px rgba(147, 51, 234, 0.18)",
            }}
            onClick={() => setSelectedProject(project)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition flex flex-col cursor-pointer group"
          >
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
              <motion.div
                whileHover={{ scale: 1.05, filter: "brightness(1.05)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2 group-hover:text-purple-500 transition">
                  {project.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.overview}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-500 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub /> Code
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-500 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
