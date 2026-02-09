'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { close, locate } from 'ionicons/icons';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Marker, Sector } from '../types/type';
import data from '../data/data.json';

const PronosticoCosteroMap: React.FC = () => {
  const history = useHistory();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    nombre: string;
    pronostico: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-71.5, -30],
      zoom: 4,
      pitch: 0,
      bearing: 0
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Handle map load and resize
    map.current.on('load', () => {
      // Trigger resize after map loads to ensure proper dimensions
      setTimeout(() => {
        map.current?.resize();
        setIsLoading(false);
      }, 100);
    });

    const pronosticos = data.pronosticos || [];

    pronosticos.forEach((pronostico: any) => {
      if (pronostico.markers && Array.isArray(pronostico.markers)) {
        pronostico.markers.forEach((marker: Marker) => {
          const el = document.createElement('div');
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.background = 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)';
          el.style.borderRadius = '50%';
          el.style.border = '3px solid white';
          el.style.cursor = 'pointer';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';

          el.addEventListener('click', () => {
            setSelectedLocation({
              nombre: marker.nombre || 'Sin nombre',
              pronostico: pronostico.nombre,
              lat: marker.lat,
              lng: marker.lng,
            });
          });

          el.addEventListener('mouseenter', () => {
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.boxShadow = '0 4px 16px rgba(2, 132, 199, 0.4)';
          });

          el.addEventListener('mouseleave', () => {
            el.style.width = '32px';
            el.style.height = '32px';
            el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          });

          new maplibregl.Marker({ element: el })
            .setLngLat([marker.lng, marker.lat])
            .addTo(map.current!);
        });
      }

      if (pronostico.sectores && Array.isArray(pronostico.sectores)) {
        pronostico.sectores.forEach((sector: Sector) => {
          if (sector.coordenadas && sector.coordenadas.lat && sector.coordenadas.lng) {
            const el = document.createElement('div');
            el.style.width = '28px';
            el.style.height = '28px';
            el.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid white';
            el.style.cursor = 'pointer';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';

            el.addEventListener('click', () => {
              setSelectedLocation({
                nombre: sector.nombre,
                pronostico: pronostico.nombre,
                lat: sector.coordenadas!.lat,
                lng: sector.coordenadas!.lng,
              });
            });

            el.addEventListener('mouseenter', () => {
              el.style.width = '36px';
              el.style.height = '36px';
              el.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
            });

            el.addEventListener('mouseleave', () => {
              el.style.width = '28px';
              el.style.height = '28px';
              el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            });

            new maplibregl.Marker({ element: el })
              .setLngLat([sector.coordenadas.lng, sector.coordenadas.lat])
              .addTo(map.current!);
          }
        });
      }
    });

    // Add window resize listener
    const handleResize = () => {
      map.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handleClose = () => {
    history.goBack();
  };

  const handleLocateClick = () => {
    if (selectedLocation) {
      map.current?.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 8,
        duration: 1000,
      });
    }
  };

  return (
    <IonPage style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <IonHeader style={{ flex: '0 0 auto' }}>
        <IonToolbar
          color="primary"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
            '--padding-top': '12px',
            '--padding-bottom': '12px',
          } as any}
        >
          <IonTitle style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.3px' }}>
            Mapa Pronóstico Costero
          </IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            color="light"
            onClick={handleClose}
            style={{ margin: 0 }}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen
        style={{
          flex: '1 1 auto',
          '--padding-start': '0',
          '--padding-end': '0',
          '--padding-top': '0',
          '--padding-bottom': '0',
          position: 'relative',
        } as any}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              zIndex: 30,
              backdropFilter: 'blur(4px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <IonSpinner name="circular" color="primary" style={{ fontSize: '48px' }} />
              <span style={{ fontSize: '14px', color: '#0284c7', fontWeight: 500 }}>Cargando mapa...</span>
            </div>
          </div>
        )}
        <div
          ref={mapContainer}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />

        {selectedLocation && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              right: '20px',
              maxWidth: '380px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              zIndex: 20,
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #f0f4f8 100%)',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  flex: 1,
                }}
              >
                {selectedLocation.nombre}
              </h3>
              <button
                onClick={() => setSelectedLocation(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(15, 23, 42, 0.05)';
                  (e.target as HTMLButtonElement).style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'none';
                  (e.target as HTMLButtonElement).style.color = '#94a3b8';
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Pronóstico:
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', fontFamily: 'Courier New, monospace' }}>
                  {selectedLocation.pronostico}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Latitud:
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', fontFamily: 'Courier New, monospace' }}>
                  {selectedLocation.lat.toFixed(4)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Longitud:
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', fontFamily: 'Courier New, monospace' }}>
                  {selectedLocation.lng.toFixed(4)}
                </span>
              </div>
              <button
                onClick={handleLocateClick}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  marginTop: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(2, 132, 199, 0.4)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(2, 132, 199, 0.2)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                <IonIcon icon={locate} />
                Centrar mapa
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            padding: '10px 12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            zIndex: 20,
            border: '1px solid #e2e8f0',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Leyenda
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '12px', color: '#475569' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
              }}
            />
            <span>Puntos principales</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '12px', color: '#475569' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              }}
            />
            <span>Sectores</span>
          </div>
        </div>
      </IonContent>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </IonPage>
  );
};

export default PronosticoCosteroMap;
