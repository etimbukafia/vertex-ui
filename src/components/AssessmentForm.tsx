
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Supplier Assessment</CardTitle>
        <CardDescription>
          Enter supplier information to generate a qualification and risk assessment
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="supplier-id" className="text-sm font-medium">
              Supplier ID
            </label>
            <Input
              id="supplier-id"
              value={supplierID}
              onChange={(e) => setSupplierID(e.target.value)}
              placeholder="Enter supplier identifier"
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="needs" className="text-sm font-medium">
              Needs Assessment
            </label>
            <Textarea
              id="needs"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="Describe your procurement needs and requirements"
              className="min-h-32 w-full"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Generate Assessment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AssessmentForm;
