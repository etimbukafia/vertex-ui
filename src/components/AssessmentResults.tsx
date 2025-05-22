
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertTriangle, ShieldCheck, Database, ChartBar } from "lucide-react";

interface Metric {
  name: string;
  value: number | string;
  description?: string;
}

interface AssessmentResultsProps {
  supplierID: string;
  riskScore: number;
  decisionAnalysis: string;
  aiDecision: string;
  metrics: Metric[];
}

const AssessmentResults = ({
  supplierID,
  riskScore,
  decisionAnalysis,
  aiDecision,
  metrics
}: AssessmentResultsProps) => {
  // Determine risk level based on score
  const getRiskLevel = (score: number) => {
    if (score <= 25) return { label: "Low Risk", color: "bg-green-500", textColor: "text-green-500" };
    if (score <= 50) return { label: "Moderate Risk", color: "bg-yellow-500", textColor: "text-yellow-500" };
    if (score <= 75) return { label: "High Risk", color: "bg-orange-500", textColor: "text-orange-500" };
    return { label: "Critical Risk", color: "bg-red-500", textColor: "text-red-500" };
  };

  const riskLevel = getRiskLevel(riskScore);
  
  // Determine decision badge
  const getDecisionBadge = (decision: string) => {
    const lowerDecision = decision.toLowerCase();
    
    if (lowerDecision.includes("approve") || lowerDecision.includes("qualified")) {
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    } else if (lowerDecision.includes("review") || lowerDecision.includes("further") || lowerDecision.includes("additional")) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Review Required</Badge>;
    } else {
      return <Badge className="bg-red-500 hover:bg-red-600">Not Approved</Badge>;
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assessment Results</h2>
        <Badge variant="outline" className="text-sm">
          Supplier ID: {supplierID}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Risk Assessment</CardTitle>
            <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className={`font-bold ${riskLevel.textColor}`}>{riskScore}/100</span>
              </div>
              <Progress value={riskScore} className={`h-3 ${riskLevel.color}`} />
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">AI Decision</h4>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">{aiDecision}</p>
                {getDecisionBadge(aiDecision)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Decision Analysis</CardTitle>
          <CardDescription>Detailed assessment explanation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground whitespace-pre-line">{decisionAnalysis}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">Metrics & Indicators</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">{metric.name}</h4>
                  <span className="font-bold">{metric.value}</span>
                </div>
                {metric.description && (
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;
