"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { IonModal, IonContent, IonIcon, IonSpinner, IonPage } from "@ionic/react"
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
  const hideHudTimeout = useRef<NodeJS.Timeout | null>(null)

  const initialPinchDistance = useRef<number | null>(null)
  const initialScale = useRef(1)
  const lastPosition = useRef({ x: 0, y: 0 })
  const isPinching = useRef(false)
  const isPanning = useRef(false)
  const startTouch = useRef({ x: 0, y: 0 })
  const lastTap = useRef(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      resetZoom()
      setIsLoading(true)
      showHudTemporarily()
    }
  }, [isOpen, initialIndex])

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const container = containerRef.current

    const getDistance = (touches: TouchList): number => {
      return Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        e.preventDefault()
        isPinching.current = true
        isPanning.current = false
        initialPinchDistance.current = getDistance(e.touches)
        initialScale.current = scale
      } else if (e.touches.length === 1) {
        // Pan start o tap
        const now = Date.now()
        const touch = e.touches[0]

        // Detectar doble tap
        if (now - lastTap.current < 300) {
          handleDoubleTap()
          lastTap.current = 0
          return
        }
        lastTap.current = now

        if (scale > 1) {
          isPanning.current = true
          startTouch.current = { x: touch.clientX, y: touch.clientY }
          lastPosition.current = { ...position }
        } else {
          // Guardar inicio para detectar swipe
          startTouch.current = { x: touch.clientX, y: touch.clientY }
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinching.current && initialPinchDistance.current !== null) {
        // Pinch move - zoom
        e.preventDefault()
        const currentDistance = getDistance(e.touches)
        const scaleChange = currentDistance / initialPinchDistance.current
        const newScale = Math.max(1, Math.min(5, initialScale.current * scaleChange))
        setScale(newScale)
      } else if (e.touches.length === 1 && isPanning.current && scale > 1) {
        // Pan move - mover imagen
        e.preventDefault()
        const touch = e.touches[0]
        const deltaX = touch.clientX - startTouch.current.x
        const deltaY = touch.clientY - startTouch.current.y
        setPosition({
          x: lastPosition.current.x + deltaX,
          y: lastPosition.current.y + deltaY,
        })
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isPinching.current) {
        // Pinch end
        isPinching.current = false
        initialPinchDistance.current = null

        // Si el scale es menor a 1.1, resetear a 1
        setScale((prev) => {
          if (prev < 1.1) {
            setPosition({ x: 0, y: 0 })
            lastPosition.current = { x: 0, y: 0 }
            return 1
          }
          return prev
        })
      } else if (isPanning.current) {
        // Pan end
        isPanning.current = false
        lastPosition.current = { ...position }
      } else if (e.changedTouches.length === 1 && scale === 1) {
        // Swipe detection para navegación
        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - startTouch.current.x
        const deltaY = touch.clientY - startTouch.current.y

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0 && currentIndex > 0) {
            goToPrevious()
          } else if (deltaX < 0 && currentIndex < images.length - 1) {
            goToNext()
          }
        }
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isOpen, scale, position, currentIndex, images.length])

  const showHudTemporarily = useCallback(() => {
    setShowHud(true)
    if (hideHudTimeout.current) {
      clearTimeout(hideHudTimeout.current)
    }
    hideHudTimeout.current = setTimeout(() => {
      setShowHud(false)
    }, 3000)
  }, [])

  const toggleHud = () => {
    if (showHud) {
      setShowHud(false)
      if (hideHudTimeout.current) {
        clearTimeout(hideHudTimeout.current)
      }
    } else {
      showHudTemporarily()
    }
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    initialScale.current = 1
    lastPosition.current = { x: 0, y: 0 }
  }

  const zoomIn = () => {
    const newScale = Math.min(5, scale + 0.5)
    setScale(newScale)
    showHudTemporarily()
  }

  const zoomOut = () => {
    const newScale = Math.max(1, scale - 0.5)
    setScale(newScale)
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 })
      lastPosition.current = { x: 0, y: 0 }
    }
    showHudTemporarily()
  }

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
      resetZoom()
      setIsLoading(true)
      showHudTemporarily()
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      resetZoom()
      setIsLoading(true)
      showHudTemporarily()
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
  }

  const handleClose = () => {
    console.log("[v0] handleClose called")
    resetZoom()
    onClose()
    console.log("[v0] onClose executed")
  }

  const handleDoubleTap = () => {
    if (scale > 1) {
      resetZoom()
    } else {
      setScale(2.5)
      initialScale.current = 2.5
    }
    showHudTemporarily()
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose} backdropDismiss={false} showBackdrop={true}>
      <IonPage>
        <IonContent scrollY={false} fullscreen style={{ "--background": "#000000" } as React.CSSProperties}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#000000",
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                paddingTop: "calc(16px + var(--ion-safe-area-top, 0px))",
                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
                zIndex: 100,
                opacity: showHud ? 1 : 0,
                transform: showHud ? "translateY(0)" : "translateY(-20px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                pointerEvents: showHud ? "auto" : "none",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("[v0] Close button clicked")
                  handleClose()
                }}
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
              >
                <IonIcon icon={close} />
              </button>
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
              {/* Spacer to balance the layout */}
              <div style={{ width: "44px" }} />
            </div>

            {/* Image Container */}
            <div
              ref={containerRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                touchAction: "none",
              }}
              onClick={toggleHud}
            >
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 50,
                  }}
                >
                  <IonSpinner color="light" />
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  willChange: "transform",
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isPinching.current || isPanning.current ? "none" : "transform 0.2s ease",
                }}
              >
                <img
                  src={images[currentIndex] || "/placeholder.svg"}
                  alt={`Imagen ${currentIndex + 1}`}
                  style={{
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  draggable={false}
                />
              </div>
            </div>

            {/* Navigation Arrows */}
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
              >
                <IonIcon icon={chevronForward} />
              </button>
            </div>

            {/* Dots Indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "calc(32px + var(--ion-safe-area-bottom, 0px))",
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
                />
              ))}
            </div>
          </div>
        </IonContent>
      </IonPage>
    </IonModal>
  )
}

export default ImageViewer
