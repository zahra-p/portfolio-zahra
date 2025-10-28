"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Reveal from "../../components/Reveal";

// export const metadata = {
//   title: "Contact | Zahra Adelinia",
//   description:
//     "Get in touch with Zahra Adelinia — let's collaborate on your next web project or discuss creative ideas.",
//   openGraph: {
//     title: "Contact Zahra Adelinia",
//     description:
//       "Let's connect — reach out to Zahra Adelinia for collaborations and freelance opportunities.",
//     url: "https://zahraadelinia.vercel.app/contact",
//     images: [{ url: "/og-image-contact.png", width: 1200, height: 630 }],
//   },
// };

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const endpoint =
      process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
      "https://formspree.io/f/mkgwkrly";

    try {
      setStatus("sending");
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
      } else throw new Error("Network error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-purple-500 mb-8"
        >
          Contact Me
        </motion.h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-10">
          Have a question or want to collaborate? Fill out the form below or
          email me directly at{" "}
          <a
            href={`mailto:${
              process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
              "zahra.adelinia@gmail.com"
            }`}
            className="text-purple-600 dark:text-purple-400 font-medium"
          >
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
              "zahra.adelinia@gmail.com"}
          </a>
          .
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="_replyto"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            disabled={status === "sending"}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-semibold transition"
          >
            {status === "sending"
              ? "Sending..."
              : status === "success"
              ? "✅ Message Sent Successfully!"
              : status === "error"
              ? "❌ Something went wrong."
              : "Send Message"}
          </motion.button>

          {/* Animated status message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: status !== "idle" ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-center pt-3"
          >
            {status === "success" && (
              <p className="text-green-500">
                Your message has been sent successfully 💜
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500">Oops! Please try again later 😢</p>
            )}
          </motion.div>
        </motion.form>
      </Reveal>
    </main>
  );
}
