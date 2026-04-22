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

//TODO: fucion que obtenga los datos en un solo objeto sobre las categorias
export interface optionsCategories {
  nameIcon: string;
  title: string;
}

export function getDataOptions(): optionsCategories[] {
  const data = categoriesIncomes.map((item) => {
    return { nameIcon: item.nameIcon, title: categories[item.nameIcon] };
  });
  data.unshift({ nameIcon: "All", title: "Todo" });
  return data;
}

export function getDataExpenses(): optionsCategories[] {
  const data = categoriesExpenses.map((item) => {
    return { nameIcon: item.nameIcon, title: categories[item.nameIcon] };
  });
  data.unshift({ nameIcon: "All", title: "Todo" });
  return data;
}
