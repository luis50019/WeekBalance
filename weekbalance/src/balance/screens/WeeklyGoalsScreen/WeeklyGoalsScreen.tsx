import { View, Text, ScrollView, StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWeeklyGoals } from "../../hooks/useWeeklyGoals";
import { COLORS } from "../../../core/constants/Color";

function WeeklyGoalsScreen() {
  const { data, loading, createGoal, deleteGoal, totalGoalAmount, totalSaved, totalProgress, refetch } = useWeeklyGoals();
  const [showForm, setShowForm] = useState(false);
  const [goalAmount, setGoalAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const errorMessage = error instanceof Error ? error.message : "No se pudo crear la meta";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      "Eliminar meta",
      "¿Estás seguro de eliminar esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGoal(goalId);
              refetch();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la meta");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    if (!data?.goals || data.goals.length === 0) return "#6B7280";
    const goal = data.goals[0];
    
    if (goal.weekStatus === "completed" || goal.isWeekFinished) {
      return goal.isCompleted ? "#4EC896" : "#EF4444";
    }
    return goal.isCompleted ? "#4EC896" : "#F59E0B";
  };

  const getStatusText = () => {
    if (!data?.goals || data.goals.length === 0) return "Sin meta activa";
    const goal = data.goals[0];
    
    if (goal.weekStatus === "completed" || goal.isWeekFinished) {
      return goal.isCompleted ? "¡Meta completada!" : "Meta no alcanzada";
    }
    return goal.isCompleted ? "¡Meta alcanzada!" : "En progreso";
  };

  const getStatusIcon = () => {
    if (!data?.goals || data.goals.length === 0) return "piggy-bank-outline";
    const goal = data.goals[0];
    
    if (goal.weekStatus === "completed" || goal.isWeekFinished) {
      return goal.isCompleted ? "check-circle" : "close-circle";
    }
    return goal.isCompleted ? "check-circle" : "piggy-bank";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[COLORS.backgroundCard, "#050846"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <Text style={styles.headerTitle}>META DE AHORRO SEMANAL</Text>
        <Text style={styles.periodText}>
          {data?.weekStart} - {data?.weekEnd}
        </Text>

        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name={getStatusIcon() as any}
            size={28}
            color={getStatusColor()}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={[styles.summaryValue, { color: "#4EC896" }]}>
              ${(data?.weekIncomes || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
              ${(data?.weekExpenses || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ahorro</Text>
            <Text style={[styles.summaryValue, { color: "#F59E0B" }]}>
              ${(data?.weeklySaving || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso de ahorro</Text>
            <Text style={[styles.progressPercent, { color: getStatusColor() }]}>
              {totalProgress.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { 
                  width: `${Math.min(totalProgress, 100)}%`,
                  backgroundColor: getStatusColor(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressDetail}>
            ${totalSaved.toFixed(2)} / ${totalGoalAmount.toFixed(2)}
          </Text>
        </View>
      </LinearGradient>

      {!showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Nueva meta de ahorro</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nueva meta de ahorro semanal</Text>

          <Text style={styles.inputLabel}>¿Cuánto quieres ahorrar esta semana?</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={goalAmount}
            onChangeText={setGoalAmount}
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowForm(false);
                setGoalAmount("");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleCreateGoal}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Tu meta</Text>

      {data?.goals && data.goals.length > 0 ? (
        data.goals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalTitleRow}>
                <MaterialCommunityIcons
                  name={goal.isCompleted ? "check-circle" : "piggy-bank"}
                  size={24}
                  color={goal.isCompleted ? "#4EC896" : "#F59E0B"}
                />
                <Text style={styles.goalTitle}>Meta de Ahorro</Text>
                {goal.weekStatus === "completed" && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>SEMANA FINALIZADA</Text>
                  </View>
                )}
              </View>
              {goal.weekStatus !== "completed" && (
                <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                  <MaterialCommunityIcons name="delete-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.goalAmountRow}>
              <Text style={styles.goalSaved}>
                ${goal.weeklySaving.toFixed(2)}
              </Text>
              <Text style={styles.goalSeparator}> / </Text>
              <Text style={styles.goalTarget}>
                ${goal.amount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  {
                    width: `${Math.min(goal.progress, 100)}%`,
                    backgroundColor: goal.isCompleted ? "#4EC896" : "#F59E0B",
                  },
                ]}
              />
            </View>

            <Text style={styles.goalStatus}>
              {goal.isCompleted
                ? "¡Felicidades! Has alcanzado tu meta de ahorro 🎉"
                : goal.weekStatus === "completed"
                ? (goal.isCompleted ? "¡Meta completada!" : "No se alcanzó la meta esta semana")
                : `Te faltan $${goal.remaining.toFixed(2)} para llegar a tu meta`}
            </Text>

            <View style={styles.goalDetails}>
              <View style={styles.goalDetail}>
                <Text style={styles.goalDetailLabel}>Ingresos</Text>
                <Text style={[styles.goalDetailValue, { color: "#4EC896" }]}>
                  +${goal.weekIncomes.toFixed(2)}
                </Text>
              </View>
              <View style={styles.goalDetail}>
                <Text style={styles.goalDetailLabel}>Gastos</Text>
                <Text style={[styles.goalDetailValue, { color: "#EF4444" }]}>
                  -${goal.weekExpenses.toFixed(2)}
                </Text>
              </View>
              <View style={styles.goalDetail}>
                <Text style={styles.goalDetailLabel}>Ahorro</Text>
                <Text style={[styles.goalDetailValue, { color: "#F59E0B" }]}>
                  ${goal.weeklySaving.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name="piggy-bank-outline" size={48} color="#4B5563" />
          <Text style={styles.emptyText}>Sin meta de ahorro</Text>
          <Text style={styles.emptySubtext}>
            Crea una meta para comenzar a ahorrar esta semana
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  periodText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressDetail: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4E54C8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#26283a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1d2a",
    borderRadius: 8,
    padding: 14,
    color: "#FFF",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#4E54C8",
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: "#26283a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  completedBadge: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedBadgeText: {
    color: "#9CA3AF",
    fontSize: 10,
    fontWeight: "600",
  },
  goalAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  goalSaved: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  goalSeparator: {
    fontSize: 20,
    color: "#6B7280",
  },
  goalTarget: {
    fontSize: 20,
    color: "#6B7280",
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#1a1d2a",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  goalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalStatus: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  goalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1d2a",
    borderRadius: 12,
    padding: 12,
  },
  goalDetail: {
    alignItems: "center",
  },
  goalDetailLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  goalDetailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "#26283a",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  emptySubtext: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
  },
});

export default WeeklyGoalsScreen;
