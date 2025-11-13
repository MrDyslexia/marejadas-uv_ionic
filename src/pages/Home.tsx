import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAlert,
} from "@ionic/react";
import {
  lockOpenOutline,
  informationCircleOutline,
  helpCircleOutline,
  mailOutline,
  chevronForward,
} from "ionicons/icons";
import { Waves,FolderOpen, ChartSpline} from "lucide-react";
import { useHistory } from "react-router-dom";
import FeatureCard from "../components/ui/FeatureCard";
import "./Home.css";
const Home: React.FC = () => {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const history = useHistory();
  
  const handleBannerLogin = () => {
    history.push("/login");
  };

  const handleBannerLater = () => {
    setBannerVisible(false);
  };

  const handleFeaturePress = (route: string) => {
    history.push(route);
  };

  const handleInfoItemPress = (item: string) => {
    setShowLoginAlert(true);
  };

  return (
    <IonPage>
      
      <IonHeader >
        <IonToolbar color="primary" className="toolbar">
          <IonTitle>Marejadas UV</IonTitle>
          <IonText className="header-subtitle">
            Información oceánica de Chile
          </IonText>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="home-content">
        
        {/* Banner de login */}
        {bannerVisible && (
          <IonCard className="login-banner">
            <IonCardContent>
              <div className="banner-content">
                <IonIcon 
                  icon={lockOpenOutline} 
                  color="primary" 
                  size="large" 
                  className="banner-icon"
                />
                <div className="banner-text">
                  <IonText>
                    <p>
                      Inicia sesión para desbloquear funcionalidades adicionales 
                      como guardar ubicaciones favoritas y recibir alertas personalizadas.
                    </p>
                  </IonText>
                </div>
              </div>
              <div className="banner-actions">
                <IonButton 
                  fill="solid" 
                  color="primary" 
                  onClick={handleBannerLogin}
                  className="banner-button"
                >
                  Iniciar sesión
                </IonButton>
                <IonButton 
                  fill="clear" 
                  color="medium" 
                  onClick={handleBannerLater}
                  className="banner-button"
                >
                  Más tarde
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Sección de servicios de pronóstico */}
        <div className="featured-section">
          <IonText color="dark">
            <h2 className="section-title">Servicios de Pronóstico</h2>
          </IonText>
          <IonText color="medium">
            <p className="section-description">
              Explora nuestros diferentes servicios.
            </p>
          </IonText>

          <FeatureCard
            title="Pronóstico Costero"
            description="Acá encontrarás el pronóstico de oleaje para los próximos 7 días en el Océano Pacífico y las principales ciudades costeras de Chile. Este pronóstico indica el comportamiento esperado en la zona oceánica (lejos de la costa), y puede dar una idea del oleaje esperado en la costa, que dependerá de la orientación de ésta y la dirección de llegada del oleaje."
            icon={Waves}
            gradient={["#4A90E2", "#5C6BC0"]}
            onPress={() => handleFeaturePress("/pronostico-costero")}
          />

          <FeatureCard
            title="Pronóstico Oceánico"
            description="Aquí encontrarás el pronóstico de oleaje para los próximos 7 días en las principales bahías. Este pronóstico, calculado a una profundidad de 20 metros, indica cómo será el comportamiento del oleaje en la costa."
            icon={ChartSpline}
            gradient={["#26A69A", "#00796B"]}
            onPress={() => handleFeaturePress("/pronostico-oceanico")}
          />

          <FeatureCard
            title="Categorías"
            description="Explora material educativo como folletos y videos animados diseñados para mejorar tu comprensión del pronóstico marítimo."
            icon={FolderOpen}
            gradient={["#8E24AA", "#6A1B9A"]}
            onPress={() => handleFeaturePress("/categorias")}
          />
        </div>

        {/* Sección de información adicional */}
        <IonCard className="info-section">
          <IonCardContent>
            <IonText color="dark">
              <h3 className="info-title">Información Adicional</h3>
            </IonText>
            
            <div className="divider"></div>

            <IonItem 
              className="info-item"
              style={{borderTopLeftRadius: "12px", borderTopRightRadius: "12px", borderLeft: "1px solid var(--ion-color-light-shade)", borderRight: "1px solid var(--ion-color-light-shade)", borderTop: "1px solid var(--ion-color-light-shade)"}}
              button 
              onClick={() => handleInfoItemPress("about")}
            >
              <IonIcon 
              icon={informationCircleOutline} 
              color="primary" 
              slot="start"
              className="info-icon"
              />
              <IonLabel>
              <h3 className="info-item-title">Acerca de los pronósticos</h3>
              <p className="info-item-description">
                Conoce más sobre nuestros modelos de pronóstico
              </p>
              </IonLabel>
              <IonIcon icon={chevronForward} color="medium" slot="end" />
            </IonItem>

            <IonItem 
              className="info-item"
              style={{borderLeft: "1px solid var(--ion-color-light-shade)", borderRight: "1px solid var(--ion-color-light-shade)",}}
              button 
              onClick={() => handleInfoItemPress("faq")}
            >
              <IonIcon 
                icon={helpCircleOutline} 
                color="primary" 
                slot="start"
                className="info-icon"
              />
              <IonLabel>
                <h3 className="info-item-title">Preguntas frecuentes</h3>
                <p className="info-item-description">
                  Respuestas a las dudas más comunes
                </p>
              </IonLabel>
              <IonIcon icon={chevronForward} color="medium" slot="end"/>
            </IonItem>

            <IonItem 
              className="info-item"
              style={{borderLeft: "1px solid var(--ion-color-light-shade)", borderRight: "1px solid var(--ion-color-light-shade)", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px"}}
              button 
              onClick={() => handleInfoItemPress("contact")}
            >
              <IonIcon 
                icon={mailOutline} 
                color="primary" 
                slot="start"
                className="info-icon"
              />
              <IonLabel>
                <h3 className="info-item-title">Contacto</h3>
                <p className="info-item-description">
                  Ponte en contacto con nuestro equipo
                </p>
              </IonLabel>
              <IonIcon icon={chevronForward} color="medium" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Footer */}
        <div className="footer">
          <IonText color="medium">
            <p className="footer-text">© 2025 Marejadas UV</p>
            <p className="footer-text">
              Desarrollado por el equipo de investigación oceánica
            </p>
          </IonText>
        </div>

        {/* Alert para funcionalidades no implementadas */}
        <IonAlert
          isOpen={showLoginAlert}
          onDidDismiss={() => setShowLoginAlert(false)}
          header="Funcionalidad en desarrollo"
          message="Esta característica estará disponible próximamente."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;