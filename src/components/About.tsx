import { Card } from "@/components/ui/card";
import { Lightbulb, Users, TrendingUp, Heart } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Lightbulb,
      title: "Innovative Thinker",
      description: "Always exploring new technologies and creative solutions"
    },
    {
      icon: Users,
      title: "Team Player",
      description: "Experienced in leading and collaborating with diverse teams"
    },
    {
      icon: TrendingUp,
      title: "Continuous Learner",
      description: "Committed to growth through courses and certifications"
    },
    {
      icon: Heart,
      title: "Community Focused",
      description: "Active volunteer work and social impact initiatives"
    }
  ];

  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-primary">Me</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Bio */}
          <div className="space-y-6 animate-slide-up">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a <span className="text-primary font-semibold">Computing Undergraduate at NIBM</span>, 
                passionate about turning ideas into impactful digital solutions. My focus lies in 
                <span className="text-primary font-semibold"> IT project management</span> and 
                <span className="text-primary font-semibold"> full-stack development</span>, where I combine 
                technical expertise with leadership skills.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 hover:border-secondary/40 transition-all">
              <p className="text-lg text-muted-foreground leading-relaxed">
                My strengths include <span className="text-secondary font-semibold">communication, teamwork, and leadership</span>. 
                I thrive on solving complex problems and building systems that matter—from inventory management solutions 
                to IoT-based landslide detection systems.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-accent/10 backdrop-blur-sm border-accent/30 hover:border-accent/50 transition-all">
              <blockquote className="text-xl font-medium italic text-center text-foreground">
                "I love turning ideas into well-organized, successful projects — and learning something new every time."
              </blockquote>
            </Card>
          </div>

          {/* Right - Highlights */}
          <div className="grid sm:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:shadow-glow transition-all group cursor-pointer"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
