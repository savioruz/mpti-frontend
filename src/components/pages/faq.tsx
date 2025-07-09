import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Apakah bisa booking untuk turnamen atau event khusus?",
    answer: "Bisa. Silakan hubungi admin melalui kontak yang tersedia ",
    value: "item-1",
  },
  {
    question: "Apa yang terjadi jika saya datang terlambat?",
    answer:
      "Waktu bermain tetap mengikuti jadwal yang dipesan. Keterlambatan tidak menambah durasi bermain, jadi harap datang tepat waktu.",
    value: "item-2",
  },
  {
    question: "Apakah bisa memesan untuk hari ini juga (booking mendadak)?",
    answer: "Ya, selama slot masih tersedia ",
    value: "item-3",
  },
  {
    question: "Apakah tersedia shuttlecock di GOR?",
    answer: "Ya, GOR kami menyediakan shuttlecock dengan harga tambahan. ",
    value: "item-4",
  },
  {
    question: "Apakah tersedia fasilitas parkir dan ruang tunggu?",
    answer: "Ya, GOR kami menyediakan.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section
      id="faq"
      className="w-full px-4 py-24 sm:py-32 flex justify-center"
    >
      <div className="w-full max-w-[700px] text-center">
        <div className="mb-8">
          <h2 className="text-lg text-primary mb-2 tracking-wider">FAQS</h2>
          <h2 className="text-3xl md:text-4xl font-bold">Common Questions</h2>
        </div>

        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-left">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
