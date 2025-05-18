
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Set initial state based on window width
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Add resize listener for responsive updates
    window.addEventListener("resize", checkMobile)
    
    // Set initial value
    checkMobile()
    
    // Also use media query for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => checkMobile()
    
    // For modern browsers
    mql.addEventListener("change", onChange)
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
