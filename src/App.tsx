import { useEffect } from "react";
import Layout from "./components/common/Layout/Layout";
import { initializeSessionManager } from "./utils/sessionManager";

/**
 * Main App Component
 * Initializes session management and renders the main layout
 */
function App() {
  // Initialize session manager on app mount
  useEffect(() => {
    // Start session management (cleanup, activity tracking, etc.)
    initializeSessionManager();

    return () => {
      // Cleanup if necessary on unmount
    };
  }, []);

  return <Layout />;
}

export default App;
