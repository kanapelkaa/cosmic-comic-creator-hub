
import Navigation from "@/components/Navigation";

const Movies = () => {
  const serials = [
    {
      id: 1,
      title: "Боевик",
      description: "Захватывающий боевик с невероятными трюками и динамичным сюжетом. История о герое, который должен преодолеть все препятствия, чтобы спасти мир от неминуемой катастрофы.",
      videoSrc: "/move1.mov"
    },
    {
      id: 2,
      title: "Драма",
      description: "Глубокая драма о человеческих отношениях и поиске смысла жизни. Фильм рассказывает о сложных семейных узах и преодолении жизненных трудностей.",
      videoSrc: "/move2.mov"
    },
    {
      id: 3,
      title: "Фантастика",
      description: "Увлекательная научная фантастика о будущем человечества. Исследование космоса, новые технологии и встреча с неизвестными цивилизациями.",
      videoSrc: "/move3.mov"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Сериалы
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {serials.map((serial) => (
              <div key={serial.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-black">
                  <video
                    controls
                    className="w-full h-full"
                    poster="/placeholder.svg"
                  >
                    <source src={serial.videoSrc} type="video/quicktime" />
                    <source src={serial.videoSrc.replace('.mov', '.mp4')} type="video/mp4" />
                    Ваш браузер не поддерживает видео.
                  </video>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-3">
                    {serial.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {serial.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
