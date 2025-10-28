"use client";
import React, { JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import Image from "next/image";

// نوع داده پروژه
type Project = {
  title: string;
  overview: string;
  challenges: string[];
  solutions: string[];
  tech: string[];
  screenshots: string[];
  github?: string;
  demo?: string;
};

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({
  project,
  onClose,
}: Props): JSX.Element | null {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-3xl w-full relative"
        >
          {/* دکمه بستن */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition"
            aria-label="Close project details"
          >
            <FaTimes size={20} />
          </button>

          {/* عنوان */}
          <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            {project.title}
          </h2>

          {/* Overview */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Overview
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.overview}
            </p>
          </section>

          {/* Screenshots Carousel */}
          {project.screenshots.length > 0 && (
            <motion.div
              className="flex gap-4 overflow-x-auto snap-x mb-6 pb-2"
              whileTap={{ cursor: "grabbing" }}
            >
              {project.screenshots.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative min-w-[80%] md:min-w-[45%] h-56 snap-center overflow-hidden rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Image
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Challenges */}
          {project.challenges.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Challenges
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                {project.challenges.map((ch, i) => (
                  <li key={i}>{ch}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Solutions */}
          {project.solutions.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Solutions
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                {project.solutions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Tech Stack */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Links */}
          <div className="flex gap-5">
            {project.github && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-600 transition"
              >
                <FaGithub /> Code
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <FaExternalLinkAlt /> Live Demo
              </motion.a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
