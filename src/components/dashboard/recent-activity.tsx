import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CreditCard } from "lucide-react";

interface Activity {
  id: string;
  type: "invoice" | "pv";
  title: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

interface RecentActivityProps {
  data: Activity[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("paid") || lowerStatus.includes("approved")) {
      return "text-green-600 bg-green-100 dark:bg-green-900/20";
    }
    if (lowerStatus.includes("pending")) {
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    }
    if (lowerStatus.includes("reject") || lowerStatus.includes("cancel")) {
      return "text-red-600 bg-red-100 dark:bg-red-900/20";
    }
    return "text-muted-foreground bg-muted";
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest invoices and payment vouchers
        </p>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-6">
            {data.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "invoice"
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : "bg-purple-100 dark:bg-purple-900/20"
                  }`}
                >
                  {activity.type === "invoice" ? (
                    <FileText className="w-4 h-4 text-blue-600" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(activity.amount)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(activity.date)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        activity.status,
                      )}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] rounded-md bg-muted/20 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
