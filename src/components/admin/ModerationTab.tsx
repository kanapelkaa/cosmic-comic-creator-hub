
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Comic } from "@/hooks/useComics";

interface ModerationTabProps {
  pendingComics: Comic[];
  onModerateComic: (id: string, status: 'published' | 'rejected') => void;
}

const ModerationTab = ({ pendingComics, onModerateComic }: ModerationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Комиксы на модерации</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingComics.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Нет комиксов на модерации.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingComics.map((comic) => (
              <div key={comic.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
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
                      size="sm"
                      onClick={() => onModerateComic(comic.id, 'published')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Одобрить
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onModerateComic(comic.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Отклонить
                    </Button>
                  </div>
                </div>
                
                {/* Preview images */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {comic.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Страница ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                  {comic.images.length > 4 && (
                    <div className="w-full h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                      +{comic.images.length - 4} ещё
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModerationTab;
