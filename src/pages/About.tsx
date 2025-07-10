
import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                About Me
              </h1>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-xl mb-6">
                  Hi, I'm <span className="text-primary font-semibold">Timofey</span>, a passionate comic creator and digital artist.
                </p>
                <p className="mb-4">
                  I've been creating comics and illustrations for over 5 years, drawing inspiration from science fiction, fantasy, and everyday life. My work focuses on storytelling that connects with readers on an emotional level.
                </p>
                <p className="mb-4">
                  When I'm not drawing, you can find me exploring new art techniques, reading graphic novels, or brainstorming the next big story to tell. I believe that comics have the unique power to combine visual art with narrative in ways that can inspire, entertain, and provoke thought.
                </p>
                <p>
                  My goal is to create comics that not only look beautiful but also tell meaningful stories that resonate with people from all walks of life.
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="relative">
                <img 
                  src="/about.png" 
                  alt="About Timofey" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
