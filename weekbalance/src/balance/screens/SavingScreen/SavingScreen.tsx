import { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SavingScreenStyle } from "./SavingScreen.style";
import { useWeeklyGoals } from "../../hooks/useWeeklyGoals";
import { CardWeek } from "../../components/CardWeek";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../core/constants/Color";

function SavingScreen() {
  const { data: weeklyGoals, loading, error, refetch } = useWeeklyGoals();
  const [showAllMonths, setShowAllMonths] = useState(false);

  const currentYear = new Date().getFullYear();

  const currentGoal = useMemo(() => {
    if (!weeklyGoals || weeklyGoals.length === 0) return null;
    return weeklyGoals[0];
  }, [weeklyGoals]);

  const totalSaved = useMemo(() => {
    if (!weeklyGoals) return 0;
    return weeklyGoals.reduce(
      (sum, goal) => sum + (goal.current_amount || 0),
      0,
    );
  }, [weeklyGoals]);

  const weeklyStreak = useMemo(() => {
    if (!weeklyGoals) return 0;
    let streak = 0;
    for (const goal of weeklyGoals) {
      if (goal.current_amount >= goal.target_amount) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [weeklyGoals]);

  const progressPercentage = useMemo(() => {
    if (!currentGoal) return 0;
    return Math.min(
      (currentGoal.current_amount / currentGoal.target_amount) * 100,
      100,
    );
  }, [currentGoal]);

  const remaining = useMemo(() => {
    if (!currentGoal) return 0;
    return Math.max(currentGoal.target_amount - currentGoal.current_amount, 0);
  }, [currentGoal]);

  const displayedGoals = useMemo(() => {
    if (!weeklyGoals) return [];
    return showAllMonths ? weeklyGoals : weeklyGoals.slice(0, 4);
  }, [weeklyGoals, showAllMonths]);

  const getWeekNumber = (dateString: string) => {
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const getGoalStatus = (
    goal: (typeof weeklyGoals)[0],
  ): "completed" | "in_progress" | "extra" | "incomplete" => {
    const weekEnd = new Date(goal.week_end);
    const now = new Date();
    const isPastWeek = weekEnd < now;

    if (goal.current_amount >= goal.target_amount) {
      return goal.current_amount > goal.target_amount ? "extra" : "completed";
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
    return weekEnd < now && currentGoal.current_amount < currentGoal.target_amount;
  }, [currentGoal]);

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
            <View style={[SavingScreenStyle.goalCard, isCurrentGoalIncomplete && SavingScreenStyle.goalCardIncomplete]}>
              <View style={SavingScreenStyle.goalHeader}>
                <Text style={SavingScreenStyle.goalLabel}>META SEMANAL</Text>
                {isCurrentGoalIncomplete ? (
                  <View style={SavingScreenStyle.incompleteBadge}>
                    <MaterialCommunityIcons name="close-circle" size={14} color="#EF4444" />
                    <Text style={SavingScreenStyle.incompleteText}>META INCOMPLETA</Text>
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
                <Text style={[SavingScreenStyle.goalAmount, isCurrentGoalIncomplete && SavingScreenStyle.goalAmountIncomplete]}>
                  $
                  {currentGoal.target_amount.toLocaleString("es-MX", {
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
                      isCurrentGoalIncomplete && SavingScreenStyle.progressBarFillIncomplete,
                    ]}
                  />
                </View>
                <Text style={[SavingScreenStyle.progressText, isCurrentGoalIncomplete && SavingScreenStyle.progressTextIncomplete]}>
                  {progressPercentage.toFixed(0)}%
                </Text>
              </View>
              <Text style={[SavingScreenStyle.remainingText, isCurrentGoalIncomplete && SavingScreenStyle.remainingTextIncomplete]}>
                $
                {remaining.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}{" "}
                restantes
              </Text>
            </View>

            <View style={SavingScreenStyle.metricsContainer}>
              <View style={SavingScreenStyle.metricCard}>
                <MaterialCommunityIcons
                  name="wallet"
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
                  Total ahorrado
                </Text>
              </View>
              <View style={SavingScreenStyle.metricCard}>
                <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
                <Text style={SavingScreenStyle.metricValue}>
                  {weeklyStreak}
                </Text>
                <Text style={SavingScreenStyle.metricLabel}>Racha semanal</Text>
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
          </View>
        )}

        <View style={SavingScreenStyle.historySection}>
          <Text style={SavingScreenStyle.historyTitle}>Historial Semanal</Text>
          <Text style={SavingScreenStyle.historyPeriod}>
            {currentYear - 1} - {currentYear}
          </Text>
        </View>

        {displayedGoals.length > 0 ? (
          displayedGoals.map((goal) => (
            <CardWeek
              key={goal.id}
              weekNumber={getWeekNumber(goal.week_start)}
              startDate={goal.week_start}
              endDate={goal.week_end}
              amount={goal.current_amount}
              targetAmount={goal.target_amount}
              status={getGoalStatus(goal)}
            />
          ))
        ) : (
          <View style={SavingScreenStyle.emptyHistory}>
            <Text style={SavingScreenStyle.emptyHistoryText}>
              Sin historial de ahorros
            </Text>
          </View>
        )}

        {weeklyGoals && weeklyGoals.length > 4 && (
          <Pressable
            style={SavingScreenStyle.loadMoreButton}
            onPress={() => setShowAllMonths(!showAllMonths)}
          >
            <Text style={SavingScreenStyle.loadMoreText}>
              {showAllMonths ? "Ver menos" : "Cargar meses anteriores"}
            </Text>
            <MaterialCommunityIcons
              name={showAllMonths ? "chevron-up" : "chevron-down"}
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        )}
      </ScrollView>

      <FloatingButton to="AddSaving" label="Agregar" />
    </View>
  );
}

export default SavingScreen;
