import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  TabletSmartphone,
  BadgeCheck,
  Goal,
  PictureInPicture,
  MousePointerClick,
  Newspaper,
} from "lucide-react";
import React from "react";

interface FeaturesProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: TabletSmartphone,
    title: "Mobile Friendly",
    description:
      "Access and book your favorite sports courts easily anytime and anywhere through mobile devices.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Pricing",
    description:
      "All prices are clearly displayed with no hidden fees.",
  },
  {
    icon: Goal,
    title: "Targeted Content",
    description:
      "Specially designed for badminton enthusiasts — fast, easy, and efficient court booking.",
  },
  {
    icon: PictureInPicture,
    title: "Optimal Lighting",
    description:
      "Evenly bright court lighting, non-glare, and supports night play.",
  },
  {
    icon: MousePointerClick,
    title: "Anti-Slip Court Surface",
    description:
      "Non-slip court surface, safe for both beginner and professional players.",
  },
  {
    icon: Newspaper,
    title: "Indoor Courts",
    description:
      "All courts are indoors, protected from rain and heat.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-20 sm:py-28">
      <h2 className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-center mb-3 tracking-widest uppercase font-bold">
        Features
      </h2>
      <h2 className="text-3xl md:text-4xl text-center font-extrabold mb-4 leading-tight">
        What Makes Us Different
      </h2>          <h3 className="md:w-2/3 lg:w-1/2 mx-auto text-base md:text-lg text-center text-muted-foreground mb-14">
            We are here to simplify the sports court booking process with a fast, safe, and responsive system. Enjoy a hassle-free booking experience right from your fingertips.
          </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="h-full bg-white/80 dark:bg-background border border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-1"
          >
            <CardHeader className="flex flex-col justify-center items-center pt-10">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 p-6 rounded-full ring-8 ring-emerald-100 dark:ring-emerald-900/30 mb-5 transition-transform duration-300 hover:scale-110 shadow-md">
                <Icon size={40} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-center bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                {title}
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center px-4 pb-10">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
