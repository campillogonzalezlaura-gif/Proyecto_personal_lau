
"use client"

import * as React from "react"
import Image from "next/image"
import { Heart, MessageCircle, Share2, MoreHorizontal, Sparkles } from "lucide-react"
import { Artwork } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ArtworkCardProps {
  artwork: Artwork;
  onOpen?: (artwork: any) => void;
}

export function ArtworkCard({ artwork, onOpen }: ArtworkCardProps) {
  const { toast } = useToast()
  const [liked, setLiked] = React.useState(false);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen({
        title: artwork.title,
        imageUrl: artwork.publicImageUrl,
        authorName: artwork.authorName,
        authorPhoto: artwork.authorPhoto,
        description: artwork.description
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.origin;
    const shareData = {
      title: `Novart: ${artwork.title}`,
      text: `Mira esta increíble obra de ${artwork.authorName} en Novart.`,
      url: shareUrl,
    }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Enlace copiado",
          description: "El enlace a la galería se ha copiado al portapapeles.",
        })
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }

    // Intentar compartir nativamente
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Si el error no es porque el usuario canceló, usamos el portapapeles
        if ((err as any).name !== 'AbortError') {
          await copyToClipboard()
        }
      }
    } else {
      // Fallback si la API no existe
      await copyToClipboard()
    }
  }

  return (
    <Card className="bg-white border-none shadow-[0_8px_30px_rgb(255,201,201,0.12)] hover:shadow-[0_8px_30px_rgb(255,201,201,0.25)] transition-all duration-500 overflow-hidden group rounded-[2rem] masonry-item">
      <CardHeader className="p-4 space-y-0 flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
            <AvatarImage src={artwork.authorPhoto} alt={artwork.authorName} />
            <AvatarFallback>{artwork.authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-headline font-bold text-[11px] hover:text-secondary cursor-pointer transition-colors leading-tight">
              {artwork.authorName}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted rounded-full">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <div 
        className="relative bg-muted/30 cursor-pointer select-none overflow-hidden mx-3 rounded-[1.5rem]"
        onContextMenu={handleContextMenu}
        onClick={handleOpen}
      >
        <Image
          src={artwork.publicImageUrl}
          alt={artwork.title}
          width={600}
          height={800}
          className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
          draggable={false}
        />
        <div className="watermark font-headline">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>Novart: {artwork.authorName}</span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
           <h3 className="text-white font-headline text-xs font-bold truncate">{artwork.title}</h3>
        </div>
      </div>

      <CardFooter className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase transition-all ${liked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
          >
            <Sparkles className={`w-4 h-4 ${liked ? 'fill-current scale-110' : ''}`} />
            <span>{artwork.likes.length + (liked ? 1 : 0)}</span>
          </button>
          <button 
            onClick={handleOpen}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-secondary transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>12</span>
          </button>
        </div>
        <button 
          onClick={handleShare}
          className="text-muted-foreground hover:text-secondary transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </CardFooter>
    </Card>
  )
}
