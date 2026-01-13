import "./FeatureCard.css";
import React from "react";
import { IonCard, IonCardContent, IonText, IonButton } from "@ionic/react";
import { LucideIcon } from "lucide-react";

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
    borderRadius: "16px",
    marginBottom: "16px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <IonCard style={cardStyle} className="feature-card">
      <IonCardContent>
        <div
          style={{
            background: "transparent",
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "12px",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "50%",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon color="white" className="card-icon" />
          </div>
          <IonText
            color="light"
            style={{ color: "white", fontWeight: "bold", flex: 1 }}
          >
            <IonText className="card-title">{title}</IonText>
          </IonText>
        </div>
        <IonText
          color="light"
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "justify",
          }}
        >
          {description}
        </IonText>

        <IonButton
          fill="clear"
          color="light"
          className="card-button"
          style={{marginTop:'18px'}}
          onClick={onPress}
        >
          Explorar
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default FeatureCard;
