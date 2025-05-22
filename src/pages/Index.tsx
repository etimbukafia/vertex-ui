import { useState } from "react";
import AssessmentForm from "@/components/AssessmentForm";
import AssessmentResults from "@/components/AssessmentResults";
import { toast } from "sonner";
import { API_BASE } from "@/apiConfig";

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

interface AssessmentMetadata {
  assessment_id: string;
  processing_time_seconds: number;
  timestamp: string;
  api_version: string;
}

interface AssessmentResult {
  supplier_id: string;
  risk_score: number;
  decision_analysis: DecisionAnalysis;
  gemini_decision: string;
  metrics: Record<string, any>;
  assessment_metadata?: AssessmentMetadata;
}

interface ApiResponse {
  result: AssessmentResult;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Transform metrics object to array format for the component
  const transformMetrics = (metricsObj: Record<string, any>): Metric[] => {
    const metricDescriptions = {
      open_majors: "Open Major Audit Findings",
      open_minors: "Open Minor Audit Findings", 
      avg_ppm: "Average Defect Rate (PPM)",
      avg_rework: "Average Rework Percentage",
      total_ncr: "Total Non-Conformance Reports",
      avg_otd: "Average On-Time Delivery (%)",
      avg_dev: "Average Schedule Deviation (days)",
      fin_score: "Financial Health Score (Altman Z-Score)",
      geo_score: "Geopolitical Risk Score",
      sanctioned: "Sanctions Status",
      embargoed: "Trade Embargo Status",
      esg_score: "ESG Controversy Score",
      acb: "Anti-Bribery Compliance",
      tcomp: "Trade Compliance",
      scomp: "Sanctions Compliance"
    };

    return Object.entries(metricsObj).map(([key, value]) => ({
      name: metricDescriptions[key as keyof typeof metricDescriptions] || key,
      value: value,
      description: `${key}: ${value}`
    }));
  };

  const generateAssessment = async (supplierID: string, need: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Generating assessment for supplier: ${supplierID}, need: ${need}`);
      
      // Updated API call to match new endpoint structure
      console.log(`🔄 API_BASE: ${API_BASE}`);
      const response = await fetch(`${API_BASE}/api/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Note: The API doesn't seem to use the body parameters based on the FastAPI code,
        // but including them for future compatibility
        body: JSON.stringify({ supplier_id: supplierID, need: need }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail?.message || 
          errorData.message || 
          `API request failed with status ${response.status}`
        );
      }
      
      const apiResponse: ApiResponse = await response.json();
      console.log('✅ Assessment response received:', apiResponse);
      
      if (!apiResponse.result) {
        throw new Error('Invalid response format: missing result data');
      }
      
      setResult(apiResponse.result);
      
      // Enhanced success message with assessment details
      const decision = apiResponse.result.decision_analysis.final_decision;
      const riskScore = apiResponse.result.risk_score.toFixed(3);
      toast.success(
        `Assessment completed: ${decision} (Risk Score: ${riskScore})`,
        {
          description: `Assessment ID: ${apiResponse.result.assessment_metadata?.assessment_id || 'N/A'}`
        }
      );
      
    } catch (error) {
      console.error("❌ Error generating assessment:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast.error("Failed to generate assessment", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAssessment = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Risk Assessment</h1>
          <p className="text-sm text-gray-600 mt-1">AI-powered supplier risk analysis and decision making</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-10">
          {/* Show form when no result or error */}
          {!result && (
            <div className="w-full flex justify-center">
              <div className="w-full max-w-2xl">
                <AssessmentForm onSubmit={generateAssessment} isLoading={isLoading} />
                
                {/* Error display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <div className="text-red-800">
                        <h3 className="text-sm font-medium">Assessment Failed</h3>
                        <p className="text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Show results when available */}
          {result && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Assessment Results</h2>
                  {result.assessment_metadata && (
                    <p className="text-sm text-gray-600">
                      ID: {result.assessment_metadata.assessment_id} | 
                      Processed in {result.assessment_metadata.processing_time_seconds}s | 
                      {new Date(result.assessment_metadata.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleNewAssessment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  New Assessment
                </button>
              </div>
              
              <AssessmentResults 
                supplierID={result.supplier_id}
                riskScore={result.risk_score}
                decisionAnalysis={result.decision_analysis}
                aiDecision={result.gemini_decision}
                metrics={transformMetrics(result.metrics)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;