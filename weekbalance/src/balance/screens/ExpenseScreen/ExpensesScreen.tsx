import { FlatList, View, Text, StyleSheet } from "react-native";
import CardHistory from "../../../shared/components/Cards/CardInfoHistory/CardInfoHistory";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { styleExpensesScreen } from "./ExpensesScreen.style";
import TransactionCard from "../../../shared/components/Cards/CardTransaction/CardTransaction";
import { useDriverContext } from "../../../core/context/ContextBalance";
import EmptyData from "../../../shared/components/UI/emptyData/EmptyData";
import { useExpenses } from "../../hooks/useExpenses";
import { Slider } from "../../../shared/components/layout/Sliders/Slider";
import { getDataExpenses } from "../../../core/constants/Categories";
import { WeekHeader } from "../../components/WeekHeader";
import { ResponseIncomeDto } from "../../types/Response/ResponseIncomeDto";
import { COLORS } from "../../../core/constants/Color";

interface WeekGroup {
  weekKey: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  items: ResponseIncomeDto[];
}

function getWeekInfo(date: Date): {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
} {
  const dayOfWeek = date.getDay();
  const diffToSunday = dayOfWeek;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - diffToSunday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  return { weekNumber, weekStart, weekEnd };
}

function groupExpensesByWeek(expenses: ResponseIncomeDto[]): WeekGroup[] {
  const groups: Record<string, WeekGroup> = {};

  const sortedExpenses = [...expenses].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  sortedExpenses.forEach((expense) => {
    const date = new Date(expense.created_at);
    const { weekNumber, weekStart, weekEnd } = getWeekInfo(date);
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!groups[weekKey]) {
      groups[weekKey] = {
        weekKey,
        weekNumber,
        startDate: weekStart.toISOString().split("T")[0],
        endDate: weekEnd.toISOString().split("T")[0],
        totalAmount: 0,
        items: [],
      };
    }

    groups[weekKey].items.push(expense);
    groups[weekKey].totalAmount += expense.amount;
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.weekKey).getTime() - new Date(a.weekKey).getTime(),
  );
}

type ListItem =
  | { type: "header"; data: WeekGroup }
  | { type: "expense"; data: ResponseIncomeDto };

function ExpensesScreen() {
  const { totalExpenses } = useDriverContext();
  const { dataFilter, handlerFilter } = useExpenses();

  const listData: ListItem[] = [];

  if (dataFilter.length > 0) {
    const weekGroups = groupExpensesByWeek(dataFilter);
    weekGroups.forEach((group) => {
      listData.push({ type: "header", data: group });
      group.items.forEach((item) => {
        listData.push({ type: "expense", data: item });
      });
    });
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "header") {
      return (
        <WeekHeader
          weekNumber={item.data.weekNumber}
          startDate={item.data.startDate}
          endDate={item.data.endDate}
          totalAmount={item.data.totalAmount}
        />
      );
    }

    return (
      <View style={styles.expenseItem}>
        <TransactionCard
          date={item.data.created_at}
          amount={item.data.amount || 0}
          category={item.data.category}
          description={item.data.description || "Sin descripcion"}
        />
      </View>
    );
  };

  const getCurrentMonthName = () => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[new Date().getMonth()];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  return (
    <View style={styleExpensesScreen.container}>
      <FlatList
        style={styles.flatList}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (item.type === "header") {
            return `header-${item.data.weekKey}`;
          }
          return `expense-${item.data.id}-${index}`;
        }}
        ListHeaderComponent={
          <View>
            <CardHistory
              title="TOTAL DE GASTOS SEMANAL"
              amount={totalExpenses || 0}
              mouth={getCurrentMonthName()}
              year={getCurrentYear()}
            />
            <Slider
              handlerClick={handlerFilter}
              options={getDataExpenses()}
              title="categorias"
            />
          </View>
        }
        ListEmptyComponent={() => {
          return (
            <EmptyData
              title="Sin datos disponibles"
              message="Aun no has registrado ningun gasto"
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <FloatingButton to="AddExpense" label="Agregar" />
    </View>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  expenseItem: {
    marginBottom: 10,
  },
});

export default ExpensesScreen;
