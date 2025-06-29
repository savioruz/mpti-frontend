"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "@tanstack/react-router";


export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full py-20 mt-20 flex flex-col justify-start items-center">

      <div className="flex flex-col flex-1 justify-center items-center w-full lg:max-w-screen-xl gap-8 mx-auto">
        <div className="text-center space-y-8">
          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
          <h1>
              Booking GOR di
              <span className="px-2">
                <span className="text-transparent bg-gradient-to-r from-[#00008B] to-[#00008B] bg-clip-text">Al</span>
                <span className="text-transparent bg-gradient-to-r from-red-600 to-red-600 bg-clip-text">kadi</span>
              </span>
              lebih mudah
            </h1>

          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {`Cek jadwal, pesan lapangan, dan nikmati olahraga tanpa antre dengan mudah, aman, dan cepat.`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button asChild variant="secondary" className="w-5/6 md:w-1/4 font-bold group/arrow">
              <Link to="/fields">
                Pesan Sekarang
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14 w-full flex flex-col items-center">
        <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-gradient-to-r from-[#00008B]/50 to-[#00008B]/50 rounded-full blur-3xl"></div>
          <img
            src={theme === "light" ? "/gor.jpg" : "/gor.jpg"}
            alt="dashboard"
            width={1200}
            height={600}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-t-2 border-secondary border-t-primary/30 object-cover"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
