
import Navigation from "@/components/Navigation";

const Movies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Фильмы
          </h1>
          
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-black">
              <video
                controls
                className="w-full h-full"
                poster="/placeholder.svg"
              >
                <source src="/film.mov" type="video/quicktime" />
                <source src="/film.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                Боевик
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Захватывающий боевик с невероятными трюками и динамичным сюжетом. 
                История о герое, который должен преодолеть все препятствия, чтобы 
                спасти мир от неминуемой катастрофы. Полный адреналина фильм с 
                потрясающими спецэффектами и незабываемыми персонажами.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
