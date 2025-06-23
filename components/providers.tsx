"use client"

import { createContext, useState, ReactNode } from "react"

export const CartContext = createContext<{
  cartCount: number;
  setCartCount: (count: number | ((prev: number) => number)) => void;
}>({
  cartCount: 0,
  setCartCount: () => {},
})

export function Providers({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0)

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  )
} 