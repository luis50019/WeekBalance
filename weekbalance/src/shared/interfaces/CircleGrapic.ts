export interface ChartDataPoint {
  value: number;
  color: string;
  text: string;
  day?: string;
  isCurrentWeek?: boolean;
}

export interface PropsGrapic {
  info: ChartDataPoint[] | null;
  totalExpense: number | null;
}
