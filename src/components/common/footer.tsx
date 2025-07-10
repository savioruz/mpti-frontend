import { Link } from "@tanstack/react-router";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Alkadi
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The best badminton sports center with premium facilities and trusted service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Main Menu</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/fields" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Book Court
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/features" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Facilities
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Court Rules
                </Link>
              </li>
              <li>
                <Link 
                  to="/location" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Location
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  9MX3+Q6 Peniron, Kabupaten Kebumen, Jawa Tengah
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">
                  +62 813-275-17420
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">
                  alkadi@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Alkadi Group. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link 
                to="/tos" 
                className="text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Operating Hours: 06:00 - 24:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
