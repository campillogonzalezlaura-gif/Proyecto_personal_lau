"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  PlusSquare, 
  User, 
  Bell, 
  ShieldCheck, 
  Compass,
  Sparkles
} from "lucide-react"
import { ShootingStarLogo } from "./shooting-star-logo"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Compass, label: "Descubrir", href: "/explore" },
  { icon: Bell, label: "Notificaciones", href: "/notifications" },
  { icon: User, label: "Perfil", href: "/profile/me" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="hidden md:flex bg-[#FEFDF5] border-r border-primary/10 floral-geometry-pattern">
      <SidebarHeader className="py-10 px-8">
        <Link href="/" className="flex items-center gap-4 group">
          <ShootingStarLogo className="w-10 h-10 transition-transform group-hover:scale-110 duration-500" />
          <span className="font-headline text-3xl font-black tracking-tighter text-foreground">
            Novart
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-6">
        <SidebarMenu className="gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  className={`transition-all py-7 rounded-2xl relative overflow-hidden ${isActive ? 'bg-secondary/20 text-secondary' : 'hover:bg-primary/10 text-muted-foreground'}`}
                >
                  <Link href={item.href} className="flex items-center gap-5 px-5">
                    <item.icon className={`w-5 h-5 transition-all ${isActive ? 'text-secondary scale-110' : 'stroke-[1.5px]'}`} />
                    <span className={`text-base font-black uppercase tracking-widest ${isActive ? 'text-secondary' : ''}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full active-indicator" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          
          <SidebarMenuItem className="mt-6">
             <Link href="/upload" className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                <PlusSquare className="w-5 h-5" />
                <span>Publicar</span>
             </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-8">
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-primary/10 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
              Bunker Novart
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            Tus creaciones protegidas con marcas de agua minimalistas.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
