'use client';

import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { close } from 'ionicons/icons';
import './PronosticoOseanicoMap.css';

const PronosticoOseanicoMap: React.FC = () => {
  const history = useHistory();

  const handleClose = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mapa Pronóstico Oceánico</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            color="light"
            onClick={handleClose}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="map-page-content">
        <div className="coming-soon-container">
          <h2>Mapa de Pronóstico Oceánico</h2>
          <p>Próximamente...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PronosticoOseanicoMap;
