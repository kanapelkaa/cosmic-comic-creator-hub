
export interface Comic {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  authorId?: string;
  status: 'published' | 'pending' | 'rejected';
}

// Simple file-based storage simulation
class ComicsStorage {
  private storageKey = 'comics_shared';
  
  // Get current host for network storage
  private getStorageKey() {
    return `${this.storageKey}_${window.location.hostname}`;
  }
  
  // Save to both localStorage and attempt network sync
  async saveComics(comics: Comic[]): Promise<void> {
    try {
      // Save locally
      localStorage.setItem(this.storageKey, JSON.stringify(comics));
      
      // Try to save to network storage (simulated)
      await this.syncToNetwork(comics);
    } catch (error) {
      console.error('Failed to save comics:', error);
    }
  }
  
  // Load from localStorage and network
  async loadComics(): Promise<Comic[]> {
    try {
      // Try to load from network first
      const networkComics = await this.loadFromNetwork();
      if (networkComics.length > 0) {
        return this.migrateComics(networkComics);
      }
      
      // Fall back to localStorage
      const localComics = localStorage.getItem(this.storageKey);
      const comics = localComics ? JSON.parse(localComics) : [];
      return this.migrateComics(comics);
    } catch (error) {
      console.error('Failed to load comics:', error);
      return [];
    }
  }
  
  // Migrate old comics to new format
  private migrateComics(comics: any[]): Comic[] {
    return comics.map(comic => ({
      ...comic,
      status: comic.status || 'published', // Default to published for existing comics
      authorId: comic.authorId || undefined
    }));
  }
  
  // Simulate network sync (in a real app, this would be an API call)
  private async syncToNetwork(comics: Comic[]): Promise<void> {
    // In a real implementation, this would POST to a server
    // For now, we'll use a shared localStorage key
    try {
      localStorage.setItem('comics_network_shared', JSON.stringify(comics));
    } catch (error) {
      console.warn('Network sync failed:', error);
    }
  }
  
  // Simulate loading from network
  private async loadFromNetwork(): Promise<Comic[]> {
    try {
      const networkData = localStorage.getItem('comics_network_shared');
      return networkData ? JSON.parse(networkData) : [];
    } catch (error) {
      console.warn('Network load failed:', error);
      return [];
    }
  }
}

export const comicsStorage = new ComicsStorage();
