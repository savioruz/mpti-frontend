"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Navigation, Car, Bus, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAllLocations, type Location } from "@/lib/location";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface HeroContentProps {
  primaryLocation: Location | null;
}

function HeroContent({ primaryLocation }: HeroContentProps) {
  const locationName = primaryLocation?.name || "ALKADI LOCATION";
  const locationDescription = primaryLocation?.description || "Find us in the heart of Kebumen. Our strategic location makes it easy for you to access premium badminton facilities with ample parking and convenient transportation.";
  
  // Generate dynamic Google Maps URL using latitude and longitude
  const getGoogleMapsUrl = (location: Location | null) => {
    if (location && location.latitude && location.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    }
    // Fallback to hardcoded link
    return "https://maps.app.goo.gl/gg7gyvYntom5hLAU8";
  };
  
  return (
    <motion.div 
      className="flex flex-col space-y-8"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <motion.div variants={fadeInUp}>
        <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
          <MapPin className="w-4 h-4 mr-2" />
          Our Location
        </Badge>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text"
        variants={fadeInUp}
      >
        {locationName.toUpperCase()}
      </motion.h1>
      
      <motion.p
        className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
        variants={fadeInUp}
      >
        {locationDescription}
      </motion.p>

      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <a
            href={getGoogleMapsUrl(primaryLocation)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Get Directions
          </a>
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
        >
          <Link to="/contact">
            Contact Us
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function LocationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await getAllLocations({ limit: 10 });
        setLocations(response.data.locations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Use the first location as the primary location, or fallback to hardcoded data
  const primaryLocation = locations.length > 0 ? locations[0] : null;

  // Generate dynamic Google Maps embed URL
  const getGoogleMapsEmbedUrl = (location: Location | null) => {
    if (location && location.latitude && location.longitude) {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${location.longitude}!3d${location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus`;
    }
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1478040549414!2d110.37182699999999!3d-7.881903000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a57928290b95b%3A0x401e8f1fc28c3e0!2sAlkadi%20Group!5e0!3m2!1sid!2sid!4v1719479479393!5m2!1sid!2sid";
  };

  // Generate dynamic Google Maps URL for external link
  const getGoogleMapsUrl = (location: Location | null) => {
    if (location && location.latitude && location.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    }
    // Fallback to hardcoded link
    return "https://maps.app.goo.gl/gg7gyvYntom5hLAU8";
  };

  // Generate location info based on fetched data or fallback
  const locationInfo = primaryLocation ? [
    {
      icon: MapPin,
      title: "Address",
      content: primaryLocation.name,
      color: "text-emerald-600"
    },
    {
      icon: Clock,
      title: "Operating Hours",
      content: "Daily: 06:00 - 24:00",
      color: "text-teal-600"
    },
    {
      icon: Phone,
      title: "Contact",
      content: "+62 813-275-17420",
      color: "text-emerald-600"
    },
    {
      icon: Car,
      title: "Location Info",
      content: `Coordinates: ${primaryLocation.latitude}, ${primaryLocation.longitude}`,
      color: "text-teal-600"
    }
  ] : [
    {
      icon: MapPin,
      title: "Address",
      content: "9MX3+Q6 Peniron, Kabupaten Kebumen, Jawa Tengah, Indonesia",
      color: "text-emerald-600"
    },
    {
      icon: Clock,
      title: "Operating Hours",
      content: "Daily: 06:00 - 24:00",
      color: "text-teal-600"
    },
    {
      icon: Phone,
      title: "Contact",
      content: "+62 813-275-17420",
      color: "text-emerald-600"
    },
    {
      icon: Car,
      title: "Parking",
      content: "Free parking available",
      color: "text-teal-600"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-300/10 to-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container py-16 px-4 md:px-8 lg:px-12">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-muted-foreground">Loading location information...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}. Showing default location information.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Hero Section */}
        {!loading && (
          <div className="flex flex-col lg:flex-row items-center mb-20 lg:mb-32">
            <div className="flex flex-col gap-6 w-full lg:max-w-2xl">
              <HeroContent primaryLocation={primaryLocation} />
            </div>

            <div className="w-full lg:max-w-xl lg:pl-16 mt-12 lg:mt-0 relative">
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-emerald-100 dark:ring-emerald-800"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              >
                <a
                  href={getGoogleMapsUrl(primaryLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-90 transition-opacity"
                >
                  <iframe
                    src={getGoogleMapsEmbedUrl(primaryLocation)}
                    width="100%"
                    height="420"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl w-full border-0"
                    title={primaryLocation?.name ? `${primaryLocation.name} Location` : "Alkadi Group Location"}
                  ></iframe>
                </a>
              </motion.div>
            </div>
          </div>
        )}

        {/* Location Information */}
        {!loading && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {locationInfo.map((info, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl w-fit mx-auto mb-4">
                      <info.icon className={`w-8 h-8 ${info.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">{info.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{info.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Additional Locations */}
        {!loading && locations.length > 1 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="mb-16"
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                <MapPin className="w-4 h-4 mr-2" />
                Other Locations
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                More Locations
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.slice(1).map((location) => (
                <motion.div key={location.id} variants={fadeInUp}>
                  <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-foreground">{location.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                          <div className="text-xs text-muted-foreground mb-3">
                            <p>Lat: {location.latitude}</p>
                            <p>Lng: {location.longitude}</p>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                          >
                            <a
                              href={getGoogleMapsUrl(location)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              View on Map
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Transportation Section */}
        {!loading && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Bus className="w-4 h-4 mr-2" />
                Getting Here
              </Badge>
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6"
            >
              Easy Access
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Located in a strategic area with easy access by private vehicle or public transportation. 
              Free parking is available for all visitors.
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
