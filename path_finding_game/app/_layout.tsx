import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ErrorBoundary>
  );
}
