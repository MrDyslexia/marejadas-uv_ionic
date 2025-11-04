import React from "react";
import { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import {
  logoGoogle,
  cloudOfflineOutline,
  lockClosed,
  mail,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useIonAlert, useIonToast } from "@ionic/react";
import "./LoginScreen.css";

// Componente temporal para el fondo (reemplaza con tu TideBackground)
const TideBackground = () => (
  <div className="tide-background">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="wave-svg">
      <path
        d="M0,0 C30,40 70,20 100,0 L100,100 L0,100 Z"
        fill="rgba(255,255,255,0.1)"
      />
    </svg>
  </div>
);

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const handleLogin = () => {
    if (!email || !password) {
      presentAlert({
        header: "Error",
        message: "Por favor completa todos los campos",
        buttons: ["OK"],
      });
      return;
    }

    presentToast({
      message: `Bienvenido ${email}`,
      duration: 2000,
      color: "success",
    });

    history.replace("/home");
  };

  const handleGoogleLogin = () => {
    presentAlert({
      header: "Google",
      message: "Login con Google en desarrollo",
      buttons: ["OK"],
    });
  };

  const handleSkip = () => {
    history.replace("/home");
  };

  const handleRegister = () => {
    presentAlert({
      header: "Registro",
      message: "Funcionalidad de registro en desarrollo",
      buttons: ["OK"],
    });
  };

  const handleForgotPassword = () => {
    presentAlert({
      header: "Recuperar contraseña",
      message: "Funcionalidad de recuperación en desarrollo",
      buttons: ["OK"],
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        {/* Fondo SVG geométrico tipo marejada */}
        <div className="background-container">
          <TideBackground />
        </div>

        <div className="scroll-container">
          {/* Logo de la app */}
          <div className="logo-container">
            <img
              src="/assets/images/icon.png"
              alt="App Logo"
              className="logo"
            />
          </div>

          <div className="header">
            <IonText color="light">
              <h1 className="title">Bienvenido</h1>
            </IonText>
            <IonText color="light">
              <p className="subtitle">Inicia sesión para continuar</p>
            </IonText>
          </div>

          <IonCard className="form-card">
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonItem className="form-item">
                      <IonLabel position="stacked">Correo electrónico</IonLabel>
                      <IonInput
                        type="email"
                        placeholder="ejemplo@email.com"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        className="custom-input"
                      >
                        <IonIcon icon={mail} slot="start" />
                      </IonInput>
                    </IonItem>

                    <IonItem className="form-item">
                      <IonLabel position="stacked">Contraseña</IonLabel>
                      <IonInput
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        className="custom-input"
                      >
                        <IonIcon icon={lockClosed} slot="start" />
                      </IonInput>
                    </IonItem>

                    <IonButton
                      fill="clear"
                      className="forgot-password"
                      onClick={handleForgotPassword}
                    >
                      ¿Olvidaste tu contraseña?
                    </IonButton>

                    <IonButton
                      expand="block"
                      className="login-button"
                      onClick={handleLogin}
                    >
                      Iniciar sesión
                    </IonButton>

                    <IonButton
                      expand="block"
                      fill="outline"
                      color="danger"
                      className="google-button"
                      onClick={handleGoogleLogin}
                    >
                      <IonIcon icon={logoGoogle} slot="start" />
                      Continuar con Google
                    </IonButton>

                    <IonButton
                      expand="block"
                      fill="outline"
                      color="primary"
                      className="skip-button"
                      onClick={handleSkip}
                    >
                      <IonIcon icon={cloudOfflineOutline} slot="start" />
                      Entrar en modo offline
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <div className="footer">
            <IonText color="light">
              <span className="footer-text">¿No tienes cuenta?</span>
            </IonText>
            <IonButton fill="clear" size="small" onClick={handleRegister}>
              Regístrate
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;