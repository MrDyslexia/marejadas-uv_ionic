import React, { useState } from "react";
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
} from "@ionic/react";
import { bookOutline, filmOutline, arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import FolletosScreen from "../components/categorias/FolletosScreen";
import VideosScreen from "../components/categorias/VideosScreen";
import TideBackground from "../components/categorias/TideBackground";
import "./CategoriesView.css";

type ViewType = "main" | "folletos" | "videos";

const CategoriesView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const history = useHistory();

  const handleSelectView = (viewName: ViewType) => {
    setCurrentView(viewName);
  };

  const handleBack = () => {
    setCurrentView("main");
  };

  const handleNavigateBack = () => {
    history.goBack();
  };

  // Renderizar vistas específicas
  if (currentView === "folletos") {
    return <FolletosScreen onBack={handleBack} />;
  }

  if (currentView === "videos") {
    return <VideosScreen onBack={handleBack} />;
  }

  // Vista principal
  return (
    <IonPage className="content">
      <IonContent fullscreen className="categories-content">
        {/* Fondo SVG */}
        <div className="background-container">
          <TideBackground />
        </div>

        <div className="scroll-container">
          {/* Header con botón de retroceso */}
          <div className="header-section">
            <IonButton 
              fill="clear" 
              className="back-button"
              onClick={handleNavigateBack}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              Atrás
            </IonButton>
          </div>

          <div className="container">
            <div className="header-container">
              <IonText color="primary">
                <h1 className="header">Explora Nuestras Categorías</h1>
              </IonText>
              <IonText color="medium">
                <p className="subtext">
                  Descubre contenido educativo que te inspire
                </p>
              </IonText>
            </div>

            <div className="categories-container">
              <IonGrid>
                <IonRow>
                  <IonCol size="12" size-md="6">
                    <IonCard 
                      className="category-card folletos-card" 
                      button 
                      onClick={() => handleSelectView("folletos")}
                    >
                      <IonCardContent>
                        <div className="card-icon-container">
                          <IonIcon 
                            icon={bookOutline} 
                            color="primary" 
                            size="large" 
                          />
                        </div>
                        
                        <IonText color="dark">
                          <h2 className="category-title">Folletos</h2>
                        </IonText>
                        
                        <IonText color="medium">
                          <p className="category-description">
                            Accede a recursos visuales que te ayudarán a aprender
                          </p>
                        </IonText>

                        <IonButton 
                          fill="solid" 
                          color="primary" 
                          className="card-button"
                        >
                          Explorar
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  <IonCol size="12" size-md="6">
                    <IonCard 
                      className="category-card videos-card" 
                      button 
                      onClick={() => handleSelectView("videos")}
                    >
                      <IonCardContent>
                        <div className="card-icon-container">
                          <IonIcon 
                            icon={filmOutline} 
                            color="primary" 
                            size="large" 
                          />
                        </div>
                        
                        <IonText color="dark">
                          <h2 className="category-title">Videos</h2>
                        </IonText>
                        
                        <IonText color="medium">
                          <p className="category-description">
                            Aprende a tu ritmo con nuestros videos educativos
                          </p>
                        </IonText>

                        <IonButton 
                          fill="solid" 
                          color="primary" 
                          className="card-button"
                        >
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
  );
};

export default CategoriesView;