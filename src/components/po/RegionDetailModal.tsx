import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Maximize2 } from "lucide-react";
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

  const expandImage = (image: string) => {
    setCurrentImages([image]);
    setCurrentImageIndex(0);
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setTimeout(() => {
      setCurrentImages([]);
      setCurrentImageIndex(0);
    }, 100);
  };

  type AttributeKey = keyof typeof attributeNames;

  return (
    <>
      <IonModal 
        isOpen={isOpen} 
        onDidDismiss={onClose}
        style={{
          "--background": "#ffffff",
          "--width": "100%",
          "--height": "100%",
        } as React.CSSProperties}
      >
        <IonHeader>
          <IonToolbar style={{ "--background": "#06b6d4", "--color": "#ffffff" } as React.CSSProperties}>
            <IonTitle style={{ fontWeight: "700", fontSize: "18px", letterSpacing: "-0.3px" }}>
              {region.nombre}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent 
          style={{
            "--background": "linear-gradient(135deg, #f8f9fa 0%, #f0f3f7 100%)",
            "--padding-top": "16px",
            "--padding-bottom": "16px",
            "--padding-start": "16px",
            "--padding-end": "16px",
          } as React.CSSProperties}
        >
          {/* Ubicación */}
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
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Ubicación
              </p>
              <p style={{ fontSize: "15px", color: "#06b6d4", margin: "0", fontWeight: "600" }}>
                Lat: {region.lat}° | Lon: {region.lon}°
              </p>
            </IonText>
          </div>

          {/* Datos de Pronóstico */}
          <div style={{ marginBottom: "24px" }}>
            <IonText>
              <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0", color: "#0c0a09", textAlign: "center", letterSpacing: "-0.3px" }}>
                Datos del Pronóstico
              </h2>
            </IonText>

            <IonGrid style={{ padding: "0" }}>
              <IonRow>
                {(Object.keys(attributeNames) as AttributeKey[]).map((key) => (
                  <IonCol size="12" size-md="6" key={key} style={{ padding: "8px" }}>
                    <div
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
                        el.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(0)";
                        el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                      }}
                    >
                      <IonText>
                        <p style={{ fontSize: "12px", color: "#06b6d4", margin: "0 0 12px 0", fontWeight: "600", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {attributeNames[key]}
                        </p>
                      </IonText>

                      <div
                        style={{
                          position: "relative",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "linear-gradient(135deg, #f0f3f7 0%, #e8ecf1 100%)",
                          minHeight: "180px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => expandImage(region.datosPronostico[key])}
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
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.transform = "scale(1.1)";
                            el.style.background = "rgba(6, 182, 212, 1)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.transform = "scale(1)";
                            el.style.background = "rgba(6, 182, 212, 0.95)";
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
                ))}
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
