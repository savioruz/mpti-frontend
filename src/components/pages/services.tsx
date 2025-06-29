import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceProps {
  title: string;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Waktu Bermain Sesuai Jadwal",
    description:
      "Pastikan datang tepat waktu. Kelebihan waktu bermain akan dikenakan biaya tambahan.",
  },
  {
    title: "Jaga Kebersihan dan Ketertiban",
    description:
      "Buang sampah pada tempatnya dan hindari membuat kegaduhan yang mengganggu pemain lain.",
  },
  {
    title: "Wajib Menggunakan Sepatu Non-Marking",
    description: "Hanya sepatu khusus non-marking yang diizinkan untuk menjaga kualitas lantai lapangan.",
  },
  {
    title: "Penggunaan Lampu Lapangan",
    description: "Hanya lapangan yang dipakai yang boleh dihidupkan",
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-20 sm:py-28">
      <h2 className="text-sm text-[#00008B] text-center mb-3 tracking-widest uppercase font-bold">
        Rules
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-extrabold mb-4 leading-tight">
        Field Rules
      </h2>
      <h3 className="md:w-2/3 lg:w-1/2 mx-auto text-base md:text-lg text-center text-muted-foreground mb-14">
        Demi kenyamanan dan keselamatan bersama, harap perhatikan aturan berikut saat menggunakan lapangan badminton kami.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description }) => (
          <Card
            key={title}
            className="h-full bg-white/80 dark:bg-background border border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-1"
          >
            <CardHeader className="flex flex-col justify-center items-center pt-8 pb-4">
              <div className="text-lg font-bold text-center text-[#000000] mb-2">{title}</div>
              <CardDescription className="text-center text-muted-foreground px-2 pb-2">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
