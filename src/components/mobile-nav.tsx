"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Search, 
  Plus, 
  Bell, 
  User,
  Compass
} from "lucide-react"

const navItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Compass, label: "Explorar", href: "/explore" },
  { icon: Plus, label: "Subir", href: "/upload", isCenter: true },
  { icon: Bell, label: "Avisos", href: "/notifications" },
  { icon: User, label: "Perfil", href: "/profile/me" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <nav className="relative bg-[#FEFDF5]/90 backdrop-blur-xl border-t border-primary/10 floral-geometry-pattern px-4 pb-6 pt-2 h-20">
        <div className="flex items-center justify-around h-full max-w-lg mx-auto relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.isCenter) {
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className="relative -top-8"
                >
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/30 border-[4px] border-[#FEFDF5] transition-transform active:scale-90">
                    <item.icon className="w-6 h-6 text-white stroke-[3px]" />
                  </div>
                </Link>
              );
            }

            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex flex-col items-center gap-1 transition-all relative py-2"
              >
                <item.icon 
                  className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-secondary scale-110' : 'text-muted-foreground stroke-[1.5px]'}`} 
                />
                {isActive && (
                  <div className="w-1 h-1 bg-secondary rounded-full active-indicator mt-1" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  )
}
