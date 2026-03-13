import { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { SavingScreenStyle } from "./SavingScreen.style";
import { useAuthStore } from "../../../auth/store";
import { getSavingHistoryService } from "../../api/savings.service";
import { SavingHistoryDto } from "../../types/Response/SavingHistory.dto";
import SavingCard from "../../components/SavingCard/SavingCard";
import EmptyData from "../../../shared/components/UI/emptyData/EmptyData";

function SavingScreen() {
  const { profile, session } = useAuthStore();
  const [savingsHistory, setSavingsHistory] = useState<SavingHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavingsHistory = async () => {
    try {
      setLoading(true);
      if (!profile?.account_id || !session?.access_token) return;
      const response = await getSavingHistoryService(
        profile.account_id,
        session.access_token,
      );
      console.log(response.data);
      setSavingsHistory(response.data || []);
    } catch (error) {
      console.log("Error loading savings history:", error);
      setSavingsHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavingsHistory();
  }, []);

  const renderSavingCard = ({ item }: { item: SavingHistoryDto }) => (
    <SavingCard
      amount={item.amount}
      weekStart={item.week_start}
      weekEnd={item.created_at}
    />
  );

  return (
    <View style={SavingScreenStyle.container}>
      <View style={SavingScreenStyle.historyContainer}>
        <Text style={SavingScreenStyle.historyTitle}>Historial de Ahorros</Text>
        {loading ? (
          <View style={SavingScreenStyle.loadingContainer}>
            <ActivityIndicator size="large" color="#2b4bee" />
            <Text style={SavingScreenStyle.loadingText}>Cargando...</Text>
          </View>
        ) : savingsHistory.length > 0 ? (
          <FlatList
            data={savingsHistory}
            keyExtractor={(item) => item.id}
            renderItem={renderSavingCard}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyData title="Sin ahorros" message="No hay ahorros registrados" />
        )}
      </View>
    </View>
  );
}

export default SavingScreen;
