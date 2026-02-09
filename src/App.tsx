'use client';

import React, { useState, useEffect } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { FolderOpen, HomeIcon, TrendingDown as TrendingUpDown, Waves } from "lucide-react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import PronosticoCostero from "./pages/PronosticoCostero";
import PronosticoOseanico from "./pages/PronosticoOseanico";
import PronosticoCosteroMap from "./pages/PronosticoCosteroMap";
import PronosticoOseanicoMap from "./pages/PronosticoOseanicoMap";
import CategoriesView from "./pages/CategoriesView";
import PdModal from "./pages/PdModal";
import type { Region } from "./types/type";
import data from "./data/data.json";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

const AppContent: React.FC<{ regionsData: Region[] }> = ({ regionsData }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("home");

  useEffect(() => {
    const pathToTab: { [key: string]: string } = {
      "/home": "home",
      "/pronostico-costero": "Pronostico Costero",
      "/pronostico-oceanico": "Pronostico Oceánico",
      "/categorias": "Categorias",
    };

    const newTab = pathToTab[location.pathname];
    if (newTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  const getIconColor = (tab: string) => {
    return activeTab === tab ? "#0284c7" : "#64748b";
  };

  return (
    <>
      <IonTabs onIonTabsDidChange={(e) => setActiveTab(e.detail.tab || "home")}>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/pronostico-costero">
            <PronosticoCostero />
          </Route>
          <Route exact path="/pronostico-oceanico">
            <PronosticoOseanico regions={regionsData} />
          </Route>
          <Route exact path="/categorias">
            <CategoriesView />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
          <IonTabButton tab="home" href="/home">
            <HomeIcon size={24} color={getIconColor("home")} aria-hidden="true" />
          </IonTabButton>
          <IonTabButton tab="Pronostico Costero" href="/pronostico-costero">
            <Waves size={24} color={getIconColor("Pronostico Costero")} aria-hidden="true" />
          </IonTabButton>
          <IonTabButton tab="Categorias" href="/categorias">
            <FolderOpen size={24} color={getIconColor("Categorias")} aria-hidden="true" />
          </IonTabButton>
          <IonTabButton tab="Pronostico Oceánico" href="/pronostico-oceanico">
            <TrendingUpDown size={24} color={getIconColor("Pronostico Oceánico")} aria-hidden="true" />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      {/* Rutas que NO deben mostrar el tab bar */}
      <Route exact path="/pdmodal">
        <PdModal />
      </Route>
      <Route exact path="/pronostico-costero-map">
        <PronosticoCosteroMap />
      </Route>
      <Route exact path="/pronostico-oceanico-map">
        <PronosticoOseanicoMap />
      </Route>
    </>
  );
};

const App: React.FC = () => {
  const regionsData: Region[] = data.po;

  return (
    <IonApp>
      <IonReactRouter>
        <AppContent regionsData={regionsData} />
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
