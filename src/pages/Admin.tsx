
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Check, X, Clock } from "lucide-react";
import { useComics } from "@/hooks/useComics";
import { useVisitorCount } from "@/hooks/useVisitorCount";
import { useAuth } from "@/hooks/useAuth";
import ComicForm from "@/components/ComicForm";
import { Comic } from "@/hooks/useComics";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { allComics, pendingComics, deleteComic, moderateComic } = useComics();
  const visitorCount = useVisitorCount();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | undefined>();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const publishedComics = allComics.filter(comic => comic.status === 'published');

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

  const handleModerateComic = (id: string, status: 'published' | 'rejected') => {
    moderateComic(id, status);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Админ панель</h1>
          <p className="text-muted-foreground">Управляйте комиксами и смотрите статистику сайта</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Опубликованные</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedComics.length}</div>
              <p className="text-xs text-muted-foreground">Активные комиксы</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">На модерации</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingComics.length}</div>
              <p className="text-xs text-muted-foreground">Ожидают проверки</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего страниц</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {publishedComics.reduce((total, comic) => total + comic.images.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Страницы комиксов</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="published" className="space-y-4">
          <TabsList>
            <TabsTrigger value="published">Опубликованные</TabsTrigger>
            <TabsTrigger value="moderation" className="relative">
              Модерация
              {pendingComics.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingComics.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Управление опубликованными комиксами</CardTitle>
                  <Button onClick={() => setIsFormOpen(true)}>
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
          </TabsContent>

          <TabsContent value="moderation">
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
                              onClick={() => handleModerateComic(comic.id, 'published')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Одобрить
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleModerateComic(comic.id, 'rejected')}
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
          </TabsContent>
        </Tabs>
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
