"use client"

import { createContext, useState, ReactNode, useEffect, useRef } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

export const CartContext = createContext<{
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}>({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

export function Providers({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const isInitializedRef = useRef(false)

  // Load cart from localStorage on mount (only once)
  useEffect(() => {
    if (isInitializedRef.current) return
    
    const savedCart = localStorage.getItem('cart')
    console.log('Loading cart from localStorage:', savedCart)
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        console.log('Parsed cart:', parsedCart)
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    
    setIsInitialized(true)
    isInitializedRef.current = true
  }, [])

  // Save cart to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return
    
    console.log('Saving cart to localStorage:', cartItems)
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems, isInitialized])

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    console.log('Adding to cart:', newItem)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        // If item already exists, increase quantity
        const updatedItems = prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        console.log('Updated existing item, new cart:', updatedItems)
        return updatedItems
      } else {
        // If item doesn't exist, add it with quantity 1
        const newItems = [...prevItems, { ...newItem, quantity: 1 }]
        console.log('Added new item, new cart:', newItems)
        return newItems
      }
    })
  }

  const removeFromCart = (id: number) => {
    console.log('Removing from cart:', id)
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    console.log('Updating quantity for item', id, 'to', quantity)
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    console.log('Clearing cart')
    setCartItems([])
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  )
} 