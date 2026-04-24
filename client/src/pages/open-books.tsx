import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  DollarSign,
  Vote,
  PieChart,
  Heart,
  AlertTriangle,
} from "lucide-react";

interface FinancialRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  status: "confirmed" | "pending" | "projected";
}

interface BudgetItem {
  id: string;
  title: string;
  description: string;
  category: string;
  requestedAmount: number;
  allocatedAmount: number;
  votes: number;
  priority: "high" | "medium" | "low";
  status: "voting" | "approved" | "funded" | "completed";
  proposedBy: string;
  deadline: string;
}

const COST_CATEGORIES = [
  "Product Sales (revenue)",
  "Manufacturing materials",
  "Research & Development",
  "Community / patron dividends",
  "Partnership licensing",
  "Operations",
];

export default function OpenBooks() {
  const { data: financialRecords = [] } = useQuery<FinancialRecord[]>({
    queryKey: ["/api/cooperative/financial-records"],
  });
  const { data: budgetItems = [] } = useQuery<BudgetItem[]>({
    queryKey: ["/api/cooperative/budget-items"],
  });

  const totalRevenue = financialRecords
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + r.amount, 0);
  const totalExpenses = financialRecords
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + Math.abs(r.amount), 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Alert className="mb-6 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Cooperative finances center intersex anatomy as the universal baseline — affirming care serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <AlertDescription className="text-sm text-amber-900 dark:text-amber-200">
            <strong>This is the books — not a marketing dashboard.</strong> Earlier versions invented financial records (e.g., "$12,450 custom protection sales", "$3,200 ocean plastic sourcing"), fake budget proposals with vote counts ("Expand 3D Scanning Precision — 127 votes", "Community Health Clinic Partnerships — 203 votes"), and a "Q4 2024" period summary totaling $14,250 / $10,800 — none of which corresponded to any real ledger. Those records have been removed. This page now reads from real cooperative ledger endpoints; until those endpoints have entries, it shows empty totals and the participatory-budgeting framework only. Open books with no entries is more honest than fabricated entries.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-recoleta">
              Open Books
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-coolvetica">
            Transparent Accounting · Participatory Budgeting · Cooperative Governance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Summary label="Total revenue (period)" value={totalRevenue} />
          <Summary label="Total expenses (period)" value={totalExpenses} />
          <Summary label="Net" value={netIncome} accent />
        </div>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Records
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              Participatory Budget
            </TabsTrigger>
            <TabsTrigger value="framework" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Framework
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>Ledger Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {financialRecords.length === 0 ? (
                  <EmptyState
                    title="No ledger entries yet"
                    body="Entries will appear here when posted by the cooperative's bookkeeping role through the records endpoint. The endpoint exists; the data does not until real transactions are recorded. Categories that the ledger will accept:"
                  >
                    <div className="flex flex-wrap gap-2 mt-3">
                      {COST_CATEGORIES.map((c) => (
                        <Badge key={c} variant="outline">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </EmptyState>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {financialRecords.map((r) => (
                      <li key={r.id} className="flex justify-between border-b pb-2">
                        <span>
                          <span className="text-muted-foreground">{r.date} — </span>
                          {r.description}
                        </span>
                        <span className={r.type === "income" ? "text-green-600" : "text-red-600"}>
                          {r.type === "income" ? "+" : "−"}${Math.abs(r.amount).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle>Active Budget Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                {budgetItems.length === 0 ? (
                  <EmptyState
                    title="No proposals yet"
                    body="Member-submitted budget proposals will appear here once the participatory-budget endpoint is wired to live submissions. The Rochdale-style governance pattern that the proposals follow:"
                  >
                    <ul className="text-sm text-muted-foreground mt-3 space-y-1 list-disc pl-5">
                      <li>Any active patron-member may submit a proposal.</li>
                      <li>Quorum for adoption: ≥10% of active patron-members or 25 absolute, whichever is greater.</li>
                      <li>Proposals carry by simple majority of the quorate vote.</li>
                      <li>Funded proposals become line items in the records tab once disbursed.</li>
                    </ul>
                  </EmptyState>
                ) : (
                  <ul className="space-y-3">
                    {budgetItems.map((b) => (
                      <li key={b.id} className="p-3 border rounded">
                        <div className="flex justify-between">
                          <p className="font-semibold">{b.title}</p>
                          <Badge variant="outline">{b.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{b.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span>Requested: ${b.requestedAmount.toLocaleString()}</span>
                          <span>Allocated: ${b.allocatedAmount.toLocaleString()}</span>
                          <span>Votes: {b.votes}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="framework">
            <Card>
              <CardHeader>
                <CardTitle>Cooperative Accounting Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  The cooperative operates under double-entry bookkeeping with patron-dividend accounting. Every transaction belongs to one of the categories above. Patron dividends are calculated annually as a function of patronage (verified contribution to cooperative output), not as profit-share on capital.
                </p>
                <p>
                  Open-books transparency means: every line item, every proposal, every vote is visible to every member, and the ledger endpoints that populate this page are read-only public for members. The honesty bar is set by what the endpoints actually contain — never by what would look good if fabricated.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Summary({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card className={accent ? "border-primary/40" : ""}>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${accent ? "text-primary" : ""}`}>
          {value === 0 ? "—" : `$${value.toLocaleString()}`}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-6 border-2 border-dashed border-muted-foreground/30 rounded text-center">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground mt-2">{body}</p>
      {children && <div className="text-left">{children}</div>}
    </div>
  );
}
