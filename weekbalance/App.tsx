import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AppNavigation from "./src/app/navigations/AppNavigation";
import { COLORS } from "./src/core/constants/Color";
import { initializeDatabase } from "./src/core/database";
import { useAuthStore } from "./src/auth/store";

function AppContent() {
  const [isDbReady, setIsDbReady] = useState(false);
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDatabase();
        await initialize();
      } catch (error) {
        console.error("[App] Setup error:", error);
      } finally {
        setIsDbReady(true);
      }
    };
    setup();
  }, []);

  if (!isDbReady || !isInitialized) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <AppNavigation />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
