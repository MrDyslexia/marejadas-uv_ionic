"use client"

import type React from "react"
import { useState, useEffect, type CSSProperties } from "react"
import { IonContent, IonPage, IonHeader, IonToolbar, IonButton, IonIcon, IonSpinner } from "@ionic/react"
import { chevronBack, playCircle, warning } from "ionicons/icons"
import data from "../../data/data.json"

type VideosScreenProps = { onBack: () => void }

interface Video {
  id: string
  nombre: string
  descripcion: string
  url: string
  limitante?: string
}
const VideosScreen: React.FC<VideosScreenProps> = ({ onBack }) => {
  const { videos } = data.categorias as { videos: Video[] }
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [cachedUris, setCachedUris] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const cacheGifs = async () => {
      const uris: { [key: string]: string } = {}
      let completed = 0

      for (const video of videos) {
        try {
          uris[video.id] = video.url
        } catch (err) {
          console.error("Error procesando GIF:", video.url, err)
          uris[video.id] = video.url
        }

        completed++
        setProgress(Math.round((completed / videos.length) * 100))
      }

      setCachedUris(uris)
      setLoading(false)
    }

    cacheGifs()
  }, [videos])

  return (
    <IonPage>
      <IonHeader className="ion-no-border" style={styles.header}>
        <IonToolbar style={styles.headerToolbar}>
          <div style={styles.headerContent}>
            <IonButton fill="clear" onClick={onBack} style={styles.backButton}>
              <IonIcon icon={chevronBack} slot="icon-only" style={styles.backButtonIcon} />
            </IonButton>

            <div style={styles.headerInfo}>
              <h1 style={styles.headerTitle}>Marejadas en acción</h1>
              <p style={styles.headerSubtitle}>Aprende con animaciones educativas</p>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ "--background": "#f1f5f9" } as CSSProperties}>
        {loading ? (
          <div style={styles.loaderContainer}>
            <div style={styles.loaderCard}>
              <div style={styles.loaderIconContainer}>
                <IonSpinner color="primary" />
              </div>
              <span style={styles.loaderTitle}>Descargando contenido</span>
              <span style={styles.loaderSubtitle}>
                {Math.round((progress / 100) * videos.length)} de {videos.length} videos
              </span>
              <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${progress}%` }} />
              </div>
              <span style={styles.loaderPercent}>{progress}%</span>
            </div>
          </div>
        ) : (
          <div style={styles.contentContainer}>
            {videos.map((video) => (
              <div key={video.id} style={styles.videoCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitleRow}>
                    <div style={styles.cardIconContainer}>
                      <IonIcon icon={playCircle} style={styles.cardIcon} />
                    </div>
                    <h2 style={styles.videoTitle}>{video.nombre}</h2>
                  </div>
                  <div style={styles.videoBadge}>
                    <span style={styles.videoBadgeText}>GIF</span>
                  </div>
                </div>

                <div style={styles.mediaContainer}>
                  <img
                    src={cachedUris[video.id] || "/placeholder.svg"}
                    alt={video.descripcion}
                    style={styles.videoGif}
                  />
                </div>

                <div style={styles.cardContent}>
                  <p style={styles.videoDescription}>{video.descripcion}</p>
                  {video.limitante && (
                    <div style={styles.limitanteContainer}>
                      <div style={styles.limitanteHeader}>
                        <IonIcon icon={warning} style={styles.limitanteIcon} />
                        <span style={styles.limitanteLabel}>Limitante</span>
                      </div>
                      <p style={styles.limitanteText}>{video.limitante}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}
const styles: { [key: string]: CSSProperties | Record<string, any> } = {
  // Header
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

  // Loader
  loaderContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "60vh",
  },
  loaderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
  },
  loaderIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0f2fe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loaderTitle: {
    fontSize: "1.0625rem",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 4,
  },
  loaderSubtitle: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginBottom: 20,
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden" as const,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0284c7",
    borderRadius: 3,
    transition: "width 0.3s ease",
  },
  loaderPercent: {
    marginTop: 12,
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#0284c7",
  },

  // Content
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  // Video Card
  videoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden" as const,
    marginBottom: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitleRow: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    flex: 1,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardIcon: {
    fontSize: 18,
    color: "#0284c7",
  },
  videoTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
    flex: 1,
  },
  videoBadge: {
    backgroundColor: "#e0f2fe",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  videoBadgeText: {
    fontSize: "0.6875rem",
    color: "#0284c7",
    fontWeight: 600,
  },
  mediaContainer: {
    backgroundColor: "#ffffff",
  },
  videoGif: {
    width: "100%",
    height: 200,
    objectFit: "cover" as const,
  },
  cardContent: {
    padding: 16,
  },
  videoDescription: {
    fontSize: "0.875rem",
    color: "#475569",
    lineHeight: 1.6,
    margin: 0,
  },
  limitanteContainer: {
    backgroundColor: "#fffbeb",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    border: "1px solid #fef3c7",
  },
  limitanteHeader: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    marginBottom: 4,
  },
  limitanteIcon: {
    fontSize: 14,
    color: "#d97706",
  },
  limitanteLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#d97706",
    marginLeft: 6,
  },
  limitanteText: {
    fontSize: "0.8125rem",
    color: "#92400e",
    lineHeight: 1.4,
    margin: 0,
  },
}
export default VideosScreen
