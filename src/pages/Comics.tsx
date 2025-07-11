
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useComics } from "@/hooks/useComics";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

const Comics = () => {
  const { comics } = useComics();
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("comics-list");
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
  
  console.log("Comics data:", comics); // Debug log

  const openComicTab = (comicId: string) => {
    if (!openTabs.includes(comicId)) {
      setOpenTabs([...openTabs, comicId]);
      setCurrentPages({ ...currentPages, [comicId]: 0 });
    }
    setActiveTab(comicId);
  };

  const closeTab = (comicId: string) => {
    const newTabs = openTabs.filter(id => id !== comicId);
    setOpenTabs(newTabs);
    
    const newCurrentPages = { ...currentPages };
    delete newCurrentPages[comicId];
    setCurrentPages(newCurrentPages);
    
    if (activeTab === comicId) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : "comics-list");
    }
  };

  const nextPage = (comicId: string) => {
    const comic = comics.find(c => c.id === comicId);
    if (comic && currentPages[comicId] < comic.images.length - 1) {
      setCurrentPages({ ...currentPages, [comicId]: currentPages[comicId] + 1 });
    }
  };

  const prevPage = (comicId: string) => {
    if (currentPages[comicId] > 0) {
      setCurrentPages({ ...currentPages, [comicId]: currentPages[comicId] - 1 });
    }
  };

  const goToPage = (comicId: string, pageIndex: number) => {
    setCurrentPages({ ...currentPages, [comicId]: pageIndex });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeTab !== "comics-list") {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          prevPage(activeTab);
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextPage(activeTab);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentPages]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="comics-list">Comics Collection</TabsTrigger>
              {openTabs.map((comicId) => {
                const comic = comics.find(c => c.id === comicId);
                return (
                  <div key={comicId} className="flex items-center">
                    <TabsTrigger value={comicId} className="pr-1">
                      {comic?.title || 'Comic'}
                    </TabsTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(comicId);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </TabsList>

            <TabsContent value="comics-list">
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
                    <div 
                      key={comic.id} 
                      className="group cursor-pointer block"
                      onClick={() => openComicTab(comic.id)}
                    >
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
                  ))}
                </div>
              )}
            </TabsContent>

            {openTabs.map((comicId) => {
              const comic = comics.find(c => c.id === comicId);
              const currentPage = currentPages[comicId] || 0;
              
              if (!comic) return null;

              return (
                <TabsContent key={comicId} value={comicId}>
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
                            onClick={() => prevPage(comicId)}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                        )}
                        
                        {currentPage < comic.images.length - 1 && (
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100 z-10"
                            onClick={() => nextPage(comicId)}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        )}
                        
                        {/* Click zones for navigation */}
                        <div 
                          className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-5"
                          onClick={() => prevPage(comicId)}
                          style={{ display: currentPage > 0 ? 'block' : 'none' }}
                        />
                        <div 
                          className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-5"
                          onClick={() => nextPage(comicId)}
                          style={{ display: currentPage < comic.images.length - 1 ? 'block' : 'none' }}
                        />
                      </div>
                    </div>

                    {/* Page Navigation Dots */}
                    <div className="flex justify-center mt-6 space-x-2 flex-wrap">
                      {comic.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(comicId, index)}
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
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Comics;
