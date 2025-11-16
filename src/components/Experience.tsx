import { Card } from "@/components/ui/card";
import { Building2, Users, BookOpen } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      icon: Users,
      role: "Director of Professional Development",
      organization: "Rotaract Club of Kandy Hill Capital",
      period: "Present",
      description: "Leading professional development initiatives, organizing events, and fostering community engagement through technology and innovation.",
      highlights: [
        "Event & project coordination",
        "Stakeholder communication",
        "Team leadership and mentoring",
        "Community impact initiatives"
      ],
      color: "primary"
    },
    {
      icon: BookOpen,
      role: "Co-Lead",
      organization: "STEM UP Foundation",
      period: "Present",
      description: "Promoting STEM education and organizing educational programs to inspire the next generation of tech innovators.",
      highlights: [
        "Educational program design",
        "Workshop facilitation",
        "Resource development",
        "Student mentorship"
      ],
      color: "secondary"
    },
    {
      icon: Building2,
      role: "Active Member",
      organization: "NIBM IT Society",
      period: "Present",
      description: "Collaborating with fellow students on tech projects and participating in knowledge-sharing sessions.",
      highlights: [
        "Technical workshops",
        "Collaborative projects",
        "Peer learning sessions",
        "Tech community building"
      ],
      color: "tech-purple"
    }
  ];

  return (
    <section id="experience" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience & <span className="text-transparent bg-clip-text bg-gradient-primary">Leadership</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building leadership skills through active community involvement and tech initiatives
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card 
              key={index}
              className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:shadow-glow transition-all group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-${exp.color}/10 flex items-center justify-center flex-shrink-0 group-hover:bg-${exp.color}/20 transition-colors`}>
                  <exp.icon className={`h-8 w-8 text-${exp.color}`} />
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full w-fit">
                        {exp.period}
                      </span>
                    </div>
                    <p className={`text-lg font-medium text-${exp.color}`}>
                      {exp.organization}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {exp.highlights.map((highlight, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${exp.color}`} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
