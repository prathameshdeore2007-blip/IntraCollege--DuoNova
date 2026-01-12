import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";

const featureNames: Record<string, string> = {
  pyqs: "Previous Year Questions",
  syllabus: "Syllabus",
  assignment: "Assignment",
  marksheet: "Marksheet",
  materials: "Study Material",
  attendance: "Attendance",
};

const SubjectFeature = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const { code, feature } = useParams<{ code: string; feature: string }>();
  const location = useLocation();
  const subject = location.state?.subject as { name: string; code: string } | undefined;

  const title = featureNames[feature || ""] || "Subject Feature";
  const subjectName = subject?.name || "Subject";
  const subjectCode = subject?.code || code || "";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <button
            onClick={() => {
              playClickSound();
              navigate(-1);
            }}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-foreground text-center">
            {title}
          </h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-xl border-2 border-border bg-card p-6 shadow-sm">
          <p className="mb-2 text-sm text-muted-foreground">{subjectName} - {subjectCode}</p>
          <div className="rounded-lg border-2 border-dashed border-muted p-10 text-center text-muted-foreground">
            This is a placeholder for the {title} page. Hook up your data sources here.
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectFeature;


