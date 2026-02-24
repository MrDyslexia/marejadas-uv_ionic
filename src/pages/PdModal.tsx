"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { closeOutline, waterOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./PdModal.css";
import {
  ChevronLeft,
  Maximize2,
  Waves,
  Compass,
  Grid3x3,
  Timer,
  Ruler,
} from "lucide-react";
import ImageViewer from "../components/ui/ImageViewer";

interface Sector {
  id: string;
  nombre: string;
  datos: {
    categoria: string;
    altura: string;
    periodo: string;
    direccion: string;
    marea: string;
  };
}

interface Marker {
  nombre: string;
  lat: number;
  lng: number;
}

interface PronosticoData {
  id: string;
  nombre: string;
  mapa_pronostico: string;
  mosaico_pronostico: string;
  markers: Marker[];
  sectores: Sector[];
}

interface LocationState {
  pronosticoData: PronosticoData;
}

const PdModal: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const pronosticoData = location.state?.pronosticoData;

  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedTab, setSelectedTab] = useState("categoria");
  const [loading, setLoading] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (pronosticoData?.sectores?.length > 0) {
      setSelectedSector(pronosticoData.sectores[0]);
    }
  }, [pronosticoData]);

  useEffect(() => {
    return () => {
      setImageViewerOpen(false);
      setCurrentImages([]);
      setCurrentImageIndex(0);
    };
  }, []);

  const tabConfig = useMemo(
    () => [
      { key: "categoria", label: "Categoría", icon: Grid3x3 },
      { key: "altura", label: "Altura", icon: Ruler },
      { key: "periodo", label: "Período", icon: Timer },
      { key: "direccion", label: "Dirección", icon: Compass },
      { key: "marea", label: "Marea", icon: Waves },
    ],
    [],
  );

  const handleSectorPress = (sector: Sector) => {
    if (sector.id === selectedSector?.id) return;
    setLoading(true);
    setSelectedSector(sector);
    setTimeout(() => setLoading(false), 300);
  };

  const handleTabPress = (tab: string) => {
    if (tab === selectedTab) return;
    setLoading(true);
    setSelectedTab(tab);
    setTimeout(() => setLoading(false), 300);
  };

  const expandImage = (url: string) => {
    setCurrentImages([url]);
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

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <IonSpinner color="primary" />
          <IonText color="medium">
            <p>Cargando datos...</p>
          </IonText>
        </div>
      );
    }

    if (!selectedSector?.datos) {
      return (
        <div className="loading-container">
          <IonText color="danger">
            <p>No hay datos disponibles para este sector</p>
          </IonText>
        </div>
      );
    }

    const imageUrl =
      selectedSector.datos[selectedTab as keyof typeof selectedSector.datos] ||
      selectedSector.datos.categoria;

    return (
      <div className="image-container enhanced">
        <button
          className="expand-button-enhanced-lucide"
          onClick={() => expandImage(imageUrl)}
          type="button"
          aria-label="Expandir imagen"
        >
          <Maximize2 size={20} color="white" />
        </button>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`Datos de ${selectedTab}`}
          className="data-image"
        />
      </div>
    );
  };

  if (!pronosticoData) {
    return (
      <>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack()}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="error-container">
            <IonText color="danger">
              <p>No se encontraron datos del pronóstico</p>
            </IonText>
          </div>
        </IonContent>
      </>
    );
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <ChevronLeft size={24} color="white" />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {pronosticoData.nombre
              .replaceAll(/PRONÓSTICOS|PRONÓSTICO DE/g, "")
              .trim()}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} fullscreen={false} className="modal-content">
        {/* Mapa de Pronóstico */}
        <IonCard className="forecast-card">
          <IonCardHeader>
            <IonCardTitle className="card-title-enhanced">
              <div className="title-icon-wrapper">
                <IonIcon icon={waterOutline} className="card-icon-enhanced" />
              </div>
              <span>Mapa de Pronóstico</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="image-container enhanced">
              <button
                className="expand-button-enhanced-lucide"
                onClick={() => expandImage(pronosticoData.mapa_pronostico)}
                type="button"
                aria-label="Expandir mapa"
              >
                <Maximize2 size={20} color="white" />
              </button>
              <img
                src={pronosticoData.mapa_pronostico || "/placeholder.svg"}
                alt="Mapa de pronóstico"
                className="map-image"
              />
            </div>
          </IonCardContent>
        </IonCard>

        {/* Mosaico de Pronóstico */}
        <IonCard className="forecast-card">
          <IonCardHeader>
            <IonCardTitle className="card-title-enhanced">
              <div className="title-icon-wrapper">
                <IonIcon icon={waterOutline} className="card-icon-enhanced" />
              </div>
              <span>Mosaico de Pronóstico</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="image-container enhanced">
              <button
                className="expand-button-enhanced-lucide"
                onClick={() => expandImage(pronosticoData.mosaico_pronostico)}
                type="button"
                aria-label="Expandir mosaico"
              >
                <Maximize2 size={20} color="white" />
              </button>
              <img
                src={pronosticoData.mosaico_pronostico || "/placeholder.svg"}
                alt="Mosaico de pronóstico"
                className="map-image"
              />
            </div>
          </IonCardContent>
        </IonCard>

        {/* Análisis por Sectores */}
        <IonCard className="forecast-card">
          <IonCardHeader>
            <IonCardTitle className="card-title-enhanced">
              <span>Análisis por Sectores</span>
              <IonChip color="primary" className="badge-enhanced">
                <IonLabel>{pronosticoData.sectores.length}</IonLabel>
              </IonChip>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {/* Sector Selection */}
            <div className="sector-scroll-container-enhanced">
              {pronosticoData.sectores.map((sector: Sector) => (
                <IonChip
                  key={sector.id}
                  color={
                    selectedSector?.id === sector.id ? "primary" : "medium"
                  }
                  onClick={() => handleSectorPress(sector)}
                  className="sector-chip-enhanced"
                >
                  <IonLabel>{sector.nombre}</IonLabel>
                </IonChip>
              ))}
            </div>

            <div className="divider-enhanced" />

            {/* Selected Sector Info */}
            <div className="selected-sector-container">
              <IonText>
                <h2 className="selected-sector-title-enhanced">
                  {selectedSector?.nombre || "Selecciona un sector"}
                </h2>
              </IonText>

              {/* Custom Tabs (reemplaza IonSegment) */}
              <div className="custom-tabs-container">
                <div className="custom-tabs-scroll">
                  {tabConfig.map((tab) => {
                    const isActive = selectedTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        className={`custom-tab-button ${isActive ? "custom-tab-active" : ""}`}
                        onClick={() => handleTabPress(tab.key)}
                      >
                        <tab.icon
                          size={18}
                          color={isActive ? "#06b6d4" : "#94a3b8"}
                        />
                        <span className="custom-tab-label">{tab.label}</span>
                        {isActive && <div className="custom-tab-indicator" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="tab-content-container-enhanced">
                {renderTabContent()}
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <ImageViewer
        isOpen={imageViewerOpen}
        images={currentImages}
        initialIndex={currentImageIndex}
        onClose={closeImageViewer}
      />
    </>
  );
};

export default PdModal;
