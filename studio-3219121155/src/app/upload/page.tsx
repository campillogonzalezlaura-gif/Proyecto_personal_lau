
"use client"

import * as React from "react"
import { Upload, ShieldCheck, FileImage, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [uploading, setUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    tags: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Inicia sesión",
        description: "Debes estar identificado para subir obras.",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Falta el archivo",
        description: "Por favor, selecciona una obra para subir.",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Falta información",
        description: "Por favor, añade un título a tu obra.",
      });
      return;
    }

    setUploading(true);
    
    // En un entorno de producción, aquí subiríamos la imagen a Firebase Storage.
    // Para este MVP, simulamos la URL con una imagen de Picsum basada en el timestamp.
    const mockImageUrl = `https://picsum.photos/seed/${Date.now()}/800/1000`;
    
    const artworkData = {
      authorId: user.uid,
      authorName: user.displayName || "Artista Novart",
      authorPhoto: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      likedByUsersIds: [],
      publicWatermarkedUrl: mockImageUrl,
      privateOriginalUrl: mockImageUrl, 
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const artworksRef = collection(db, "artworks");
      addDocumentNonBlocking(artworksRef, artworkData);
      
      toast({
        title: "Obra publicada con éxito",
        description: "Se ha aplicado la marca de agua digital Novart a tu obra.",
      });
      
      router.push("/");
    } catch (error) {
      console.error("Error al subir:", error);
      toast({
        variant: "destructive",
        title: "Error al publicar",
        description: "No se pudo guardar la obra en la base de datos.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <header className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-black text-foreground mb-3 tracking-tighter">Publicar Obra</h1>
        <p className="text-muted-foreground font-medium">Tu propiedad intelectual es nuestra prioridad número uno.</p>
      </header>

      <form onSubmit={handleUpload} className="space-y-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-2 block">Archivo de la obra</Label>
          
          <div 
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer group shadow-sm ${
              selectedFile 
                ? 'bg-secondary/5 border-secondary/40' 
                : 'bg-white/50 border-primary/10 hover:bg-white hover:border-primary/30'
            }`}
          >
            <div className={`p-5 rounded-full transition-colors ${selectedFile ? 'bg-secondary/20' : 'bg-primary/10 group-hover:bg-primary/20'}`}>
              {selectedFile ? (
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-lg font-black text-foreground flex items-center justify-center gap-2">
                  <FileImage className="w-5 h-5 text-secondary" />
                  {selectedFile.name}
                </p>
                <p className="text-xs text-secondary font-black uppercase tracking-widest">¡Archivo listo!</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-black text-foreground">Haz clic para subir o arrastra un archivo</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG o TIFF hasta 50MB</p>
              </div>
            )}
            
            <Input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="flex items-start gap-4 p-6 bg-secondary/10 border border-secondary/20 rounded-[2rem] shadow-sm">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              <span className="text-emerald-900 font-black uppercase tracking-tight">Protocolo Bunker Novart:</span> Al subir tu obra, generaremos una copia protegida con marca de agua digital indeleble para la vista pública. Tu original se guardará de forma segura en nuestro servidor privado cifrado.
            </p>
          </div>
        </div>

        <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Título de la obra</Label>
            <Input 
              id="title" 
              placeholder="Ej: Fragmentos de Realidad" 
              className="bg-muted/30 border-none rounded-2xl h-14 text-foreground font-bold px-6 focus-visible:ring-primary/20" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Descripción</Label>
            <Textarea 
              id="description" 
              placeholder="Cuéntanos la historia detrás de esta pieza..." 
              className="bg-muted/30 border-none rounded-2xl min-h-[140px] text-foreground font-medium p-6 focus-visible:ring-primary/20 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Etiquetas (separadas por comas)</Label>
            <Input 
              id="tags" 
              placeholder="abstracto, digital, oleo, surrealismo" 
              className="bg-muted/30 border-none rounded-2xl h-14 text-foreground font-medium px-6 focus-visible:ring-primary/20"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={uploading || !selectedFile}
          className="w-full h-16 text-sm font-headline font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          {uploading ? "Procesando Marca de Agua..." : "Publicar y Proteger"}
        </Button>
      </form>
    </div>
  );
}
