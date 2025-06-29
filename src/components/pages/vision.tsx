import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Blocks,
    LineChart,
    Wallet,
    Sparkle,
  } from "lucide-react";
  
  interface BenefitsProps {
    icon: React.ComponentType<any>;
    description: string;
  }
  
  const benefitList: BenefitsProps[] = [
    {
      icon: Blocks,
      description:
        "Menyediakan fasilitas bulutangkis yang nyaman, modern, dan sesuai standar nasional.",
    },
    {
      icon: LineChart,
      description:
        "Menjaga kebersihan, keamanan, dan profesionalitas dalam setiap layanan kepada pengunjung.",
    },
    {
      icon: Wallet,
      description:
        "Membangun budaya hidup sehat dan aktif melalui olahraga yang terjangkau untuk semua kalangan.",
    },
    {
      icon: Sparkle,
      description:
        "Menjalin kerja sama dengan sekolah, komunitas, dan instansi dalam mengembangkan potensi olahraga.",
    },
  ];
  
  export const BenefitsSection = () => {
    return (
      <section
        id="benefits"
        className="relative py-24 sm:py-32 overflow-hidden bg-white dark:bg-background"
      >
        <div className="container">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white">
              Visi & Misi
            </h2>
            <div className="w-16 h-1 bg-black dark:bg-white rounded-full mb-6" />
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl text-center">
              Menjadi pusat olahraga bulutangkis terbaik dan terpercaya yang mendorong
              prestasi, kebugaran, dan kebersamaan masyarakat Indonesia.
            </p>
          </div>
  
          <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1">
            {benefitList.map(({ icon: Icon, description }, index) => (
              <Card
                key={index}
                className="bg-white border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-3xl group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-4 rounded-xl bg-muted text-primary shadow-sm group-hover:bg-muted/70 transition-all">
                      <Icon size={32} className="drop-shadow-sm" />
                    </div>
  
                    <span className="text-2xl font-bold text-muted-foreground/20 group-hover:text-muted-foreground transition-colors duration-300">
                      0{index + 1}
                    </span>
                  </div>
                </CardHeader>
  
                <CardContent className="text-base text-foreground/80 leading-relaxed px-6 pb-6 pt-0">
                  {description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };
  