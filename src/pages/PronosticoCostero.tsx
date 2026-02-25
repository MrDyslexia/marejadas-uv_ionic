import type React from "react";
import { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import { chevronForward, location, navigate, close } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import data from "../data/data.json";
import type { Pronostico } from "../types/type";
import "./PronosticoCostero.css";
import {
  MapIcon,
  Pin,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Search,
} from "lucide-react";

const datosEjemplo = {
  pronosticos: data.pc.map((p: any) => ({
    ...p,
    markers: p.markers ?? [],
  })),
};

const PronosticoCosteroScreen: React.FC = () => {
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      setPronosticos(datosEjemplo.pronosticos);
      setCargando(false);
    }, 1000);
  }, []);

  const navegarADetalle = (pronostico: Pronostico) => {
    history.push({
      pathname: "/pdmodal",
      state: {
        pronosticoData: pronostico,
      },
    });
  };

  const calcularCoordenadasDisponibles = (sectores: any[]) => {
    const sectoresConCoordenadas = sectores.filter(
      (sector) => sector.coordenadas,
    );
    return sectoresConCoordenadas.length;
  };

  const navigateToMap = () => {
    history.push("/pronostico-costero-map");
  };

  // Filter pronosticos based on search query
  const filteredPronosticos = pronosticos.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalSectores = filteredPronosticos.reduce(
    (acc, p) => acc + p.sectores.length,
    0,
  );
  const totalConCoords = pronosticos.reduce(
    (acc, p) => acc + calcularCoordenadasDisponibles(p.sectores),
    0,
  );

  if (cargando) {
    return (
      <IonPage>
        <IonContent fullscreen className="loading-content">
          <div className="centrado">
            <IonSpinner color="primary" />
            <IonText color="medium">
              <p className="texto-indicador">Cargando pronósticos...</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage style={{ "--background": "#f1f5f9" } as React.CSSProperties}>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)",
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
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "white",
                  margin: "0",
                  letterSpacing: "-0.5px",
                }}
              >
                Pronóstico Costero
              </h1>
            </IonText>
            <IonText>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: "2px 0 0 0",
                  fontWeight: "400",
                }}
              >
                Selecciona un pronóstico para ver detalles
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
            <MapIcon size={20} color="#0284c7" />
            <span
              style={{ color: "#0284c7", fontSize: "14px", fontWeight: "600" }}
            >
              Mapa
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            position: "relative",
            marginBottom: "16px",
            marginTop: "12px",
          }}
        >
          {searchQuery && filteredPronosticos.length === 0 && (
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                marginTop: "8px",
                marginLeft: "0",
              }}
            >
              No se encontraron pronósticos con &quot;{searchQuery}&quot;
            </p>
          )}
          {searchQuery && filteredPronosticos.length > 0 && (
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                marginTop: "8px",
                marginLeft: "0",
              }}
            >
              {filteredPronosticos.length} resultado
              {filteredPronosticos.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
        {/* Expandable Section - Stats or Search */}
        {(showStats || showSearch) && (
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              padding: "16px",
              marginBottom: "12px",
              backdropFilter: "blur(10px)",
              animation: "slideDown 0.3s ease-out",
            }}
          >
            {showSearch && !showStats ? (
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={18}
                    color="rgba(255, 255, 255, 0.6)"
                    style={{
                      position: "absolute",
                      left: "12px",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Buscar pronóstico..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={
                      {
                        width: "100%",
                        padding: "10px 12px 10px 40px",
                        paddingRight: searchQuery ? "36px" : "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        outline: "none",
                      } as any
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.3)";
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: "8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.opacity = "0.8";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.opacity = "1";
                      }}
                    >
                      <IonIcon
                        icon={close}
                        style={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "20px",
                        }}
                      />
                    </button>
                  )}
                </div>
              </div>
            ) : showStats && !showSearch ? (
              <>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <IonText>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "white",
                        margin: "0",
                      }}
                    >
                      {pronosticos.length}
                    </p>
                  </IonText>
                  <IonText>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "4px 0 0 0",
                        textTransform: "uppercase",
                        fontWeight: "500",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Pronósticos
                    </p>
                  </IonText>
                </div>
                <div
                  style={{
                    width: "1px",
                    background: "rgba(255, 255, 255, 0.3)",
                    margin: "0 8px",
                  }}
                />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <IonText>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "white",
                        margin: "0",
                      }}
                    >
                      {totalSectores}
                    </p>
                  </IonText>
                  <IonText>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "4px 0 0 0",
                        textTransform: "uppercase",
                        fontWeight: "500",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Sectores
                    </p>
                  </IonText>
                </div>
                <div
                  style={{
                    width: "1px",
                    background: "rgba(255, 255, 255, 0.3)",
                    margin: "0 8px",
                  }}
                />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <IonText>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "white",
                        margin: "0",
                      }}
                    >
                      {totalConCoords}
                    </p>
                  </IonText>
                  <IonText>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "4px 0 0 0",
                        textTransform: "uppercase",
                        fontWeight: "500",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Con GPS
                    </p>
                  </IonText>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Buttons Row */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <button
            onClick={() => {
              setShowStats(!showStats);
              if (showSearch) setShowSearch(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: showStats
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(255, 255, 255, 0.15)",
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
              el.style.background = showStats
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(255, 255, 255, 0.15)";
            }}
          >
            <BarChart3 size={16} color="rgba(255, 255, 255, 0.9)" />
            <span>Estadísticas</span>
            {showStats ? (
              <ChevronUp size={16} color="rgba(255, 255, 255, 0.9)" />
            ) : (
              <ChevronDown size={16} color="rgba(255, 255, 255, 0.9)" />
            )}
          </button>

          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (showStats) setShowStats(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: showSearch
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(255, 255, 255, 0.15)",
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
              el.style.background = showSearch
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(255, 255, 255, 0.15)";
            }}
          >
            <Search size={16} color="rgba(255, 255, 255, 0.9)" />
            <span>Búsqueda</span>
            {showSearch ? (
              <ChevronUp size={16} color="rgba(255, 255, 255, 0.9)" />
            ) : (
              <ChevronDown size={16} color="rgba(255, 255, 255, 0.9)" />
            )}
          </button>
        </div>

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
          input::placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
            opacity: 1 !important;
          }
          input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
          }
          input::-moz-placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
            opacity: 1 !important;
          }
          input:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
          }
        `}</style>
      </div>
      <IonContent
        fullscreen
        className="pronostico-content"
        style={
          {
            "--background": "#f1f5f9",
          } as React.CSSProperties
        }
      >
        <div className="lista-container">
          {filteredPronosticos.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#64748b",
              }}
            >
              <p style={{ fontSize: "16px", fontWeight: "500", margin: "0" }}>
                No hay pronósticos que coincidan
              </p>
              <p
                style={{
                  fontSize: "14px",
                  margin: "8px 0 0 0",
                  color: "#94a3b8",
                }}
              >
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            filteredPronosticos.map((item, index) => (
              <IonCard
                key={item.id}
                className="tarjeta"
                button
                onClick={() => navegarADetalle(item)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IonCardContent className="card-content-wrapper">
                  <div className="card-header">
                    <div className="title-row">
                      <div className="icon-badge">
                        <Pin size={32} color="white" />
                      </div>
                      <div className="title-content">
                        <h2 className="tarjeta-titulo">{item.nombre}</h2>
                        <p className="tarjeta-descripcion">
                          Pronóstico disponible
                        </p>
                      </div>
                    </div>
                  </div>

                  <IonGrid className="info-grid">
                    <IonRow>
                      <IonCol size="6">
                        <div className="info-card">
                          <div className="info-icon-wrapper info-icon-success">
                            <IonIcon icon={location} />
                          </div>
                          <p className="info-label">Sectores</p>
                          <p className="info-value">{item.sectores.length}</p>
                          <p className="info-sublabel">disponibles</p>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="info-card">
                          <div className="info-icon-wrapper info-icon-warning">
                            <IonIcon icon={navigate} />
                          </div>
                          <p className="info-label">Puntos</p>
                          <p className="info-value">
                            {calcularCoordenadasDisponibles(item.sectores) > 0
                              ? `${calcularCoordenadasDisponibles(
                                item.sectores,
                              )}/${item.sectores.length}`
                              : "Próx."}
                          </p>
                          <p className="info-sublabel">geo-ref</p>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  <div className="sectores-preview">
                    <div className="sectores-header">
                      <p className="sectores-title">Sectores disponibles</p>
                      <span className="sectores-count">
                        {item.sectores.length} total
                      </span>
                    </div>
                    <div className="sectores-container">
                      {item.sectores.slice(0, 3).map((sector) => (
                        <div key={sector.id} className="sector-chip">
                          <div className="sector-dot"></div>
                          <span className="sector-nombre">{sector.nombre}</span>
                        </div>
                      ))}
                      {item.sectores.length > 3 && (
                        <div className="sector-chip sector-more">
                          <span className="sector-nombre">
                            +{item.sectores.length - 3} más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="card-footer"
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="card-footer-text">
                      Ver detalles completos
                    </span>
                    <div className="card-footer-icon">
                      <IonIcon icon={chevronForward} />
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PronosticoCosteroScreen;
