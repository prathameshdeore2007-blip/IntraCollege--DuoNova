import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Paperclip, FileText, Image, File, ClipboardCheck } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";

interface AttachmentFile {
  name: string;
  type: string;
  url: string;
}

interface ContentPost {
  id: string;
  topic: string;
  content: string;
  attachments: AttachmentFile[];
  createdAt: string;
  subjectCode: string;
  feature: string;
  requiresSubmission?: boolean;
}

interface StudentSubmission {
  postId: string;
  submittedAt: string;
  attachments: AttachmentFile[];
}

const featureNames: Record<string, string> = {
  pyqs: "PYQs",
  syllabus: "Syllabus",
  assignment: "Assignment",
  marksheet: "Marksheet",
  materials: "Study Material",
  attendance: "Attendance",
};

const StudentContentFeed = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const { code, feature } = useParams<{ code: string; feature: string }>();
  const location = useLocation();
  const subject = location.state?.subject;

  const subjectName = subject?.name || "Subject";
  const subjectCode = subject?.code || code || "";
  const featureTitle = featureNames[feature || ""] || feature || "Content";

  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission>>({});

  // Load posts from localStorage (same storage as faculty)
  useEffect(() => {
    const storageKey = `faculty_posts_${subjectCode}_${feature}`;
    const savedPosts = localStorage.getItem(storageKey);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    // Load student submissions
    const studentId = localStorage.getItem("studentId") || "student_default";
    const submissionsKey = `student_submissions_${studentId}`;
    const savedSubmissions = localStorage.getItem(submissionsKey);
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, [subjectCode, feature]);

  const goBack = () => {
    playClickSound();
    navigate(`/subject-details/${subjectCode}`, {
      state: { subject: { name: subjectName, code: subjectCode } }
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    return File;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubmissionStatus = (postId: string) => {
    return submissions[postId];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-foreground">{featureTitle}</h1>
            <p className="text-xs text-muted-foreground">{subjectName} - {subjectCode}</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Content Feed */}
      <main className="container mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No content available</h2>
            <p className="text-muted-foreground max-w-sm">
              Your faculty hasn't posted any {featureTitle.toLowerCase()} content yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {posts.map((post, index) => {
              const submission = getSubmissionStatus(post.id);
              return (
                <div
                  key={post.id}
                  onClick={() => {
                    playClickSound();
                    navigate(`/student/subject/${subjectCode}/${feature}/post/${post.id}`, {
                      state: { subject: { name: subjectName, code: subjectCode } }
                    });
                  }}
                  className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md animate-fade-in cursor-pointer hover:border-primary/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{post.topic}</h3>
                        {post.requiresSubmission && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
                            Assignment
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.content || "No description provided"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.attachments && post.attachments.length > 0 && (
                          <span className="flex items-center gap-1 text-primary">
                            <Paperclip className="h-3 w-3" />
                            {post.attachments.length} file{post.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {post.requiresSubmission && submission && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <ClipboardCheck className="h-3 w-3" />
                            Submitted
                          </span>
                        )}
                        {post.requiresSubmission && !submission && (
                          <span className="flex items-center gap-1 text-amber-600">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {post.attachments.slice(0, 3).map((att, idx) => {
                          const IconComponent = getFileIcon(att.type);
                          return (
                            <div key={idx} className="rounded-lg bg-primary/10 p-2">
                              <IconComponent className="h-4 w-4 text-primary" />
                            </div>
                          );
                        })}
                        {post.attachments.length > 3 && (
                          <div className="rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                            +{post.attachments.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentContentFeed;
