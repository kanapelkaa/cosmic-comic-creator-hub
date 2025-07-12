
import { useState, useEffect } from 'react';
import { comicsStorage } from '@/services/comicsStorage';

export interface Comic {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  authorId?: string;
  status: 'published' | 'pending' | 'rejected';
}

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
      status: comic.authorId ? 'pending' : 'published', // User comics need approval
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
  };
};
