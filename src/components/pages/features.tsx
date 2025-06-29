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
      "Akses dan pesan lapangan olahraga favorit Anda dengan mudah kapan saja dan di mana saja melalui perangkat seluler.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Pricing",
    description: "Semua harga ditampilkan dengan jelas tanpa biaya tersembunyi.",
  },
  {
    icon: Goal,
    title: "Targeted Content",
    description:
      "Didesain khusus untuk penggemar badminton — cepat, mudah, dan efisien dalam memesan lapangan.",
  },
  {
    icon: PictureInPicture,
    title: "Optimal Lighting",
    description:
      "Penerangan lapangan terang merata, tidak silau, dan mendukung permainan malam hari.",
  },
  {
    icon: MousePointerClick,
    title: "Anti-Slip Court Surface",
    description:
      "Permukaan lapangan tidak licin, aman untuk pemain pemula maupun profesional.",
  },
  {
    icon: Newspaper,
    title: "Indoor Field",
    description:
      "Semua lapangan berada di dalam ruangan (indoor) sehingga aman dari hujan dan panas.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-20 sm:py-28">
      <h2 className="text-sm text-[#00008B] text-center mb-3 tracking-widest uppercase font-bold">
        Features
      </h2>
      <h2 className="text-3xl md:text-4xl text-center font-extrabold mb-4 leading-tight">
        What Makes Us Different
      </h2>
      <h3 className="md:w-2/3 lg:w-1/2 mx-auto text-base md:text-lg text-center text-muted-foreground mb-14">
        Kami hadir untuk mempermudah proses pemesanan lapangan olahraga dengan sistem yang cepat, aman, dan responsif. 
        Nikmati pengalaman booking tanpa ribet langsung dari genggaman Anda.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="h-full bg-white/80 dark:bg-background border border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-1"
          >
            <CardHeader className="flex flex-col justify-center items-center pt-10">
              <div className="bg-gradient-to-br from-[#00008B]/20 to-primary/30 p-6 rounded-full ring-8 ring-primary/10 mb-5 transition-transform duration-300 hover:scale-110 shadow-md">
                <Icon size={40} className="text-[#00008B]" />
              </div>
              <div className="text-lg font-bold text-center text-[#00008B]">{title}</div>
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