import { Image } from 'react-native';

// Le logo affiché dans l'appli est assets/branding/image.png.
const sources = {
  default: require('../../../assets/branding/image.png'),
  white: require('../../../assets/branding/logo-white.png'),
};

type Props = {
  variant?: 'default' | 'white';
  size?: number;
  /** Largeur / hauteur. image.png est carrée : 1 par défaut. */
  aspectRatio?: number;
};

export function Logo({ variant = 'default', size = 120, aspectRatio = 1 }: Props) {
  return (
    <Image
      source={sources[variant]}
      accessibilityLabel="Drive Go!"
      style={{ width: size * aspectRatio, height: size, maxWidth: '100%' }}
      resizeMode="contain"
    />
  );
}
