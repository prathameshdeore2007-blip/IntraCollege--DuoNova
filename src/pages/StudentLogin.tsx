import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, User, Lock } from "lucide-react";
import studentIcon from "@/assets/student-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useClickSound } from "@/hooks/useClickSound";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const StudentLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const playClickSound = useClickSound();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    playClickSound();
    // Store email for username extraction on dashboard
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userRole", "student");
    console.log("Login attempt:", data.email);
    
    // Simulate successful login and navigate to section/year selection
    navigate("/section-year", { state: { userType: "student" } });
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

      {/* Student Icon */}
      <div className="mb-12">
        <img 
          src={studentIcon} 
          alt="Student Login" 
          className="h-24 w-24 object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Email"
                        type="email"
                        className="h-12 rounded-full border-2 border-input pl-12 pr-4 text-base focus-visible:border-ring"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Password"
                        type="password"
                        className="h-12 rounded-full border-2 border-input pl-12 pr-4 text-base focus-visible:border-ring"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button
              type="submit"
              className="h-14 w-full rounded-full bg-[hsl(215,25%,40%)] text-base font-semibold uppercase tracking-wide text-white transition-all hover:bg-[hsl(215,25%,35%)] hover:scale-[1.02]"
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentLogin;
