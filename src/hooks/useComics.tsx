
import { useState, useEffect } from 'react';

export interface Comic {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
}

export const useComics = () => {
  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    const savedComics = localStorage.getItem('comics');
    if (savedComics) {
      setComics(JSON.parse(savedComics));
    }
  }, []);

  const saveComics = (newComics: Comic[]) => {
    setComics(newComics);
    localStorage.setItem('comics', JSON.stringify(newComics));
  };

  const addComic = (comic: Omit<Comic, 'id' | 'createdAt'>) => {
    const newComic: Comic = {
      ...comic,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedComics = [...comics, newComic];
    saveComics(updatedComics);
  };

  const deleteComic = (id: string) => {
    const updatedComics = comics.filter(comic => comic.id !== id);
    saveComics(updatedComics);
  };

  const updateComic = (id: string, updates: Partial<Comic>) => {
    const updatedComics = comics.map(comic => 
      comic.id === id ? { ...comic, ...updates } : comic
    );
    saveComics(updatedComics);
  };

  return {
    comics,
    addComic,
    deleteComic,
    updateComic,
  };
};
