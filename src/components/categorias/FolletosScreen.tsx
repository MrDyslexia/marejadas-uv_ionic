import React, { useState } from "react";
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
  IonModal,
  IonButtons,
  IonImg
} from "@ionic/react";
import {
  chevronBack,
  chevronDown,
  chevronUp,
  folder,
  close,
  chevronForward,
  chevronBackOutline
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import data from "../../data/data.json";
import "./FolletosScreen.css";

type FolletosScreenProps = { onBack: () => void };

interface Folleto {
  id: string;
  nombre: string;
  descripcion: string;
  imagenes: Array<{
    id: string;
    url: string;
    descripcion: string;
  }>;
}

const FolletosScreen: React.FC<FolletosScreenProps> = ({ onBack }) => {
  const { folletos } = data.categorias as unknown as { folletos: Folleto[] };
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<{urls: string[], index: number} | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const history = useHistory();

  // Manejar carga de imágenes con IonImg
  const handleImageLoad = (id: string) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: string) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
    console.error(`Error loading image: ${id}`);
  };

  const expandImage = (folleto: Folleto, selectedImageIndex: number) => {
    const imageUrls = folleto.imagenes.map(img => img.url);
    setSelectedImage({
      urls: imageUrls,
      index: selectedImageIndex
    });
    setCurrentImageIndex(selectedImageIndex);
  };

  const toggleFolder = (folletoId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folletoId]: !prev[folletoId]
    }));
  };

  const nextImage = () => {
    if (selectedImage && currentImageIndex < selectedImage.urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const renderFolderPreview = (imagenes: any[]) => {
    const previewImages = imagenes.slice(0, 3);

    return (
      <div className="folder-preview">
        {previewImages.map((img, index) => (
          <div
            key={img.id}
            className="preview-image-container"
            style={{
              zIndex: previewImages.length - index,
              transform: `translateX(${index * 8}px) translateY(${index * 6}px) rotate(${index * 2 - 2}deg)`
            }}
          >
            <IonImg
              src={img.url}
              alt={`Preview ${index + 1}`}
              className="preview-image"
              onIonImgWillLoad={() => setLoadingImages(prev => ({ ...prev, [`preview-${img.id}`]: true }))}
              onIonImgDidLoad={() => handleImageLoad(`preview-${img.id}`)}
              onIonError={() => handleImageError(`preview-${img.id}`)}
            />
            {loadingImages[`preview-${img.id}`] && (
              <div className="preview-loading-overlay">
                <IonSpinner color="primary" />
              </div>
            )}
          </div>
        ))}

        {/* Icono de carpeta en la esquina */}
        <div className="folder-icon">
          <IonIcon icon={folder} color="warning" />
        </div>

        {/* Contador de imágenes */}
        <div className="image-counter">
          <IonText color="light">
            <span className="image-counter-text">{imagenes.length}</span>
          </IonText>
        </div>
      </div>
    );
  };

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
                <h1 className="header-title">Folletos</h1>
              </IonText>
              <IonText color="medium">
                <p className="header-counter">
                  {folletos.length} {folletos.length === 1 ? "folleto" : "folletos"} disponibles
                </p>
              </IonText>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="folletos-content">
        <div className="content-container">
          {folletos.map((folleto) => (
            <IonCard key={folleto.id} className="folder-container">
              <IonCardContent>
                <div 
                  className="folder-header" 
                  onClick={() => toggleFolder(folleto.id)}
                >
                  <div className="folder-info">
                    {renderFolderPreview(folleto.imagenes)}
                    <div className="folder-details">
                      <IonText color="dark">
                        <h2 className="folder-name">
                          {folleto.nombre || folleto.descripcion}
                        </h2>
                      </IonText>
                      <IonText color="medium">
                        <p className="folder-subtitle">
                          {folleto.imagenes.length} {folleto.imagenes.length === 1 ? "imagen" : "imágenes"}
                        </p>
                      </IonText>
                    </div>
                  </div>

                  <div className="expand-button">
                    <IonIcon
                      icon={expandedFolders[folleto.id] ? chevronUp : chevronDown}
                      color="medium"
                    />
                  </div>
                </div>

                {expandedFolders[folleto.id] && (
                  <div className="expanded-content">
                    <IonGrid>
                      <IonRow>
                        {folleto.imagenes.map((img, imageIndex) => (
                          <IonCol size="6" key={img.id}>
                            <div className="image-wrapper">
                              <div 
                                className="image-container"
                                onClick={() => expandImage(folleto, imageIndex)}
                              >
                                <IonImg
                                  src={img.url}
                                  alt={img.descripcion}
                                  className="image"
                                  onIonImgWillLoad={() => setLoadingImages(prev => ({ ...prev, [img.id]: true }))}
                                  onIonImgDidLoad={() => handleImageLoad(img.id)}
                                  onIonError={() => handleImageError(img.id)}
                                />
                                {loadingImages[img.id] && (
                                  <div className="loading-overlay">
                                    <IonSpinner color="primary" />
                                  </div>
                                )}
                              </div>
                              <IonText color="medium">
                                <p className="image-description">{img.descripcion}</p>
                              </IonText>
                            </div>
                          </IonCol>
                        ))}
                      </IonRow>
                    </IonGrid>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          ))}

          {!folletos.length && (
            <div className="empty-state">
              <IonText color="medium">
                <p className="empty-state-text">No hay folletos disponibles</p>
              </IonText>
            </div>
          )}
        </div>
      </IonContent>

      {/* Modal para imagen expandida */}
      <IonModal 
        isOpen={!!selectedImage} 
        onDidDismiss={() => {
          setSelectedImage(null);
          setCurrentImageIndex(0);
        }}
        className="image-modal"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              {selectedImage && `Imagen ${currentImageIndex + 1} de ${selectedImage.urls.length}`}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setSelectedImage(null)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="image-modal-content">
          {selectedImage && (
            <div className="image-viewer">
              <IonButton 
                className="nav-button prev-button"
                fill="clear"
                color="light"
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                <IonIcon icon={chevronBackOutline} />
              </IonButton>
              
              <div className="image-container-modal">
                <IonImg
                  src={selectedImage.urls[currentImageIndex]}
                  alt={`Imagen ${currentImageIndex + 1}`}
                  className="expanded-image"
                  onIonImgWillLoad={() => setLoadingImages(prev => ({ ...prev, [`modal-${currentImageIndex}`]: true }))}
                  onIonImgDidLoad={() => handleImageLoad(`modal-${currentImageIndex}`)}
                  onIonError={() => handleImageError(`modal-${currentImageIndex}`)}
                />
                {loadingImages[`modal-${currentImageIndex}`] && (
                  <div className="modal-loading-overlay">
                    <IonSpinner color="primary" />
                  </div>
                )}
              </div>

              <IonButton 
                className="nav-button next-button"
                fill="clear"
                color="light"
                onClick={nextImage}
                disabled={currentImageIndex === selectedImage.urls.length - 1}
              >
                <IonIcon icon={chevronForward} />
              </IonButton>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default FolletosScreen;