import { useMemo, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SavingScreenStyle } from "./SavingScreen.style";
import {
  useWeeklyGoals,
  WeeklyGoalWithProgress,
} from "../../hooks/useWeeklyGoals";
import { CardWeek } from "../../components/CardWeek";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../core/constants/Color";

function SavingScreen() {
  const {
    data,
    history,
    loading,
    totalGoalAmount,
    totalSaved,
    totalProgress,
    refetch,
    createGoal,
  } = useWeeklyGoals();
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [goalAmount, setGoalAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();

  const currentGoal = useMemo(() => {
    if (!data?.goals || data.goals.length === 0) return null;
    return data.goals[0];
  }, [data]);

  const progressPercentage = useMemo(() => {
    if (!currentGoal) return 0;
    return Math.min(currentGoal.progress, 100);
  }, [currentGoal]);

  const remaining = useMemo(() => {
    if (!currentGoal) return 0;
    return currentGoal.remaining;
  }, [currentGoal]);

  const displayedGoals = useMemo(() => {
    if (!data?.goals) return [];
    return showAllMonths ? data.goals : data.goals.slice(0, 4);
  }, [data, showAllMonths]);

  const getWeekNumber = (dateString: string) => {
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const getGoalStatus = (
    goal: WeeklyGoalWithProgress,
  ): "completed" | "in_progress" | "extra" | "incomplete" => {
    const weekEnd = new Date(goal.week_end);
    const now = new Date();
    const isPastWeek = weekEnd < now;

    if (goal.isCompleted) {
      return goal.weeklySaving > goal.amount ? "extra" : "completed";
    }

    if (isPastWeek) {
      return "incomplete";
    }

    return "in_progress";
  };

  const isCurrentGoalIncomplete = useMemo(() => {
    if (!currentGoal) return false;
    const weekEnd = new Date(currentGoal.week_end);
    const now = new Date();
    return weekEnd < now && !currentGoal.isCompleted;
  }, [currentGoal]);

  const handleCreateGoal = async () => {
    if (!goalAmount || parseFloat(goalAmount) <= 0) {
      Alert.alert("Error", "Ingresa un monto válido");
      return;
    }

    try {
      setIsSubmitting(true);
      await createGoal(parseFloat(goalAmount));
      setShowForm(false);
      setGoalAmount("");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "No se pudo crear la meta";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={SavingScreenStyle.container}>
        <View style={SavingScreenStyle.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.backgroundCard} />
          <Text style={SavingScreenStyle.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={SavingScreenStyle.container}>
      <ScrollView
        style={SavingScreenStyle.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={SavingScreenStyle.scrollContent}
      >
        <View style={SavingScreenStyle.header}>
          <Text style={SavingScreenStyle.headerTitle}>Mis Ahorros</Text>
        </View>

        {currentGoal ? (
          <>
            <View
              style={[
                SavingScreenStyle.goalCard,
                isCurrentGoalIncomplete && SavingScreenStyle.goalCardIncomplete,
              ]}
            >
              <View style={SavingScreenStyle.goalHeader}>
                <Text style={SavingScreenStyle.goalLabel}>META SEMANAL</Text>
                {isCurrentGoalIncomplete ? (
                  <View style={SavingScreenStyle.incompleteBadge}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={14}
                      color="#EF4444"
                    />
                    <Text style={SavingScreenStyle.incompleteText}>
                      META INCOMPLETA
                    </Text>
                  </View>
                ) : (
                  <MaterialCommunityIcons
                    name="piggy-bank"
                    size={32}
                    color={COLORS.backgroundCard}
                  />
                )}
              </View>
              <View style={SavingScreenStyle.goalAmountRow}>
                <Text
                  style={[
                    SavingScreenStyle.goalAmount,
                    isCurrentGoalIncomplete &&
                      SavingScreenStyle.goalAmountIncomplete,
                  ]}
                >
                  $
                  {currentGoal.weeklySaving.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                {!isCurrentGoalIncomplete && (
                  <MaterialCommunityIcons
                    name="piggy-bank"
                    size={32}
                    color={COLORS.backgroundCard}
                  />
                )}
              </View>
              <View style={SavingScreenStyle.progressBarContainer}>
                <View style={SavingScreenStyle.progressBarBg}>
                  <View
                    style={[
                      SavingScreenStyle.progressBarFill,
                      { width: `${progressPercentage}%` },
                      isCurrentGoalIncomplete &&
                        SavingScreenStyle.progressBarFillIncomplete,
                    ]}
                  />
                </View>
                <Text
                  style={[
                    SavingScreenStyle.progressText,
                    isCurrentGoalIncomplete &&
                      SavingScreenStyle.progressTextIncomplete,
                  ]}
                >
                  {progressPercentage.toFixed(0)}%
                </Text>
              </View>
              <Text
                style={[
                  SavingScreenStyle.remainingText,
                  isCurrentGoalIncomplete &&
                    SavingScreenStyle.remainingTextIncomplete,
                ]}
              >
                $
                {remaining.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}{" "}
                restantes
              </Text>
            </View>

            <TouchableOpacity
              style={SavingScreenStyle.createGoalButton}
              onPress={() => setShowForm(true)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              <Text style={SavingScreenStyle.createGoalButtonText}>
                Nueva meta semanal
              </Text>
            </TouchableOpacity>

            <View style={SavingScreenStyle.metricsContainer}>
              <View style={SavingScreenStyle.metricCard}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={24}
                  color={COLORS.backgroundCard}
                />
                <Text style={SavingScreenStyle.metricValue}>
                  $
                  {totalSaved.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                <Text style={SavingScreenStyle.metricLabel}>
                  Ahorrado esta semana
                </Text>
              </View>
              <View style={SavingScreenStyle.metricCard}>
                <MaterialCommunityIcons
                  name="target"
                  size={24}
                  color="#F59E0B"
                />
                <Text style={SavingScreenStyle.metricValue}>
                  $
                  {totalGoalAmount.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                <Text style={SavingScreenStyle.metricLabel}>Meta semanal</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={SavingScreenStyle.emptyGoalCard}>
            <MaterialCommunityIcons
              name="piggy-bank-outline"
              size={48}
              color={COLORS.textSecondary}
            />
            <Text style={SavingScreenStyle.emptyGoalText}>
              Sin meta semanal activa
            </Text>
            <Text style={SavingScreenStyle.emptyGoalSubtext}>
              Crea una meta para comenzar a ahorrar
            </Text>
            <TouchableOpacity
              style={SavingScreenStyle.createGoalButton}
              onPress={() => setShowForm(true)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              <Text style={SavingScreenStyle.createGoalButtonText}>
                Crear meta semanal
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={SavingScreenStyle.formCard}>
            <Text style={SavingScreenStyle.formTitle}>
              Nueva meta de ahorro semanal
            </Text>
            <Text style={SavingScreenStyle.inputLabel}>
              ¿Cuánto quieres ahorrar esta semana?
            </Text>
            <TextInput
              style={SavingScreenStyle.input}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              value={goalAmount}
              onChangeText={setGoalAmount}
            />
            <View style={SavingScreenStyle.formButtons}>
              <TouchableOpacity
                style={SavingScreenStyle.cancelButton}
                onPress={() => {
                  setShowForm(false);
                  setGoalAmount("");
                }}
              >
                <Text style={SavingScreenStyle.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  SavingScreenStyle.submitButton,
                  isSubmitting && SavingScreenStyle.submitButtonDisabled,
                ]}
                onPress={handleCreateGoal}
                disabled={isSubmitting}
              >
                <Text style={SavingScreenStyle.submitButtonText}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {history.length > 0 ? (
          <View style={SavingScreenStyle.historySection}>
            <Text style={SavingScreenStyle.historyTitle}>
              Historial de metas
            </Text>
            {history.map((goal) => (
              <View key={goal.id} style={SavingScreenStyle.historyCard}>
                <View style={SavingScreenStyle.historyHeader}>
                  <View>
                    <Text style={SavingScreenStyle.historyPeriod}>
                      {goal.week_start} - {goal.week_end}
                    </Text>
                    <View style={SavingScreenStyle.historyStatusRow}>
                      <MaterialCommunityIcons
                        name={
                          goal.isCompleted ? "check-circle" : "close-circle"
                        }
                        size={16}
                        color={goal.isCompleted ? "#4EC896" : "#EF4444"}
                      />
                      <Text
                        style={[
                          SavingScreenStyle.historyStatus,
                          { color: goal.isCompleted ? "#4EC896" : "#EF4444" },
                        ]}
                      >
                        {goal.isCompleted
                          ? "Meta alcanzada"
                          : "Meta no alcanzada"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      SavingScreenStyle.historyProgress,
                      { color: goal.isCompleted ? "#4EC896" : "#EF4444" },
                    ]}
                  >
                    {goal.progress.toFixed(0)}%
                  </Text>
                </View>
                <View style={SavingScreenStyle.historyDetails}>
                  <View style={SavingScreenStyle.historyDetail}>
                    <Text style={SavingScreenStyle.historyDetailLabel}>
                      Ahorrado
                    </Text>
                    <Text
                      style={[
                        SavingScreenStyle.historyDetailValue,
                        { color: "#F59E0B" },
                      ]}
                    >
                      ${goal.weeklySaving.toFixed(2)}
                    </Text>
                  </View>
                  <View style={SavingScreenStyle.historyDetail}>
                    <Text style={SavingScreenStyle.historyDetailLabel}>
                      Meta
                    </Text>
                    <Text style={SavingScreenStyle.historyDetailValue}>
                      ${goal.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={SavingScreenStyle.historySection}>
            <Text style={SavingScreenStyle.historyTitle}>
              Historial de metas
            </Text>
            <View style={SavingScreenStyle.emptyHistoryCard}>
              <MaterialCommunityIcons
                name="history"
                size={40}
                color={COLORS.textSecondary}
              />
              <Text style={SavingScreenStyle.emptyHistoryText}>
                No existe un historial por el momento
              </Text>
              <Text style={SavingScreenStyle.emptyHistorySubtext}>
                Completa tu primera semana para ver el historial aquí
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <FloatingButton to="AddSaving" label="Agregar" />
    </View>
  );
}

export default SavingScreen;
