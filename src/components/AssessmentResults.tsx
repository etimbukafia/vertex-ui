
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
//import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertTriangle, ShieldCheck, Database, ChartBar, AlertCircle, Eye, Shield } from "lucide-react";

interface Metric {
  name: string;
  value: number | string;
  description?: string;
}

interface DecisionAnalysis {
  final_decision: string;
  decision_tier: string;
  confidence_level: string;
  reasoning: string[];
  risk_factors: string[];
  mitigation_suggestions: string[];
  review_required: boolean;
}

interface AssessmentResultsProps {
  supplierID: string;
  riskScore: number;
  decisionAnalysis: DecisionAnalysis; // Changed from string to object
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
  // Convert risk score (0-1 range) to percentage for display
  const riskScorePercentage = Math.round(riskScore * 100);
  
  // Determine risk level based on score
  const getRiskLevel = (score: number) => {
    if (score <= 25) return { label: "Low Risk", color: "bg-green-500", textColor: "text-green-500" };
    if (score <= 50) return { label: "Moderate Risk", color: "bg-yellow-500", textColor: "text-yellow-500" };
    if (score <= 75) return { label: "High Risk", color: "bg-orange-500", textColor: "text-orange-500" };
    return { label: "Critical Risk", color: "bg-red-500", textColor: "text-red-500" };
  };

  const riskLevel = getRiskLevel(riskScorePercentage);
  
  // Enhanced decision badge logic
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'APPROVE':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'CONDITIONAL_APPROVE':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><AlertTriangle className="w-3 h-3 mr-1" />Conditional Approval</Badge>;
      case 'REQUIRES_REVIEW':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Eye className="w-3 h-3 mr-1" />Review Required</Badge>;
      case 'REJECT':
        return <Badge className="bg-red-500 hover:bg-red-600"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get confidence level styling
  const getConfidenceStyle = (confidence: string) => {
    switch (confidence) {
      case 'CERTAIN':
      case 'HIGH':
        return { color: "text-green-600", bg: "bg-green-50" };
      case 'MEDIUM':
        return { color: "text-yellow-600", bg: "bg-yellow-50" };
      case 'LOW':
        return { color: "text-red-600", bg: "bg-red-50" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const confidenceStyle = getConfidenceStyle(decisionAnalysis.confidence_level);

  // Get tier icon and color
  const getTierInfo = (tier: string) => {
    if (tier.includes('TIER_1')) return { icon: AlertCircle, color: "text-red-500", label: "Tier 1 - Absolute" };
    if (tier.includes('TIER_2')) return { icon: AlertTriangle, color: "text-orange-500", label: "Tier 2 - High Risk" };
    if (tier.includes('TIER_3')) return { icon: Eye, color: "text-yellow-500", label: "Tier 3 - Moderate" };
    if (tier.includes('TIER_4')) return { icon: CheckCircle, color: "text-green-500", label: "Tier 4 - Low Risk" };
    return { icon: Shield, color: "text-gray-500", label: tier };
  };

  const tierInfo = getTierInfo(decisionAnalysis.decision_tier);
  const TierIcon = tierInfo.icon;

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assessment Results</h2>
        <Badge variant="outline" className="text-sm">
          Supplier ID: {supplierID}
        </Badge>
      </div>

      {/* Decision Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Decision Summary</CardTitle>
            {getDecisionBadge(decisionAnalysis.final_decision)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Risk Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Score</span>
                <span className={`font-bold ${riskLevel.textColor}`}>{riskScore.toFixed(3)}</span>
              </div>
              <Progress value={riskScorePercentage} className="h-3" />
              <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
            </div>

            {/* Decision Tier */}
            <div className={`p-3 rounded-lg border ${confidenceStyle.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <TierIcon className={`h-4 w-4 ${tierInfo.color}`} />
                <span className="text-sm font-medium">Decision Tier</span>
              </div>
              <div className="text-xs text-gray-600">{tierInfo.label}</div>
            </div>

            {/* Confidence Level */}
            <div className={`p-3 rounded-lg border ${confidenceStyle.bg}`}>
              <div className="text-sm font-medium mb-1">Confidence Level</div>
              <div className={`font-bold ${confidenceStyle.color}`}>
                {decisionAnalysis.confidence_level}
              </div>
            </div>
          </div>

          {/* Review Required Alert */}
          {decisionAnalysis.review_required && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-medium">Manual Review Required</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decision Reasoning Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            Decision Reasoning
          </CardTitle>
          <CardDescription>Key factors influencing the assessment decision</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {decisionAnalysis.reasoning.map((reason, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Risk Factors Card */}
      {decisionAnalysis.risk_factors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Risk Factors
            </CardTitle>
            <CardDescription>Identified risk categories for this supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {decisionAnalysis.risk_factors.map((factor, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mitigation Suggestions Card */}
      {decisionAnalysis.mitigation_suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Mitigation Suggestions
            </CardTitle>
            <CardDescription>Recommended actions to address identified risks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {decisionAnalysis.mitigation_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            AI Analysis
          </CardTitle>
          <CardDescription>Raw AI assessment output</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {aiDecision}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">Supplier Metrics</CardTitle>
          </div>
          <CardDescription>Key performance indicators and risk metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm text-gray-700">{metric.name}</h4>
                  <span className="font-bold text-gray-900">{metric.value}</span>
                </div>
                {metric.description && (
                  <p className="text-xs text-gray-500">{metric.description}</p>
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