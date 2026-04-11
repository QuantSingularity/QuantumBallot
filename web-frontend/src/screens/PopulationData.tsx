import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import TablePopulation from "@/tables/population_table/page";

function PopulationData() {
  const { toast } = useToast();

  return (
    <div className="flex gap-2 flex-col">
      <span className="font-inria-sans text-2xl text-gray-400">
        Population Data
      </span>
      <div className="md:items-center md:gap-2 w-full h-screen">
        <Toaster />
        <TablePopulation toast={toast} />
      </div>
    </div>
  );
}

export default PopulationData;
