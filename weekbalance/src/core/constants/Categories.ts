export const categories: Record<string, string> = {
  briefcase: "Trabajo",
  gift: "Regalo",
  refresh: "Reintegro",
  "ellipsis-vertical": "Otros",
  restaurant: "Comida",
  car: "Viajes",
  cart: "Compras",
  medical: "Salud",
  film: "Ocio",
};

export type Categories = {
  nameIcon: string;
};
//LISTAS DE CATEGORÍAS
//INCOMES
export const categoriesIncomes: Categories[] = [
  { nameIcon: "briefcase" },
  { nameIcon: "gift" },
  { nameIcon: "refresh" },
  { nameIcon: "ellipsis-vertical" },
];
//EXPENSES
export const categoriesExpenses: Categories[] = [
  { nameIcon: "restaurant" },
  { nameIcon: "car" },
  { nameIcon: "cart" },
  { nameIcon: "medical" },
  { nameIcon: "film" },
];
