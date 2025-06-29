"use client";

import { motion, useAnimation } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

function HeroPill() {
  const controls = useAnimation();

  return (
    <Link to="/" className="group">
      <motion.div
        className="inline-flex items-center gap-2 rounded-full border border-primary bg-background/80 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 shadow-md backdrop-blur"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onHoverStart={() => controls.start({ rotate: -10 })}
        onHoverEnd={() => controls.start({ rotate: 0 })}
      >
        <motion.span
          className="transition-colors group-hover:text-primary"
          animate={controls}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          🌟
        </motion.span>
        <span>Selamat Datang di Alkadi Group</span>
      </motion.div>
    </Link>
  );
}

function HeroContent() {
  return (
    <div className="flex flex-col space-y-6">
      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#0f172a] to-black text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        ALKADI GROUP
      </motion.h1>
      <motion.p
        className="max-w-2xl text-muted-foreground sm:text-xl sm:leading-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}
      >
        Alkadi Group selalu berupaya memberikan produk berkualitas terbaik kepada customer. Kami juga menyediakan gedung serbaguna untuk olahraga dan acara seperti pernikahan, wisuda, dan lainnya.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
      >
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient blob */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-primary/10 to-transparent blur-2xl opacity-30" />

      <div className="container flex min-h-[calc(100vh-64px)] flex-col lg:flex-row items-center py-16 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-6 w-full lg:max-w-2xl">
          <HeroPill />
          <HeroContent />
        </div>
        <div className="w-full lg:max-w-xl lg:pl-16 mt-12 lg:mt-0 relative">
          <motion.img
            src="/logos/alkadi2.jpg"
            alt="Gedung Alkadi"
            className="w-full h-auto rounded-2xl shadow-2xl object-cover ring-2 ring-primary/10"
            style={{ maxHeight: "420px" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
