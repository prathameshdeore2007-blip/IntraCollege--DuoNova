import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, BookOpen, Bell, Users, CreditCard, Clock, Calendar, LogOut, MessageSquare, Info, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import intracollegeLogo from "@/assets/intracollege-watermark.png";
import { useClickSound } from "@/hooks/useClickSound";

const menuItems = [
  { title: "Subjects", icon: BookOpen, path: "/academic" },
  { title: "Ask AI", icon: Sparkles, path: "/cursor-ai" },
  { title: "Notices", icon: Bell, path: "/notices" },
  { title: "Clubs", icon: Users, path: "/clubs" },
  { title: "Payments", icon: CreditCard, path: "/payments" },
  { title: "Logout", icon: LogOut, path: "/" },
  { title: "Feedback", icon: MessageSquare, path: "/feedback" },
  { title: "About Developer", icon: Info, path: "/about" },
];

const dashboardTiles = [
  { title: "Academic", icon: BookOpen, path: "/academic", color: "bg-purple-200 hover:bg-purple-300", textColor: "text-purple-900" },
  { title: "Notices", icon: Bell, path: "/notices", color: "bg-yellow-200 hover:bg-yellow-300", textColor: "text-yellow-900" },
  { title: "Clubs", icon: Users, path: "/clubs", color: "bg-orange-200 hover:bg-orange-300", textColor: "text-orange-900" },
  { title: "Payments", icon: CreditCard, path: "/payments", color: "bg-blue-200 hover:bg-blue-300", textColor: "text-blue-900" },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("Student");
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Extract username from email (stored during login)
    const email = localStorage.getItem("userEmail") || "student@example.com";
    const extractedUsername = email.split("@")[0];
    setUsername(extractedUsername.charAt(0).toUpperCase() + extractedUsername.slice(1));

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle clicks outside the logout dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLogoutDropdown(false);
      }
    };

    if (showLogoutDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogoutDropdown]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const handleLogoutClick = () => {
    playClickSound();
    // Hide dropdown first, then show dialog with slight delay to ensure clean transition
    setShowLogoutDropdown(false);
    setTimeout(() => {
      setShowLogoutDialog(true);
    }, 50);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  const handleNavigation = (path: string, title: string) => {
    playClickSound();
    if (title === "Logout") {
      setShowLogoutDialog(true);
    } else {
      navigate(path);
    }
  };

  const toggleLogoutDropdown = () => {
    playClickSound();
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar Navigation */}
        <Sidebar className="border-r border-border">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => handleNavigation(item.path, item.title)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-base">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 relative">
          {/* Background Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url(${intracollegeLogo})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "50%",
            }}
          />

          {/* Header Bar */}
          <header className="sticky top-0 z-10 bg-slate-600 text-white px-6 py-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white hover:bg-slate-700">
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(currentTime)}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(currentTime)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDay(currentTime)}</span>
                </div>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleLogoutDropdown}
                  className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-all cursor-pointer"
                >
                  <span>Hello {username}!</span>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-300 ${
                      showLogoutDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {showLogoutDropdown && (
                  <div className="absolute top-full right-0 mt-2 z-50 animate-fade-in">
                    <Button
                      onClick={handleLogoutClick}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg border-2 border-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="relative z-10 px-6 py-8">
            {/* AI Widget */}
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">IntraCollege AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">
                      Welcome to your personalized dashboard! You're in{" "}
                      <span className="font-medium text-foreground">
                        {localStorage.getItem("userSection") || "your section"}
                      </span>
                      , Year{" "}
                      <span className="font-medium text-foreground">
                        {localStorage.getItem("userYear") || "N/A"}
                      </span>
                      . Select a tile below to get started.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Tiles */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dashboardTiles.map((tile) => (
                  <button
                    key={tile.title}
                    onClick={() => {
                      playClickSound();
                      navigate(tile.path);
                    }}
                    className={`${tile.color} rounded-2xl p-8 border-4 border-dashed border-opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                    style={{ minHeight: "180px" }}
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <tile.icon className={`h-16 w-16 ${tile.textColor} group-hover:scale-110 transition-transform`} />
                      <span className={`text-2xl font-bold ${tile.textColor}`}>
                        {tile.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Universal Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="z-[100] animate-scale-in bg-background">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <AlertDialogTitle className="text-xl">Logout Confirmation</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base mt-4">
              Do you really want to logout? You'll need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              onClick={playClickSound}
              className="bg-background"
            >
              No, Stay Here
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                playClickSound();
                confirmLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default StudentDashboard;
