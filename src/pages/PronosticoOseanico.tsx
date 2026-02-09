'use client';

import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Map } from "lucide-react";
import AnimatedMap from "../components/po/AnimatedMap";
import RegionDetailModal from "../components/po/RegionDetailModal";
import RegionList from "../components/po/RegionList";
import type { Region } from "../types/type";
import "./PronosticoOseanico.css";

interface PronosticoOseanicoProps {
  regions: Region[];
}

const PronosticoOseanico: React.FC<PronosticoOseanicoProps> = ({ regions }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const history = useHistory();

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedRegion(null);
    setModalVisible(false);
  };

  const navigateToMap = () => {
    history.push('/pronostico-oceanico-map')
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <div className="header-content">
              <IonText color="light">
                <h1 className="header-title">Pronóstico Oceánico</h1>
              </IonText>
              <IonText color="light">
                <p className="header-subtitle">
                  Selecciona una región para ver más detalles.
                </p>
              </IonText>
            </div>
          </IonTitle>
          
          <IonButton
            slot="end"
            fill="clear"
            color="light"
            className="map-button"
            onClick={() => navigateToMap()}
          >
            <Map size={24} color="white" />
            <span className="header-button-text">Ver mapa oceánico</span>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="pronostico-oceanico-content">
        <RegionList regions={regions} onRegionSelect={handleRegionSelect} />
        <AnimatedMap />

        <RegionDetailModal
          isOpen={modalVisible}
          region={selectedRegion}
          onClose={closeModal}
        />
      </IonContent>
    </IonPage>
  );
};

export default PronosticoOseanico;
