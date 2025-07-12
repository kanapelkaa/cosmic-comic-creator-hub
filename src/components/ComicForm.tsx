
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import { useComics, Comic } from "@/hooks/useComics";
import { useAuth } from "@/hooks/useAuth";

interface ComicFormProps {
  onClose: () => void;
  comic?: Comic;
}

const ComicForm = ({ onClose, comic }: ComicFormProps) => {
  const { addComic, updateComic } = useComics();
  const { user } = useAuth();
  const [title, setTitle] = useState(comic?.title || "");
  const [description, setDescription] = useState(comic?.description || "");
  const [images, setImages] = useState<string[]>(comic?.images || []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      fileArray.forEach((file) => {
        if (images.length < 10) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            setImages(prev => {
              if (prev.length < 10) {
                return [...prev, result];
              }
              return prev;
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && images.length > 0) {
      if (comic) {
        updateComic(comic.id, { title, description, images });
      } else {
        // Only add authorId if user is not admin - admin comics are published directly
        const authorId = user?.role === 'admin' ? undefined : user?.id;
        addComic({ 
          title, 
          description, 
          images,
          authorId
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">
            {comic ? 'Редактировать комикс' : 'Создать новый комикс'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название комикса"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание комикса"
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Изображения ({images.length}/10)</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 10}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${
                  images.length >= 10 ? 'opacity-50 cursor-not-allowed' : 'border-muted-foreground'
                }`}
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {images.length >= 10 ? 'Максимум 10 изображений' : 'Нажмите для загрузки изображений'}
                  </p>
                </div>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-[3/4] border rounded overflow-hidden">
                    <img
                      src={image}
                      alt={`Страница комикса ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user?.role !== 'admin' && !comic && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Ваш комикс будет отправлен на модерацию перед публикацией.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!title || !description || images.length === 0}>
              {comic ? 'Обновить комикс' : 'Создать комикс'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComicForm;
