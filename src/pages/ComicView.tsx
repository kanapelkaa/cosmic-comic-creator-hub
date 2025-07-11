
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useComics } from "@/hooks/useComics";

const ComicView = () => {
  const { id } = useParams();
  const { comics } = useComics();
  const [currentPage, setCurrentPage] = useState(0);

  console.log("Comic ID:", id, "Comics:", comics); // Debug log

  const comic = comics.find(c => c.id === id);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        prevPage();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, comic]);

  if (!comic) {
    console.log("Comic not found, redirecting to comics page");
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

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100 z-10"
                  onClick={prevPage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              
              {currentPage < comic.images.length - 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100 z-10"
                  onClick={nextPage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
              
              {/* Click zones for navigation */}
              <div 
                className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-5"
                onClick={prevPage}
                style={{ display: currentPage > 0 ? 'block' : 'none' }}
              />
              <div 
                className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-5"
                onClick={nextPage}
                style={{ display: currentPage < comic.images.length - 1 ? 'block' : 'none' }}
              />
            </div>
          </div>

          {/* Page Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2 flex-wrap">
            {comic.images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-colors m-1 ${
                  index === currentPage 
                    ? 'bg-primary' 
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>

          {/* Navigation Info */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Use arrow keys, click on the sides of the image, or click the dots to navigate
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicView;
