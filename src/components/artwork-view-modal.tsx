
"use client"

import * as React from "react"
import Image from "next/image"
import { X, Sparkles, Heart, Share2, ShieldCheck, MessageCircle, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  user: string
  avatar: string
  text: string
  time: string
}

interface ArtworkViewModalProps {
  isOpen: boolean
  onClose: () => void
  artwork: {
    title: string
    imageUrl: string
    authorName: string
    authorPhoto?: string
    description?: string
  } | null
}

const MOCK_COMMENTS: Comment[] = [
  { id: "1", user: "Marco Silva", avatar: "https://picsum.photos/seed/artist2/100/100", text: "¡Qué manejo de la luz tan increíble! 😍", time: "2h" },
  { id: "2", user: "Sofia Luna", avatar: "https://picsum.photos/seed/artist3/100/100", text: "Me encanta el concepto minimalista.", time: "5h" },
  { id: "3", user: "Elena Valeri", avatar: "https://picsum.photos/seed/artist1/100/100", text: "Inspirador. ¿Qué herramientas usaste?", time: "1d" },
]

export function ArtworkViewModal({ isOpen, onClose, artwork }: ArtworkViewModalProps) {
  const { toast } = useToast()
  const [comments, setComments] = React.useState<Comment[]>(MOCK_COMMENTS)
  const [newComment, setNewComment] = React.useState("")
  const [isLiked, setIsLiked] = React.useState(false)

  if (!artwork) return null

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: "Tu Usuario",
      avatar: "https://picsum.photos/seed/me/100/100",
      text: newComment,
      time: "Ahora"
    }
    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleShare = async () => {
    const shareUrl = window.location.href;
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
          description: "El enlace a esta obra se ha copiado al portapapeles.",
        })
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          await copyToClipboard()
        }
      }
    } else {
      await copyToClipboard()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] md:h-[80vh] p-0 overflow-hidden bg-background border-none rounded-[2rem] shadow-2xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Lado de la Imagen */}
          <div 
            className="relative flex-[1.5] bg-[#F5F5F0] flex items-center justify-center p-4 overflow-hidden group select-none"
            onContextMenu={handleContextMenu}
          >
            <div className="relative w-full h-full">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain drop-shadow-2xl"
                draggable={false}
                priority
              />
              <div className="watermark font-headline bottom-6 right-6 scale-125">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Protegido por Novart: {artwork.authorName}</span>
              </div>
            </div>
          </div>

          {/* Lado de Detalles y Comentarios */}
          <div className="w-full md:w-[400px] bg-white flex flex-col border-l border-primary/5">
            <div className="p-6 border-b border-primary/5">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/10">
                    <AvatarImage src={artwork.authorPhoto || `https://picsum.photos/seed/${artwork.authorName}/100/100`} />
                    <AvatarFallback>{artwork.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-headline font-black text-sm text-foreground">{artwork.authorName}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Artista Emergente</p>
                  </div>
                </div>
              </div>
              <DialogTitle className="font-headline text-2xl font-black text-foreground tracking-tighter leading-tight mb-2">
                {artwork.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed italic line-clamp-2">
                {artwork.description || "Esta obra es una pieza única del portafolio digital del artista, protegida bajo los estándares de propiedad intelectual de Novart."}
              </p>
            </div>

            {/* Sección de Comentarios */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-6 py-3 bg-secondary/5 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Comentarios ({comments.length})</span>
              </div>
              
              <ScrollArea className="flex-1 px-6">
                <div className="py-4 space-y-6">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3 group">
                      <Avatar className="w-8 h-8 shrink-0 border border-primary/10">
                        <AvatarImage src={c.avatar} />
                        <AvatarFallback>{c.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] font-black text-foreground">{c.user}</span>
                          <span className="text-[9px] text-muted-foreground uppercase">{c.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input de Comentario */}
              <div className="p-4 border-t border-primary/5 bg-background">
                <form onSubmit={handleAddComment} className="relative">
                  <Input 
                    placeholder="Escribe un comentario..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="pr-12 bg-muted/30 border-none rounded-xl text-xs h-11 focus-visible:ring-primary/20"
                  />
                  <Button 
                    type="submit"
                    size="icon" 
                    disabled={!newComment.trim()}
                    className="absolute right-1 top-1 h-9 w-9 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-all active:scale-90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Acciones Finales */}
            <div className="p-6 bg-secondary/5 border-t border-primary/5">
              <div className="flex items-center justify-between gap-3">
                <Button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "flex-1 font-black rounded-xl h-11 shadow-sm transition-all active:scale-95",
                    isLiked ? "bg-accent text-foreground" : "bg-accent/50 hover:bg-accent/80 text-foreground"
                  )}
                >
                  <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                  {isLiked ? "Te gusta" : "Me gusta"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleShare}
                  className="h-11 w-11 rounded-xl border-2 hover:bg-white"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2 justify-center">
                <ShieldCheck className="w-3 h-3 text-secondary" />
                <span className="text-[8px] font-black uppercase tracking-widest text-secondary/60">Propiedad Intelectual Verificada</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
