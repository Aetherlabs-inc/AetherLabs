import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// Redirect to new multi-step flow
export default function NewArtworkScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(artworks)/new/step1-basic');
  }, []);

  return null;
}
