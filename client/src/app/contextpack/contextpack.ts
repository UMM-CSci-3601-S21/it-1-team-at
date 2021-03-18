
export interface ContextPack {
  _id: string;
  scheme?: string;
  name: string;
  enabled: boolean;
  icon?: string;
  wordPacks?: WordPack[];
}

export interface WordPack {
  name?: string;
  enabled?: boolean;
  nouns?: Words[];
  verbs?: Words[];
  adjectives?: Words[];
  misc?: Words[];
}
export interface Words {
  word?: string;
  forms?: string[];
}

export type WordRole = 'nouns' | 'verbs' | 'adjectives' | 'misc';
