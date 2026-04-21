"use client"

import React from 'react';

export function ShootingStarLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className="relative inline-block">
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
      >
        {/* Estrella de 4 puntas minimalista - Dorado Metálico */}
        <path 
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
          fill="#D4AF37" 
        />
        {/* Estela dinámica hacia arriba */}
        <path 
          d="M6 18L3 21" 
          stroke="#D4AF37" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.6"
        />
      </svg>
      {/* Tres estrellas diminutas estáticas rodeando */}
      <div className="absolute -top-1 -right-1 w-1 h-1 bg-[#E3C771] rounded-full animate-pulse" />
      <div className="absolute top-2 -left-2 w-0.5 h-0.5 bg-[#E3C771] rounded-full opacity-60" />
      <div className="absolute -bottom-1 left-3 w-1 h-1 bg-[#E3C771] rounded-full opacity-40" />
    </div>
  );
}
