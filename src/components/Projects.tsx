import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { apiGet } from '@/lib/api';

interface PublicProject {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  image?: string;
  github?: string;
  demo?: string;
  slug?: string;
}

export const Projects = () => {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiGet('/projects');
        if (res.ok) {
          const data = await res.json();
          // map backend shape to public shape
          const mapped = data
            .filter((p: any) => p.published)
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              description: p.description || p.short_desc || '',
              technologies: Array.isArray(p.tech_stack) ? p.tech_stack : (p.technologies || []),
              image: p.cover_url || p.coverImage || '',
              github: p.repo_url || p.github || '',
              demo: p.live_url || p.demo || '',
              slug: p.slug,
            }));
          setProjects(mapped);
        }
      } catch (e) {
        console.error('Failed to load projects', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="projets" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
            Projets récents
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Une sélection de mes réalisations les plus significatives
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="h-64 animate-pulse" />
              ))
            ) : (
              projects.map((project) => (
                <Card 
                  key={project.id}
                  className="overflow-hidden hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.technologies || []).map((tech) => (
                        <span 
                          key={tech}
                          className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={project.github || '#'} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-accent hover:bg-accent/90"
                        asChild
                      >
                        <a href={project.demo || '#'} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
