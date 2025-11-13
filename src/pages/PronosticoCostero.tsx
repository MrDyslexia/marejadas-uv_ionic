"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonTitle,
} from "@ionic/react"
import { chevronForward, location, navigate } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import data from "../data/data.json"
import InteractiveMapModal from "../components/pc/InteractiveMapModal"
import type { Pronostico } from "../types/type"
import "./PronosticoCostero.css"
import { MapIcon, Pin } from "lucide-react"

const datosEjemplo = {
  pronosticos: data.pronosticos.map((p: any) => ({
    ...p,
    markers: p.markers ?? [],
  })),
}

const PronosticoCosteroScreen: React.FC = () => {
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const history = useHistory()

  useEffect(() => {
    setTimeout(() => {
      setPronosticos(datosEjemplo.pronosticos)
      setCargando(false)
    }, 1000)
  }, [])

  const navegarADetalle = (pronostico: Pronostico) => {
    console.log('🔍 Navegando a PdModal con datos:', pronostico)
    
    // ✅ Usar el objeto de location con state
    history.push({
      pathname: '/pdmodal',
      state: { 
        pronosticoData: pronostico 
      }
    })
  }

  const calcularCoordenadasDisponibles = (sectores: any[]) => {
    const sectoresConCoordenadas = sectores.filter((sector) => sector.coordenadas)
    return sectoresConCoordenadas.length
  }

  const closeMapModal = () => {
    setModalVisible(false)
  }

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
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <div className="header-content">
              <IonText color="light">
                <h1 className="header-title">Pronóstico costero</h1>
              </IonText>
              <IonText color="light">
                <p className="header-subtitle">Selecciona un pronóstico para ver detalles</p>
              </IonText>
            </div>
          </IonTitle>

          <IonButton
            slot="end"
            fill="clear"
            color="light"
            className="map-button"
            onClick={() => setModalVisible(true)}
          >
            <MapIcon size={32}/>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="pronostico-content">
        <div className="lista-container">
          {pronosticos.map((item, index) => (
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
                      <Pin size={32} color="white"/>
                    </div>
                    <div className="title-content">
                      <h2 className="tarjeta-titulo">{item.nombre}</h2>
                      <p className="tarjeta-descripcion">Pronóstico disponible</p>
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
                        <p className="info-label">Coordenadas</p>
                        <p className="info-value">
                          {calcularCoordenadasDisponibles(item.sectores) > 0
                            ? `${calcularCoordenadasDisponibles(item.sectores)}/${item.sectores.length}`
                            : "Próx."}
                        </p>
                        <p className="info-sublabel">geo-referenciadas</p>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <div className="sectores-preview">
                  <div className="sectores-header">
                    <p className="sectores-title">Sectores disponibles</p>
                    <span className="sectores-count">{item.sectores.length} total</span>
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
                        <span className="sector-nombre">+{item.sectores.length - 3} más</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <span className="card-footer-text">Ver detalles completos</span>
                  <div className="card-footer-icon">
                    <IonIcon icon={chevronForward} />
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>

      <InteractiveMapModal isOpen={modalVisible} onClose={closeMapModal} />
    </IonPage>
  )
}

export default PronosticoCosteroScreen