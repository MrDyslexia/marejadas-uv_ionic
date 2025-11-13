import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { closeOutline, expandOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import type { Region } from "../../types/type";
import "./RegionDetailModal.css";

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
  const history = useHistory();

  if (!region) return null;

  const attributeNames = {
    categoria: "Categoría",
    altura: "Altura",
    periodo: "Periodo",
    direccion: "Dirección",
    espectro: "Espectro",
  };

  const expandImage = (image: string) => {
    onClose();
    setTimeout(() => {
      history.push("/img-expand", { expandedImage: image });
    }, 100);
  };

  type AttributeKey = keyof typeof attributeNames;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="region-detail-modal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{region.nombre}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="modal-content">
        <IonCard className="region-info-card">
          <IonCardContent>
            <IonText color="medium">
              <p className="coordinates">
                Lat: {region.lat}° | Lon: {region.lon}°
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonText>
              <h2 className="details-title">Datos de Pronóstico</h2>
            </IonText>

            <IonGrid>
              <IonRow>
                {(Object.keys(attributeNames) as AttributeKey[]).map((key) => (
                  <IonCol size="12" size-md="6" key={key}>
                    <div className="detail-item">
                      <IonText>
                        <h3 className="detail-label">{attributeNames[key]}</h3>
                      </IonText>
                      
                      <div className="image-container">
                        <IonButton
                          fill="clear"
                          className="expand-button"
                          onClick={() => expandImage(region.datosPronostico[key])}
                        >
                          <IonIcon icon={expandOutline} slot="icon-only" />
                        </IonButton>
                        <img
                          src={region.datosPronostico[key]}
                          alt={attributeNames[key]}
                          className="detail-image"
                        />
                      </div>
                    </div>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default RegionDetailModal;