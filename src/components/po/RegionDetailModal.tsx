import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { ChevronLeft, Maximize2 } from "lucide-react";
import type { Region } from "../../types/type";
import ImageViewer from "../ui/ImageViewer";

interface RegionDetailModalProps {
  isOpen: boolean;
  region: Region | null;
  onClose: () => void;
}

const RegionDetailModal: React.FC<RegionDetailModalProps> = ({
  isOpen,
  region,
  onClose,
}) => {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!region) return null;

  const attributeNames = {
    categoria: "Categoría",
    altura: "Altura",
    periodo: "Periodo",
    direccion: "Dirección",
    espectro: "Espectro",
  };

  type AttributeKey = keyof typeof attributeNames;

  const expandImage = (image: string) => {
    // Recopilar todas las imágenes para permitir navegación entre ellas
    const allImages = (Object.keys(attributeNames) as AttributeKey[]).map(
      (key) => region.datosPronostico[key]
    );
    const index = allImages.indexOf(image);

    setCurrentImages(allImages);
    setCurrentImageIndex(Math.max(index, 0));
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setTimeout(() => {
      setCurrentImages([]);
      setCurrentImageIndex(0);
    }, 300);
  };

  const handleModalDismiss = () => {
    if (imageViewerOpen) return;
    onClose();
  };

  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={handleModalDismiss}
        canDismiss={!imageViewerOpen}
        style={
          {
            "--background": "#ffffff",
            "--width": "100%",
            "--height": "100%",
          } as React.CSSProperties
        }
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonButton onClick={onClose}>
                <ChevronLeft size={24} color="white" />
              </IonButton>
            </IonButtons>
            <IonTitle>{region.nombre}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent
          style={
            {
              "--background":
                "linear-gradient(135deg, #f8f9fa 0%, #f0f3f7 100%)",
              "--padding-top": "16px",
              "--padding-bottom": "16px",
              "--padding-start": "16px",
              "--padding-end": "16px",
            } as React.CSSProperties
          }
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              textAlign: "center",
            }}
          >
            <IonText>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 8px 0",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Ubicación
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "#06b6d4",
                  margin: "0",
                  fontWeight: "600",
                }}
              >
                Lat: {region.lat}° | Lon: {region.lon}°
              </p>
            </IonText>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <IonText>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0 0 20px 0",
                  color: "#0c0a09",
                  textAlign: "center",
                  letterSpacing: "-0.3px",
                }}
              >
                Datos del Pronóstico
              </h2>
            </IonText>

            <IonGrid style={{ padding: "0" }}>
              <IonRow>
                {(Object.keys(attributeNames) as AttributeKey[]).map(
                  (key) => (
                    <IonCol
                      size="12"
                      size-md="6"
                      key={key}
                      style={{ padding: "8px" }}
                    >
                      <div
                        role="group"
                        tabIndex={0}
                        aria-label={`Datos de ${attributeNames[key]}`}
                        style={{
                          background: "white",
                          borderRadius: "16px",
                          padding: "16px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.transform = "translateY(-4px)";
                          el.style.boxShadow =
                            "0 8px 16px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.transform = "translateY(0)";
                          el.style.boxShadow =
                            "0 2px 8px rgba(0, 0, 0, 0.08)";
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            const button = (
                              e.currentTarget as HTMLElement
                            ).querySelector("button");
                            button?.click();
                          }
                        }}
                      >
                        <IonText>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#06b6d4",
                              margin: "0 0 12px 0",
                              fontWeight: "600",
                              textAlign: "center",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {attributeNames[key]}
                          </p>
                        </IonText>

                        <div
                          style={{
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background:
                              "linear-gradient(135deg, #f0f3f7 0%, #e8ecf1 100%)",
                            minHeight: "180px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              expandImage(region.datosPronostico[key]);
                            }}
                            type="button"
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              zIndex: 1,
                              background: "rgba(6, 182, 212, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              width: "44px",
                              height: "44px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                              transition: "all 0.3s ease",
                              padding: "0",
                              color: "white",
                            }}
                            onMouseEnter={(e) => {
                              const el =
                                e.currentTarget as HTMLButtonElement;
                              el.style.transform = "scale(1.1)";
                              el.style.background =
                                "rgba(6, 182, 212, 1)";
                            }}
                            onMouseLeave={(e) => {
                              const el =
                                e.currentTarget as HTMLButtonElement;
                              el.style.transform = "scale(1)";
                              el.style.background =
                                "rgba(6, 182, 212, 0.95)";
                            }}
                            aria-label="Expandir imagen"
                          >
                            <Maximize2 size={20} color="white" />
                          </button>
                          <img
                            src={region.datosPronostico[key]}
                            alt={attributeNames[key]}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                    </IonCol>
                  )
                )}
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonModal>
      <ImageViewer
        isOpen={imageViewerOpen}
        images={currentImages}
        initialIndex={currentImageIndex}
        onClose={closeImageViewer}
      />
    </>
  );
};

export default RegionDetailModal;