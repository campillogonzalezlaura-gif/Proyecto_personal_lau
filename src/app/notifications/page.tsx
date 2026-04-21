
"use client"

import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const notifications = [
  {
    id: 1,
    type: "like",
    user: "Sofia Luna",
    avatar: "https://picsum.photos/seed/artist3/100/100",
    content: "le ha dado me gusta a tu obra 'Reflexiones'",
    time: "Hace 5 min"
  },
  {
    id: 2,
    type: "follow",
    user: "Marco Silva",
    avatar: "https://picsum.photos/seed/artist2/100/100",
    content: "ha empezado a seguirte",
    time: "Hace 1 hora"
  },
  {
    id: 3,
    type: "comment",
    user: "Elena Valeri",
    avatar: "https://picsum.photos/seed/artist1/100/100",
    content: "ha comentado: 'Increíble uso del color!'",
    time: "Hace 3 horas"
  }
]

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <header className="flex items-center justify-between mb-12">
        <h1 className="font-headline text-4xl font-black text-foreground tracking-tighter">Notificaciones</h1>
        <button className="text-sm text-emerald-900 font-black uppercase tracking-widest hover:underline transition-all">
          Marcar todas como leídas
        </button>
      </header>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="flex items-center gap-5 p-6 rounded-[2rem] bg-white shadow-sm hover:shadow-md transition-all cursor-pointer border border-primary/5 group"
          >
            <div className="relative">
              <Avatar className="w-14 h-14 border-2 border-background shadow-sm transition-transform group-hover:scale-105">
                <AvatarImage src={notif.avatar} />
                <AvatarFallback>{notif.user[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white border border-primary/10 shadow-sm">
                {notif.type === 'like' && <Heart className="w-4 h-4 text-primary fill-current" />}
                {notif.type === 'follow' && <UserPlus className="w-4 h-4 text-secondary" />}
                {notif.type === 'comment' && <MessageCircle className="w-4 h-4 text-accent" />}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">
                <span className="font-black text-foreground">{notif.user}</span>{" "}
                <span className="text-muted-foreground font-medium">{notif.content}</span>
              </p>
              <p className="text-[10px] text-primary font-black mt-2 uppercase tracking-[0.2em]">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-12 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-primary/20 shadow-inner floral-geometry-pattern">
        <Bell className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
        <p className="text-muted-foreground font-medium italic">No hay más notificaciones por ahora.</p>
      </div>
    </div>
  )
}
