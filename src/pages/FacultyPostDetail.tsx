import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Paperclip, Download, FileText, Image, File, Upload, X, Send, Calendar, Tag } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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

const FacultyPostDetail = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const { code, feature, postId } = useParams<{ code: string; feature: string; postId: string }>();
  const location = useLocation();
  const subject = location.state?.subject;

  const subjectName = subject?.name || "Subject";
  const subjectCode = subject?.code || code || "";
  const featureTitle = featureNames[feature || ""] || feature || "Content";

  const [post, setPost] = useState<ContentPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Edit form state
  const [editTopic, setEditTopic] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAttachments, setEditAttachments] = useState<AttachmentFile[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [editRequiresSubmission, setEditRequiresSubmission] = useState(false);

  // Load post from localStorage
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
  }, [subjectCode, feature, postId]);

  const goBack = () => {
    playClickSound();
    navigate(`/subject/${subjectCode}/${feature}/inbox`, {
      state: { subject: { name: subjectName, code: subjectCode } }
    });
  };

  const openEditModal = () => {
    if (!post) return;
    playClickSound();
    setEditTopic(post.topic);
    setEditContent(post.content);
    setEditAttachments([...post.attachments]);
    setNewAttachments([]);
    setEditRequiresSubmission(post.requiresSubmission || false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTopic("");
    setEditContent("");
    setEditAttachments([]);
    setNewAttachments([]);
    setEditRequiresSubmission(false);
  };

  const removeExistingAttachment = (index: number) => {
    setEditAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalCurrent = editAttachments.length + newAttachments.length;
    const newFiles = Array.from(files);
    const remainingSlots = MAX_ATTACHMENTS - totalCurrent;

    if (newFiles.length > remainingSlots) {
      toast({
        title: "Maximum 10 files allowed",
        description: `You can only add ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      const allowedFiles = newFiles.slice(0, remainingSlots);
      setNewAttachments(prev => [...prev, ...allowedFiles]);
    } else {
      setNewAttachments(prev => [...prev, ...newFiles]);
    }

    e.target.value = '';
  };

  const handleUpdate = () => {
    if (!post) return;
    
    if (!editTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your post",
        variant: "destructive",
      });
      return;
    }

    const totalAttachments = editAttachments.length + newAttachments.length;
    if (!editContent.trim() && totalAttachments === 0) {
      toast({
        title: "Content or attachment required",
        description: "Please add content or at least one attachment",
        variant: "destructive",
      });
      return;
    }

    playClickSound();

    // Combine existing and new attachments
    const combinedAttachments: AttachmentFile[] = [
      ...editAttachments,
      ...newAttachments.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    ];

    const updatedPost: ContentPost = {
      ...post,
      topic: editTopic.trim(),
      content: editContent.trim(),
      attachments: combinedAttachments,
      requiresSubmission: editRequiresSubmission,
    };

    // Update in localStorage
    const storageKey = `faculty_posts_${subjectCode}_${feature}`;
    const savedPosts = localStorage.getItem(storageKey);
    if (savedPosts) {
      const posts: ContentPost[] = JSON.parse(savedPosts);
      const updatedPosts = posts.map(p => p.id === postId ? updatedPost : p);
      localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
    }

    setPost(updatedPost);
    closeEditModal();

    toast({
      title: "Post updated!",
      description: "Your changes have been saved.",
    });
  };

  const handleDelete = () => {
    playClickSound();
    
    // Remove from localStorage
    const storageKey = `faculty_posts_${subjectCode}_${feature}`;
    const savedPosts = localStorage.getItem(storageKey);
    if (savedPosts) {
      const posts: ContentPost[] = JSON.parse(savedPosts);
      const updatedPosts = posts.filter(p => p.id !== postId);
      localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
    }

    toast({
      title: "Post deleted",
      description: "The post has been removed from all student feeds.",
    });

    navigate(`/subject/${subjectCode}/${feature}/inbox`, {
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

  const totalEditAttachments = editAttachments.length + newAttachments.length;

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openEditModal}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => { playClickSound(); setIsDeleteDialogOpen(true); }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
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

          {/* Attachments */}
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
        </article>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Topic / Title</label>
              <Input
                placeholder="e.g., Mid-Term Exam Topics"
                value={editTopic}
                onChange={(e) => setEditTopic(e.target.value)}
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
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Require Submission Toggle */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="edit-submission-toggle" className="text-sm font-medium cursor-pointer">
                  Require Student Submission
                </Label>
                <p className="text-xs text-muted-foreground">
                  Students will need to upload files as assignment submission
                </p>
              </div>
              <Switch
                id="edit-submission-toggle"
                checked={editRequiresSubmission}
                onCheckedChange={setEditRequiresSubmission}
              />
            </div>

            {/* Attachment Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Attachments</label>
                <span className={`text-xs font-medium ${totalEditAttachments >= MAX_ATTACHMENTS ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {totalEditAttachments}/{MAX_ATTACHMENTS}
                </span>
              </div>
              
              {/* Existing Attachments */}
              {editAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Current files:</p>
                  <div className="max-h-[100px] overflow-y-auto space-y-2 rounded-lg border bg-muted/30 p-2">
                    {editAttachments.map((file, index) => {
                      const IconComponent = getFileIcon(file.type);
                      return (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-background">
                          <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="flex-1 text-sm truncate">{file.name}</span>
                          <button
                            onClick={() => removeExistingAttachment(index)}
                            className="p-1 rounded-full hover:bg-destructive/10 text-destructive flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Attachments */}
              {newAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">New files to add:</p>
                  <div className="max-h-[100px] overflow-y-auto space-y-2 rounded-lg border bg-primary/5 p-2">
                    {newAttachments.map((file, index) => {
                      const IconComponent = getFileIcon(file.type);
                      return (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-background">
                          <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="flex-1 text-sm truncate">{file.name}</span>
                          <button
                            onClick={() => removeNewAttachment(index)}
                            className="p-1 rounded-full hover:bg-destructive/10 text-destructive flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {totalEditAttachments < MAX_ATTACHMENTS && (
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
                    <span className="text-sm text-muted-foreground">Add more files</span>
                  </div>
                </label>
              )}

              {totalEditAttachments >= MAX_ATTACHMENTS && (
                <p className="text-xs text-destructive font-medium">Maximum 10 files allowed per post.</p>
              )}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
            <Button
              onClick={handleUpdate}
              className="gap-2"
              disabled={!editTopic.trim() || (!editContent.trim() && totalEditAttachments === 0)}
            >
              <Send className="h-4 w-4" />
              Update Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will remove it from all student feeds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => playClickSound()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FacultyPostDetail;

