import { View } from 'react-native';

/** Web : l'appli est centrée dans une colonne de largeur téléphone, hauteur = zone visible. */
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#0B0D10',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}