import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, FileText } from "lucide-react";

interface DashboardStatsProps {
  totalInvoices: number;
  invoicesCount: number;
  pendingPV: number;
  activeNow: number;
}

const statCards = [
  {
    title: "Total Invoices",
    icon: DollarSign,
    valueKey: "totalInvoices" as const,
    format: "currency" as const,
  },
  {
    title: "Invoices Count",
    icon: FileText,
    valueKey: "invoicesCount" as const,
    format: "number" as const,
  },
  {
    title: "Pending PV",
    icon: CreditCard,
    valueKey: "pendingPV" as const,
    format: "number" as const,
  },
  {
    title: "Active Now",
    icon: Activity,
    valueKey: "activeNow" as const,
    format: "number" as const,
  },
];

export function DashboardStats({
  totalInvoices,
  invoicesCount,
  pendingPV,
  activeNow,
}: DashboardStatsProps) {
  const formatValue = (value: number, format: "currency" | "number") => {
    if (format === "currency") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString("id-ID");
  };

  const stats = {
    totalInvoices,
    invoicesCount,
    pendingPV,
    activeNow,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.valueKey];

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(value, card.format)}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.valueKey === "totalInvoices" && "+20.1% from last month"}
                {card.valueKey === "invoicesCount" && "+180.1% from last month"}
                {card.valueKey === "pendingPV" && "+19% from last month"}
                {card.valueKey === "activeNow" && "+201 since last hour"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
