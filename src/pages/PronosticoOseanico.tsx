'use client';

import React, { useState, useMemo } from "react";
import {
  IonContent,
  IonPage,
  IonText,
  IonSearchbar,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Map, ChevronUp, ChevronDown, BarChart3, ChevronRight, Waves } from "lucide-react";
import AnimatedMap from "../components/po/AnimatedMap";
import RegionDetailModal from "../components/po/RegionDetailModal";
import type { Region } from "../types/type";

interface PronosticoOseanicoProps {
  regions: Region[];
}

const PronosticoOseanico: React.FC<PronosticoOseanicoProps> = ({ regions }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showStats, setShowStats] = useState(false);
  const history = useHistory();

  const filteredRegions = useMemo(() => {
    if (!searchText.trim()) {
      return regions;
    }
    return regions.filter(region =>
      region.nombre.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [regions, searchText]);

  const totalWithCoords = regions.filter((r) => r.lat && r.lon).length;

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedRegion(null);
    setModalVisible(false);
  };

  const navigateToMap = () => {
    history.push('/pronostico-oceanico-map');
  };

  return (
    <IonPage style={{ "--background": "#f1f5f9" } as React.CSSProperties}>
      {/* HEADER GRADIENTE */}
      <div
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)",
          paddingTop: "20px",
          paddingBottom: "24px",
          paddingLeft: "20px",
          paddingRight: "20px",
          boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)",
        }}
      >
        {/* Header Top */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div>
            <IonText>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "white", margin: "0", letterSpacing: "-0.5px" }}>
                Pronóstico Oceánico
              </h1>
            </IonText>
            <IonText>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)", margin: "2px 0 0 0", fontWeight: "400" }}>
                Zonas Oceánicas y Mapa animado
              </p>
            </IonText>
          </div>

          <button
            onClick={navigateToMap}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "white",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              el.style.transform = "translateY(0)";
            }}
          >
            <Map size={20} color="#0284c7" />
            <span style={{ color: "#0284c7", fontSize: "14px", fontWeight: "600" }}>Mapa</span>
          </button>
        </div>

        {/* Stats Row - Expandible */}
        {showStats && (
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              padding: "16px",
              justifyContent: "space-around",
              marginBottom: "12px",
              backdropFilter: "blur(10px)",
              animation: "slideDown 0.3s ease-out",
            }}
          >
            <div style={{ textAlign: "center", flex: 1 }}>
              <IonText>
                <p style={{ fontSize: "24px", fontWeight: "700", color: "white", margin: "0" }}>
                  {regions.length}
                </p>
              </IonText>
              <IonText>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", margin: "4px 0 0 0", textTransform: "uppercase", fontWeight: "500", letterSpacing: "0.5px" }}>
                  Regiones
                </p>
              </IonText>
            </div>
            <div style={{ width: "1px", background: "rgba(255, 255, 255, 0.3)", margin: "0 8px" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <IonText>
                <p style={{ fontSize: "24px", fontWeight: "700", color: "white", margin: "0" }}>
                  {totalWithCoords}
                </p>
              </IonText>
              <IonText>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", margin: "4px 0 0 0", textTransform: "uppercase", fontWeight: "500", letterSpacing: "0.5px" }}>
                  Con GPS
                </p>
              </IonText>
            </div>
            <div style={{ width: "1px", background: "rgba(255, 255, 255, 0.3)", margin: "0 8px" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <IonText>
                <p style={{ fontSize: "24px", fontWeight: "700", color: "white", margin: "0" }}>
                  5
                </p>
              </IonText>
              <IonText>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", margin: "4px 0 0 0", textTransform: "uppercase", fontWeight: "500", letterSpacing: "0.5px" }}>
                  Variables
                </p>
              </IonText>
            </div>
          </div>
        )}

        {/* Toggle Stats Button */}
        <button
          onClick={() => setShowStats(!showStats)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.15)",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(255, 255, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <BarChart3 size={16} color="rgba(255, 255, 255, 0.9)" />
          <span>{showStats ? "Ocultar estadísticas" : "Mostrar estadísticas"}</span>
          {showStats ? (
            <ChevronUp size={16} color="rgba(255, 255, 255, 0.9)" />
          ) : (
            <ChevronDown size={16} color="rgba(255, 255, 255, 0.9)" />
          )}
        </button>

        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {/* CONTENT */}
      <IonContent
        style={{
          "--background": "#f1f5f9",
        } as React.CSSProperties}
      >
        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingBottom: "32px",
          }}
        >
          {/* Mapa Animado */}
          <AnimatedMap />

          {/* Zonas Oceánicas */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              display: "flex",
              flexDirection: "column",
              height: "500px",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "20px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <Waves size={22} color="#0284c7" />
                <IonText>
                  <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0", color: "#0c0a09", letterSpacing: "-0.3px" }}>
                    Zonas Oceánicas
                  </h2>
                </IonText>
              </div>
              <IonText>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0", fontWeight: "500" }}>
                  {filteredRegions.length} de {regions.length} región{regions.length === 1 ? '' : 'es'} disponible{regions.length === 1 ? '' : 's'}
                </p>
              </IonText>
            </div>

            {/* Search */}
            <div style={{ marginBottom: "16px", flexShrink: 0 }}>
              <IonSearchbar
                value={searchText}
                onIonInput={(e) => setSearchText(e.detail.value || "")}
                placeholder="Buscar región..."
                style={{
                  "--background": "#f5f5f5",
                  "--border-radius": "12px",
                  "--color": "#0c0a09",
                  "--placeholder-color": "#94a3b8",
                  "--icon-color": "#0284c7",
                  "--cancel-button-color": "#0284c7",
                  padding: "0",
                } as React.CSSProperties}
              />
            </div>

            {/* Lista con Scroll Interno - Altura Fija */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                paddingRight: "8px",
                minHeight: "0",
              }}
            >
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <div
                    key={region.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleRegionSelect(region)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleRegionSelect(region);
                      }
                    }}
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexShrink: 0,
                      minHeight: "60px",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "white";
                      el.style.borderColor = "#0284c7";
                      el.style.boxShadow = "0 4px 12px rgba(2, 132, 199, 0.15)";
                      el.style.transform = "translateX(6px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "#f8f9fa";
                      el.style.borderColor = "#e2e8f0";
                      el.style.boxShadow = "none";
                      el.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "0" }}>
                      <IonText>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0c0a09", margin: "0 0 4px 0", letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {region.nombre}
                        </h3>
                      </IonText>
                      <IonText>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: "0", fontWeight: "500" }}>
                          {region.lat}° • {region.lon}°
                        </p>
                      </IonText>
                    </div>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#e0f2fe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "12px",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ChevronRight size={18} color="#0284c7" />
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "12px",
                    color: "#94a3b8",
                  }}
                >
                  <IonText>
                    <p style={{ fontSize: "14px", margin: "0", textAlign: "center", fontWeight: "500", maxWidth: "200px" }}>
                      No se encontraron regiones
                    </p>
                  </IonText>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>

      <RegionDetailModal
        isOpen={modalVisible}
        region={selectedRegion}
        onClose={closeModal}
      />
    </IonPage>
  );
};

export default PronosticoOseanico;
