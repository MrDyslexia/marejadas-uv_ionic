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
} from "@ionic/react";
import { closeOutline, navigateOutline } from "ionicons/icons";
import "./InteractiveMapModal.css";

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions?: any[];
  onRegionSelect?: (region: any) => void;
}

const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="interactive-map-modal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mapa Interactivo</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="map-content">
        <div className="map-container">
          {/* Aquí iría tu implementación del mapa */}
          <div className="map-placeholder">
            <IonIcon icon={navigateOutline} className="map-icon" />
            <h3>Mapa Interactivo</h3>
            <p>Implementación del mapa con Google Maps o similar</p>
            <p>Coordenadas iniciales: -33.4489, -70.6693</p>
          </div>
          
        </div>
      </IonContent>
    </IonModal>
  );
};

export default InteractiveMapModal;