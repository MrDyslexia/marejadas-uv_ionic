import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
} from '@ionic/react';
import { LucideIcon } from 'lucide-react';
import './FeatureCard.css';
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string[];
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
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
    <IonCard style={cardStyle} className="feature-card" >
      <IonCardContent>
        <div className="card-header">
          <Icon 
            color="white" 
            size={32} 
            className="card-icon"
          />
          <IonText color="light">
            <h3 className="card-title">{title}</h3>
          </IonText>
        </div>

        <div className="image-container">
          <Icon 
            color="white" 
            size={64} 
          />
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
