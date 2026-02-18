"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { IonIcon } from "@ionic/react"
import { close, chevronBack, chevronForward } from "ionicons/icons"
import "./ImageViewer.css"

interface ImageViewerProps {
  isOpen: boolean
  images: string[]
  initialIndex: number
  onClose: () => void
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showHud, setShowHud] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const initialPinchDistance = useRef<number | null>(null)
  const initialScale = useRef(1)
  const lastPosition = useRef({ x: 0, y: 0 })
  const isPinching = useRef(false)
  const isPanning = useRef(false)
  const startTouch = useRef({ x: 0, y: 0 })
  const lastTap = useRef(0)

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const showHudTemporarily = useCallback(() => {
    setShowHud(true)
    if (hudTimeoutRef.current) {
      clearTimeout(hudTimeoutRef.current)
    }
    hudTimeoutRef.current = setTimeout(() => setShowHud(false), 3000)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      resetZoom()
      setIsLoading(true)
      showHudTemporarily()
    }
  }, [isOpen, initialIndex, resetZoom, showHudTemporarily])

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const container = containerRef.current

    const getDistance = (touches: TouchList): number => {
      return Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching.current = true
        initialPinchDistance.current = getDistance(e.touches)
        initialScale.current = scale
      } else if (e.touches.length === 1) {
        startTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }

        const now = Date.now()
        if (now - lastTap.current < 300) {
          // Double tap
          if (scale === 1) {
            setScale(2)
            showHudTemporarily()
          } else {
            resetZoom()
          }
        }
        lastTap.current = now
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching.current && e.touches.length === 2 && initialPinchDistance.current) {
        const currentDistance = getDistance(e.touches)
        const scaleFactor = currentDistance / initialPinchDistance.current
        setScale(Math.max(1, Math.min(initialScale.current * scaleFactor, 4)))
      } else if (scale > 1 && e.touches.length === 1) {
        isPanning.current = true
        const deltaX = e.touches[0].clientX - startTouch.current.x
        const deltaY = e.touches[0].clientY - startTouch.current.y

        const maxX = (scale - 1) * (imageRef.current?.width || 0) * 0.5
        const maxY = (scale - 1) * (imageRef.current?.height || 0) * 0.5

        setPosition({
          x: Math.max(-maxX, Math.min(maxX, lastPosition.current.x + deltaX)),
          y: Math.max(-maxY, Math.min(maxY, lastPosition.current.y + deltaY)),
        })
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isPinching.current && e.touches.length < 2) {
        isPinching.current = false
        initialPinchDistance.current = null
      }
      if (e.touches.length === 0) {
        isPanning.current = false
        lastPosition.current = position
      }
    }

    const handleClick = (e: React.MouseEvent) => {
      if (e.target === container) {
        handleClose()
      }
    }

    container.addEventListener("touchstart", handleTouchStart as EventListener)
    container.addEventListener("touchmove", handleTouchMove as EventListener)
    container.addEventListener("touchend", handleTouchEnd as EventListener)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart as EventListener)
      container.removeEventListener("touchmove", handleTouchMove as EventListener)
      container.removeEventListener("touchend", handleTouchEnd as EventListener)
    }
  }, [isOpen, scale, position, resetZoom, showHudTemporarily])

  const handleClose = useCallback(() => {
    console.log("[v0] ImageViewer handleClose triggered")
    resetZoom()
    onClose()
  }, [onClose, resetZoom])

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      resetZoom()
      setIsLoading(true)
      showHudTemporarily()
    }
  }

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
      resetZoom()
      setIsLoading(true)
      showHudTemporarily()
    }
  }

  if (!isOpen) {
    return null
  }

  const currentImage = images[currentIndex] || ""

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          handleClose()
        }
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          paddingTop: `calc(16px + ${getComputedStyle(document.documentElement).getPropertyValue("--ion-safe-area-top") || "0px"})`,
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
          zIndex: 100,
          opacity: showHud ? 1 : 0,
          transform: showHud ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: showHud ? "auto" : "none",
        }}
      >
        <button
          onClick={handleClose}
          type="button"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "22px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#ffffff",
            fontSize: "24px",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
          aria-label="Cerrar"
        >
          <IonIcon icon={close} />
        </button>
        {images.length > 1 && (
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#ffffff",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
        <div style={{ width: "44px" }} />
      </div>

      {/* Image Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          marginTop: "64px",
          marginBottom: images.length > 1 ? "64px" : "0",
        }}
      >
        {isLoading && (
          <div style={{ color: "#ffffff", fontSize: "20px" }}>
            Cargando...
          </div>
        )}
        <img
          ref={imageRef}
          src={currentImage}
          alt={`Imagen ${currentIndex + 1}`}
          onLoad={() => setIsLoading(false)}
          onClick={showHudTemporarily}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isLoading ? "none" : "transform 0.1s ease-out",
            cursor: scale > 1 ? "grab" : "zoom-in",
            userSelect: "none",
          }}
        />
      </div>

      {/* Navigation Arrows - Solo mostrar si hay múltiples imágenes */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 16px",
            pointerEvents: "none",
            zIndex: 100,
            opacity: showHud ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            disabled={currentIndex === 0}
            type="button"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "24px",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ffffff",
              fontSize: "28px",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              pointerEvents: showHud ? "auto" : "none",
              opacity: currentIndex === 0 ? 0.3 : 1,
            }}
            aria-label="Imagen anterior"
          >
            <IonIcon icon={chevronBack} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            disabled={currentIndex === images.length - 1}
            type="button"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "24px",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ffffff",
              fontSize: "28px",
              cursor: currentIndex === images.length - 1 ? "not-allowed" : "pointer",
              pointerEvents: showHud ? "auto" : "none",
              opacity: currentIndex === images.length - 1 ? 0.3 : 1,
            }}
            aria-label="Siguiente imagen"
          >
            <IonIcon icon={chevronForward} />
          </button>
        </div>
      )}

      {/* Dots Indicator - Solo mostrar si hay múltiples imágenes */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            zIndex: 100,
            opacity: showHud ? 1 : 0,
            transform: showHud ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: showHud ? "auto" : "none",
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
                resetZoom()
                setIsLoading(true)
                showHudTemporarily()
              }}
              type="button"
              style={{
                width: index === currentIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: index === currentIndex ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "background-color 0.2s ease, width 0.2s ease",
              }}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageViewer
