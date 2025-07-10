
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useComics } from "@/hooks/useComics";

const Comics = () => {
  const { comics } = useComics();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-foreground">
            Comics Collection
          </h1>
          
          {comics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">No comics available yet.</p>
              <p className="text-muted-foreground">Check back soon for new releases!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comics.map((comic) => (
                <Link key={comic.id} to={`/comic/${comic.id}`}>
                  <div className="group cursor-pointer">
                    <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img 
                          src={comic.images[0] || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop"} 
                          alt={comic.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-card-foreground mb-2">{comic.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{comic.description}</p>
                        <div className="mt-4 text-sm text-muted-foreground">
                          {comic.images.length} page{comic.images.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comics;
