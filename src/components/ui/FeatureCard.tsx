import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonButton,
} from '@ionic/react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient,
  onPress,
}) => {
  const cardStyle = {
    background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <IonCard style={cardStyle} className="feature-card">
      <IonCardContent>
        <div className="card-header">
          <IonIcon 
            icon={icon} 
            color="light" 
            size="large" 
            className="card-icon"
          />
          <IonText color="light">
            <h3 className="card-title">{title}</h3>
          </IonText>
        </div>

        <div className="image-container">
          <div className="placeholder-image">
            <IonText color="light">
              <p>Imagen ilustrativa</p>
            </IonText>
          </div>
        </div>

        <IonText color="light">
          <p className="card-description">{description}</p>
        </IonText>

        <IonButton 
          fill="outline" 
          color="light" 
          className="card-button"
          onClick={onPress}
        >
          Explorar
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default FeatureCard;