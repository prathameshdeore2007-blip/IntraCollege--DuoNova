import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, BookOpen, ClipboardList, BarChart2, FolderOpen, CheckCircle } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";

interface Subject {
  name: string;
  code: string;
}

type FeatureKey = "pyqs" | "syllabus" | "assignment" | "marksheet" | "materials" | "attendance";

const featureTiles: Array<{
  key: FeatureKey;
  title: string;
  description: string;
  icon: any;
  color: string;
  hover: string;
  border: string;
}> = [
  { key: "pyqs", title: "PYQs", description: "Previous Year Questions", icon: FileText, color: "bg-blue-500/10", hover: "hover:bg-blue-500/20", border: "border-blue-500/30" },
  { key: "syllabus", title: "Syllabus", description: "Course Curriculum", icon: BookOpen, color: "bg-emerald-500/10", hover: "hover:bg-emerald-500/20", border: "border-emerald-500/30" },
  { key: "assignment", title: "Assignment", description: "Details & Submission", icon: ClipboardList, color: "bg-violet-500/10", hover: "hover:bg-violet-500/20", border: "border-violet-500/30" },
  { key: "marksheet", title: "Marksheet", description: "Your Grades", icon: BarChart2, color: "bg-fuchsia-500/10", hover: "hover:bg-fuchsia-500/20", border: "border-fuchsia-500/30" },
  { key: "materials", title: "Study material", description: "Notes & Resources", icon: FolderOpen, color: "bg-amber-500/10", hover: "hover:bg-amber-500/20", border: "border-amber-500/30" },
  { key: "attendance", title: "Attendance", description: "Attendance Record", icon: CheckCircle, color: "bg-cyan-500/10", hover: "hover:bg-cyan-500/20", border: "border-cyan-500/30" },
];

const getPersonalHint = (subjectName: string) => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun,1=Mon,...
  const hour = now.getHours();

  if (day === 1 && hour < 12) {
    return "Time to check your Attendance! Let's start the week strong.";
  }
  if (hour >= 20) {
    return `Evening focus time. A quick review of ${subjectName} materials could boost retention.`;
  }
  if (hour < 9) {
    return `Good morning! Skim the syllabus to set goals for ${subjectName}.`;
  }
  return `Stay on track: a brief look at ${subjectName} assignments can help you plan your day.`;
};

const SubjectDetails = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const subject: Subject | undefined = location.state?.subject;

  const subjectName = subject?.name || "Subject";
  const subjectCode = subject?.code || code || "";

  // Check if user is faculty (from localStorage)
  const userRole = localStorage.getItem("userRole") || "student";
  const isFaculty = userRole === "faculty";

  const hint = useMemo(() => getPersonalHint(subjectName), [subjectName]);

  const goBack = () => {
    playClickSound();
    if (isFaculty) {
      navigate("/faculty/assigned-subjects");
    } else {
      navigate("/academic");
    }
  };

  const openFeature = (feature: FeatureKey) => {
    playClickSound();
    // Faculty goes to inbox view, students go to student content feed
    if (isFaculty) {
      navigate(`/subject/${subjectCode}/${feature}/inbox`, { 
        state: { subject: { name: subjectName, code: subjectCode } } 
      });
    } else {
      navigate(`/student/subject/${subjectCode}/${feature}/feed`, { 
        state: { subject: { name: subjectName, code: subjectCode } } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Go back to subjects"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-foreground text-center">
            {subjectName} <span className="text-muted-foreground">- {subjectCode}</span>
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Body */}
      <main className="container mx-auto px-6 py-8">
        {/* Helpful AI message */}
        <div className="mx-auto mb-8 max-w-2xl rounded-xl border-2 border-primary/20 bg-primary/10 p-4 text-center">
          <p className="text-sm font-medium text-primary">
            {hint}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureTiles.map((tile, index) => (
            <button
              key={tile.key}
              onClick={() => openFeature(tile.key)}
              className={`group relative aspect-square rounded-2xl border-2 ${tile.border} ${tile.color} ${tile.hover} p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-background/50 p-4">
                  <tile.icon className="h-12 w-12 text-foreground" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground leading-tight">{tile.title}</h3>
                  <p className="text-xs text-muted-foreground">{tile.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubjectDetails;


