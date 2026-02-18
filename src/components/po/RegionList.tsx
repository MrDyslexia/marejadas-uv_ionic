import React, { useState } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import { chevronForward, locationOutline } from "ionicons/icons";
import { MapPin, ChartSpline } from "lucide-react";
import type { Region } from "../../types/type";

interface RegionListProps {
  regions: Region[];
  onRegionSelect: (region: Region) => void;
}

const RegionList: React.FC<RegionListProps> = ({ 
  regions, 
  onRegionSelect 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRegionSelect = (region: Region) => {
    onRegionSelect(region);
  };

  const scrollToRegion = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "24px",
        margin: "20px 16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IonIcon icon={locationOutline} style={{ color: "#06b6d4", fontSize: "24px" }} />
          <IonText>
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "0", color: "#0c0a09", letterSpacing: "-0.3px" }}>
              Zonas Oceánicas
            </h2>
          </IonText>
        </div>
      </div>

      {/* Grid de Regiones */}
      <IonGrid style={{ padding: "0" }}>
        <IonRow>
          {regions.map((region, index) => (
            <IonCol size="12" size-md="6" size-lg="4" key={region.id} style={{ padding: "12px" }}>
              <IonCard 
                button
                onClick={() => {
                  handleRegionSelect(region);
                  scrollToRegion(index);
                }}
                style={{
                  margin: "0",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: activeIndex === index ? "2px solid #06b6d4" : "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
              >
                <IonCardContent style={{ padding: "0" }}>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                      padding: "20px",
                      borderRadius: "18px",
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "24px",
                          background: "rgba(255, 255, 255, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "14px",
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={24} color="white" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <IonText>
                          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: "0 0 4px 0", letterSpacing: "-0.2px" }}>
                            {region.nombre}
                          </h3>
                        </IonText>
                        <IonText>
                          <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)", margin: "0", fontWeight: "500" }}>
                            Lat: {region.lat}° | Lon: {region.lon}°
                          </p>
                        </IonText>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(255, 255, 255, 0.2)",
                        margin: "16px 0",
                      }}
                    />

                    {/* Card Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <ChartSpline size={28} color="white" />
                        <IonText>
                          <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.8)", margin: "0", fontWeight: "500" }}>
                            Datos
                          </p>
                        </IonText>
                      </div>

                      <IonButton
                        fill="clear"
                        style={{
                          "--background": "rgba(255, 255, 255, 0.15)",
                          "--border-radius": "20px",
                          "--color": "white",
                          "--border-color": "rgba(255, 255, 255, 0.25)",
                          "--border-width": "1px",
                          "--border-style": "solid",
                          "--padding-start": "16px",
                          "--padding-end": "16px",
                          "--padding-top": "8px",
                          "--padding-bottom": "8px",
                          "--min-height": "36px",
                        } as React.CSSProperties}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegionSelect(region);
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: "600", marginRight: "6px" }}>
                          Ver detalles
                        </span>
                        <IonIcon icon={chevronForward} />
                      </IonButton>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      {/* Pagination Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "24px",
          gap: "8px",
        }}
      >
        {regions.map((region, index) => (
          <button
            key={region.id}
            onClick={() => scrollToRegion(index)}
            type="button"
            style={{
              width: activeIndex === index ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: activeIndex === index ? "#06b6d4" : "#cbd5e1",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: "0",
            }}
            aria-label={`Ir a ${region.nombre}`}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              if (activeIndex !== index) {
                el.style.background = "#94a3b8";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              if (activeIndex !== index) {
                el.style.background = "#cbd5e1";
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RegionList;
