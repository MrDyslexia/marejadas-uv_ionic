import React from "react";
import { Redirect, Route } from "react-router-dom";
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
const App: React.FC = () => {
  const regionsData: Region[] = data.po;
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
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
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <HomeIcon size={32} aria-hidden="true" />
            </IonTabButton>
            <IonTabButton tab="Pronostico Costero" href="/pronostico-costero">
              <Waves size={32} aria-hidden="true" />
            </IonTabButton>
            <IonTabButton tab="Categorias" href="/categorias">
              <FolderOpen size={32} aria-hidden="true" />
            </IonTabButton>
            <IonTabButton tab="Pronostico Oceánico" href="/pronostico-oceanico">
              <TrendingUpDown size={32} aria-hidden="true" />
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
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
