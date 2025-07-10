
import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useComics } from "@/hooks/useComics";

const ComicView = () => {
  const { id } = useParams();
  const { comics } = useComics();
  const [currentPage, setCurrentPage] = useState(0);

  const comic = comics.find(c => c.id === id);

  if (!comic) {
    return <Navigate to="/comics" replace />;
  }

  const nextPage = () => {
    if (currentPage < comic.images.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Comic Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {comic.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {comic.description}
            </p>
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {comic.images.length}
            </div>
          </div>

          {/* Comic Reader */}
          <div className="relative bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-[3/4] relative">
              <img 
                src={comic.images[currentPage]} 
                alt={`${comic.title} - Page ${currentPage + 1}`}
                className="w-full h-full object-contain bg-white"
              />
              
              {/* Navigation Arrows */}
              {currentPage > 0 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                  onClick={prevPage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              
              {currentPage < comic.images.length - 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                  onClick={nextPage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>

          {/* Page Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {comic.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentPage 
                    ? 'bg-primary' 
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicView;
