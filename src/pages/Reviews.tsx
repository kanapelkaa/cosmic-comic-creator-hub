
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { reviewsStorage, Review } from "@/services/reviewsStorage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Reviews = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const recentReviews = await reviewsStorage.getRecentReviews(6);
    setReviews(recentReviews);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему для оставления отзыва",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите рейтинг",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, оставьте комментарий",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewsStorage.addReview({
        userId: user.id,
        username: user.username,
        rating,
        comment: comment.trim()
      });

      toast({
        title: "Успешно",
        description: "Отзыв добавлен!"
      });

      // Reset form
      setRating(0);
      setComment("");
      
      // Reload reviews
      await loadReviews();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить отзыв",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Отзывы</h1>
          
          {/* Review Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Оставить отзыв</CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Рейтинг
                    </label>
                    {renderStars(hoverRating || rating, true)}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Комментарий
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Поделитесь своим мнением..."
                      rows={4}
                      maxLength={500}
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {comment.length}/500
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Отправка..." : "Отправить отзыв"}
                  </Button>
                </form>
              ) : (
                <p className="text-muted-foreground">
                  Войдите в систему, чтобы оставить отзыв
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{review.username}</span>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Пока нет отзывов</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
