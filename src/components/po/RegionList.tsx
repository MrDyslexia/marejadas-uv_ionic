import React, { useState, useRef } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import { chevronForward, locationOutline } from "ionicons/icons";
import { MapPin, ChartSpline } from "lucide-react";
import type { Region } from "../../types/type";
import "./RegionList.css";

interface RegionListProps {
  regions: Region[];
  onRegionSelect: (region: Region) => void;
}

const RegionList: React.FC<RegionListProps> = ({ 
  regions, 
  onRegionSelect 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleRegionSelect = (region: Region) => {
    onRegionSelect(region);
  };

  const scrollToRegion = (index: number) => {
    setActiveIndex(index);
    // En Ionic, el scroll se maneja automáticamente con el layout
  };

  return (
    <div className="region-list-container">
      <div className="region-list-header">
        <div className="title-container">
          <IonIcon icon={locationOutline} color="primary" />
          <IonText>
            <h2 className="section-title">Zonas oceánicas</h2>
          </IonText>
        </div>
      </div>

      <IonGrid className="regions-grid">
        <IonRow>
          {regions.map((region, index) => (
            <IonCol size="12" size-md="6" size-lg="4" key={region.id}>
              <IonCard 
                className={`region-card ${activeIndex === index ? 'active' : ''}`}
                button
                onClick={() => {
                  handleRegionSelect(region);
                  scrollToRegion(index);
                }}
              >
                <IonCardContent className="region-card-content">
                  <div className="card-gradient">
                    <div className="card-header">
                      <div className="icon-container">
                        <MapPin size={20} color="white" />
                      </div>
                      <div className="region-info">
                        <IonText>
                          <h3 className="region-name">{region.nombre}</h3>
                        </IonText>
                        <IonText color="light">
                          <p className="region-coords">
                            Lat: {region.lat}° | Lon: {region.lon}°
                          </p>
                        </IonText>
                      </div>
                    </div>

                    <div className="divider" />

                    <div className="card-footer">
                      <div className="ocean-data-preview">
                        <ChartSpline size={28} color="white" />
                        <IonText color="light">
                          <p className="data-preview-text">Datos</p>
                        </IonText>
                      </div>

                      <IonButton
                        fill="clear"
                        color="light"
                        className="view-details-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegionSelect(region);
                        }}
                      >
                        <span className="view-details-text">Ver detalles</span>
                        <IonIcon icon={chevronForward} slot="end" />
                      </IonButton>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      {/* Indicadores de paginación para móvil */}
      <div className="pagination-container">
        {regions.map((region, index) => (
          <button
            key={region.id}
            className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => scrollToRegion(index)}
            aria-label={`Go to ${region.nombre}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default RegionList;