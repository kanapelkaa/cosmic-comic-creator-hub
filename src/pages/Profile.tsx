
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Clock, Check, X } from "lucide-react";
import { useComics } from "@/hooks/useComics";
import { useAuth } from "@/hooks/useAuth";
import ComicForm from "@/components/ComicForm";
import { Comic } from "@/hooks/useComics";
import { Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const { allComics, deleteComic } = useComics();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | undefined>();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Filter comics by current user
  const userComics = allComics.filter(comic => comic.authorId === user.id);
  const publishedComics = userComics.filter(comic => comic.status === 'published');
  const pendingComics = userComics.filter(comic => comic.status === 'pending');
  const rejectedComics = userComics.filter(comic => comic.status === 'rejected');

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Опубликован';
      case 'pending':
        return 'На модерации';
      case 'rejected':
        return 'Отклонен';
      default:
        return status;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Мой профиль</h1>
            <p className="text-muted-foreground">Добро пожаловать, {user.username}!</p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего комиксов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userComics.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Опубликованные</CardTitle>
                <Check className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedComics.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">На модерации</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingComics.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Отклоненные</CardTitle>
                <X className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedComics.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">Все комиксы</TabsTrigger>
                <TabsTrigger value="published">Опубликованные</TabsTrigger>
                <TabsTrigger value="pending">На модерации</TabsTrigger>
                <TabsTrigger value="rejected">Отклоненные</TabsTrigger>
              </TabsList>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Создать комикс
              </Button>
            </div>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Все мои комиксы</CardTitle>
                </CardHeader>
                <CardContent>
                  {userComics.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      У вас пока нет комиксов. Создайте свой первый комикс!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {userComics.map((comic) => (
                        <div key={comic.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={comic.images[0]}
                              alt={comic.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{comic.title}</h3>
                                {getStatusIcon(comic.status)}
                                <span className="text-sm text-muted-foreground">
                                  {getStatusText(comic.status)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{comic.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {comic.images.length} страниц • Создано {new Date(comic.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {comic.status !== 'published' && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditComic(comic)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
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

            <TabsContent value="published">
              <Card>
                <CardHeader>
                  <CardTitle>Опубликованные комиксы</CardTitle>
                </CardHeader>
                <CardContent>
                  {publishedComics.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      У вас нет опубликованных комиксов.
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
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Комиксы на модерации</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingComics.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      У вас нет комиксов на модерации.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pendingComics.map((comic) => (
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

            <TabsContent value="rejected">
              <Card>
                <CardHeader>
                  <CardTitle>Отклоненные комиксы</CardTitle>
                </CardHeader>
                <CardContent>
                  {rejectedComics.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      У вас нет отклоненных комиксов.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {rejectedComics.map((comic) => (
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
          </Tabs>
        </div>

        {isFormOpen && (
          <ComicForm
            onClose={handleCloseForm}
            comic={editingComic}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
