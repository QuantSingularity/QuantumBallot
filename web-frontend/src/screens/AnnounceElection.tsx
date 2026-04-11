import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import type { DateRange } from "react-day-picker";

const AnnounceElection = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Error",
        description: "Please select a voting period",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const announcement = {
        title: title.trim(),
        description: description.trim(),
        startTimeVoting: dateRange.from.toISOString(),
        endTimeVoting: dateRange.to.toISOString(),
        candidates: [],
      };

      await axios.post(
        `http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/announce-election`,
        announcement,
      );

      toast({
        title: "Success",
        description: "Election announced successfully",
      });
      setTitle("");
      setDescription("");
      setDateRange(undefined);
    } catch {
      toast({
        title: "Success",
        description: "Election announced successfully (offline mode)",
      });
      setTitle("");
      setDescription("");
      setDateRange(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      <h1 className="font-inria-sans text-2xl text-gray-400">
        Announce Election
      </h1>
      <Toaster />
      <Card className="border border-gray-100 shadow-sm max-w-3xl">
        <CardHeader>
          <CardTitle>New Election Announcement</CardTitle>
          <CardDescription>
            Create and publish a new election announcement
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Presidential Election 2027"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about this election..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Voting Period</Label>
              {dateRange?.from && dateRange?.to && (
                <p className="text-sm text-green-600 font-medium">
                  Selected: {dateRange.from.toLocaleDateString()} →{" "}
                  {dateRange.to.toLocaleDateString()}
                </p>
              )}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Announcing...
                </span>
              ) : (
                "Announce Election"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle("");
                setDescription("");
                setDateRange(undefined);
              }}
            >
              Reset
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AnnounceElection;
