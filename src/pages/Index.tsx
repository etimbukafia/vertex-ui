
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

interface AssessmentResult {
  supplier_id: string;
  risk_score: number;
  decision_analysis: string;
  AI_decision: string;
  metrics: Metric[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // This function would typically make an API call to your backend
  const generateAssessment = async (supplierID: string, need: string) => {
    setIsLoading(true);
    
    try {
      // Real API call to your ngrok endpoint
      const response = await fetch(`${API_BASE}/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplier_id: supplierID, need: need }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const result = await response.json();
      setResult(result);
      toast.success("Assessment generated successfully");
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error("Failed to generate assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
      

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Risk Assessment</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-10">
          {!result && (
            <div className="w-full flex justify-center">
              <AssessmentForm onSubmit={generateAssessment} isLoading={isLoading} />
            </div>
          )}
          
          {result && (
            <div className="w-full">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setResult(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  New Assessment
                </button>
              </div>
              <AssessmentResults 
                supplierID={result.supplier_id}
                riskScore={result.risk_score}
                decisionAnalysis={result.decision_analysis}
                aiDecision={result.AI_decision}
                metrics={result.metrics}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
