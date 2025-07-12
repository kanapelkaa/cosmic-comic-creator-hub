
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Обо мне
              </h1>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-xl mb-6">
                  Меня зовут <span className="text-primary font-semibold">Тимофей</span>, я крутой 
                </p>
                <p className="mb-4">
                  Я люблю путешествовать 
                </p>
                {/* <p className="mb-4">
                  When I'm not drawing, you can find me exploring new art techniques, reading graphic novels, or brainstorming the next big story to tell. I believe that comics have the unique power to combine visual art with narrative in ways that can inspire, entertain, and provoke thought.
                </p>
                <p>
                  My goal is to create comics that not only look beautiful but also tell meaningful stories that resonate with people from all walks of life.
                </p> */}
              </div>
                
              <div className="mt-8">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/tetris">
                    🎮 Начать играть в Tetris
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="relative">
                <img 
                  src="/about.png" 
                  alt="About Timofey" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-869c-620a-be99-a6c57d27abff/raw?se=2025-07-11T14%3A50%3A22Z&sp=r&sv=2024-08-04&sr=b&scid=6b8bc751-262c-51f0-b132-5a6a0f467b3c&skoid=eb780365-537d-4279-a878-cae64e33aa9c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-11T04%3A59%3A24Z&ske=2025-07-12T04%3A59%3A24Z&sks=b&skv=2024-08-04&sig=QF3uIFJBm832TIrrCsKLESJwgUsTsbtbjmRZGGeyZ7Q%3D";
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
