export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  category: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  keywords: string[];
}

