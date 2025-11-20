import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* À propos */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Seydou Salif DIANKA</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Développeur Full-Stack passionné par la création d'applications web modernes et performantes.
              </p>
            </div>

            {/* Navigation rapide */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#apropos" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#competences" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Compétences
                  </a>
                </li>
                <li>
                  <a href="#projets" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Projets
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Suivez-moi</h3>
              <div className="flex gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/seydou-dianka-11a031313/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="mailto:diankaseydou52@gmail.com"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/60">
              © {currentYear} Seydou Salif DIANKA. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
