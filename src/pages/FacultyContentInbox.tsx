import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PlusCircle, Paperclip, Send, Upload, X, FileText, Image, File } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

const MAX_ATTACHMENTS = 10;

const featureNames: Record<string, string> = {
  pyqs: "PYQs",
  syllabus: "Syllabus",
  assignment: "Assignment",
  marksheet: "Marksheet",
  materials: "Study Material",
  attendance: "Attendance",
};

const FacultyContentInbox = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const { code, feature } = useParams<{ code: string; feature: string }>();
  const location = useLocation();
  const subject = location.state?.subject;

  const subjectName = subject?.name || "Subject";
  const subjectCode = subject?.code || code || "";
  const featureTitle = featureNames[feature || ""] || feature || "Content";

  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newContent, setNewContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [requiresSubmission, setRequiresSubmission] = useState(false);

  // Load posts from localStorage
  useEffect(() => {
    const storageKey = `faculty_posts_${subjectCode}_${feature}`;
    const savedPosts = localStorage.getItem(storageKey);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, [subjectCode, feature]);

  const goBack = () => {
    playClickSound();
    navigate(`/subject-details/${subjectCode}`, { 
      state: { subject: { name: subjectName, code: subjectCode } } 
    });
  };

  const openModal = () => {
    playClickSound();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTopic("");
    setNewContent("");
    setAttachments([]);
    setRequiresSubmission(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const remainingSlots = MAX_ATTACHMENTS - attachments.length;

    if (newFiles.length > remainingSlots) {
      toast({
        title: "Maximum 10 files allowed",
        description: `You can only add ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      const allowedFiles = newFiles.slice(0, remainingSlots);
      setAttachments(prev => [...prev, ...allowedFiles]);
    } else {
      setAttachments(prev => [...prev, ...newFiles]);
      toast({
        title: `${newFiles.length} file${newFiles.length > 1 ? 's' : ''} attached`,
        description: `${attachments.length + newFiles.length}/${MAX_ATTACHMENTS} files selected`,
      });
    }

    // Reset input value to allow re-selecting same files
    e.target.value = '';
  };

  const handleSend = () => {
    // Validation: Need topic AND (content OR at least one attachment)
    if (!newTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your post",
        variant: "destructive",
      });
      return;
    }

    if (!newContent.trim() && attachments.length === 0) {
      toast({
        title: "Content or attachment required",
        description: "Please add content or at least one attachment",
        variant: "destructive",
      });
      return;
    }

    playClickSound();

    const newPost: ContentPost = {
      id: Date.now().toString(),
      topic: newTopic.trim(),
      content: newContent.trim(),
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
      createdAt: new Date().toISOString(),
      subjectCode,
      feature: feature || "",
      requiresSubmission,
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // Save to localStorage
    const storageKey = `faculty_posts_${subjectCode}_${feature}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedPosts));

    toast({
      title: "Post sent!",
      description: "Your content has been distributed to all enrolled students.",
    });

    closeModal();
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
            <h1 className="text-lg font-bold text-foreground">{featureTitle} Inbox</h1>
            <p className="text-xs text-muted-foreground">{subjectName} - {subjectCode}</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Content Feed */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No posts yet</h2>
            <p className="text-muted-foreground max-w-sm">
              Click the "+ New" button to create your first {featureTitle.toLowerCase()} post for this subject.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {posts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => {
                  playClickSound();
                  navigate(`/subject/${subjectCode}/${feature}/post/${post.id}`, {
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
                          {post.attachments.length} file{post.attachments.length > 1 ? 's' : ''} attached
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
            ))}
          </div>
        )}
      </main>

      {/* Floating New Button */}
      <Button
        onClick={openModal}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        size="icon"
      >
        <PlusCircle className="h-6 w-6" />
      </Button>

      {/* New Post Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              New {featureTitle} Post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Topic / Title
              </label>
              <Input
                placeholder="e.g., Mid-Term Exam Topics"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Content / Message <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Textarea
                placeholder="Enter detailed content, announcements, or instructions..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Require Submission Toggle */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="submission-toggle" className="text-sm font-medium cursor-pointer">
                  Require Student Submission
                </Label>
                <p className="text-xs text-muted-foreground">
                  Students will need to upload files as assignment submission
                </p>
              </div>
              <Switch
                id="submission-toggle"
                checked={requiresSubmission}
                onCheckedChange={setRequiresSubmission}
              />
            </div>

            {/* Attachment Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Attachments (Optional)
                </label>
                <span className={`text-xs font-medium ${attachments.length >= MAX_ATTACHMENTS ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {attachments.length}/{MAX_ATTACHMENTS}
                </span>
              </div>
              
              {/* File List */}
              {attachments.length > 0 && (
                <div className="max-h-[140px] overflow-y-auto space-y-2 rounded-lg border bg-muted/30 p-2">
                  {attachments.map((file, index) => {
                    const IconComponent = getFileIcon(file.type);
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-background">
                        <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="flex-1 text-sm truncate">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
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

              {/* Upload Button */}
              {attachments.length < MAX_ATTACHMENTS && (
                <label className="block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="*/*"
                    multiple
                  />
                  <div className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {attachments.length > 0 ? 'Add more files' : 'Upload from Device'}
                    </span>
                  </div>
                </label>
              )}

              {attachments.length >= MAX_ATTACHMENTS && (
                <p className="text-xs text-destructive font-medium">
                  Maximum 10 files allowed per post.
                </p>
              )}
              
              <p className="text-xs text-muted-foreground">
                Supports images, documents, spreadsheets, videos, and more. Select multiple files at once.
              </p>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSend}
              className="h-12 px-6 gap-2"
              disabled={!newTopic.trim() || (!newContent.trim() && attachments.length === 0)}
            >
              <Send className="h-4 w-4" />
              Send to Students
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyContentInbox;
