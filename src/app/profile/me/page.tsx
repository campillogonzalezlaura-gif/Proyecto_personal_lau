
"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, Share2, Grid, Bookmark, Camera, Loader2, Mail, AtSign } from "lucide-react"
import Image from "next/image"
import { ArtworkViewModal } from "@/components/artwork-view-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase"
import { collection, query, where, orderBy, doc, serverTimestamp } from "firebase/firestore"

export default function MyProfilePage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const profilePhotoInputRef = React.useRef<HTMLInputElement>(null)
  
  const [selectedArt, setSelectedArt] = React.useState<{
    title: string
    imageUrl: string
    authorName: string
    authorPhoto: string
    description?: string
  } | null>(null)

  // Perfil dinámico (estado local para el formulario y fallback)
  const [profile, setProfile] = React.useState({
    name: "Tu Nombre Artístico",
    username: "tuusuario",
    email: "artista@novart.com",
    photo: "https://picsum.photos/seed/me/400/400",
    bio: "Artista visual experimentando con la luz y las texturas digitales. Cada pincelada es una historia de propiedad protegida en Novart."
  })

  // Referencia al documento de perfil en Firestore
  const profileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  // Obtener datos del perfil desde Firestore
  const { data: remoteProfile, isLoading: isProfileLoading } = useDoc(profileRef);

  // Sincronizar estado local con Firestore o Auth
  React.useEffect(() => {
    if (remoteProfile) {
      setProfile({
        name: remoteProfile.artistName || "Tu Nombre Artístico",
        username: user?.email?.split('@')[0] || "usuario",
        email: user?.email || "artista@novart.com",
        photo: remoteProfile.profilePhotoUrl || "https://picsum.photos/seed/me/400/400",
        bio: remoteProfile.biography || "¡Bienvenido a mi portafolio en Novart!"
      });
    } else if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        photo: user.photoURL || prev.photo,
        username: user.email?.split('@')[0] || prev.username,
        email: user.email || prev.email
      }));
    }
  }, [remoteProfile, user]);

  // Obtener obras del usuario de Firestore
  const myArtworksQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, "artworks"),
      where("authorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [db, user]);

  const { data: myArtworks, isLoading: isArtLoading } = useCollection(myArtworksQuery);

  // Estado para el modal de edición
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [editValues, setEditValues] = React.useState({ ...profile })

  const handleSaveProfile = () => {
    if (!user || !profileRef) return;

    const profileData = {
      id: user.uid,
      artistName: editValues.name,
      profilePhotoUrl: editValues.photo,
      biography: editValues.bio,
      followersCount: remoteProfile?.followersCount || 0,
      followingCount: remoteProfile?.followingCount || 0,
      createdAt: remoteProfile?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Guardar en Firestore (persistente)
    setDocumentNonBlocking(profileRef, profileData, { merge: true });
    
    setIsEditOpen(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios se han guardado con éxito en la base de datos de Novart.",
    });
  }

  const handleProfilePhotoClick = () => {
    profilePhotoInputRef.current?.click();
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulación de carga: En producción usaríamos Firebase Storage
      const mockUrl = `https://picsum.photos/seed/${Date.now()}/400/400`;
      setEditValues(prev => ({ ...prev, photo: mockUrl }));
      toast({
        title: "Imagen seleccionada",
        description: "Se ha cargado una vista previa de tu nueva foto de perfil.",
      });
    }
  }

  const handleShareProfile = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `Portafolio de ${profile.name}`,
      text: `Descubre mis últimas creaciones en Novart.`,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Enlace copiado al portapapeles" })
      }
    } catch (err) {
      if ((err as any).name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Enlace copiado al portapapeles" })
      }
    }
  }

  const openEditModal = () => {
    setEditValues({ ...profile })
    setIsEditOpen(true)
  }

  if (isProfileLoading && !profile.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium italic">Sincronizando Bunker Novart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-20">
        <div className="relative group">
          <Avatar className="w-48 h-48 border-[6px] border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <AvatarImage src={profile.photo} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <button 
            onClick={openEditModal}
            className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl shadow-lg border-4 border-white hover:scale-110 active:scale-95 transition-transform"
          >
            <Paintbrush className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-5xl font-black text-foreground tracking-tighter mb-1">{profile.name}</h1>
              <p className="text-primary font-black uppercase text-xs tracking-[0.3em]">@{profile.username}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={openEditModal}
                className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-8 py-6 h-auto shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Editar Perfil
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShareProfile}
                className="rounded-xl w-14 h-14 border-2 hover:bg-muted"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-12 border-y border-border py-8">
            <div className="text-center group cursor-pointer">
              <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                {myArtworks?.length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Obras</p>
            </div>
            <div className="text-center group cursor-pointer">
              <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                {remoteProfile?.followersCount || 0}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Seguidores</p>
            </div>
            <div className="text-center group cursor-pointer">
              <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                {remoteProfile?.followingCount || 0}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Siguiendo</p>
            </div>
          </div>

          <p className="text-muted-foreground max-w-xl mx-auto md:mx-0 font-medium leading-relaxed italic">
            "{profile.bio}"
          </p>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1.5 rounded-2xl mb-12 max-w-md mx-auto border-none">
          <TabsTrigger value="grid" className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] py-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm border-none transition-all">
            <Grid className="w-4 h-4" />
            Galería
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] py-4 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm border-none transition-all">
            <Bookmark className="w-4 h-4" />
            Guardados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          {isArtLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium italic">Cargando tu portafolio...</p>
            </div>
          ) : myArtworks && myArtworks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {myArtworks.map((art) => (
                <div 
                  key={art.id} 
                  onClick={() => setSelectedArt({
                    title: art.title,
                    imageUrl: art.publicWatermarkedUrl,
                    authorName: profile.name,
                    authorPhoto: profile.photo,
                    description: art.description
                  })}
                  className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm border-none bg-white transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <Image 
                    src={art.publicWatermarkedUrl} 
                    alt={art.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-8 backdrop-blur-[2px]">
                    <p className="text-white font-headline font-black text-xl mb-2 uppercase tracking-tight">{art.title}</p>
                    <div className="flex gap-4 text-white/90 text-[10px] font-black uppercase tracking-widest">
                      <span>{art.likedByUsersIds?.length || 0} Me gusta</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-primary/20 shadow-inner">
               <Paintbrush className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
               <p className="text-muted-foreground font-bold italic">Aún no has publicado ninguna obra.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="text-center py-32 bg-white/50 rounded-[3rem] border-2 border-dashed border-muted shadow-inner">
          <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
          <p className="text-muted-foreground font-bold italic">Tu colección privada está vacía.</p>
        </TabsContent>
      </Tabs>

      <ArtworkViewModal 
        isOpen={!!selectedArt} 
        onClose={() => setSelectedArt(null)} 
        artwork={selectedArt} 
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl bg-background overflow-hidden p-0">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="font-headline text-3xl font-black text-foreground tracking-tighter">Editar tu Perfil</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">Actualiza tu identidad artística. Los cambios se guardarán en tu cuenta.</DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col items-center gap-4">
              <div 
                className="relative group cursor-pointer"
                onClick={handleProfilePhotoClick}
              >
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                  <AvatarImage src={editValues.photo} />
                  <AvatarFallback>{editValues.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={profilePhotoInputRef}
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="photo" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">URL de la Foto</Label>
                <Input 
                  id="photo" 
                  value={editValues.photo}
                  onChange={(e) => setEditValues({...editValues, photo: e.target.value})}
                  className="bg-white/50 border-primary/10 rounded-xl h-12"
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nombre Artístico</Label>
                <Input 
                  id="name" 
                  value={editValues.name}
                  onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                  className="bg-white/50 border-primary/10 rounded-xl h-12 text-lg font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nombre de Usuario (@)</Label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    value={editValues.username}
                    onChange={(e) => setEditValues({...editValues, username: e.target.value})}
                    className="bg-white/50 border-primary/10 rounded-xl h-12 pl-12 font-bold"
                    placeholder="usuario"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Correo para Notificaciones</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    value={editValues.email}
                    onChange={(e) => setEditValues({...editValues, email: e.target.value})}
                    className="bg-white/50 border-primary/10 rounded-xl h-12 pl-12 font-medium"
                    placeholder="tu@correo.com"
                    disabled
                  />
                </div>
                <p className="text-[9px] text-muted-foreground italic px-2">El correo está vinculado a tu cuenta de acceso.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Biografía</Label>
                <Textarea 
                  id="bio" 
                  value={editValues.bio}
                  onChange={(e) => setEditValues({...editValues, bio: e.target.value})}
                  className="bg-white/50 border-primary/10 rounded-xl min-h-[100px] leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/30 border-t border-primary/5 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsEditOpen(false)}
              className="font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveProfile}
              className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl px-10 shadow-lg shadow-primary/20 transition-all active:scale-95 flex-1"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
