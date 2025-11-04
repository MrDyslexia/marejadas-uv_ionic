import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonChip,
  IonAlert
} from "@ionic/react";
import {
  chevronForward,
  location,
  navigate,
  water,
  planet
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import data from "../data/data.json";
import InteractiveMapModal from "../components/pc/InteractiveMapModal";
import { Pronostico } from "../types/type";
import "./PronosticoCostero.css";

const datosEjemplo = {
  pronosticos: data.pronosticos.map((p: any) => ({
    ...p,
    markers: p.markers ?? [],
  })),
};

const PronosticoCosteroScreen: React.FC = () => {
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      setPronosticos(datosEjemplo.pronosticos);
      setCargando(false);
    }, 1000);
  }, []);

  const navegarADetalle = (pronostico: Pronostico) => {
    history.push({
      pathname: "/pd-modal",
      state: { pronostico }
    });
  };

  const calcularCoordenadasDisponibles = (sectores: any[]) => {
    const sectoresConCoordenadas = sectores.filter(
      (sector) => sector.coordenadas
    );
    return sectoresConCoordenadas.length;
  };

  const closeMapModal = () => {
    setModalVisible(false);
  };

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
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="header-toolbar">
          <IonTitle>
            <div className="header-content">
              <IonText color="light">
                <h1 className="header-title">Pronóstico costero</h1>
              </IonText>
              <IonText color="light">
                <p className="header-subtitle">
                  Selecciona un pronóstico para ver detalles
                </p>
              </IonText>
            </div>
          </IonTitle>
          
          <IonButton 
            slot="end" 
            fill="clear" 
            color="light"
            className="header-button"
            onClick={() => setModalVisible(true)}
          >
            <IonIcon icon={planet} slot="start" />
            <span className="header-button-text">Ver mapa costero</span>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="pronostico-content">
        <div className="lista-container">
          {pronosticos.map((item) => (
            <IonCard 
              key={item.id} 
              className="tarjeta"
              button
              onClick={() => navegarADetalle(item)}
            >
              <IonCardContent>
                <div className="card-header">
                  <div className="title-row">
                    <IonIcon icon={water} color="primary" />
                    <IonText color="dark">
                      <h2 className="tarjeta-titulo">{item.nombre}</h2>
                    </IonText>
                  </div>

                  <IonGrid className="info-grid">
                    <IonRow>
                      <IonCol size="6">
                        <div className="info-card">
                          <IonIcon icon={location} color="success" />
                          <IonText color="medium">
                            <p className="info-label">Sectores disponibles</p>
                          </IonText>
                          <IonText color="dark">
                            <p className="info-value">{item.sectores.length}</p>
                          </IonText>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="info-card">
                          <IonIcon icon={navigate} color="warning" />
                          <IonText color="medium">
                            <p className="info-label">Coordenadas</p>
                          </IonText>
                          <IonText color="dark">
                            <p className="info-value">
                              {calcularCoordenadasDisponibles(item.sectores) > 0
                                ? `${calcularCoordenadasDisponibles(item.sectores)}/${
                                    item.sectores.length
                                  }`
                                : "Próximamente"}
                            </p>
                          </IonText>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>

                <div className="sectores-preview">
                  <IonText color="medium">
                    <p className="sectores-title">Sectores disponibles:</p>
                  </IonText>
                  <div className="sectores-container">
                    {item.sectores.slice(0, 4).map((sector) => (
                      <IonChip 
                        key={sector.id} 
                        color="primary" 
                        outline
                        className="sector-chip"
                      >
                        <IonText color="primary">
                          <span className="sector-nombre">{sector.nombre}</span>
                        </IonText>
                      </IonChip>
                    ))}
                    {item.sectores.length > 4 && (
                      <IonChip color="primary" outline className="sector-chip">
                        <IonText color="primary">
                          <span className="mas-texto">
                            +{item.sectores.length - 4}
                          </span>
                        </IonText>
                      </IonChip>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <IonText color="primary">
                    <span className="card-footer-text">Ver pronóstico completo</span>
                  </IonText>
                  <IonIcon icon={chevronForward} color="primary" />
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>

      <InteractiveMapModal 
        isOpen={modalVisible} 
        onClose={closeMapModal} 
      />
    </IonPage>
  );
};

export default PronosticoCosteroScreen;