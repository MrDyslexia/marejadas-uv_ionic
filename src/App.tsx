import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { ChartSpline, FolderOpen, HomeIcon, Waves} from 'lucide-react';
import { IonReactRouter } from '@ionic/react-router';
import LoginScreen from './pages/LoginScreen';
import Home from './pages/Home';
import PronosticoCostero from './pages/PronosticoCostero';
//import PronosticoOceánico from './pages/PronosticoOceánico';
import CategoriesView from './pages/CategoriesView';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/login">
            <LoginScreen />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/pronostico-costero">
            <PronosticoCostero />
          </Route>
          {/*<Route exact path="/pronostico-oceanico">
            <PronosticoOceánico />
          </Route>*/}
          <Route exact path="/categorias">
            <CategoriesView />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <HomeIcon size={32} aria-hidden="true" />
            
          </IonTabButton>
          <IonTabButton tab="Pronostico Costero" href="/pronostico-costero">
            <Waves size={32} aria-hidden="true"/>
          </IonTabButton>
          <IonTabButton tab="Categorias" href="/categorias">
            <FolderOpen size={32} aria-hidden="true"/>
          </IonTabButton>
          <IonTabButton tab="Pronostico Oceánico" href="/tab3">
            <ChartSpline aria-hidden="true"/>
            <IonLabel>Pronostico Oceánico</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
