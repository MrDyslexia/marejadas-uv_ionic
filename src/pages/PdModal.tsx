"use client"

import type React from "react"
import { type Key, useState, useMemo, useEffect } from "react"
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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react"
import { closeOutline, expandOutline, locationOutline, waterOutline } from "ionicons/icons"
import { useHistory, useLocation } from "react-router-dom"
import "./PdModal.css"
import { ChevronLeft } from "lucide-react"

interface Sector {
  id: string
  nombre: string
  datos: {
    categoria: string
    altura: string
    periodo: string
    direccion: string
    marea: string
  }
}

interface Marker {
  nombre: string
  lat: number
  lng: number
}

interface PronosticoData {
  id: string
  nombre: string
  mapa_pronostico: string
  mosaico_pronostico: string
  markers: Marker[]
  sectores: Sector[]
}

interface LocationState {
  pronosticoData: PronosticoData
}

const PdModal: React.FC = () => {
  const history = useHistory()
  const location = useLocation<LocationState>()
  const pronosticoData = location.state?.pronosticoData

  // Manejo seguro del estado inicial con useEffect
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [selectedTab, setSelectedTab] = useState("categoria")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pronosticoData?.sectores?.length > 0) {
      setSelectedSector(pronosticoData.sectores[0])
    }
  }, [pronosticoData])

  const tabConfig = useMemo(
    () => [
      { key: "categoria", label: "Categoría", icon: "📊" },
      { key: "altura", label: "Altura", icon: "📏" },
      { key: "periodo", label: "Período", icon: "⏱️" },
      { key: "direccion", label: "Dirección", icon: "🧭" },
      { key: "marea", label: "Marea", icon: "🌊" },
    ],
    [],
  )

  const handleSectorPress = (sector: Sector) => {
    if (sector.id === selectedSector?.id) return
    setLoading(true)
    setSelectedSector(sector)
    setTimeout(() => setLoading(false), 300)
  }

  const handleTabPress = (tab: string) => {
    if (tab === selectedTab) return
    setLoading(true)
    setSelectedTab(tab)
    setTimeout(() => setLoading(false), 300)
  }

  const expandImage = (url: string) => {
    history.push("/img-expand", { expandedImage: url })
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <IonSpinner color="primary" />
          <IonText color="medium">
            <p>Cargando datos...</p>
          </IonText>
        </div>
      )
    }

    // Verificación segura de selectedSector.datos
    if (!selectedSector?.datos) {
      return (
        <div className="loading-container">
          <IonText color="danger">
            <p>No hay datos disponibles para este sector</p>
          </IonText>
        </div>
      )
    }

    let imageUrl = ""
    switch (selectedTab) {
      case "categoria":
        imageUrl = selectedSector.datos.categoria
        break
      case "altura":
        imageUrl = selectedSector.datos.altura
        break
      case "periodo":
        imageUrl = selectedSector.datos.periodo
        break
      case "direccion":
        imageUrl = selectedSector.datos.direccion
        break
      case "marea":
        imageUrl = selectedSector.datos.marea
        break
      default:
        imageUrl = selectedSector.datos.categoria
    }

    return (
      <div className="image-container enhanced">
        <IonButton fill="clear" className="expand-button-enhanced" onClick={() => expandImage(imageUrl)}>
          <IonIcon icon={expandOutline} slot="icon-only" />
        </IonButton>
        <img src={imageUrl || "/placeholder.svg"} alt={`Datos de ${selectedTab}`} className="data-image" />
      </div>
    )
  }

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
    )
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
          <IonTitle>{pronosticoData.nombre}</IonTitle>
        </IonToolbar>
        <IonToolbar color="primary" className="subtitle-toolbar">
          <IonTitle size="small">Pronóstico Marítimo Detallado</IonTitle>
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
              <IonButton
                fill="clear"
                className="expand-button-enhanced"
                onClick={() => expandImage(pronosticoData.mapa_pronostico)}
              >
                <IonIcon icon={expandOutline} slot="icon-only" />
              </IonButton>
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
              <IonButton
                fill="clear"
                className="expand-button-enhanced"
                onClick={() => expandImage(pronosticoData.mosaico_pronostico)}
              >
                <IonIcon icon={expandOutline} slot="icon-only" />
              </IonButton>
              <img
                src={pronosticoData.mosaico_pronostico || "/placeholder.svg"}
                alt="Mosaico de pronóstico"
                className="map-image"
              />
            </div>
          </IonCardContent>
        </IonCard>

        {/* Ubicaciones */}
        <IonCard className="forecast-card">
          <IonCardHeader>
            <IonCardTitle className="card-title-enhanced">
              <div className="title-icon-wrapper">
                <IonIcon icon={locationOutline} className="card-icon-enhanced" />
              </div>
              <span>Ubicaciones</span>
              <IonChip color="primary" className="badge-enhanced">
                <IonLabel>{pronosticoData.markers.length}</IonLabel>
              </IonChip>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                {pronosticoData.markers.map((marker: Marker, index: Key | null | undefined) => (
                  <IonCol size="12" size-md="6" key={index}>
                    <div className="marker-card-enhanced">
                      <div className="marker-header">
                        <div className="marker-icon-wrapper">
                          <IonIcon icon={locationOutline} />
                        </div>
                        <IonText>
                          <h3 className="marker-name">{marker.nombre}</h3>
                        </IonText>
                      </div>
                      <IonText color="medium">
                        <p className="marker-coords">
                          {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                        </p>
                      </IonText>
                    </div>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
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
                  color={selectedSector?.id === sector.id ? "primary" : "medium"}
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
                <h2 className="selected-sector-title-enhanced">{selectedSector?.nombre || "Selecciona un sector"}</h2>
              </IonText>

              {/* Enhanced Tabs */}
              <IonSegment
                value={selectedTab}
                onIonChange={(e) => handleTabPress(e.detail.value as string)}
                scrollable={true}
                className="segment-enhanced"
              >
                {tabConfig.map((tab) => (
                  <IonSegmentButton key={tab.key} value={tab.key} className="segment-button-enhanced">
                    <IonLabel>
                      <div className="tab-content-enhanced">
                        <span className="tab-emoji">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                      </div>
                    </IonLabel>
                  </IonSegmentButton>
                ))}
              </IonSegment>

              {/* Tab Content */}
              <div className="tab-content-container-enhanced">{renderTabContent()}</div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </>
  )
}

export default PdModal
