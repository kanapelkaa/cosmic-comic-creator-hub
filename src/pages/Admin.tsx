
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useComics } from "@/hooks/useComics";
import { useVisitorCount } from "@/hooks/useVisitorCount";
import { useAuth } from "@/hooks/useAuth";
import ComicForm from "@/components/ComicForm";
import { Comic } from "@/hooks/useComics";
import AdminStatistics from "@/components/admin/AdminStatistics";
import PublishedComicsTab from "@/components/admin/PublishedComicsTab";
import ModerationTab from "@/components/admin/ModerationTab";
import AdminLoginModal from "@/components/AdminLoginModal";

const Admin = () => {
  const { allComics, pendingComics, deleteComic, moderateComic } = useComics();
  const visitorCount = useVisitorCount();
  const { user, logout } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | undefined>();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is admin, if not show login modal
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [user]);

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

  const handleCreateComic = () => {
    setIsFormOpen(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowLoginModal(true);
  };

  // Show login modal if not authenticated as admin
  if (showLoginModal) {
    return (
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => {}} // Don't allow closing without login
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Админ панель</h1>
            <p className="text-muted-foreground">Управляйте комиксами и смотрите статистику сайта</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Добро пожаловать, {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Выйти
            </button>
          </div>
        </div>

        <AdminStatistics
          visitorCount={visitorCount}
          publishedComics={publishedComics}
          pendingComics={pendingComics}
        />

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
            <PublishedComicsTab
              publishedComics={publishedComics}
              onCreateComic={handleCreateComic}
              onEditComic={handleEditComic}
              onDeleteComic={handleDeleteComic}
            />
          </TabsContent>

          <TabsContent value="moderation">
            <ModerationTab
              pendingComics={pendingComics}
              onModerateComic={handleModerateComic}
            />
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
