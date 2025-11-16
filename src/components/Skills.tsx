import { Card } from "@/components/ui/card";
import { Code2, Database, Wrench, GitBranch, Rocket, Lightbulb } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      icon: Code2,
      title: "Programming",
      color: "primary",
      skills: ["Java", "JavaScript", "Python", "Dart"]
    },
    {
      icon: Wrench,
      title: "Frameworks & Tools",
      color: "secondary",
      skills: ["Spring Boot", "React", "Flutter", "REST APIs"]
    },
    {
      icon: Database,
      title: "Database & Backend",
      color: "tech-purple",
      skills: ["MySQL", "PostgreSQL", "API Development", "Server Management"]
    },
    {
      icon: GitBranch,
      title: "Version Control",
      color: "primary",
      skills: ["Git", "GitHub", "Collaboration Workflows", "Code Review"]
    },
    {
      icon: Rocket,
      title: "Project/PM Tools",
      color: "secondary",
      skills: ["Trello", "Notion", "MS Office", "Agile Methodologies"]
    },
    {
      icon: Lightbulb,
      title: "Interests",
      color: "tech-purple",
      skills: ["AI & Machine Learning", "IoT & Automation", "Mobile Development", "Robotics"]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-transparent bg-clip-text bg-gradient-primary">Skills</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <Card 
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:shadow-glow transition-all group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${category.color}/10 flex items-center justify-center group-hover:bg-${category.color}/20 transition-colors flex-shrink-0`}>
                  <category.icon className={`h-6 w-6 text-${category.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors pt-2">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-2">
                {category.skills.map((skill, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full bg-${category.color}/50`} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-accent/10 backdrop-blur-sm border-accent/30 inline-block">
            <p className="text-lg text-muted-foreground">
              Always learning and expanding my skill set to stay ahead in the tech industry
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
