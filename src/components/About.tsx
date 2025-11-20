import profilePhoto from "@/assets/profile-photo.jpeg";

export const About = () => {
  return (
    <section id="apropos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            À propos de moi
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-accent-gradient rounded-2xl blur-xl opacity-30" />
                <img
                  src={profilePhoto}
                  alt="Seydou Salif DIANKA"
                  className="relative rounded-2xl shadow-card-lg w-full max-w-md object-cover"
                />
              </div>
            </div>

            {/* Contenu */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-primary">
                Développeur passionné
              </h3>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Bonjour ! Je suis Seydou Salif DIANKA, développeur Full-Stack passionné par la création 
                  d'applications web modernes et performantes.
                </p>
                
                <p>
                  Avec une expertise en React, Vue.js, Node.js et PostgreSQL, je transforme des idées 
                  en solutions digitales innovantes. Mon approche combine esthétique moderne, 
                  performance optimale et expérience utilisateur intuitive.
                </p>
                
                <p>
                  Chaque projet est une opportunité de repousser les limites du développement web 
                  et de créer des applications qui font la différence.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">5+</div>
                  <div className="text-sm text-muted-foreground mt-1">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">50+</div>
                  <div className="text-sm text-muted-foreground mt-1">Projets réalisés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Clients satisfaits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
