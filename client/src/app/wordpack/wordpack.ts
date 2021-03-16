export interface WordPack {
  name: string;
  enabled: boolean;
  nouns?: Words[];
  verbs?: Words[];
  adjectives?: Words[];
  misc?: Words[];
}

export interface Words {
  word?: string;
  forms?: string[];
}