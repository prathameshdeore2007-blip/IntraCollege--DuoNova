import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Paperclip, Download, FileText, Image, File, Upload, X, Send, Calendar, Tag, ClipboardCheck, AlertCircle } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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

const MAX_SUBMISSION_FILES = 10;

const featureNames: Record<string, string> = {
  pyqs: "PYQs",
  syllabus: "Syllabus",
  assignment: "Assignment",
  marksheet: "Marksheet",
  materials: "Study Material",
  attendance: "Attendance",
};

const StudentPostDetail = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const { code, feature, postId } = useParams<{ code: string; feature: string; postId: string }>();
  const location = useLocation();
  const subject = location.state?.subject;

  const subjectName = subject?.name || "Subject";
  const subjectCode = subject?.code || code || "";
  const featureTitle = featureNames[feature || ""] || feature || "Content";

  const [post, setPost] = useState<ContentPost | null>(null);
  const [submission, setSubmission] = useState<StudentSubmission | null>(null);
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);

  const studentId = localStorage.getItem("studentId") || "student_default";

  // Load post and submission data
  useEffect(() => {
    const storageKey = `faculty_posts_${subjectCode}_${feature}`;
    const savedPosts = localStorage.getItem(storageKey);
    if (savedPosts) {
      const posts: ContentPost[] = JSON.parse(savedPosts);
      const foundPost = posts.find(p => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      }
    }

    // Load student submission for this post
    const submissionsKey = `student_submissions_${studentId}`;
    const savedSubmissions = localStorage.getItem(submissionsKey);
    if (savedSubmissions) {
      const allSubmissions: Record<string, StudentSubmission> = JSON.parse(savedSubmissions);
      if (allSubmissions[postId || ""]) {
        setSubmission(allSubmissions[postId || ""]);
      }
    }
  }, [subjectCode, feature, postId, studentId]);

  const goBack = () => {
    playClickSound();
    navigate(`/student/subject/${subjectCode}/${feature}/feed`, {
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
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const removeSubmissionFile = (index: number) => {
    setSubmissionFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const remainingSlots = MAX_SUBMISSION_FILES - submissionFiles.length;

    if (newFiles.length > remainingSlots) {
      toast({
        title: "Maximum 10 files allowed",
        description: `You can only add ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      const allowedFiles = newFiles.slice(0, remainingSlots);
      setSubmissionFiles(prev => [...prev, ...allowedFiles]);
    } else {
      setSubmissionFiles(prev => [...prev, ...newFiles]);
    }

    e.target.value = '';
  };

  const handleSubmitAssignment = () => {
    if (submissionFiles.length === 0) {
      toast({
        title: "No files attached",
        description: "Please attach at least one file to submit.",
        variant: "destructive",
      });
      return;
    }

    playClickSound();

    const newSubmission: StudentSubmission = {
      postId: postId || "",
      submittedAt: new Date().toISOString(),
      attachments: submissionFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    };

    // Save to localStorage
    const submissionsKey = `student_submissions_${studentId}`;
    const savedSubmissions = localStorage.getItem(submissionsKey);
    const allSubmissions: Record<string, StudentSubmission> = savedSubmissions 
      ? JSON.parse(savedSubmissions) 
      : {};
    
    allSubmissions[postId || ""] = newSubmission;
    localStorage.setItem(submissionsKey, JSON.stringify(allSubmissions));

    setSubmission(newSubmission);
    setSubmissionFiles([]);

    toast({
      title: "Assignment Submitted!",
      description: "Your submission has been recorded successfully.",
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Post not found</h2>
          <Button onClick={goBack} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

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
            <p className="text-xs text-muted-foreground">{subjectName}</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Post Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <article className="space-y-6">
          {/* Topic */}
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold text-foreground flex-1">{post.topic}</h1>
            {post.requiresSubmission && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
                Assignment
              </span>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{featureTitle}</span>
            </div>
          </div>

          {/* Content */}
          {post.content && (
            <div className="rounded-xl border bg-card p-6">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
          )}

          {/* Faculty Attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Attachments ({post.attachments.length})
              </h2>
              <div className="space-y-2">
                {post.attachments.map((att, index) => {
                  const IconComponent = getFileIcon(att.type);
                  return (
                    <a
                      key={index}
                      href={att.url}
                      download={att.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="rounded-lg bg-primary/10 p-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{att.name}</p>
                        <p className="text-xs text-muted-foreground">{att.type || "File"}</p>
                      </div>
                      <Download className="h-5 w-5 text-muted-foreground" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student Submission Section - Only show if requiresSubmission is true */}
          {post.requiresSubmission && (
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-amber-600" />
                Your Submission
              </h2>

              {submission ? (
                // Already submitted
                <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">Submitted on {formatDate(submission.submittedAt)}</span>
                  </div>
                  <div className="space-y-2">
                    {submission.attachments.map((att, index) => {
                      const IconComponent = getFileIcon(att.type);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background">
                          <IconComponent className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm truncate flex-1">{att.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Submission form
                <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Submission Required</span>
                  </div>

                  {/* Attached Files List */}
                  {submissionFiles.length > 0 && (
                    <div className="max-h-[160px] overflow-y-auto space-y-2 rounded-lg border bg-background p-2">
                      {submissionFiles.map((file, index) => {
                        const IconComponent = getFileIcon(file.type);
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                            <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="flex-1 text-sm truncate">{file.name}</span>
                            <button
                              onClick={() => removeSubmissionFile(index)}
                              className="p-1 rounded-full hover:bg-destructive/10 text-destructive flex-shrink-0"
                              aria-label={`Remove ${file.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Counter */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Files attached</span>
                    <span className={`font-medium ${submissionFiles.length >= MAX_SUBMISSION_FILES ? 'text-destructive' : 'text-foreground'}`}>
                      {submissionFiles.length}/{MAX_SUBMISSION_FILES}
                    </span>
                  </div>

                  {/* Upload Button */}
                  {submissionFiles.length < MAX_SUBMISSION_FILES && (
                    <label className="block">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="*/*"
                        multiple
                      />
                      <div className="flex items-center justify-center gap-2 h-14 rounded-lg border-2 border-dashed border-amber-500/40 hover:border-amber-500/70 hover:bg-amber-500/10 cursor-pointer transition-colors">
                        <Upload className="h-5 w-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                          {submissionFiles.length > 0 ? 'Add more files' : 'Upload Assignment Files'}
                        </span>
                      </div>
                    </label>
                  )}

                  {submissionFiles.length >= MAX_SUBMISSION_FILES && (
                    <p className="text-xs text-destructive font-medium">
                      Maximum 10 files allowed per submission.
                    </p>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitAssignment}
                    className="w-full h-12 gap-2"
                    disabled={submissionFiles.length === 0}
                  >
                    <Send className="h-4 w-4" />
                    Submit Assignment
                  </Button>
                </div>
              )}
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default StudentPostDetail;
