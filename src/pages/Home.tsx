"use client";

import type React from "react";
import { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonText,
  IonIcon,
  IonAlert,
  IonImg,
} from "@ionic/react";
import {
  informationCircleOutline,
  mailOutline,
  chevronForward,
  logoInstagram,
  logoYoutube,
} from "ionicons/icons";
import {
  Waves,
  FolderOpen,
  TrendingUpDown,
} from "lucide-react";
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
      <IonHeader className="home-header">
        <IonToolbar className="gradient-toolbar">
          <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
          >
        <div style={{
          position: "absolute",
          left: 0,
        }}>
          <IonImg
            src="/assets/images/icon.png"
            alt="Marejadas UV"
            className="logo-image"
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 className="header-title">Marejadas UV</h1>
          <p className="header-subtitle">Información oceánica de Chile</p>
        </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        {/* Banner de login - eliminado temporalmente para coincidir con el diseño de referencia */}

        <div className="featured-section">
          <div className="section-header">
            <IonText
              color="dark"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Servicios de Pronóstico
            </IonText>
            <IonText color="medium">
              Explora nuestros diferentes servicios de información oceánica.
            </IonText>
          </div>

          <FeatureCard
            title="Pronóstico Costero"
            description="Pronóstico de oleaje para los próximos 7 días en el Océano Pacífico y las principales ciudades costeras de Chile."
            icon={Waves}
            gradient={["#4A90E2", "#5C6BC0"]}
            onPress={() => handleFeaturePress("/pronostico-costero")}
          />

          <FeatureCard
            title="Pronóstico Oceánico"
            description="Pronóstico de oleaje para los próximos 7 días en las principales bahías, calculado a una profundidad de 20 metros."
            icon={TrendingUpDown}
            gradient={["#26A69A", "#00796B"]}
            onPress={() => handleFeaturePress("/pronostico-oceanico")}
          />

          <FeatureCard
            title="Categorías"
            description="Material educativo como folletos y videos animados para mejorar tu comprensión del pronóstico marítimo."
            icon={FolderOpen}
            gradient={["#8E24AA", "#6A1B9A"]}
            onPress={() => handleFeaturePress("/categorias")}
          />
        </div>

        <div className="info-section-container">
          <IonText color="dark">
            <h3 className="info-title">Información Adicional</h3>
          </IonText>

          <div className="info-items-wrapper">
            <div
              className="info-item-custom"
              onClick={() => window.open("https://marejadas.uv.cl/", "_blank")}
            >
              <div className="info-icon-container">
                <IonIcon
                  icon={informationCircleOutline}
                  className="info-icon-custom"
                />
              </div>
              <div className="info-content">
                <h4 className="info-item-title">Acerca de los pronósticos</h4>
                <p className="info-item-description">
                  Conoce mas sobre nuestros modelos
                </p>
              </div>
              <IonIcon icon={chevronForward} className="chevron-icon" />
            </div>

            <div
              className="info-item-custom"
              onClick={() =>
                window.open("https://www.instagram.com/marejadasuv/", "_blank")
              }
            >
              <div className="info-icon-container">
                <IonIcon icon={logoInstagram} className="info-icon-custom" />
              </div>
              <div className="info-content">
                <h4 className="info-item-title">Instagram</h4>
                <p className="info-item-description">
                  No te pierdas ninguna novedad
                </p>
              </div>
              <IonIcon icon={chevronForward} className="chevron-icon" />
            </div>

            <div
              className="info-item-custom"
              onClick={() =>
                window.open("https://www.youtube.com/@MarejadasUV", "_blank")
              }
            >
              <div className="info-icon-container">
                <IonIcon icon={logoYoutube} className="info-icon-custom" />
              </div>
              <div className="info-content">
                <h4 className="info-item-title">Youtube</h4>
                <p className="info-item-description">
                  Conoce nuestro canal de Youtube.
                </p>
              </div>
              <IonIcon icon={chevronForward} className="chevron-icon" />
            </div>

            <div
              className="info-item-custom last-item"
              onClick={() => window.open("mailto:marejadas@uv.cl", "_blank")}
            >
              <div className="info-icon-container">
                <IonIcon icon={mailOutline} className="info-icon-custom" />
              </div>
              <div className="info-content">
                <h4 className="info-item-title">Contacto</h4>
                <p className="info-item-description">
                  Ponte en contacto con nuestro equipo
                </p>
              </div>
              <IonIcon icon={chevronForward} className="chevron-icon" />
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="footer-divider"></div>
          <IonText color="medium">
            <p className="footer-text">2026 Marejadas UV</p>
            <p className="footer-subtext">
              Desarrollado por el equipo de investigación oceánica de la
              Universidad de Valparaíso.
            </p>
          </IonText>
        </div>

        {/* Alert para funcionalidades no implementadas */}
        <IonAlert
          isOpen={showLoginAlert}
          onDidDismiss={() => setShowLoginAlert(false)}
          header="Funcionalidad en desarrollo"
          message="Esta característica estará disponible próximamente."
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
