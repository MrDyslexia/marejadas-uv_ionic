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
  IonSpinner,
  IonBadge
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import data from "../../data/data.json";
import "./VideosScreen.css";

type VideosScreenProps = { onBack: () => void };

interface Video {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  limitante?: string;
}

const VideosScreen: React.FC<VideosScreenProps> = ({ onBack }) => {
  const { videos } = data.categorias as { videos: Video[] };
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [cachedUris, setCachedUris] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const cacheGifs = async () => {
      const uris: { [key: string]: string } = {};
      let completed = 0;

      for (const video of videos) {
        try {
          // En Ionic React, podemos usar el cache del navegador
          // Para una implementación más avanzada, considerar IndexedDB
          uris[video.id] = video.url;
        } catch (err) {
          console.error("Error procesando GIF:", video.url, err);
          uris[video.id] = video.url;
        }

        completed++;
        setProgress(Math.round((completed / videos.length) * 100));
      }

      setCachedUris(uris);
      setLoading(false);
    };

    cacheGifs();
  }, [videos]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButton 
            fill="clear" 
            slot="start" 
            onClick={onBack}
            className="back-button"
          >
            <IonIcon icon={chevronBack} slot="start" />
            Atrás
          </IonButton>
          <IonTitle>
            <div className="header-title-group">
              <IonText color="dark">
                <h1 className="header-title">Marejadas en acción</h1>
              </IonText>
              <IonText color="medium">
                <p className="header-subtitle">
                  Aprende a tu ritmo con nuestras animaciones educativas
                </p>
              </IonText>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="videos-content">
        {loading ? (
          <div className="loader-container">
            <IonSpinner color="primary" />
            <IonText color="dark">
              <p className="loader-text">
                Cargando contenido... {progress}%
              </p>
            </IonText>
            <IonText color="medium">
              <p className="loader-sub-text">
                {progress}% ({Math.round((progress / 100) * videos.length)} de {videos.length})
              </p>
            </IonText>
          </div>
        ) : (
          <div className="content-container">
            {videos.map((video) => (
              <IonCard key={video.id} className="video-card">
                <IonCardContent>
                  <div className="card-header">
                    <IonText color="dark">
                      <h2 className="video-title">{video.nombre}</h2>
                    </IonText>
                    <IonBadge color="success" className="video-badge">
                      GIF
                    </IonBadge>
                  </div>

                  <div className="media-container">
                    <img
                      src={cachedUris[video.id]}
                      alt={video.descripcion}
                      className="video-gif"
                    />
                  </div>

                  <div className="card-content">
                    <IonText color="medium">
                      <p className="video-description">{video.descripcion}</p>
                    </IonText>
                    {video.limitante && (
                      <div className="limitante-container">
                        <IonText color="warning">
                          <p className="limitante-label">Limitante:</p>
                        </IonText>
                        <IonText color="warning">
                          <p className="limitante-text">{video.limitante}</p>
                        </IonText>
                      </div>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default VideosScreen;