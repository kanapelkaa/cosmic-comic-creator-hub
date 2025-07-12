
import { useState, useEffect } from 'react';
import { comicsStorage, Comic } from '@/services/comicsStorage';

export type { Comic } from '@/services/comicsStorage';

export const useComics = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComics();
  }, []);

  const loadComics = async () => {
    try {
      setLoading(true);
      const loadedComics = await comicsStorage.loadComics();
      setComics(loadedComics);
      console.log('Loaded comics:', loadedComics);
    } catch (error) {
      console.error('Error loading comics:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveComics = async (newComics: Comic[]) => {
    try {
      await comicsStorage.saveComics(newComics);
      setComics(newComics);
      console.log('Saved comics:', newComics);
    } catch (error) {
      console.error('Error saving comics:', error);
    }
  };

  const addComic = async (comic: Omit<Comic, 'id' | 'createdAt' | 'status'>) => {
    const newComic: Comic = {
      ...comic,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: comic.authorId ? 'pending' : 'published', // User comics need approval, admin comics are published directly
    };
    const updatedComics = [...comics, newComic];
    await saveComics(updatedComics);
  };

  const deleteComic = async (id: string) => {
    const updatedComics = comics.filter(comic => comic.id !== id);
    await saveComics(updatedComics);
  };

  const updateComic = async (id: string, updates: Partial<Comic>) => {
    const updatedComics = comics.map(comic => 
      comic.id === id ? { ...comic, ...updates } : comic
    );
    await saveComics(updatedComics);
  };

  const moderateComic = async (id: string, status: 'published' | 'rejected') => {
    await updateComic(id, { status });
  };

  // Filter comics based on status
  const publishedComics = comics.filter(comic => comic.status === 'published');
  const pendingComics = comics.filter(comic => comic.status === 'pending');

  // Get top users by comic count
  const getTopUsers = () => {
    const userComicCounts = comics.reduce((acc, comic) => {
      if (comic.authorId && comic.status === 'published') {
        acc[comic.authorId] = (acc[comic.authorId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userComicCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return {
    comics: publishedComics, // Only show published comics by default
    allComics: comics, // All comics for admin
    pendingComics,
    loading,
    addComic,
    deleteComic,
    updateComic,
    moderateComic,
    refreshComics: loadComics,
    getTopUsers,
  };
};
