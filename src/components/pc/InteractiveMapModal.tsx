import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from "@ionic/react";
import { close } from "ionicons/icons";
import { GoogleMap } from "@capacitor/google-maps";

const InteractiveMapModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<GoogleMap | undefined>(undefined);

  React.useEffect(() => {
    if (isOpen && mapRef.current) {
      createMap();
    }

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, [isOpen]);

  const createMap = async () => {
    if (!mapRef.current) return;

    const newMap = await GoogleMap.create({
      id: 'coastal-map',
      element: mapRef.current,
      apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      config: {
        center: {
          lat: -33.4489,
          lng: -70.6693,
        },
        zoom: 10,
      },
    });

    setMap(newMap);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa Costero</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      </IonContent>
    </IonModal>
  );
};

export default InteractiveMapModal;