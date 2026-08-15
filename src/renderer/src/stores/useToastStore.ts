import { create } from 'zustand'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface Toast {
  id: string
  type: ToastType
  message: string
  createdAt: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now().toString() + Math.random().toString()
    set((state) => {
      const newToasts = [...state.toasts, { id, type, message, createdAt: Date.now() }]
      if (newToasts.length > 5) {
        newToasts.shift()
      }
      return { toasts: newToasts }
    })

    let timeout = 3000
    if (type === 'warning') timeout = 5000
    else if (type === 'error') timeout = 8000

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, timeout)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}))
