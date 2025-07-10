"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Calendar, Clock, MapPin } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

export const HeroSection = () => {
  const { theme } = useTheme();
  
  return (
    <section className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container w-full py-20 mt-20 flex flex-col justify-start items-center">
        <div className="flex flex-col flex-1 justify-center items-center w-full lg:max-w-screen-xl gap-12 mx-auto">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            {/* Hero badge */}
            <motion.div variants={fadeInUp}>            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Star className="w-4 h-4 mr-2" />
              Premium Badminton Courts
            </Badge>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold"
            >
              <h1 className="leading-tight">
                Book Courts at
                <span className="px-2">
                  <span className="text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text">
                    Al
                  </span>
                  <span className="text-transparent bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text">
                    kadi
                  </span>
                </span>
                Made Easy
              </h1>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="max-w-screen-sm mx-auto text-xl text-muted-foreground leading-relaxed"
            >
              Check schedules, book courts, and enjoy sports without queuing - easy, safe, and fast.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold group/arrow shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link to="/fields">
                  Book Now
                  <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
              >
                <Link to="/location">
                  View Location
                  <MapPin className="size-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Features grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                  <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
                  <p className="text-sm text-muted-foreground">Book courts anytime, anywhere</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                  <h3 className="font-bold text-lg mb-2">Flexible Hours</h3>
                  <p className="text-sm text-muted-foreground">Open daily 06:00 - 24:00</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                  <h3 className="font-bold text-lg mb-2">Premium Facilities</h3>
                  <p className="text-sm text-muted-foreground">International standard courts</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Hero image with enhanced styling */}
          <motion.div 
            className="relative group mt-8 w-full flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
            <img
              src={theme === "light" ? "/gor.png" : "/gor.png"}
              alt="GOR Alkadi - Lapangan Badminton Premium"
              width={1200}
              height={600}
              className="w-full md:w-[1200px] mx-auto rounded-2xl relative leading-none flex items-center border border-t-2 border-secondary border-t-emerald-500/30 object-cover shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2"
            />
            <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
