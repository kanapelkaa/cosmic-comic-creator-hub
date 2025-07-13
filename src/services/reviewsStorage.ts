
export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

class ReviewsStorage {
  private storageKey = 'reviews';
  
  async saveReviews(reviews: Review[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  }
  
  async loadReviews(): Promise<Review[]> {
    try {
      const reviewData = localStorage.getItem(this.storageKey);
      return reviewData ? JSON.parse(reviewData) : [];
    } catch (error) {
      console.error('Failed to load reviews:', error);
      return [];
    }
  }
  
  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const reviews = await this.loadReviews();
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    reviews.unshift(newReview); // Add to beginning for newest first
    await this.saveReviews(reviews);
    return newReview;
  }
  
  async getRecentReviews(limit: number = 6): Promise<Review[]> {
    const reviews = await this.loadReviews();
    return reviews.slice(0, limit);
  }
}

export const reviewsStorage = new ReviewsStorage();
