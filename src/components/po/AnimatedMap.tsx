import React, { useState, useEffect, useRef } from "react";
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonPage,
  IonContent,
} from "@ionic/react";
import {
  play,
  pause,
  playForward,
  playBack,
  expandOutline,
  close,
  chevronBack,
  chevronForward,
} from "ionicons/icons";
import { Waves } from "lucide-react";
import "./AnimatedMap.css";

const AnimatedMap: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadedFrames, setPreloadedFrames] = useState<
    Record<number, string>
  >({});
  const [frameRate, setFrameRate] = useState<number>(200);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenIsPlaying, setFullscreenIsPlaying] = useState(false);
  const [fullscreenShowHud, setFullscreenShowHud] = useState(true);
  const totalFrames = 61;
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenHudTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  // Función para generar la URL de la imagen
  const getImageUrl = (frame: number) => {
    return `https://marejadas.uv.cl/images/SAM/pacifico/Campo${frame}.png`;
  };

  // Precargar imágenes
  useEffect(() => {
    const preloadImages = async () => {
      setIsInitialLoading(true);
      const frames: Record<number, string> = {};

      // Precargar imágenes en grupos
      const batchSize = 5;
      for (let batch = 0; batch < Math.ceil(totalFrames / batchSize); batch++) {
        const batchPromises = [];

        for (let i = 0; i < batchSize; i++) {
          const frameNumber = batch * batchSize + i + 1;
          if (frameNumber <= totalFrames) {
            batchPromises.push(preloadSingleImage(frameNumber));
          }
        }

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach((result, index) => {
          if (result) {
            const frameNumber = batch * batchSize + index + 1;
            frames[frameNumber] = result;
          }
        });

        setPreloadProgress(
          Math.min(
            100,
            Math.round(((batch + 1) * batchSize * 100) / totalFrames)
          )
        );
      }

      setPreloadedFrames(frames);
      setIsInitialLoading(false);
    };

    const preloadSingleImage = async (frameNumber: number): Promise<string> => {
      try {
        // En esta versión web, simplemente precargamos la imagen
        return getImageUrl(frameNumber);
      } catch (error) {
        console.error(`Error preloading frame ${frameNumber}:`, error);
        return getImageUrl(frameNumber);
      }
    };

    preloadImages();

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Control de animación
  useEffect(() => {
    if (isPlaying && !isInitialLoading) {
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          return prev === totalFrames ? 1 : prev + 1;
        });
      }, frameRate);
    } else if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, isInitialLoading, frameRate]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToNextFrame = () => {
    if (isPlaying) setIsPlaying(false);
    setCurrentFrame((prev) => {
      return prev === totalFrames ? 1 : prev + 1;
    });
  };

  const goToPrevFrame = () => {
    if (isPlaying) setIsPlaying(false);
    setCurrentFrame((prev) => {
      return prev === 1 ? totalFrames : prev - 1;
    });
  };

  const updateFrameRate = (value: string | number | undefined) => {
    if (!value) return;
    const newFrameRate = typeof value === 'string' ? Number.parseInt(value) : value;
    setFrameRate(newFrameRate);

    if (isPlaying) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }

      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          return prev === totalFrames ? 1 : prev + 1;
        });
      }, newFrameRate);
    }
  };

  const expandImage = () => {
    setIsFullscreenOpen(true);
    setFullscreenIsPlaying(false);
    setFullscreenShowHud(true);
    showFullscreenHudTemporarily();
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
    if (fullscreenAnimationRef.current) {
      clearInterval(fullscreenAnimationRef.current);
    }
    if (fullscreenHudTimeoutRef.current) {
      clearTimeout(fullscreenHudTimeoutRef.current);
    }
    setFullscreenIsPlaying(false);
  };

  const showFullscreenHudTemporarily = () => {
    setFullscreenShowHud(true);
    if (fullscreenHudTimeoutRef.current) {
      clearTimeout(fullscreenHudTimeoutRef.current);
    }
    fullscreenHudTimeoutRef.current = setTimeout(() => {
      setFullscreenShowHud(false);
    }, 3000);
  };

  const toggleFullscreenHud = () => {
    if (fullscreenShowHud) {
      setFullscreenShowHud(false);
      if (fullscreenHudTimeoutRef.current) {
        clearTimeout(fullscreenHudTimeoutRef.current);
      }
    } else {
      showFullscreenHudTemporarily();
    }
  };

  // Control de animación fullscreen
  useEffect(() => {
    if (!isFullscreenOpen) return;

    if (fullscreenIsPlaying) {
      fullscreenAnimationRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          return prev === totalFrames ? 1 : prev + 1;
        });
      }, frameRate);
    } else if (fullscreenAnimationRef.current) {
      clearInterval(fullscreenAnimationRef.current);
    }

    return () => {
      if (fullscreenAnimationRef.current) {
        clearInterval(fullscreenAnimationRef.current);
      }
    };
  }, [fullscreenIsPlaying, isFullscreenOpen, frameRate]);

  const currentImageUrl = preloadedFrames[currentFrame] || getImageUrl(currentFrame);

  if (isInitialLoading) {
    return (
      <IonCard className="animated-map-container">
        <IonCardContent>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Waves size={22} color="#0284c7" />
            <IonText>
              <h2 className="section-title" style={{ margin: "0" }}>Mapa Animado</h2>
            </IonText>
          </div>
          <div className="loader-container">
            <IonSpinner color="primary" />
            <IonText color="medium">
              <p>Precargando frames: {preloadProgress}%</p>
            </IonText>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${preloadProgress}%` }}
              />
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <>
      <IonCard className="animated-map-container">
        <IonCardContent>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Waves size={22} color="#0284c7" />
            <IonText>
              <h2 className="section-title" style={{ margin: "0" }}>Mapa Animado</h2>
            </IonText>
          </div>
          
          <div className="map-frame-container">
            <div className="image-container">
              <IonButton
                fill="clear"
                className="expand-button"
                onClick={expandImage}
              >
                <IonIcon icon={expandOutline} slot="icon-only" />
              </IonButton>
              <img
                src={currentImageUrl}
                alt={`Frame ${currentFrame}`}
                className="map-frame"
              />
            </div>
            <div className="frame-counter">
              Frame: {currentFrame}/{totalFrames}
            </div>
          </div>

          <div className="slider-track">
            <div
              className="slider-fill"
              style={{ width: `${((currentFrame - 1) / (totalFrames - 1)) * 100}%` }}
            />
          </div>

          <div className="controls-container">
            <IonButton
              fill="clear"
              className="control-button"
              onClick={goToPrevFrame}
            >
              <IonIcon icon={playBack} slot="icon-only" />
            </IonButton>

            <IonButton
              className="play-pause-button"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <IonIcon icon={isPlaying ? pause : play} slot="icon-only" />
            </IonButton>

            <IonButton
              fill="clear"
              className="control-button"
              onClick={goToNextFrame}
            >
              <IonIcon icon={playForward} slot="icon-only" />
            </IonButton>
          </div>

          <div className="speed-control-container">
            <IonSegment
              value={frameRate.toString()}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (value !== undefined) {
                  updateFrameRate(value);
                }
              }}
            >
              <IonSegmentButton value="500">
                <IonLabel>0.5x</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="200">
                <IonLabel>1x</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="100">
                <IonLabel>2x</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Fullscreen Modal */}
      <IonModal
        isOpen={isFullscreenOpen}
        onDidDismiss={closeFullscreen}
        backdropDismiss={true}
        showBackdrop={true}
      >
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
                  paddingTop: "calc(16px + var(--ion-safe-area-top, 0px))",
                  background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
                  zIndex: 100,
                  opacity: fullscreenShowHud ? 1 : 0,
                  transform: fullscreenShowHud ? "translateY(0)" : "translateY(-20px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  pointerEvents: fullscreenShowHud ? "auto" : "none",
                }}
              >
                <button
                  onClick={closeFullscreen}
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
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#ffffff",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Frame: {currentFrame}/{totalFrames}
                </div>
                <div style={{ width: "44px" }} />
              </div>

              {/* Image Container */}
              <div
                ref={fullscreenContainerRef}
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
                onClick={toggleFullscreenHud}
              >
                <img
                  src={preloadedFrames[currentFrame] || getImageUrl(currentFrame)}
                  alt={`Frame ${currentFrame}`}
                  style={{
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
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
                  opacity: fullscreenShowHud ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentFrame > 1) {
                      setCurrentFrame(currentFrame - 1);
                      showFullscreenHudTemporarily();
                    }
                  }}
                  disabled={currentFrame === 1}
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
                    cursor: currentFrame === 1 ? "not-allowed" : "pointer",
                    pointerEvents: fullscreenShowHud ? "auto" : "none",
                    opacity: currentFrame === 1 ? 0.3 : 1,
                  }}
                  aria-label="Frame anterior"
                >
                  <IonIcon icon={chevronBack} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentFrame < totalFrames) {
                      setCurrentFrame(currentFrame + 1);
                      showFullscreenHudTemporarily();
                    }
                  }}
                  disabled={currentFrame === totalFrames}
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
                    cursor: currentFrame === totalFrames ? "not-allowed" : "pointer",
                    pointerEvents: fullscreenShowHud ? "auto" : "none",
                    opacity: currentFrame === totalFrames ? 0.3 : 1,
                  }}
                  aria-label="Siguiente frame"
                >
                  <IonIcon icon={chevronForward} />
                </button>
              </div>

              {/* Footer Controls */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "16px",
                  paddingBottom: "calc(16px + var(--ion-safe-area-bottom, 0px))",
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
                  zIndex: 100,
                  opacity: fullscreenShowHud ? 1 : 0,
                  transform: fullscreenShowHud ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  pointerEvents: fullscreenShowHud ? "auto" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentFrame > 1) {
                        setCurrentFrame(currentFrame - 1);
                        showFullscreenHudTemporarily();
                      }
                    }}
                    disabled={currentFrame === 1}
                    type="button"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      cursor: currentFrame === 1 ? "not-allowed" : "pointer",
                      opacity: currentFrame === 1 ? 0.3 : 1,
                    }}
                  >
                    <IonIcon icon={playBack} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenIsPlaying(!fullscreenIsPlaying);
                      showFullscreenHudTemporarily();
                    }}
                    type="button"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "20px",
                      background: "#0284c7",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <IonIcon icon={fullscreenIsPlaying ? pause : play} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentFrame < totalFrames) {
                        setCurrentFrame(currentFrame + 1);
                        showFullscreenHudTemporarily();
                      }
                    }}
                    disabled={currentFrame === totalFrames}
                    type="button"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      cursor: currentFrame === totalFrames ? "not-allowed" : "pointer",
                      opacity: currentFrame === totalFrames ? 0.3 : 1,
                    }}
                  >
                    <IonIcon icon={playForward} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFrameRate("500");
                      showFullscreenHudTemporarily();
                    }}
                    type="button"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: frameRate === 500 ? "#0284c7" : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    0.5x
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFrameRate("200");
                      showFullscreenHudTemporarily();
                    }}
                    type="button"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: frameRate === 200 ? "#0284c7" : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    1x
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFrameRate("100");
                      showFullscreenHudTemporarily();
                    }}
                    type="button"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: frameRate === 100 ? "#0284c7" : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    2x
                  </button>
                </div>
              </div>
            </div>
          </IonContent>
        </IonPage>
      </IonModal>
    </>
  );
};

export default AnimatedMap;
