import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/duonova.png";
import { useClickSound } from "@/hooks/useClickSound";

const Index = () => {
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const playClickSound = useClickSound();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleVideoEnd = () => {
        setShowButton(true);
      };

      const handleVideoError = () => {
        setShowButton(true);
      };

      const tryAutoplay = () => {
        // Ensure muted to satisfy autoplay policies
        video.muted = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch(() => {/* Autoplay blocked; fallback timer will show button. */});
        }
      };

      // Fallback: if nothing happened within 6s, show button
      const fallbackTimer = window.setTimeout(() => setShowButton(true), 6000);

      video.addEventListener("ended", handleVideoEnd);
      video.addEventListener("error", handleVideoError);
      video.addEventListener("stalled", handleVideoError);
      video.addEventListener("canplay", tryAutoplay, { once: true });

      // Kick off an immediate attempt as well
      tryAutoplay();

      return () => {
        window.clearTimeout(fallbackTimer);
        video.removeEventListener("ended", handleVideoEnd);
        video.removeEventListener("error", handleVideoError);
        video.removeEventListener("stalled", handleVideoError);
        video.removeEventListener("canplay", tryAutoplay);
      };
    }
  }, []);

  const handleGetStarted = () => {
    playClickSound();
    navigate("/home");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 py-8 gap-6 overflow-hidden">
      {/* Logo at top center */}
      <div className="flex-shrink-0">
        <img 
          src={logo} 
          alt="DuoNova Logo" 
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* Video container */}
      <div className="relative w-full max-w-2xl flex-shrink-0">
        <video
          ref={videoRef}
          className="w-full rounded-xl shadow-2xl max-h-[60vh] object-contain"
          autoPlay
          playsInline
          muted
          preload="auto"
        >
          <source src="/videos/logo_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>


        {/* Get Started Button - appears after video ends */}
        {showButton && (
          <div className="absolute bottom-3 right-3 animate-fade-in">
            <Button
              onClick={handleGetStarted}
              size="default"
              className="group shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
