
export interface Artist {
  id: string;
  name: string;
  photoUrl: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isNew?: boolean;
}

export interface Artwork {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  title: string;
  description: string;
  tags: string[];
  likes: string[]; // array of user IDs
  publicImageUrl: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  artworkId: string;
  authorName: string;
  content: string;
  timestamp: number;
}
