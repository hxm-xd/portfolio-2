import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const projects = [
    {
      title: "Billing & Inventory Management System",
      description: "A comprehensive enterprise solution for managing inventory, billing, and customer relationships with real-time analytics and reporting capabilities.",
      technologies: ["Java", "Spring Boot", "MySQL", "REST API"],
      demo: "#",
      github: "#",
      gradient: "from-primary/20 to-tech-purple/20"
    },
    {
      title: "Landslide Detection & Monitoring System",
      description: "IoT-powered system that monitors environmental conditions and provides early warnings for potential landslides using sensor networks and predictive analytics.",
      technologies: ["IoT", "Python", "Web Dashboard", "Analytics"],
      demo: "#",
      github: "#",
      gradient: "from-tech-purple/20 to-primary/20"
    },
    {
      title: "Mobile App Portfolio",
      description: "Collection of mobile applications built with Flutter, focusing on user experience and cross-platform performance.",
      technologies: ["Flutter", "Dart", "Firebase", "REST API"],
      demo: "#",
      github: "#",
      gradient: "from-secondary/20 to-primary/20"
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-primary">Projects</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of my recent work showcasing my skills in development and project management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="group bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 overflow-hidden transition-all hover:shadow-card hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient header */}
              <div className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
                    <Github className="h-8 w-8 text-foreground" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <Badge 
                      key={i}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 hover:border-primary"
          >
            <Github className="mr-2 h-5 w-5" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
