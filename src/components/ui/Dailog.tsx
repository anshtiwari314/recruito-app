import React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
interface DialogProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
  return <>{open && children}</>
}

interface DialogTriggerProps {
  children: React.ReactElement
  asChild?: boolean
  onClick?: () => void
  onOpen?: () => void
}

export const DialogTrigger = ({ children, asChild = false, onClick, onOpen }: DialogTriggerProps) => {
  return React.cloneElement(children, {
    onClick: () => {
      onOpen?.()
      onClick?.()
    },
  })
}

export const DialogContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded-md w-[90%] max-w-md shadow-lg ${className}`}>{children}</div>
    </div>
  )
}

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
)

export const DialogClose = ({ children, asChild = false }: { children: React.ReactElement; asChild?: boolean }) => {
  return children
}


interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

export const DialogHeader = ({ children, className, onClose }: DialogHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close dialog">
          <X size={18} />
        </button>
      )}
    </div>
  )
}