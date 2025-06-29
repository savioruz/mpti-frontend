"use client";

import { motion } from "framer-motion";

function HeroContent() {
  return (
    <div className="flex flex-col space-y-6">
      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#0f172a] to-black text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        ALKADI LOCATION
      </motion.h1>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-primary/10 to-transparent blur-2xl opacity-30" />

      <div className="container flex min-h-[calc(100vh-64px)] flex-col lg:flex-row items-center py-16 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-6 w-full lg:max-w-2xl">
          <HeroContent />
        </div>

        <div className="w-full lg:max-w-xl lg:pl-16 mt-12 lg:mt-0 relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-primary/10">
          <a
            href="https://maps.app.goo.gl/gg7gyvYntom5hLAU8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1478040549414!2d110.37182699999999!3d-7.881903000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a57928290b95b%3A0x401e8f1fc28c3e0!2sAlkadi%20Group!5e0!3m2!1sid!2sid!4v1719479479393!5m2!1sid!2sid"
              width="100%"
              height="420"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl w-full border-0"
            ></iframe>
          </a>
        </div>
      </div>
    </div>
  );
}
