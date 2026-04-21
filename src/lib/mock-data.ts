
import { Artist, Artwork } from "./types";

export const MOCK_ARTISTS: Artist[] = [
  {
    id: "artist_1",
    name: "Elena Valeri",
    photoUrl: "https://picsum.photos/seed/artist1/400/400",
    bio: "Explorando la intersección entre lo digital y lo orgánico. Pintora abstracta con base en Barcelona.",
    followersCount: 1250,
    followingCount: 340,
    isNew: false
  },
  {
    id: "artist_2",
    name: "Marco Silva",
    photoUrl: "https://picsum.photos/seed/artist2/400/400",
    bio: "Fotografía urbana y minimalismo extremo.",
    followersCount: 890,
    followingCount: 120,
    isNew: true
  },
  {
    id: "artist_3",
    name: "Sofia Luna",
    photoUrl: "https://picsum.photos/seed/artist3/400/400",
    bio: "Ilustradora conceptual enfocada en el surrealismo contemporáneo.",
    followersCount: 45,
    followingCount: 88,
    isNew: true
  }
];

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "art_1",
    authorId: "artist_1",
    authorName: "Elena Valeri",
    authorPhoto: "https://picsum.photos/seed/artist1/400/400",
    title: "Fragmentos de Memoria",
    description: "Una exploración de cómo los recuerdos se desvanecen y se transforman con el tiempo.",
    tags: ["abstracto", "oleo", "memoria"],
    likes: ["user_a", "user_b", "user_c"],
    publicImageUrl: "https://picsum.photos/seed/art1/800/1000",
    timestamp: Date.now() - 3600000
  },
  {
    id: "art_2",
    authorId: "artist_2",
    authorName: "Marco Silva",
    authorPhoto: "https://picsum.photos/seed/artist2/400/400",
    title: "Silencio Urbano",
    description: "Capturando la soledad de las grandes metrópolis durante la madrugada.",
    tags: ["fotografia", "urbano", "minimalismo"],
    likes: ["user_d"],
    publicImageUrl: "https://picsum.photos/seed/art2/800/1000",
    timestamp: Date.now() - 7200000
  },
  {
    id: "art_3",
    authorId: "artist_3",
    authorName: "Sofia Luna",
    authorPhoto: "https://picsum.photos/seed/artist3/400/400",
    title: "El Sueño del Agua",
    description: "Ilustración digital sobre la fluidez de la conciencia.",
    tags: ["digital", "surrealismo", "nuevo"],
    likes: ["user_e", "user_f"],
    publicImageUrl: "https://picsum.photos/seed/art3/800/1000",
    timestamp: Date.now() - 100000
  }
];
