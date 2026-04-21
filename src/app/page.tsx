
"use client"

import * as React from "react"
import { ArtworkCard } from "@/components/artwork-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";
import { ArtworkViewModal } from "@/components/artwork-view-modal";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function Home() {
  const [selectedArt, setSelectedArt] = React.useState<any>(null);
  const db = useFirestore();

  const artworksQuery = useMemoFirebase(() => {
    return query(collection(db, "artworks"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: artworks, isLoading } = useCollection(artworksQuery);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <header className="mb-10 px-4 flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Descubre lo nuevo</span>
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter text-center md:text-left">Tu Galería Personal</h1>
      </header>

      <Tabs defaultValue="feed" className="w-full">
        <div className="px-4 mb-8">
          <TabsList className="inline-flex w-auto bg-white/50 backdrop-blur-md p-1 rounded-full border border-primary/20 shadow-sm">
            <TabsTrigger value="feed" className="px-8 font-black text-xs uppercase tracking-widest rounded-full data-[state=active]:bg-secondary data-[state=active]:text-white transition-all">Para ti</TabsTrigger>
            <TabsTrigger value="following" className="px-8 font-black text-xs uppercase tracking-widest rounded-full data-[state=active]:bg-secondary data-[state=active]:text-white transition-all">Siguiendo</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="feed" className="px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium italic">Invocando el arte...</p>
            </div>
          ) : artworks && artworks.length > 0 ? (
            <div className="masonry-grid">
              {artworks.map(artwork => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={{
                    ...artwork,
                    publicImageUrl: artwork.publicWatermarkedUrl, // Map from Firestore schema
                    likes: artwork.likedByUsersIds || []
                  } as any} 
                  onOpen={setSelectedArt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-primary/20 shadow-inner floral-geometry-pattern">
              <p className="text-muted-foreground italic font-medium">Aún no hay obras publicadas. ¡Sé el primero!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="following" className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-primary/20 shadow-inner floral-geometry-pattern mx-4">
          <p className="text-muted-foreground italic font-medium">Aún no sigues a ningún artista.</p>
          <button className="mt-6 text-secondary font-black uppercase text-xs tracking-widest hover:underline hover:scale-105 transition-transform">Explora nuevos talentos</button>
        </TabsContent>
      </Tabs>

      <ArtworkViewModal 
        isOpen={!!selectedArt} 
        onClose={() => setSelectedArt(null)} 
        artwork={selectedArt} 
      />
    </div>
  );
}
