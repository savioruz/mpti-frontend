export default function Footer() {
  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 MPTI TEAM — All rights reserved.{" "}
        </p>

        <div className="flex items-center gap-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/alkadi.market?igsh=a3d1cGJvbGF5bjRs"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80 transition"
          >
            <img src="/logos/ig.jpg" alt="Instagram" className="h-5 w-5" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/6281215770290"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80 transition"
          >
            <img src="/logos/whatsapp.png" alt="WhatsApp" className="h-5 w-5" />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@alkadimarket_?_t=ZS-8xVKskXsnTe&_r=1"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80 transition"
          >
            <img src="/logos/tt.png" alt="TikTok" className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
