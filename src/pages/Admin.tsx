
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useComics } from "@/hooks/useComics";
import { useVisitorCount } from "@/hooks/useVisitorCount";
import ComicForm from "@/components/ComicForm";
import { Comic } from "@/hooks/useComics";

const Admin = () => {
  const { comics, deleteComic } = useComics();
  const visitorCount = useVisitorCount();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | undefined>();

  const handleEditComic = (comic: Comic) => {
    setEditingComic(comic);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingComic(undefined);
  };

  const handleDeleteComic = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот комикс?")) {
      deleteComic(id);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Админ панель</h1>
          <p className="text-muted-foreground">Управляйте комиксами и смотрите статистику сайта</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Количество просмотров</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitorCount}</div>
              <p className="text-xs text-muted-foreground">Посещение сайта</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего комиксов</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{comics.length}</div>
              <p className="text-xs text-muted-foreground">Опубликовать комикс</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего страниц</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {comics.reduce((total, comic) => total + comic.images.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Страницы комиксов</p>
            </CardContent>
          </Card>
        </div>

        {/* Comics Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Управление комиксами</CardTitle>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Создать комикс
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {comics.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Комиксы пока не созданы. Нажмите «Создать комикс», чтобы начать.
              </p>
            ) : (
              <div className="space-y-4">
                {comics.map((comic) => (
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
                        onClick={() => handleEditComic(comic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteComic(comic.id)}
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
      </div>

      {isFormOpen && (
        <ComicForm
          onClose={handleCloseForm}
          comic={editingComic}
        />
      )}
    </div>
  );
};

export default Admin;
