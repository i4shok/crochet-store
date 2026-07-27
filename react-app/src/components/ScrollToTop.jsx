import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position to the top whenever the route changes.
// Without this, navigating to a new page keeps whatever scroll
// position the previous page was at (e.g. clicking "Shop All" from
// partway down the home page would land you in the middle of the
// shop page instead of at the top).
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
