
import Navigation from "@/components/Navigation";
import { Mail, MessageCircle, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 via-transparent to-primary/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <Navigation />
      
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="text-center text-foreground px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Cosmic Comic Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in text-muted-foreground">
            Welcome to my creative universe where stories come to life through art and imagination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <a 
              href="/comics" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              Explore Comics
            </a>
            <a 
              href="/about" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              About Me
            </a>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-center mb-4 text-card-foreground">
              Get in Touch
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://t.me/snakwnzzz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-all hover:scale-105 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">@snakwnzzz</span>
              </a>
              <a 
                href="https://discord.com/users/kanapel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 group"
              >
                <Users className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">@kanapel</span>
              </a>
              <a 
                href="mailto:kanapelkaaa@gmail.com"
                className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 group"
              >
                <Mail className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">kanapelkaaa@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
