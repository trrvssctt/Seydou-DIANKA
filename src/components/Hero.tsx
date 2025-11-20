import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background avec overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-secondary/90 to-primary/95" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Seydou Salif DIANKA
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground/90 font-light">
            Développeur Full-Stack
          </p>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Création d'applications web modernes et performantes avec React, Node.js, Vue.js et PostgreSQL
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('projets')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Voir mes projets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-lg"
            >
              Me contacter
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center pt-8">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-8 w-8" />
            </a>
            <a 
              href="https://www.linkedin.com/in/seydou-dianka-11a031313/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-8 w-8" />
            </a>
            <a 
              href="mailto:diankaseydou52@gmail.com"
              className="text-primary-foreground/70 hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail className="h-8 w-8" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
