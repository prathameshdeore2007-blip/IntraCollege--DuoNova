import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import FacultyLogin from "./pages/FacultyLogin";
import SectionYearSelection from "./pages/SectionYearSelection";
import StudentDashboard from "./pages/StudentDashboard";
import Academic from "./pages/Academic";
import CursorAI from "./pages/CursorAI";
import SubjectDetails from "./pages/SubjectDetails";
import SubjectFeature from "./pages/SubjectFeature";
import FacultyAssignedSubjects from "./pages/FacultyAssignedSubjects";
import FacultyContentInbox from "./pages/FacultyContentInbox";
import FacultyPostDetail from "./pages/FacultyPostDetail";
import StudentContentFeed from "./pages/StudentContentFeed";
import StudentPostDetail from "./pages/StudentPostDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/section-year" element={<SectionYearSelection />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/cursor-ai" element={<CursorAI />} />
          <Route path="/subject-details/:code" element={<SubjectDetails />} />
          <Route path="/subject/:code/:feature" element={<SubjectFeature />} />
          <Route path="/subject/:code/:feature/inbox" element={<FacultyContentInbox />} />
          <Route path="/subject/:code/:feature/post/:postId" element={<FacultyPostDetail />} />
          <Route path="/student/subject/:code/:feature/feed" element={<StudentContentFeed />} />
          <Route path="/student/subject/:code/:feature/post/:postId" element={<StudentPostDetail />} />
          <Route path="/faculty/assigned-subjects" element={<FacultyAssignedSubjects />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
