"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#fffaf6",
          "--normal-text": "#34251e",
          "--normal-border": "#ddcec5",
          "--success-bg": "#e1f4ee",
          "--success-text": "#1f8f84",
          "--success-border": "#bfe8df",
          "--error-bg": "#f9e7e2",
          "--error-text": "#a73524",
          "--error-border": "#f0d7d1",
          "--warning-bg": "#fff3d8",
          "--warning-text": "#9b6418",
          "--warning-border": "#f4dfbd",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast !shadow-[0_18px_42px_rgba(70,37,21,0.16)] !font-bold",
          icon: "!text-current",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
