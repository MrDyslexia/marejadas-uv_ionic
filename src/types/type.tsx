// Tipos
export type DatosSector = {
  categoria: string
  altura: string
  periodo: string
  direccion: string
  marea: string
}
export type DatosAcc = {
  id: string
  categoria: string
  altura: string
  periodo: string
  direccion: string
  marea: string
}
export type DatosPronostico = {
  categoria: string
  altura: string
  periodo: string
  direccion: string
  espectro: string
}
export type Region = {
  id: string
  nombre: string
  lat: number
  lon: number
  datosPronostico: DatosPronostico
}
export type Sector = {
  id: string
  nombre: string
  datos: DatosSector
}

export type Marker = {
  lat: number
  lng: number
  nombre: string
}

export type Pronostico = {
  id: string
  nombre: string
  mapa_pronostico: string
  mosaico_pronostico: string
  markers: Marker[]
  sectores: Sector[]
}
export type Acc = {
  id: string
  nombre: string
  lon: number
  lat: number
  norOeste: DatosAcc
  oeste: DatosAcc
  surOeste: DatosAcc
}
export type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
  gradient: [string, string, ...string[]];
  onPress: () => void;
  image?: string;
}
export type Direction = "norOeste" | "oeste" | "surOeste"
export type Attribute = "categoria" | "altura" | "periodo" | "direccion" | "marea"
