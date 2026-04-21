
"use client"

import * as React from "react"
import { MOCK_ARTISTS, MOCK_ARTWORKS } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, TrendingUp } from "lucide-react"
import Image from "next/image"
import { ArtworkViewModal } from "@/components/artwork-view-modal"

export default function ExplorePage() {
  const [selectedArt, setSelectedArt] = React.useState<{
    title: string
    imageUrl: string
    authorName: string
    authorPhoto: string
  } | null>(null)

  const newArtists = MOCK_ARTISTS.filter(a => a.isNew);
  
  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      <section className="max-w-2xl mx-auto text-center space-y-8 py-10">
        <h1 className="font-headline text-5xl font-black text-foreground tracking-tighter">Explorar</h1>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Busca por estilos, tags o artistas..." 
            className="pl-12 h-16 bg-white border-none shadow-sm focus:ring-2 focus:ring-primary/20 rounded-[1.5rem] text-lg font-medium"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="font-headline text-2xl font-black text-foreground">Nuevos Talentos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArtists.map(artist => (
            <div key={artist.id} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group border-none text-center">
              <Avatar className="w-24 h-24 mx-auto mb-6 ring-4 ring-background shadow-lg transition-transform group-hover:scale-110">
                <AvatarImage src={artist.photoUrl} />
                <AvatarFallback>{artist.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-headline text-xl font-black mb-1">{artist.name}</h3>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest px-3 mb-4">NUEVO</Badge>
              <p className="text-xs text-muted-foreground line-clamp-2 font-medium mb-6">
                {artist.bio}
              </p>
              <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-8">
                <div>{artist.followersCount} <span className="text-muted-foreground block font-bold">Seguidores</span></div>
                <div className="w-px bg-border h-8"></div>
                <div>{artist.followingCount} <span className="text-muted-foreground block font-bold">Siguiendo</span></div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">Seguir</Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-xl">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-headline text-2xl font-black text-foreground">Tendencias de la Semana</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {MOCK_ARTWORKS.map((art) => (
            <div 
              key={art.id} 
              onClick={() => setSelectedArt({
                title: art.title,
                imageUrl: art.publicImageUrl,
                authorName: art.authorName,
                authorPhoto: art.authorPhoto
              })}
              className="relative aspect-square rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm"
            >
              <Image 
                src={art.publicImageUrl} 
                alt={art.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <p className="text-white font-headline font-black text-center px-6 text-sm uppercase tracking-widest">{art.title}</p>
              </div>
            </div>
          ))}
          {[1, 2, 3, 4].map(i => (
            <div 
              key={`trend-${i}`} 
              onClick={() => setSelectedArt({
                title: `Obra Tendencia ${i}`,
                imageUrl: `https://picsum.photos/seed/trend${i}/600/600`,
                authorName: "Artista Destacado",
                authorPhoto: `https://picsum.photos/seed/artist${i}/100/100`
              })}
              className="relative aspect-square rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm"
            >
              <Image 
                src={`https://picsum.photos/seed/trend${i}/600/600`} 
                alt="Trend" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
               <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <p className="text-white font-headline font-black text-center px-6 text-sm uppercase tracking-widest">Obra #{i}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ArtworkViewModal 
        isOpen={!!selectedArt} 
        onClose={() => setSelectedArt(null)} 
        artwork={selectedArt} 
      />
    </div>
  );
}
