import { Client, Databases, ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

export const database = new Databases(client);

/**
 * Increment or create a search count document.
 */
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    if (!searchTerm) return; // Skip for trending/no search
    const cleanTerm = searchTerm.trim();

    const existing = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('searchTerm', cleanTerm), Query.limit(1)]
    );

    if (existing.documents.length > 0) {
      const doc = existing.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count ?? 0) + 1,
      });
      return { updated: true, id: doc.$id };
    } else {
      const newDoc = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: cleanTerm,
          count: 1,
          movie_id: movie?.id,
          title: movie?.title || movie?.name || 'Untitled',
          poster_url: movie?.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/placeholder.png',
        }
      );
      return { created: true, id: newDoc.$id };
    }
  } catch (error) {
    console.error('Error updating search count:', error);
    return { error: error.message };
  }
};

/**
 * Fetch trending movies sorted by count (top 5 by default).
 */
export const getTrendingMovies = async (limit = 5) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.orderDesc('count'), Query.limit(limit)]
    );

    // Normalize for React
    return result.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title || 'Untitled',
      poster_url: doc.poster_url || '/placeholder.png',
      movie_id: doc.movie_id,
      count: doc.count ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};
