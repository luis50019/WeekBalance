import { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { NewSavingScreenStyle } from "./NewSavingScreen.style";
import { useNewSaving, getWeekDates } from "../../hooks/useNewSaving";
import { NumericKeypad } from "../../../shared/components/NumericKeypad";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigate } from "../../../shared/hooks/useNavigate";
import ErrorModal from "../../../shared/components/UI/ErrorModal/ErrorModal";
import LoadingOverlay from "../../../shared/components/UI/LoadingOverlay/LoadingOverlay";

function NewSavingScreen() {
  const { navigationTo } = useNavigate();
  const {
    onSubmit,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
  } = useNewSaving();
  const [amountString, setAmountString] = useState<string>("");

  const weekDates = getWeekDates();
  const currentWeek = getCurrentWeekInfo();

  const handleKeyPress = useCallback((key: string) => {
    setAmountString((prev) => {
      if (key === "." && prev.includes(".")) return prev;
      if (prev === "0" && key !== ".") return key;
      if (prev.length >= 10) return prev;

      const decimalIndex = prev.indexOf(".");
      if (decimalIndex !== -1 && prev.length - decimalIndex > 2) return prev;

      return prev + key;
    });
  }, []);

  const handleDelete = useCallback(() => {
    setAmountString((prev) => prev.slice(0, -1));
  }, []);

  const handleSave = () => {
    const amount = parseFloat(amountString);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    onSubmit({
      amount,
      description: `Ahorro semana ${currentWeek.weekNumber}`,
    });
  };

  const formattedAmount = amountString
    ? `$${parseFloat(amountString).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "$0.00";

  return (
    <View style={NewSavingScreenStyle.container}>
      <View style={NewSavingScreenStyle.amountSection}>
        <MaterialCommunityIcons name="bank-outline" size={60} color="#4E54C8" />
        <Text style={NewSavingScreenStyle.amountLabel}>
          Ingresa el monto a ahorrar
        </Text>
        <Text style={NewSavingScreenStyle.amountValue}>{formattedAmount}</Text>
      </View>

      <Pressable
        style={[
          NewSavingScreenStyle.saveButton,
          (!amountString || parseFloat(amountString) <= 0) &&
            NewSavingScreenStyle.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={
          !amountString || parseFloat(amountString) <= 0 || isSubmitting
        }
      >
        <Text style={NewSavingScreenStyle.saveButtonText}>Guardar Ahorro</Text>
      </Pressable>

      <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />

      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onClose={closeErrorModal}
      />
      <LoadingOverlay visible={isSubmitting} />
    </View>
  );
}

function getCurrentWeekInfo() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return { weekNumber };
}

export default NewSavingScreen;
