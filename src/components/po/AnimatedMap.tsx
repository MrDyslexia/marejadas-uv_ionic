import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  IonIcon,
  IonText,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import {
  playForward,
  playBack,
  expandOutline,
  close,
  chevronBack,
  chevronForward,
} from "ionicons/icons";
import { Waves, Pause, Play, Maximize2 } from "lucide-react";

const TOTAL_FRAMES = 61;

const getImageUrl = (frame: number) =>
  `https://marejadas.uv.cl/images/SAM/pacifico/Campo${frame}.png`;
interface FullscreenProps {
  frames: Record<number, string>;
  initialFrame: number;
  frameRate: number;
  onClose: (lastFrame: number) => void;
}

const FullscreenPlayer: React.FC<FullscreenProps> = ({
  frames,
  initialFrame,
  frameRate,
  onClose,
}) => {
  const imgRefs = useRef<[HTMLImageElement | null, HTMLImageElement | null]>([
    null,
    null,
  ]);
  const activeRef = useRef<0 | 1>(0);
  const currentFrameRef = useRef(initialFrame);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hudTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Solo para lo que el usuario ve en la UI
  const [displayFrame, setDisplayFrame] = useState(initialFrame);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHud, setShowHud] = useState(true);
  const [localFrameRate, setLocalFrameRate] = useState(frameRate);

  // ── Inicializar buffers al montar (una sola vez) ──────────────────────
  useEffect(() => {
    const img0 = imgRefs.current[0];
    const img1 = imgRefs.current[1];
    if (!img0 || !img1) return;

    const currentUrl = frames[initialFrame] || getImageUrl(initialFrame);
    const nextFrame = initialFrame === TOTAL_FRAMES ? 1 : initialFrame + 1;
    const nextUrl = frames[nextFrame] || getImageUrl(nextFrame);

    img0.src = currentUrl;
    img0.style.opacity = "1";
    img1.src = nextUrl;
    img1.style.opacity = "0";
    activeRef.current = 0;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Avanzar frame manipulando DOM directamente (cero re-renders) ──────
  const advanceFrame = useCallback(
    (direction: 1 | -1) => {
      const prev = currentFrameRef.current;
      const next =
        direction === 1
          ? prev === TOTAL_FRAMES
            ? 1
            : prev + 1
          : prev === 1
            ? TOTAL_FRAMES
            : prev - 1;

      const img0 = imgRefs.current[0]!;
      const img1 = imgRefs.current[1]!;
      if (!img0 || !img1) return;

      const active = activeRef.current;
      const inactive: 0 | 1 = active === 0 ? 1 : 0;
      const inactiveImg = inactive === 0 ? img0 : img1;
      const activeImg = active === 0 ? img0 : img1;
      inactiveImg.style.opacity = "1";
      activeImg.style.opacity = "0";
      activeRef.current = inactive;
      const upcoming =
        direction === 1
          ? next === TOTAL_FRAMES
            ? 1
            : next + 1
          : next === 1
            ? TOTAL_FRAMES
            : next - 1;
      activeImg.src = frames[upcoming] || getImageUrl(upcoming);

      currentFrameRef.current = next;
      setDisplayFrame(next);
    },
    [frames],
  );
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => advanceFrame(1), localFrameRate);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, localFrameRate, advanceFrame]);
  const showHudTemporarily = useCallback(() => {
    setShowHud(true);
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    hudTimerRef.current = setTimeout(() => setShowHud(false), 3000);
  }, []);

  const toggleHud = useCallback(() => {
    setShowHud((prev) => {
      if (prev && hudTimerRef.current) clearTimeout(hudTimerRef.current);
      if (!prev) showHudTemporarily();
      return !prev;
    });
  }, [showHudTemporarily]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    onClose(currentFrameRef.current);
  };

  const changeRate = (val: number) => {
    setLocalFrameRate(val);
    showHudTemporarily();
  };

  const hudStyle: React.CSSProperties = {
    opacity: showHud ? 1 : 0,
    pointerEvents: showHud ? "auto" : "none",
    transition: "opacity 0.3s ease",
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <div
        role="button"
        tabIndex={0}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={toggleHud}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleHud();
          }
        }}
      >
        <img
          ref={(el) => {
            imgRefs.current[0] = el;
          }}
          alt=""
          style={{
            position: "absolute",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            userSelect: "none",
            pointerEvents: "none",
            opacity: 0,
          }}
        />
        <img
          ref={(el) => {
            imgRefs.current[1] = el;
          }}
          alt=""
          style={{
            position: "absolute",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            userSelect: "none",
            pointerEvents: "none",
            opacity: 0,
          }}
        />
      </div>
      <div
        style={{
          ...hudStyle,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "max(env(safe-area-inset-top, 0px), 16px)",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 16,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)",
        }}
      >
        <button onClick={handleClose} style={btnCircle}>
          <IonIcon icon={close} style={{ fontSize: 22, color: "#fff" }} />
        </button>
        <span
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          Frame {displayFrame} / {TOTAL_FRAMES}
        </span>
        <div style={{ width: 44 }} />
      </div>
      <div
        style={{
          ...hudStyle,
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 12px",
          zIndex: 10,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            advanceFrame(-1);
            showHudTemporarily();
          }}
          style={btnCircle}
        >
          <IonIcon icon={chevronBack} style={{ fontSize: 24, color: "#fff" }} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            advanceFrame(1);
            showHudTemporarily();
          }}
          style={btnCircle}
        >
          <IonIcon
            icon={chevronForward}
            style={{ fontSize: 24, color: "#fff" }}
          />
        </button>
      </div>
      <div
        style={{
          ...hudStyle,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
          paddingTop: 16,
          paddingLeft: 20,
          paddingRight: 20,
          background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
        }}
      >
        {/* Barra de progreso */}
        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 2,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((displayFrame - 1) / (TOTAL_FRAMES - 1)) * 100}%`,
              background: "#0284c7",
              borderRadius: 2,
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            marginBottom: 16,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              advanceFrame(-1);
              showHudTemporarily();
            }}
            style={{ ...btnCircle, width: 40, height: 40 }}
          >
            <IonIcon icon={playBack} style={{ fontSize: 20, color: "#fff" }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((p) => !p);
              showHudTemporarily();
            }}
            style={{
              ...btnCircle,
              width: 52,
              height: 52,
              background: "#0284c7",
            }}
          >
            {isPlaying ? <Pause color="white" /> : <Play color="white" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              advanceFrame(1);
              showHudTemporarily();
            }}
            style={{ ...btnCircle, width: 40, height: 40 }}
          >
            <IonIcon
              icon={playForward}
              style={{ fontSize: 20, color: "#fff" }}
            />
          </button>
        </div>

        {/* Velocidad */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {(
            [
              ["500", "0.5x"],
              ["200", "1x"],
              ["100", "2x"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={(e) => {
                e.stopPropagation();
                changeRate(Number.parseInt(val));
              }}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                cursor: "pointer",
                background:
                  localFrameRate === Number.parseInt(val)
                    ? "#0284c7"
                    : "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};
const AnimatedMap: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadedFrames, setPreloadedFrames] = useState<
    Record<number, string>
  >({});
  const [frameRate, setFrameRate] = useState(200);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const load = async () => {
      const frames: Record<number, string> = {};
      const batchSize = 5;
      for (
        let batch = 0;
        batch < Math.ceil(TOTAL_FRAMES / batchSize);
        batch++
      ) {
        const promises = Array.from({ length: batchSize }, (_, i) => {
          const n = batch * batchSize + i + 1;
          if (n > TOTAL_FRAMES) return null;
          return new Promise<{ frame: number; url: string }>((resolve) => {
            const url = getImageUrl(n);
            const img = new Image();
            img.onload = img.onerror = () => resolve({ frame: n, url });
            img.src = url;
          });
        }).filter(Boolean) as Promise<{ frame: number; url: string }>[];

        const results = await Promise.all(promises);
        results.forEach(({ frame, url }) => {
          frames[frame] = url;
        });
        setPreloadProgress(
          Math.min(
            100,
            Math.round(((batch + 1) * batchSize * 100) / TOTAL_FRAMES),
          ),
        );
      }
      setPreloadedFrames(frames);
      setIsInitialLoading(false);
    };
    load();
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !isInitialLoading && !isFullscreenOpen) {
      animationRef.current = setInterval(() => {
        setCurrentFrame((p) => (p === TOTAL_FRAMES ? 1 : p + 1));
      }, frameRate);
    } else if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isPlaying, isInitialLoading, frameRate, isFullscreenOpen]);

  const currentImageUrl =
    preloadedFrames[currentFrame] || getImageUrl(currentFrame);

  if (isInitialLoading) {
    return (
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Waves size={22} color="#0284c7" />
          <IonText>
            <h2 style={{ fontSize: 20, fontWeight: "bold", color: "var(--ion-color-dark)", margin: 0, textAlign: "center" }}>
              Mapa Animado
            </h2>
          </IonText>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          backgroundColor: "var(--ion-color-light)",
          borderRadius: 12,
        }}>
          <IonSpinner color="primary" />
          <IonText color="medium">
            <p style={{ margin: "16px 0 8px 0", color: "var(--ion-color-medium)", fontSize: 14 }}>
              Precargando frames: {preloadProgress}%
            </p>
          </IonText>
          <div style={{
            width: "80%",
            height: 8,
            backgroundColor: "var(--ion-color-light-shade)",
            borderRadius: 4,
            marginTop: 12,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${preloadProgress}%`,
              backgroundColor: "var(--ion-color-primary)",
              borderRadius: 4,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        background: "var(--ion-card-background, #fff)",
        animation: "fadeIn 0.5s ease-out",
      }}>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Waves size={22} color="#0284c7" />
            <IonText>
              <h2 style={{ fontSize: 20, fontWeight: "bold", color: "var(--ion-color-dark)", margin: 0, textAlign: "center" }}>
                Mapa Animado
              </h2>
            </IonText>
          </div>

          <div style={{
            position: "relative",
            height: 300,
            backgroundColor: "var(--ion-color-light)",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16,
          }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <button
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 1,
                  background: "rgba(6,182,212,0.95)",
                  border: "none",
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  padding: 12,
                }}
                onClick={() => {
                  setIsPlaying(false);
                  setIsFullscreenOpen(true);
                }}
              >
                <Maximize2 size={20} color="white" />
              </button>
              <img
                src={currentImageUrl}
                alt={`Frame ${currentFrame}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "white",
                  transition: "opacity 0.3s ease",
                }}
              />
            </div>
            <div style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
            }}>
              Frame: {currentFrame}/{TOTAL_FRAMES}
            </div>
          </div>

          <div style={{
            width: "100%",
            height: 6,
            backgroundColor: "var(--ion-color-light-shade)",
            borderRadius: 3,
            margin: "16px 0",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${((currentFrame - 1) / (TOTAL_FRAMES - 1)) * 100}%`,
              backgroundColor: "var(--ion-color-primary)",
              borderRadius: 3,
              transition: "width 0.3s ease",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, margin: "20px 0" }}>
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: "var(--ion-color-primary)",
                WebkitTapHighlightColor: "transparent",
                borderRadius: "50%",
                transition: "background 0.15s ease",
                width: 48,
                height: 48,
                fontSize: 22,
              }}
              onClick={() => setCurrentFrame((p) => (p === 1 ? TOTAL_FRAMES : p - 1))}
            >
              <IonIcon icon={playBack} />
            </button>
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "none",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                width: 56,
                height: 56,
                fontSize: 26,
                background: "var(--ion-color-primary)",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(2,132,199,0.35)",
              }}
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: "var(--ion-color-primary)",
                WebkitTapHighlightColor: "transparent",
                borderRadius: "50%",
                transition: "background 0.15s ease",
                width: 48,
                height: 48,
                fontSize: 22,
              }}
              onClick={() => setCurrentFrame((p) => (p === TOTAL_FRAMES ? 1 : p + 1))}
            >
              <IonIcon icon={playForward} />
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <IonSegment
              key={frameRate}
              value={frameRate.toString()}
              onIonChange={(e) => {
                if (e.detail.value)
                  setFrameRate(Number.parseInt(e.detail.value as string));
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
        </div>
      </div>

      {isFullscreenOpen && (
        <FullscreenPlayer
          frames={preloadedFrames}
          initialFrame={currentFrame}
          frameRate={frameRate}
          onClose={(lastFrame) => {
            setCurrentFrame(lastFrame);
            setIsFullscreenOpen(false);
          }}
        />
      )}
    </>
  );
};

const btnCircle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  flexShrink: 0,
};

export default AnimatedMap;