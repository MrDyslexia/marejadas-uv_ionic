"use client"

import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonText,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import { bookOutline, filmOutline, arrowBackOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import FolletosScreen from "../components/categorias/FolletosScreen"
import VideosScreen from "../components/categorias/VideosScreen"
import TideBackground from "../components/categorias/TideBackground"
import "./CategoriesView.css"

type ViewType = "main" | "folletos" | "videos"

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
  },
  categoriesContent: {
    // --background se mantiene en CSS por ser variable de Ionic
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 0,
  },
  scrollContainer: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  headerSection: {
    padding: "16px",
  },
  backButton: {
    margin: 0,
  },
  container: {
    flex: 1,
    padding: "2% 5% 40px 5%",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: "4vh",
  },
  header: {
    fontSize: "7vw",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  subtext: {
    fontSize: "4vw",
    margin: 0,
    lineHeight: 1.4,
    padding: "0 5%",
  },
  categoriesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "3vh",
    marginBottom: "5vh",
  },
  categoryCard: {
    borderRadius: "20px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    margin: "0 auto",
    transition: "all 0.3s ease",
    maxWidth: "500px",
    borderLeft: "4px solid var(--ion-color-primary)",
  },
  cardIconContainer: {
    width: "15vw",
    height: "15vw",
    maxWidth: "70px",
    maxHeight: "70px",
    backgroundColor: "#b9e0ff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 2vh auto",
  },
  categoryTitle: {
    fontSize: "5.5vw",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    textAlign: "center",
    color: "var(--ion-color-dark)",
  },
  categoryDescription: {
    fontSize: "3.5vw",
    margin: "0 0 2vh 0",
    textAlign: "center",
    lineHeight: 1.4,
    color: "var(--ion-color-medium)",
    padding: "0 2%",
  },
  cardButton: {
    margin: "0 auto",
    display: "block",
    minWidth: "30vw",
    fontWeight: 600,
    fontSize: "4vw",
  },
}

const CategoriesView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("main")
  const history = useHistory()

  const handleSelectView = (viewName: ViewType) => {
    setCurrentView(viewName)
  }

  const handleBack = () => {
    setCurrentView("main")
  }

  const handleNavigateBack = () => {
    history.goBack()
  }

  // Renderizar vistas específicas
  if (currentView === "folletos") {
    return <FolletosScreen onBack={handleBack} />
  }

  if (currentView === "videos") {
    return <VideosScreen onBack={handleBack} />
  }

  // Vista principal
  return (
    <IonPage style={styles.content}>
      <IonContent fullscreen className="categories-content">
        {/* Fondo SVG */}
        <div style={styles.backgroundContainer}>
          <TideBackground />
        </div>

        <div style={styles.scrollContainer}>
          {/* Header con botón de retroceso */}
          <div style={styles.headerSection}>
            <IonButton fill="clear" style={styles.backButton} onClick={handleNavigateBack}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              Atrás
            </IonButton>
          </div>

          <div style={styles.container}>
            <div style={styles.headerContainer}>
              <IonText color="primary">
                <h1 style={styles.header}>Explora Nuestras Categorías</h1>
              </IonText>
              <IonText color="medium">
                <p style={styles.subtext}>Descubre contenido educativo que te inspire</p>
              </IonText>
            </div>

            <div style={styles.categoriesContainer}>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" size-md="6">
                    <IonCard style={styles.categoryCard} button onClick={() => handleSelectView("folletos")}>
                      <IonCardContent>
                        <div style={styles.cardIconContainer}>
                          <IonIcon icon={bookOutline} color="primary" size="large" />
                        </div>

                        <IonText color="dark">
                          <h2 style={styles.categoryTitle}>Folletos</h2>
                        </IonText>

                        <IonText color="medium">
                          <p style={styles.categoryDescription}>
                            Accede a recursos visuales que te ayudarán a aprender
                          </p>
                        </IonText>

                        <IonButton fill="solid" color="primary" style={styles.cardButton}>
                          Explorar
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  <IonCol size="12" size-md="6">
                    <IonCard style={styles.categoryCard} button onClick={() => handleSelectView("videos")}>
                      <IonCardContent>
                        <div style={styles.cardIconContainer}>
                          <IonIcon icon={filmOutline} color="primary" size="large" />
                        </div>

                        <IonText color="dark">
                          <h2 style={styles.categoryTitle}>Videos</h2>
                        </IonText>

                        <IonText color="medium">
                          <p style={styles.categoryDescription}>Aprende a tu ritmo con nuestros videos educativos</p>
                        </IonText>

                        <IonButton fill="solid" color="primary" style={styles.cardButton}>
                          Ver Videos
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CategoriesView
