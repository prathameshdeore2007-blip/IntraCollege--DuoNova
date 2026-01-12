import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useClickSound } from "@/hooks/useClickSound";

const sections = ["CSD", "CSH", "CSA", "IoT", "CSE-core", "ECE"];
const years = ["1st", "2nd", "3rd", "4th"];

const SectionYearSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || "student"; // 'student' or 'faculty'
  const playClickSound = useClickSound();
  
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [semesterError, setSemesterError] = useState<string>("");

  // Get valid semester range based on selected year
  const getValidSemesterRange = (year: string): number[] => {
    const yearMap: Record<string, number[]> = {
      "1st": [1, 2],
      "2nd": [3, 4],
      "3rd": [5, 6],
      "4th": [7, 8],
    };
    return yearMap[year] || [];
  };

  // Get error message for invalid semester based on year
  const getErrorMessage = (year: string): string => {
    const errorMap: Record<string, string> = {
      "1st": "Invalid. 1st Year only allows Semesters 1 or 2.",
      "2nd": "Invalid. 2nd Year only allows Semesters 3 or 4.",
      "3rd": "Invalid. 3rd Year only allows Semesters 5 or 6.",
      "4th": "Invalid. 4th Year only allows Semesters 7 or 8.",
    };
    return errorMap[year] || "Please select a year first.";
  };

  // Get hint message for selected year
  const getHintMessage = (year: string): string => {
    if (!year) return "";
    const validRange = getValidSemesterRange(year);
    return `Okay, for Year ${year}, I'm looking for Semester ${validRange.join(" or ")}.`;
  };

  const isSemesterValid = () => {
    if (!selectedYear || !selectedSemester) return false;
    const num = parseInt(selectedSemester);
    const validRange = getValidSemesterRange(selectedYear);
    return !isNaN(num) && validRange.includes(num);
  };

  const isFormValid = selectedSection && selectedYear && selectedSemester && isSemesterValid();

  const handleNext = () => {
    if (isFormValid) {
      playClickSound();
      // Store selections (can be enhanced with proper state management later)
      localStorage.setItem("userSection", selectedSection);
      localStorage.setItem("userYear", selectedYear);
      localStorage.setItem("userSemester", selectedSemester);
      
      // Navigate to appropriate page based on user type
      if (userType === "faculty") {
        // Faculty goes directly to assigned subjects with context
        navigate("/faculty/assigned-subjects", { 
          state: { 
            section: selectedSection, 
            year: selectedYear, 
            semester: selectedSemester 
          } 
        });
      } else {
        navigate("/student-dashboard");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => {
          playClickSound();
          navigate("/home");
        }}
        className="absolute bottom-8 left-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Go back to role selection"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Welcome Message */}
      <div className="mb-12 text-center">
        <p className="text-lg text-muted-foreground">
          Welcome! Please choose your Section, Year, and Semester to unlock your tailored campus experience.
        </p>
      </div>

      {/* Selection Form */}
      <div className="w-full max-w-sm space-y-8">
        {/* Sections Field */}
        <div className="space-y-3">
          <label className="block text-center text-3xl font-medium text-foreground">
            Sections
          </label>
          <Select 
            value={selectedSection} 
            onValueChange={(value) => {
              playClickSound();
              setSelectedSection(value);
            }}
          >
            <SelectTrigger className="h-14 rounded-full border-2 border-input text-base">
              <SelectValue placeholder="Sections" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Field */}
        <div className="space-y-3">
          <label className="block text-center text-3xl font-medium text-foreground">
            Year
          </label>
          <Select 
            value={selectedYear} 
            onValueChange={(value) => {
              playClickSound();
              setSelectedYear(value);
              // Reset semester when year changes since valid options change
              setSelectedSemester("");
              setSemesterError("");
            }}
          >
            <SelectTrigger className="h-14 rounded-full border-2 border-input text-base">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester Field */}
        <div className="space-y-3">
          <label className="block text-center text-3xl font-medium text-foreground">
            Semester
          </label>
          
          {/* Hint message when year is selected */}
          {selectedYear && !selectedSemester && (
            <p className="text-center text-sm text-muted-foreground italic">
              {getHintMessage(selectedYear)}
            </p>
          )}
          
          <Select 
            value={selectedSemester} 
            onValueChange={(value) => {
              playClickSound();
              setSelectedSemester(value);
              setSemesterError("");
            }}
            disabled={!selectedYear}
          >
            <SelectTrigger 
              className={`h-14 rounded-full border-2 text-base ${
                selectedSemester && isSemesterValid() 
                  ? "border-primary" 
                  : "border-input"
              } ${!selectedYear ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder={selectedYear ? "Select Semester" : "Select year first"} />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {selectedYear && getValidSemesterRange(selectedYear).map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Next Button */}
      <div className="absolute bottom-8 right-8">
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className="h-12 rounded-full px-8 text-base font-semibold uppercase tracking-wide transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SectionYearSelection;
