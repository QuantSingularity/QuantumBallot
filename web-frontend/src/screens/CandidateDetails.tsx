import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Candidate } from "@/data_types";
import Waveform from "@/tables/election_results_table/Waveform";

interface CandidateDetailsProps {
  candidate?: Candidate;
  isLoading?: boolean;
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({
  candidate = {
    id: 1,
    code: 1,
    name: "John Doe",
    acronym: "JD",
    party: "Independent",
    candidadePhoto: "/images/nakamoto.svg",
    status: "active",
    toast: () => {},
  },
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // In a real app, fetch candidate data by id
    if (id) {
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  const speechUrl = (candidate as any).speech;

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{candidate.name}</CardTitle>
          <CardDescription>Party: {candidate.party}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex justify-center">
              {candidate.candidadePhoto && (
                <img
                  src={candidate.candidadePhoto}
                  alt={candidate.name ?? "Candidate"}
                  className="w-64 h-64 object-contain rounded-xl"
                />
              )}
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-medium mb-2">
                Candidate Information
              </h3>
              <p className="text-gray-500 mb-4">
                This candidate is running for office with the {candidate.party}{" "}
                party.
              </p>
              {speechUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Campaign Speech</h3>
                  <Waveform url={speechUrl} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button>Vote for this Candidate</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CandidateDetails;
