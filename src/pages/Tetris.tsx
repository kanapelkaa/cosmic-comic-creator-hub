
import Navigation from "@/components/Navigation";
import TetrisGame from "@/components/TetrisGame";

const Tetris = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            🎮 Тетрис
          </h1>
          <p className="text-xl text-muted-foreground">
            Классический тетрис с полным функционалом. Играйте с помощью клавиш со стрелками!
          </p>
        </div>
        
        <TetrisGame />
      </div>
    </div>
  );
};

export default Tetris;
