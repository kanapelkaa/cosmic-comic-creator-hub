
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/background.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <Navigation />
      
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            Cosmic Comic Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in">
            Welcome to my creative universe where stories come to life through art and imagination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <a 
              href="/comics" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105"
            >
              Explore Comics
            </a>
            <a 
              href="/about" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105"
            >
              About Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
