"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Trophy, Heart, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const values = [
  {
    icon: Building2,
    title: "Best Facilities",
    description: "Providing comfortable, modern badminton facilities that meet national standards."
  },
  {
    icon: Users,
    title: "Premium Service",
    description: "Maintaining cleanliness, security, and professionalism in every service to visitors."
  },
  {
    icon: Heart,
    title: "Healthy Living",
    description: "Building a culture of healthy and active living through affordable sports for all."
  },
  {
    icon: Trophy,
    title: "Shared Achievement",
    description: "Building partnerships with schools, communities, and institutions in developing sports potential."
  }
];

function HeroPill() {
  return (
    <Link to="/" className="group">
      <motion.div
        className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-background/80 px-5 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/20 shadow-md backdrop-blur"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.span
          className="transition-colors group-hover:text-emerald-700"
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          🌟
        </motion.span>
        <span>Welcome to Alkadi Group</span>
      </motion.div>
    </Link>
  );
}

function HeroContent() {
  return (
    <div className="flex flex-col space-y-8">
      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        ALKADI GROUP
      </motion.h1>
      
      <motion.p
        className="max-w-2xl text-muted-foreground text-lg sm:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}
      >
        Alkadi Group is committed to providing the best quality products to our customers. 
        We also provide multipurpose buildings for sports and events such as weddings, graduations, and more.
      </motion.p>
      
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
      >
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <Link to="/fields">
            Book Court
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
        >
          <Link to="/contact">
            Contact Us
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient blob */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-300/10 to-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container py-16 px-4 md:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center mb-20 lg:mb-32">
          <div className="flex flex-col gap-6 w-full lg:max-w-2xl">
            <HeroPill />
            <HeroContent />
          </div>
          <div className="w-full lg:max-w-xl lg:pl-16 mt-12 lg:mt-0 relative">
            <motion.img
              src="/logos/alkadi2.jpg"
              alt="Gedung Alkadi - Fasilitas Olahraga dan Event Premium"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover ring-2 ring-emerald-100 dark:ring-emerald-800"
              style={{ maxHeight: "420px" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Vision & Mission Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Trophy className="w-4 h-4 mr-2" />
              Vision & Mission
            </Badge>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6"
          >
            Our Vision & Mission
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            To become the best and most trusted badminton sports center that promotes achievement, fitness, and togetherness in Indonesian society.
          </motion.p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map((value, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl w-fit mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
