
import { useState, useEffect } from 'react';
import { comicsStorage } from '@/services/comicsStorage';

export interface Comic {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
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

  const addComic = async (comic: Omit<Comic, 'id' | 'createdAt'>) => {
    const newComic: Comic = {
      ...comic,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
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

  return {
    comics,
    loading,
    addComic,
    deleteComic,
    updateComic,
    refreshComics: loadComics,
  };
};
