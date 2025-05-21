import { ObjectId } from 'mongodb';

/**
 * Word document structure
 */
export interface WordDocument {
  _id?: ObjectId;
  word: string;
  difficulty?: number;
  frequency?: number;
  lastUsed?: Date;
  categories?: string[];
}

/**
 * Collection name for words
 */
export const WORDS_COLLECTION = 'words';
