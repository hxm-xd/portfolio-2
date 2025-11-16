import { Card } from "@/components/ui/card";
import { GraduationCap, Award, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Education = () => {
  const certifications = [
    "Project Management Reinvented for Non-Project Managers",
    "Software Testing & QA Fundamentals",
    "Agile Development Practices",
    "Full Stack Web Development"
  ];

  return (
    <section id="education" className="py-20 px-4 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Education & <span className="text-transparent bg-clip-text bg-gradient-primary">Certifications</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Continuous learning and professional development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education Card */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:shadow-glow transition-all group animate-slide-up">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  BSc/HND in Computing
                </h3>
                <p className="text-lg text-primary font-medium">
                  National Institute of Business Management
                </p>
                <p className="text-muted-foreground">Present</p>
              </div>
            </div>
            
            <div className="space-y-3 pl-22">
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive program covering software development, database management, 
                project management, and emerging technologies.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Software Engineering
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Project Management
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Database Systems
                </Badge>
              </div>
            </div>
          </Card>

          {/* Certifications Card */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-secondary/20 hover:border-secondary/40 hover:shadow-glow transition-all group animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                  Key Certifications
                </h3>
                <p className="text-muted-foreground">LinkedIn Learning & More</p>
              </div>
            </div>
            
            <div className="space-y-3 pl-22">
              {certifications.map((cert, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Timeline accent */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-gradient-accent/10 backdrop-blur-sm border-accent/30 inline-block">
            <p className="text-muted-foreground">
              <span className="text-accent font-semibold">Always learning</span> — Committed to staying current with industry trends and best practices
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Education;
