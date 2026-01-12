import { useNavigate } from "react-router-dom";
import logo from "@/assets/intracollege-logo.png";
import studentIcon from "@/assets/student-icon.png";
import facultyIcon from "@/assets/faculty-icon.png";
import { Button } from "@/components/ui/button";
import { useClickSound } from "@/hooks/useClickSound";

const Home = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-8">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src={logo} 
          alt="IntraCollege Logo" 
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <h2 className="mb-8 text-2xl font-medium text-foreground">Login As:</h2>

      {/* Role Selection */}
      <div className="flex gap-12 items-start justify-center">
        {/* Student Option */}
        <div 
          className="flex flex-col items-center gap-3 cursor-pointer group transition-transform hover:scale-105"
          onClick={() => {
            playClickSound();
            navigate("/student-login");
          }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <img 
              src={studentIcon} 
              alt="Student" 
              className="w-full h-full object-contain"
            />
          </div>
          <Button 
            size="lg"
            className="w-32 font-bold uppercase rounded-full"
          >
            Student
          </Button>
        </div>

        {/* Faculty Option */}
        <div 
          className="flex flex-col items-center gap-3 cursor-pointer group transition-transform hover:scale-105"
          onClick={() => {
            playClickSound();
            navigate("/faculty-login");
          }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <img 
              src={facultyIcon} 
              alt="Faculty" 
              className="w-full h-full object-contain"
            />
          </div>
          <Button 
            size="lg"
            className="w-32 font-bold uppercase rounded-full"
          >
            Faculty
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
