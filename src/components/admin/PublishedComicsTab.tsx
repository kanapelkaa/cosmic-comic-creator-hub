
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Comic } from "@/hooks/useComics";

interface PublishedComicsTabProps {
  publishedComics: Comic[];
  onCreateComic: () => void;
  onEditComic: (comic: Comic) => void;
  onDeleteComic: (id: string) => void;
}

const PublishedComicsTab = ({ 
  publishedComics, 
  onCreateComic, 
  onEditComic, 
  onDeleteComic 
}: PublishedComicsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Управление опубликованными комиксами</CardTitle>
          <Button onClick={onCreateComic}>
            <Plus className="h-4 w-4 mr-2" />
            Создать комикс
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {publishedComics.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Опубликованные комиксы отсутствуют.
          </p>
        ) : (
          <div className="space-y-4">
            {publishedComics.map((comic) => (
              <div key={comic.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={comic.images[0]}
                    alt={comic.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{comic.title}</h3>
                    <p className="text-sm text-muted-foreground">{comic.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {comic.images.length} страниц • Создано {new Date(comic.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditComic(comic)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteComic(comic.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublishedComicsTab;
