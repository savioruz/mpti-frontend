import { Card, CardDescription, CardHeader } from "@/components/ui/card";

interface ServiceProps {
  title: string;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Punctual Playing Time",
    description:
      "Please arrive on time. Extra playing time will incur additional charges.",
  },
  {
    title: "Maintain Cleanliness and Order",
    description:
      "Dispose of trash properly and avoid making noise that disturbs other players.",
  },
  {
    title: "Must Use Non-Marking Shoes",
    description:
      "Only special non-marking shoes are allowed to maintain court floor quality.",
  },
  {
    title: "Court Light Usage",
    description: "Only courts in use may have their lights turned on",
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-20 sm:py-28">
      <h2 className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-center mb-3 tracking-widest uppercase font-bold">
        Rules
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-extrabold mb-4 leading-tight">
        Field Rules
      </h2>          <h3 className="md:w-2/3 lg:w-1/2 mx-auto text-base md:text-lg text-center text-muted-foreground mb-14">
            For everyone's comfort and safety, please observe the following rules when using our badminton courts.
          </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description }) => (
          <Card
            key={title}
            className="h-full bg-white/80 dark:bg-background border border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-1"
          >
            <CardHeader className="flex flex-col justify-center items-center pt-8 pb-4">
              <div className="text-lg font-bold text-center bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
                {title}
              </div>
              <CardDescription className="text-center text-muted-foreground px-2 pb-2">
                {description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
