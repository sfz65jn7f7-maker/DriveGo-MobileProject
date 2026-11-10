/** Style de carte sombre (Google Maps) utilisé quand le thème est sombre. */
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1A1D23' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#98A2B3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F1115' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2E333D' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#20242c' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#16241d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2E333D' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1A1D23' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a404c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#20242c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b1a24' }] },
];
