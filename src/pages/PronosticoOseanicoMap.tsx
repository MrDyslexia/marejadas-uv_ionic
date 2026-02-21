"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { close } from "ionicons/icons";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Region } from "../types/type";
import data from "../data/data.json";

const PronosticoOseanicoMap: React.FC = () => {
  const history = useHistory();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    nombre: string;
    lat: number;
    lng: number;
    regionData: Region["datosPronostico"];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const initialDistanceRef = useRef<number>(0);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [-80, -30],
      zoom: 3,
      pitch: 0,
      bearing: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Handle map load and resize
    map.current.on("load", () => {
      // Trigger resize after map loads to ensure proper dimensions
      setTimeout(() => {
        map.current?.resize();
        setIsLoading(false);
      }, 100);
    });

    const regiones: Region[] = (data.po as any[]).map((r) => ({
      id: r.id,
      nombre: r.nombre,
      lat: r.lat,
      lon: r.lon,
      datosPronostico: r.datosPronostico,
    }));

    regiones.forEach((region) => {
      if (!region.lat || !region.lon) return;

      const el = document.createElement("div");
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.background = "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.cursor = "pointer";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";

      el.addEventListener("click", () => {
        setSelectedLocation({
          nombre: region.nombre,
          lat: region.lat,
          lng: region.lon,
          regionData: region.datosPronostico,
        });
      });

      el.addEventListener("mouseenter", () => {
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.boxShadow = "0 4px 16px rgba(2, 132, 199, 0.4)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([region.lon, region.lat])
        .addTo(map.current!);
    });

    // Add window resize listener
    const handleResize = () => {
      map.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <IonPage
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <IonHeader style={{ flex: "0 0 auto" }}>
        <IonToolbar
          color="primary"
          style={
            {
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              "--padding-top": "12px",
              "--padding-bottom": "12px",
            } as any
          }
        >
          <IonTitle
            style={{
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.3px",
            }}
          >
            Mapa Pronóstico Oceánico
          </IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            color="light"
            onClick={handleClose}
            style={{ margin: 0 }}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen
        style={
          {
            flex: "1 1 auto",
            "--padding-start": "0",
            "--padding-end": "0",
            "--padding-top": "0",
            "--padding-bottom": "0",
            position: "relative",
          } as any
        }
      >
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.95)",
              zIndex: 30,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <IonSpinner
                name="circular"
                color="primary"
                style={{ fontSize: "48px" }}
              />
              <span
                style={{ fontSize: "14px", color: "#0284c7", fontWeight: 500 }}
              >
                Cargando mapa...
              </span>
            </div>
          </div>
        )}
        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />

        {selectedLocation && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              right: "20px",
              maxWidth: "420px",
              maxHeight: "80vh",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              zIndex: 20,
              animation: "slideUp 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f0f9ff 0%, #f0f4f8 100%)",
                flexShrink: 0,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0f172a",
                  flex: 1,
                }}
              >
                {selectedLocation.nombre}
              </h3>
              <button
                onClick={() => setSelectedLocation(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 0,
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background =
                    "rgba(15, 23, 42, 0.05)";
                  (e.target as HTMLButtonElement).style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "none";
                  (e.target as HTMLButtonElement).style.color = "#94a3b8";
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Información */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    Región:
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                    {selectedLocation.nombre}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    Coordenadas:
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", fontFamily: "Courier New, monospace" }}>
                    {selectedLocation.lat.toFixed(2)}, {selectedLocation.lng.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Imágenes de pronóstico */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { key: "categoria", label: "Categoría" },
                  { key: "altura",    label: "Altura" },
                  { key: "periodo",   label: "Período" },
                  { key: "direccion", label: "Dirección" },
                  { key: "espectro",  label: "Espectro" },
                ].map(({ key, label }) => {
                  const src = selectedLocation.regionData[key as keyof typeof selectedLocation.regionData];
                  if (!src) return null;
                  return (
                    <div key={key} style={{ gridColumn: key === "espectro" ? "1 / -1" : undefined }}>
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
                        {label}
                      </span>
                      <button
                        onClick={() => setExpandedImage(src)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%", transition: "all 0.2s ease" }}
                        onMouseEnter={(e) => {
                          const img = (e.target as HTMLButtonElement).querySelector("img");
                          if (img) img.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                          const img = (e.target as HTMLButtonElement).querySelector("img");
                          if (img) img.style.opacity = "1";
                        }}
                      >
                        <img
                          src={src || "/placeholder.svg"}
                          alt={label}
                          style={{ width: "100%", borderRadius: "6px", border: "1px solid #e2e8f0", maxHeight: "120px", objectFit: "contain", background: "#f8fafc", transition: "all 0.2s ease" }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            position: "fixed",
            top: "70px",
            right: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "8px",
            padding: "10px 12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            zIndex: 20,
            border: "1px solid #e2e8f0",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Leyenda
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 0",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              }}
            />
            <span>Regiones oceánicas</span>
          </div>
        </div>
      </IonContent>

        {expandedImage && (
          <div
            role="dialog"
            aria-label="Expanded image viewer"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              backdropFilter: "blur(4px)",
              animation: "fadeIn 0.3s ease-out",
              overflow: "auto",
              touchAction: "none",
              border: "none",
              padding: 0,
              margin: 0,
            } as any}
            onKeyDown={(e: any) => {
              if (e.key === "Escape") {
                setExpandedImage(null);
                setImageZoom(1);
              }
            }}
            onTouchStart={(e: any) => {
              if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                  touch1.clientX - touch2.clientX,
                  touch1.clientY - touch2.clientY
                );
                initialDistanceRef.current = distance;
                e.preventDefault();
              }
            }}
            onTouchMove={(e: any) => {
              if (e.touches.length === 2 && initialDistanceRef.current > 0) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                  touch1.clientX - touch2.clientX,
                  touch1.clientY - touch2.clientY
                );
                const scale = currentDistance / initialDistanceRef.current;
                const newZoom = Math.min(3, Math.max(1, imageZoom * scale));
                setImageZoom(newZoom);
                initialDistanceRef.current = currentDistance;
                e.preventDefault();
              }
            }}
            onTouchEnd={() => {
              initialDistanceRef.current = 0;
            }}
            tabIndex={0}
          >
            {/* Close Button - Fixed position */}
            <button
              onClick={() => {
                setExpandedImage(null);
                setImageZoom(1);
              }}
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "none",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                transition: "all 0.2s ease",
                zIndex: 100,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "rgba(255, 255, 255, 0.2)";
              }}
            >
              ×
            </button>

            {/* Image Container */}
            <button
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                outline: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
                setImageZoom(1);
              }}
              aria-label="Close image viewer"
            >
              <img
                src={expandedImage || "/placeholder.svg"}
                alt="Expanded"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                  transform: `scale(${imageZoom})`,
                  transition: "transform 0.2s ease",
                  userSelect: "none",
                }}
                onTouchStart={(e) => e.preventDefault()}
              />
            </button>
          </div>
        )}

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
    </IonPage>
  );
};

export default PronosticoOseanicoMap;