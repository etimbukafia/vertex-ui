
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, FileText, SendHorizontal } from "lucide-react";

interface AssessmentFormProps {
  onSubmit: (supplierID: string, need: string) => void;
  isLoading: boolean;
}

const AssessmentForm = ({ onSubmit, isLoading }: AssessmentFormProps) => {
  const [supplierID, setSupplierID] = useState<string>("");
  const [need, setNeed] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierID.trim()) {
      toast.error("Supplier ID is required");
      return;
    }
    
    if (!need.trim()) {
      toast.error("Needs assessment is required");
      return;
    }

    onSubmit(supplierID, need);
  };

  return (
    <Card className="w-full max-w-2xl border-0 bg-gradient-to-b from-white to-gray-50 shadow-lg">
      <CardHeader className="space-y-1 pb-6 pt-8 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Supplier Assessment</CardTitle>
        <CardDescription className="text-base">
          Enter supplier information to generate a qualification and risk assessment
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 px-8">
          <div className="space-y-2">
            <label htmlFor="supplier-id" className="text-sm font-medium">
              Supplier ID
            </label>
            <div className="relative">
              <Input
                id="supplier-id"
                value={supplierID}
                onChange={(e) => setSupplierID(e.target.value)}
                placeholder="Enter supplier identifier"
                className="pl-10 shadow-sm"
                disabled={isLoading}
              />
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="needs" className="text-sm font-medium">
              Needs Assessment
            </label>
            <div className="relative">
              <Textarea
                id="needs"
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                placeholder="Describe your procurement needs and requirements"
                className="min-h-40 pl-10 shadow-sm"
                disabled={isLoading}
              />
              <FileText className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-8 pt-2">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-base py-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                Generate Assessment
                <SendHorizontal className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AssessmentForm;
