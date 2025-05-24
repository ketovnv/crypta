import { animation } from "@stores/animation";
import { animationEngine } from "@animations/animationEngine";

/**
 * @deprecated Use animationEngine.getPageWithNavBarValues() directly instead
 */
export const PageWithNavBarMoving = () => {
  // Get animation values from the centralized animation engine
  const animationValues = animationEngine.getPageWithNavBarValues();
  
  // Keep this for backward compatibility with existing code
  animation.setSpringAnimation({
    PageWithNavBarMoving: animationValues,
  });

  return null;
};
