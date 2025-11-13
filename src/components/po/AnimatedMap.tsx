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
} from "@ionic/react";
import {
  play,
  pause,
  playForward,
  playBack,
  expandOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./AnimatedMap.css";

const AnimatedMap: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadedFrames, setPreloadedFrames] = useState<
    Record<number, string>
  >({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [frameRate, setFrameRate] = useState<number>(200);
  const totalFrames = 61;
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();

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
          const nextFrame = prev === totalFrames ? 1 : prev + 1;
          setActiveImageIndex((current) => (current === 0 ? 1 : 0));
          return nextFrame;
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
      const nextFrame = prev === totalFrames ? 1 : prev + 1;
      setActiveImageIndex((current) => (current === 0 ? 1 : 0));
      return nextFrame;
    });
  };

  const goToPrevFrame = () => {
    if (isPlaying) setIsPlaying(false);
    setCurrentFrame((prev) => {
      const nextFrame = prev === 1 ? totalFrames : prev - 1;
      setActiveImageIndex((current) => (current === 0 ? 1 : 0));
      return nextFrame;
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
          const nextFrame = prev === totalFrames ? 1 : prev + 1;
          setActiveImageIndex((current) => (current === 0 ? 1 : 0));
          return nextFrame;
        });
      }, newFrameRate);
    }
  };

  const expandImage = (url: string) => {
    history.push("/img-expand", { expandedImage: url });
  };

  const currentImageUrl = preloadedFrames[currentFrame] || getImageUrl(currentFrame);

  if (isInitialLoading) {
    return (
      <IonCard className="animated-map-container">
        <IonCardContent>
          <IonText>
            <h2 className="section-title">Mapa Animado</h2>
          </IonText>
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
    <IonCard className="animated-map-container">
      <IonCardContent>
        <IonText>
          <h2 className="section-title">Mapa Animado</h2>
        </IonText>
        
        <div className="map-frame-container">
          <div className="image-container">
            <IonButton
              fill="clear"
              className="expand-button"
              onClick={() => expandImage(currentImageUrl)}
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
            onClick={togglePlayPause}
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
            onIonChange={(e) => updateFrameRate(e.detail.value!)}
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
  );
};

export default AnimatedMap;