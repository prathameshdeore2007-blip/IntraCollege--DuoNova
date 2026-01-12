import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calculator, Zap, Atom, Code, Cpu, TreePine, Grid3x3, Binary, Database, Terminal, MessageSquare, Wrench, Star, TrendingUp, BookOpen, Layers, Network, GitBranch, Settings, Brain, BarChart3, Scale, Lightbulb, Briefcase, Bot, PieChart, Gamepad2, MousePointer2, Palette, Trophy, Hand, Bug, Globe, LineChart, Server, Radio, BarChart2, FolderOpen, LogOut } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface Subject {
  name: string;
  code: string;
  icon: any;
  color: string;
  isPopular?: boolean;
  isAIML?: boolean;
}

interface SubjectData {
  [key: string]: Subject[];
}

// Complete subject data matching Academic.tsx
const subjectData: SubjectData = {
  "CSE-core_1st_1": [
    { name: "Calculus for Engineers", code: "MAL103", icon: Calculator, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { name: "Elements of Electrical Engineering", code: "BEL102", icon: Zap, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
    { name: "Applied Sciences", code: "BSL101", icon: Atom, color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30" },
    { name: "Computer Programming", code: "CSL101", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30", isPopular: true },
    { name: "Electronics Devices and Circuits", code: "ECL101", icon: Cpu, color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30" },
    { name: "Environmental Studies", code: "HUL102", icon: TreePine, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30" },
  ],
  "CSE-core_1st_2": [
    { name: "Matrices, Transform Techniques, and Differential Equations", code: "MAL104", icon: Grid3x3, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30" },
    { name: "Digital Electronics", code: "ECL102", icon: Binary, color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30" },
    { name: "Data Structures", code: "CSL102", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30", isPopular: true },
    { name: "Application Programming", code: "CSL103", icon: Terminal, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Communication Skills", code: "HUL101", icon: MessageSquare, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "Mechanics & Graphics", code: "BEL101", icon: Wrench, color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30" },
  ],
  "CSE-core_2nd_3": [
    { name: "Numerical Methods and Probability Theory", code: "MAL201", icon: TrendingUp, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { name: "Introduction to Object Oriented Programming", code: "CSL202", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30", isPopular: true },
    { name: "Computer System Organisation", code: "CSL203", icon: Cpu, color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30" },
    { name: "Data Structures with Applications", code: "CSL210", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30" },
    { name: "IT Workshop I", code: "CSP201", icon: Wrench, color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30" },
    { name: "Microprocessors & Interfacing", code: "ECL202", icon: Cpu, color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30" },
  ],
  "CSE-core_2nd_4": [
    { name: "Design and Analysis of Algorithms", code: "CSL205", icon: GitBranch, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30", isPopular: true },
    { name: "Software Engineering", code: "CSL206", icon: Layers, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30" },
    { name: "Operating Systems", code: "CSL207", icon: Terminal, color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30" },
    { name: "Design Principles of Programming Languages", code: "CSL208", icon: BookOpen, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30" },
    { name: "Discrete Maths and Graph Theory", code: "CSL204", icon: Network, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "IT Workshop II", code: "CSP202", icon: Settings, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
  ],
  "CSA_1st_1": [
    { name: "Calculus for Data Science", code: "MAL105", icon: Calculator, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { name: "Conversational AI", code: "CSL110", icon: Brain, color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30", isPopular: true, isAIML: true },
    { name: "Computer Programming", code: "CSL101", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" },
    { name: "AI, Ethics and Society", code: "CSL111", icon: Scale, color: "bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/30" },
    { name: "Applied Electronics", code: "ECL103", icon: Zap, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
    { name: "Environmental Studies", code: "HUL102", icon: TreePine, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30" },
  ],
  "CSA_1st_2": [
    { name: "Probability and Statistics", code: "MAL106", icon: BarChart3, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30" },
    { name: "Introduction to Linear Algebra", code: "MAL107", icon: Grid3x3, color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30" },
    { name: "Data Structures", code: "CSL102", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30", isPopular: true },
    { name: "Application Programming", code: "CSL103", icon: Terminal, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Communication Skills", code: "HUL101", icon: MessageSquare, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "IT Workshop I", code: "CSP201", icon: Wrench, color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30" },
  ],
  "CSA_2nd_3": [
    { name: "Introduction to Object Oriented Programming", code: "CSL202", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" },
    { name: "Data Structure with Applications", code: "CSL210", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30" },
    { name: "Discrete Maths and Graph Theory", code: "CSL204", icon: Network, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "Foundations of Computing", code: "CSL216", icon: Lightbulb, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
    { name: "Computer System Organization", code: "CSL203", icon: Cpu, color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30" },
    { name: "Introduction to Entrepreneurship", code: "HUL103", icon: Briefcase, color: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30" },
    { name: "AI/ML Workshop I", code: "CSP203", icon: Bot, color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30", isPopular: true, isAIML: true },
  ],
  "CSA_2nd_4": [
    { name: "Machine Learning", code: "CSL422", icon: Brain, color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30", isPopular: true, isAIML: true },
    { name: "Design and Analysis of Algorithms", code: "CSL205", icon: GitBranch, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Operating Systems", code: "CSL207", icon: Terminal, color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30" },
    { name: "Software Engineering", code: "CSL206", icon: Layers, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30" },
    { name: "Database Management Systems", code: "CSL301", icon: Database, color: "bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30" },
    { name: "Data Handling and Visualization", code: "CSL214", icon: PieChart, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30", isAIML: true },
    { name: "AI/ML Workshop II", code: "CSP204", icon: Bot, color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30", isPopular: true, isAIML: true },
  ],
  "CSH_1st_1": [
    { name: "Calculus for Engineers", code: "MAL103", icon: Calculator, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { name: "Introduction to Gaming", code: "CSL106", icon: Gamepad2, color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30", isPopular: true },
    { name: "Computer Programming", code: "CSL101", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" },
    { name: "Mechanics & Graphics", code: "BEL101", icon: Wrench, color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30" },
    { name: "Communication Skills", code: "HUL101", icon: MessageSquare, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "Introduction to HCI", code: "CSL107", icon: MousePointer2, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30", isPopular: true },
  ],
  "CSH_1st_2": [
    { name: "Matrices, Transform Techniques, and Differential Equations", code: "MAL104", icon: Grid3x3, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30" },
    { name: "Applied Physics for Gaming", code: "ASL103", icon: Atom, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Data Structures", code: "CSL102", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30", isPopular: true },
    { name: "Application Programming", code: "CSL103", icon: Terminal, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Game Development Design Thinking", code: "CSL108", icon: Palette, color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30" },
    { name: "Environmental Studies", code: "HUL102", icon: TreePine, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30" },
    { name: "Applied Electronics", code: "ECL103", icon: Zap, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
  ],
  "CSH_2nd_3": [
    { name: "Discrete Maths & Graph Theory", code: "CSL204", icon: Network, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "Gamification for Learning", code: "CSL211", icon: Trophy, color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30", isPopular: true },
    { name: "Introduction to Object Oriented Programming", code: "CSL202", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" },
    { name: "Computer Architecture and Organization", code: "CSL212", icon: Cpu, color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30" },
    { name: "Data Structures With Applications", code: "CSL210", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30" },
    { name: "IT Workshop I", code: "CSP201", icon: Wrench, color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30" },
  ],
  "CSH_2nd_4": [
    { name: "Human Computer Interaction", code: "CSL432", icon: Hand, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30", isPopular: true },
    { name: "Design and Analysis of Algorithms", code: "CSL205", icon: GitBranch, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Operating Systems", code: "CSL207", icon: Terminal, color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30" },
    { name: "Software Engineering and Game Testing", code: "CSL213", icon: Bug, color: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30" },
    { name: "Numerical Methods and Probability Theory", code: "MAL201", icon: TrendingUp, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { name: "IT Workshop II", code: "CSP202", icon: Settings, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
  ],
  "CSD_1st_1": [
    { name: "Calculus for Data Science", code: "MAL105", icon: Calculator, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { name: "Introduction to Data and Analytics", code: "CSL109", icon: BarChart3, color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30", isPopular: true },
    { name: "Computer Programming", code: "CSL101", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" },
    { name: "Professional Ethics", code: "HUL304", icon: Scale, color: "bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/30" },
    { name: "Communication Skills", code: "HUL101", icon: MessageSquare, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "Environmental Studies", code: "HUL102", icon: TreePine, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30" },
  ],
  "CSD_1st_2": [
    { name: "Introduction to Linear Algebra", code: "MAL107", icon: Grid3x3, color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30" },
    { name: "Probability and Statistics", code: "MAL106", icon: BarChart3, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30" },
    { name: "Data Structures", code: "CSL102", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30", isPopular: true },
    { name: "Web Programming", code: "CSP101", icon: Globe, color: "bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30" },
    { name: "Applied Electronics", code: "ECL103", icon: Zap, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
    { name: "Introduction to Entrepreneurship", code: "HUL103", icon: Briefcase, color: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30" },
  ],
  "CSD_2nd_3": [
    { name: "Advanced Probability and Statistics", code: "MAL202", icon: LineChart, color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30", isPopular: true },
    { name: "Discrete Maths and Graph Theory", code: "CSL204", icon: Network, color: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30" },
    { name: "Introduction to Object Oriented Programming", code: "CSL202", icon: Code, color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" },
    { name: "Tools and Practices for Data Science I", code: "CSP205", icon: Server, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Data Structures With Applications", code: "CSL210", icon: Database, color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30" },
    { name: "Data Handling and Visualization", code: "CSL214", icon: PieChart, color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30", isPopular: true },
  ],
  "CSD_2nd_4": [
    { name: "Sensor Data Analytics", code: "CSL215", icon: Radio, color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30", isPopular: true },
    { name: "Design and Analysis of Algorithms", code: "CSL205", icon: GitBranch, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
    { name: "Operating Systems", code: "CSL207", icon: Terminal, color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30" },
    { name: "Foundations of Computing", code: "CSL216", icon: Lightbulb, color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
    { name: "Web Analytics", code: "CSL217", icon: BarChart2, color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30", isPopular: true },
    { name: "Tools and Practices for Data Science II", code: "CSP206", icon: Server, color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30" },
  ],
  "IoT_1st_1": [
    { name: "Applied Mathematics for Engineers", code: "MAL108", icon: Calculator, color: "bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/30" },
    { name: "Electronic Devices and Applications", code: "ECL103", icon: Cpu, color: "bg-orange-600/10 hover:bg-orange-600/20 border-orange-600/30" },
    { name: "Computer Programming", code: "CSL101", icon: Code, color: "bg-green-600/10 hover:bg-green-600/20 border-green-600/30", isPopular: true },
    { name: "Introduction to IoT", code: "ECL104", icon: Radio, color: "bg-cyan-600/10 hover:bg-cyan-600/20 border-cyan-600/30" },
    { name: "Electrical Systems", code: "ECL105", icon: Zap, color: "bg-yellow-600/10 hover:bg-yellow-600/20 border-yellow-600/30" },
    { name: "Environmental Studies", code: "HUL102", icon: TreePine, color: "bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-600/30" },
  ],
  "IoT_1st_2": [
    { name: "Digital System Design with HDL", code: "ECL106", icon: Binary, color: "bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-600/30" },
    { name: "Analog IC and Fabrication", code: "ECL107", icon: Cpu, color: "bg-purple-600/10 hover:bg-purple-600/20 border-purple-600/30" },
    { name: "IoT Workshop I", code: "ECL108", icon: Wrench, color: "bg-amber-600/10 hover:bg-amber-600/20 border-amber-600/30", isPopular: true },
    { name: "Data Structures", code: "CSL102", icon: Database, color: "bg-pink-600/10 hover:bg-pink-600/20 border-pink-600/30" },
    { name: "Numerical Methods and Probability Theory", code: "MAL201", icon: TrendingUp, color: "bg-sky-600/10 hover:bg-sky-600/20 border-sky-600/30" },
    { name: "Instrumentation Techniques", code: "ECL109", icon: Settings, color: "bg-teal-600/10 hover:bg-teal-600/20 border-teal-600/30" },
    { name: "Communication Skills", code: "HUL101", icon: MessageSquare, color: "bg-rose-600/10 hover:bg-rose-600/20 border-rose-600/30" },
  ],
  "IoT_2nd_3": [
    { name: "Applied Signals and Systems", code: "ECE205", icon: Radio, color: "bg-fuchsia-600/10 hover:bg-fuchsia-600/20 border-fuchsia-600/30" },
    { name: "Introduction to Object Oriented Programming", code: "CSL202", icon: Code, color: "bg-green-600/10 hover:bg-green-600/20 border-green-600/30" },
    { name: "Sensors and Transducers", code: "ECE206", icon: Radio, color: "bg-cyan-700/10 hover:bg-cyan-700/20 border-cyan-700/30" },
    { name: "IoT Workshop II", code: "ECE207", icon: Wrench, color: "bg-amber-700/10 hover:bg-amber-700/20 border-amber-700/30", isPopular: true },
    { name: "Programming Techniques for IoT", code: "CSL217", icon: Terminal, color: "bg-blue-700/10 hover:bg-blue-700/20 border-blue-700/30" },
    { name: "Electromagnetic Field Theory", code: "ECE208", icon: Network, color: "bg-violet-700/10 hover:bg-violet-700/20 border-violet-700/30" },
  ],
  "IoT_2nd_4": [
    { name: "DSP and Applications", code: "ECE307", icon: Radio, color: "bg-cyan-800/10 hover:bg-cyan-800/20 border-cyan-800/30" },
    { name: "Modelling for IoT", code: "ECE308", icon: Layers, color: "bg-indigo-800/10 hover:bg-indigo-800/20 border-indigo-800/30" },
    { name: "Microprocessor and Microcontroller", code: "ECE309", icon: Cpu, color: "bg-orange-800/10 hover:bg-orange-800/20 border-orange-800/30" },
    { name: "Operating Systems", code: "CSL207", icon: Terminal, color: "bg-cyan-800/10 hover:bg-cyan-800/20 border-cyan-800/30" },
    { name: "Communication Systems", code: "ECE310", icon: MessageSquare, color: "bg-rose-800/10 hover:bg-rose-800/20 border-rose-800/30" },
    { name: "IoT Workshop III", code: "ECE311", icon: Wrench, color: "bg-amber-800/10 hover:bg-amber-800/20 border-amber-800/30", isPopular: true },
  ],
};

// AI/ML subjects for tooltip
const aimlSubjectCodes = ["CSL110", "CSL422", "CSP203", "CSP204", "CSL214"];

const isAIMLSubject = (code: string): boolean => {
  return aimlSubjectCodes.includes(code);
};

interface FacultyContext {
  section: string | null;
  year: string | null;
  semester: string | null;
  email: string | null;
}

const FacultyAssignedSubjects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const playClickSound = useClickSound();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyContext, setFacultyContext] = useState<FacultyContext>({
    section: null,
    year: null,
    semester: null,
    email: null,
  });

  // Get context from location state or localStorage
  useEffect(() => {
    const section = location.state?.section || localStorage.getItem("userSection");
    const year = location.state?.year || localStorage.getItem("userYear");
    const semester = location.state?.semester || localStorage.getItem("userSemester");
    const email = localStorage.getItem("userEmail");

    setFacultyContext({ section, year, semester, email });

    // Build lookup key and fetch subjects
    if (section && year && semester) {
      const key = `${section}_${year}_${semester}`;
      const filteredSubjects = subjectData[key] || [];
      setSubjects(filteredSubjects);
    }
  }, [location.state]);

  // Extract faculty name from email
  const getFacultyName = () => {
    if (!facultyContext.email) return "Faculty";
    const namePart = facultyContext.email.split("@")[0];
    return namePart
      .split(".")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <button
            onClick={() => {
              playClickSound();
              navigate("/section-year", { state: { userType: "faculty" } });
            }}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Assigned Subjects</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                onClick={() => playClickSound()}
                className="flex items-center gap-2 text-destructive transition-colors hover:text-destructive/80"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => playClickSound()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    playClickSound();
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userSection");
                    localStorage.removeItem("userYear");
                    localStorage.removeItem("userSemester");
                    localStorage.removeItem("userType");
                    navigate("/home");
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Context Header */}
        <div className="mb-8 text-center space-y-2">
          {facultyContext.section && facultyContext.year && facultyContext.semester ? (
            <>
              <p className="text-lg text-muted-foreground">
                Your Assigned Courses for{" "}
                <span className="font-semibold text-foreground">{facultyContext.section}</span>,{" "}
                <span className="font-semibold text-foreground">{facultyContext.year} Year</span>,{" "}
                <span className="font-semibold text-foreground">Semester {facultyContext.semester}</span>
              </p>
              <p className="text-sm text-primary font-medium animate-fade-in">
                Welcome, {getFacultyName()}! Tap any subject to access the Subject Details Hub.
              </p>
            </>
          ) : (
            <p className="text-lg text-muted-foreground">
              No selection found. Please complete your profile.
            </p>
          )}
        </div>

        {/* Subject Grid */}
        {subjects.length > 0 ? (
          <TooltipProvider>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjects.map((subject, index) => {
                const isAIML = isAIMLSubject(subject.code);
                
                const handleSubjectClick = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  playClickSound();
                  // Exclude icon from state as React components can't be cloned for history state
                  const { icon, ...subjectData } = subject;
                  navigate(`/subject-details/${subject.code}`, { state: { subject: subjectData } });
                };
                
                const SubjectTile = (
                  <button
                    key={subject.code}
                    onClick={handleSubjectClick}
                    role="button"
                    tabIndex={0}
                    className={`relative block w-full h-full aspect-square cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in pointer-events-auto ${subject.color}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Popular Badge */}
                    {subject.isPopular && (
                      <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
                        <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <div className="rounded-full bg-background/50 p-4">
                        <subject.icon className="h-12 w-12 text-foreground" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-bold text-foreground leading-tight">
                          {subject.name}
                        </h3>
                        <p className="text-sm font-mono text-muted-foreground">{subject.code}</p>
                      </div>
                    </div>
                  </button>
                );

                // Wrap AI/ML subjects with tooltip
                if (isAIML) {
                  return (
                    <Tooltip key={subject.code}>
                      <TooltipTrigger asChild>
                        {SubjectTile}
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-fuchsia-500 text-white border-fuchsia-600">
                        <p className="font-medium">🚀 This subject is the future of data!</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return SubjectTile;
              })}
            </div>
          </TooltipProvider>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <FolderOpen className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Assigned Subjects Found</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              It looks like you don't have any subjects assigned for the selected section, year, and semester.
              Please contact the administrator if you believe this is an error.
            </p>
            <button
              onClick={() => {
                playClickSound();
                navigate("/section-year", { state: { userType: "faculty" } });
              }}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-all hover:scale-105"
            >
              Change Selection
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyAssignedSubjects;
