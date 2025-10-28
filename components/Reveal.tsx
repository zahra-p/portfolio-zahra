"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

/**
 * Reveal Component
 * ----------------
 * المان فرزند را وقتی به صفحه اسکرول می‌شود، با انیمیشن ظاهر می‌کند.
 * کاربرد: هر بخشی از سایت را داخل <Reveal> بگذار تا با اسکرول نمایش داده شود.
 */

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const elementRef = useRef(null);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
