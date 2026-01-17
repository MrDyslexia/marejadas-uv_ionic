"use client"

import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonModal,
  IonTitle,
  IonButtons,
  IonImg,
} from "@ionic/react"
import {
  chevronBack,
  chevronDown,
  chevronUp,
  folder,
  close,
  chevronForward,
  chevronBackOutline,
  documentTextOutline,
} from "ionicons/icons"
import data from "../../data/data.json"
import "./FolletosScreen.css"



type FolletosScreenProps = { onBack: () => void }

interface Folleto {
  id: string
  nombre: string
  descripcion: string
  imagenes: Array<{
    id: string
    url: string
    descripcion: string
  }>
}

const FolletosScreen: React.FC<FolletosScreenProps> = ({ onBack }) => {
  const { folletos } = data.categorias as unknown as { folletos: Folleto[] }
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({})
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({})
  const [selectedImage, setSelectedImage] = useState<{ urls: string[]; index: number } | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleImageLoad = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }))
  }

  const handleImageError = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }))
    console.error(`Error loading image: ${id}`)
  }

  const expandImage = (folleto: Folleto, selectedImageIndex: number) => {
    const imageUrls = folleto.imagenes.map((img) => img.url)
    setSelectedImage({
      urls: imageUrls,
      index: selectedImageIndex,
    })
    setCurrentImageIndex(selectedImageIndex)
  }

  const toggleFolder = (folletoId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folletoId]: !prev[folletoId],
    }))
  }

  const nextImage = () => {
    if (selectedImage && currentImageIndex < selectedImage.urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (selectedImage && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const renderFolderPreview = (imagenes: any[]) => {
    const previewImages = imagenes.slice(0, 3)

    return (
      <div style={styles.folderPreview}>
        {previewImages.map((img, index) => (
          <div key={img.id} style={styles.previewImageContainer(index, previewImages.length)}>
            <IonImg
              src={img.url}
              alt={`Preview ${index + 1}`}
              style={styles.previewImage}
              onIonImgWillLoad={() => setLoadingImages((prev) => ({ ...prev, [`preview-${img.id}`]: true }))}
              onIonImgDidLoad={() => handleImageLoad(`preview-${img.id}`)}
              onIonError={() => handleImageError(`preview-${img.id}`)}
            />
            {loadingImages[`preview-${img.id}`] && (
              <div style={styles.previewLoadingOverlay}>
                <IonSpinner color="primary" />
              </div>
            )}
          </div>
        ))}

        <div style={styles.folderIcon}>
          <IonIcon icon={folder} style={styles.folderIconInner} />
        </div>

        <div style={styles.imageCounter}>
          <span style={styles.imageCounterText}>{imagenes.length}</span>
        </div>
      </div>
    )
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border" style={styles.header}>
        <IonToolbar style={styles.headerToolbar}>
          <div style={styles.headerContent}>
            <IonButton fill="clear" onClick={onBack} style={styles.backButton}>
              <IonIcon icon={chevronBack} slot="icon-only" style={styles.backButtonIcon} />
            </IonButton>

            <div style={styles.headerInfo}>
              <h1 style={styles.headerTitle}>Folletos</h1>
              <p style={styles.headerSubtitle}>
                {folletos.length} {folletos.length === 1 ? "folleto" : "folletos"} disponibles
              </p>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={styles.content}>
        <div style={styles.contentContainer}>
          {folletos.map((folleto) => (
            <IonCard key={folleto.id} style={styles.folderContainer}>
              <IonCardContent style={{ padding: 0 }}>
                <button style={styles.folderHeader} onClick={() => toggleFolder(folleto.id)} type="button">
                  <div style={styles.folderInfo}>
                    {renderFolderPreview(folleto.imagenes)}
                    <div style={styles.folderDetails}>
                      <h2 style={styles.folderName}>{folleto.nombre || folleto.descripcion}</h2>
                      <p style={styles.folderSubtitle}>
                        {folleto.imagenes.length} {folleto.imagenes.length === 1 ? "imagen" : "imágenes"}
                      </p>
                    </div>
                  </div>

                  <div style={styles.expandButton}>
                    <IonIcon icon={expandedFolders[folleto.id] ? chevronUp : chevronDown} color="medium" size="small" />
                  </div>
                </button>

                {expandedFolders[folleto.id] && (
                  <div style={styles.expandedContent}>
                    <IonGrid>
                      <IonRow>
                        {folleto.imagenes.map((img, imageIndex) => (
                          <IonCol size="6" key={img.id}>
                            <div style={styles.imageWrapper}>
                              <button style={styles.imageContainer} onClick={() => expandImage(folleto, imageIndex)}>
                                <IonImg
                                  src={img.url}
                                  alt={img.descripcion}
                                  style={styles.image}
                                  onIonImgWillLoad={() => setLoadingImages((prev) => ({ ...prev, [img.id]: true }))}
                                  onIonImgDidLoad={() => handleImageLoad(img.id)}
                                  onIonError={() => handleImageError(img.id)}
                                />
                                {loadingImages[img.id] && (
                                  <div style={styles.loadingOverlay}>
                                    <IonSpinner color="primary" />
                                  </div>
                                )}
                              </button>
                              <p style={styles.imageDescription}>{img.descripcion}</p>
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
            <div style={styles.emptyState}>
              <IonIcon icon={documentTextOutline} style={styles.emptyStateIcon} />
              <p style={styles.emptyStateText}>No hay folletos disponibles</p>
            </div>
          )}
        </div>
      </IonContent>

      <IonModal
        isOpen={!!selectedImage}
        onDidDismiss={() => {
          setSelectedImage(null)
          setCurrentImageIndex(0)
        }}
        style={{ "--width": "100%", "--height": "100%", "--border-radius": "0" } as React.CSSProperties}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedImage && `Imagen ${currentImageIndex + 1} de ${selectedImage.urls.length}`}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setSelectedImage(null)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent style={styles.imageModalContent}>
          {selectedImage && (
            <div style={styles.imageViewer}>
              <IonButton
                style={{
                  ...styles.navButton,
                  ...(currentImageIndex === 0 ? styles.navButtonDisabled : {}),
                }}
                fill="clear"
                color="light"
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                <IonIcon icon={chevronBackOutline} />
              </IonButton>

              <div style={styles.imageContainerModal}>
                <IonImg
                  src={selectedImage.urls[currentImageIndex]}
                  alt={`Imagen ${currentImageIndex + 1}`}
                  style={styles.expandedImage}
                  onIonImgWillLoad={() =>
                    setLoadingImages((prev) => ({ ...prev, [`modal-${currentImageIndex}`]: true }))
                  }
                  onIonImgDidLoad={() => handleImageLoad(`modal-${currentImageIndex}`)}
                  onIonError={() => handleImageError(`modal-${currentImageIndex}`)}
                />
                {loadingImages[`modal-${currentImageIndex}`] && (
                  <div style={styles.modalLoadingOverlay}>
                    <IonSpinner color="primary" />
                  </div>
                )}
              </div>

              <IonButton
                style={{
                  ...styles.navButton,
                  ...(currentImageIndex === selectedImage.urls.length - 1 ? styles.navButtonDisabled : {}),
                }}
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
  )
}
const styles = {
  header: {
    background: "transparent",
  },
  headerToolbar: {
    "--background": "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)",
    "--color": "#ffffff",
    paddingBottom: "14px",
  } as React.CSSProperties,
  headerContent: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    padding: "12px 20px",
    gap: "12px",
  },
  backButton: {
    "--color": "#ffffff",
    "--background": "rgba(255, 255, 255, 0.2)",
    "--background-hover": "rgba(255, 255, 255, 0.3)",
    "--background-activated": "rgba(255, 255, 255, 0.25)",
    "--border-radius": "50%",
    "--padding-start": "0",
    "--padding-end": "0",
    width: "40px",
    height: "40px",
    minWidth: "40px",
    margin: "0",
  } as React.CSSProperties,
  backButtonIcon: {
    fontSize: "24px",
  },
  headerInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: 700,
    margin: "12px 0 2px 0",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: "14px",
    margin: 0,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: 400,
  },
  content: {
    "--background": "#f1f5f9",
  } as React.CSSProperties,
  contentContainer: {
    padding: "16px",
    paddingBottom: "40px",
  },
  folderContainer: {
    marginBottom: "12px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },
  folderHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    width: "100%",
  },
  folderInfo: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  folderPreview: {
    width: "80px",
    height: "60px",
    marginRight: "16px",
    position: "relative" as const,
  },
  previewImageContainer: (index: number, total: number) => ({
    position: "absolute" as const,
    width: "50px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(15, 23, 42, 0.1)",
    overflow: "hidden",
    zIndex: total - index,
    transform: `translateX(${index * 8}px) translateY(${index * 6}px) rotate(${index * 2 - 2}deg)`,
  }),
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: "6px",
    objectFit: "cover" as const,
  },
  previewLoadingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(241, 245, 249, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "6px",
  },
  folderIcon: {
    position: "absolute" as const,
    top: "-6px",
    right: "8px",
    backgroundColor: "#e0f2fe",
    borderRadius: "8px",
    padding: "4px",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.1)",
    zIndex: 12,
  },
  folderIconInner: {
    color: "#0284c7",
    fontSize: "20px",
  },
  imageCounter: {
    position: "absolute" as const,
    bottom: "-2px",
    right: "8px",
    backgroundColor: "#0284c7",
    borderRadius: "10px",
    minWidth: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 6px",
    zIndex: 100,
  },
  imageCounterText: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#ffffff",
  },
  folderDetails: {
    flex: 1,
  },
  folderName: {
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 4px 0",
    color: "#0f172a",
  },
  folderSubtitle: {
    fontSize: "13px",
    margin: 0,
    color: "#64748b",
  },
  expandButton: {
    width: "36px",
    height: "36px",
    borderRadius: "18px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    cursor: "pointer",
  },
  expandedContent: {
    padding: "0 16px 16px 16px",
    borderTop: "1px solid #e2e8f0",
  },
  imageWrapper: {
    marginBottom: "12px",
  },
  imageContainer: {
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    height: "140px",
    position: "relative" as const,
    border: "none",
    width: "100%",
    padding: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    objectFit: "cover" as const,
  },
  loadingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(241, 245, 249, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDescription: {
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "8px",
    lineHeight: "16px",
    color: "#64748b",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 0",
  },
  emptyStateIcon: {
    fontSize: "48px",
    color: "#cbd5e1",
    marginBottom: "12px",
  },
  emptyStateText: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0,
  },
  // Modal styles
  imageModalContent: {
    "--background": "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as const,
  } as React.CSSProperties,
  imageViewer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative" as const,
    padding: "0 20px",
  },
  imageContainerModal: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    maxWidth: "calc(100% - 120px)",
    position: "relative" as const,
  },
  expandedImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain" as const,
  },
  navButton: {
    "--background": "rgba(255, 255, 255, 0.2)",
    "--background-hover": "rgba(255, 255, 255, 0.4)",
    "--background-activated": "rgba(255, 255, 255, 0.3)",
    "--border-radius": "50%",
    width: "50px",
    height: "50px",
    margin: "0 1rem",
  } as React.CSSProperties,
  navButtonDisabled: {
    "--background": "rgba(255, 255, 255, 0.1)",
    opacity: 0.5,
  } as React.CSSProperties,
  modalLoadingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}
export default FolletosScreen
