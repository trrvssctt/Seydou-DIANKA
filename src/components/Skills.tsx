import { Code2, Database, Globe, Server, Smartphone, Workflow } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend",
    icon: Globe,
    skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Next.js"],
    color: "text-accent"
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "NestJS", "API REST", "GraphQL"],
    color: "text-primary"
  },
  {
    title: "Base de données",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "Prisma", "TypeORM", "Redis"],
    color: "text-accent"
  },
  {
    title: "DevOps & Cloud",
    icon: Workflow,
    skills: ["Docker", "AWS", "Vercel", "GitHub Actions", "Linux"],
    color: "text-primary"
  },
  {
    title: "Mobile",
    icon: Smartphone,
    skills: ["React Native", "Flutter", "Progressive Web Apps", "Responsive Design"],
    color: "text-accent"
  },
  {
    title: "Outils & Méthodologie",
    icon: Code2,
    skills: ["Git", "Agile/Scrum", "Tests unitaires", "CI/CD", "Code Review"],
    color: "text-primary"
  }
];

export const Skills = () => {
  return (
    <section id="competences" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
            Compétences techniques
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Une stack technologique complète pour développer des applications web modernes et performantes
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.title}
                  className="border-2 hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${category.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {category.title}
                      </h3>
                    </div>
                    
                    <ul className="space-y-2">
                      {category.skills.map((skill) => (
                        <li 
                          key={skill}
                          className="text-muted-foreground flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
