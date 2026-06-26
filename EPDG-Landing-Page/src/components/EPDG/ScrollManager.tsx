import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Handles scroll behaviour on navigation:
 *  - navigate("/", { state: { scrollTo: "services" } }) scrolls to that section
 *  - any other route change scrolls to the top
 */
const ScrollManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      // Wait a frame so the destination section is mounted
      requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);

  return null;
};

export default ScrollManager;
