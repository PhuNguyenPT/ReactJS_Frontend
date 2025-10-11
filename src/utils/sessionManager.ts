/**
 * Session Manager
 * Handles automatic cleanup of guest studentId based on inactivity
 * and authentication token expiration
 */

const STORAGE_KEYS = {
  STUDENT_ID: "studentId",
  BEARER_TOKEN: "accessToken",
  LAST_ACTIVITY: "lastActivity",
  IS_GUEST: "isGuest",
} as const;

// Configuration
const GUEST_INACTIVITY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
// Adjust this value based on your needs:
// - 30 minutes: 30 * 60 * 1000
// - 1 hour: 60 * 60 * 1000
// - 7 days: 7 * 24 * 60 * 60 * 1000

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.BEARER_TOKEN) !== null;
}

/**
 * Update the last activity timestamp
 */
export function updateLastActivity(): void {
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
}

/**
 * Get the last activity timestamp
 */
function getLastActivity(): number | null {
  const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  return lastActivity ? parseInt(lastActivity, 10) : null;
}

/**
 * Check if guest session has expired due to inactivity
 */
function isGuestSessionExpired(): boolean {
  const lastActivity = getLastActivity();

  if (!lastActivity) {
    return true; // No activity recorded, consider expired
  }

  const now = Date.now();
  const timeSinceLastActivity = now - lastActivity;

  return timeSinceLastActivity > GUEST_INACTIVITY_DURATION;
}

/**
 * Mark the current session as guest
 */
export function markAsGuest(): void {
  localStorage.setItem(STORAGE_KEYS.IS_GUEST, "true");
  updateLastActivity();
}

/**
 * Check if current session is guest
 */
function isGuestSession(): boolean {
  return localStorage.getItem(STORAGE_KEYS.IS_GUEST) === "true";
}

/**
 * Clear guest-specific data
 */
function clearGuestData(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
  console.log("[SessionManager] Guest data cleared");
}

/**
 * Clear all session data (for authenticated users who log out)
 */
export function clearAllSessionData(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
  localStorage.removeItem(STORAGE_KEYS.BEARER_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
  console.log("[SessionManager] All session data cleared");
}

/**
 * Main cleanup function - checks and cleans up expired sessions
 * Should be called on app initialization and periodically
 */
export function cleanupExpiredSessions(): void {
  const hasStudentId = localStorage.getItem(STORAGE_KEYS.STUDENT_ID) !== null;

  if (!hasStudentId) {
    return; // Nothing to clean up
  }

  const authenticated = isAuthenticated();

  if (authenticated) {
    // User is authenticated - clear guest flag if it exists
    localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    console.log("[SessionManager] Authenticated user detected");
  } else if (isGuestSession()) {
    // Guest user - check for inactivity
    if (isGuestSessionExpired()) {
      console.log("[SessionManager] Guest session expired due to inactivity");
      clearGuestData();
    } else {
      console.log("[SessionManager] Guest session still active");
    }
  } else {
    // StudentId exists but no bearer token and not marked as guest
    // This could be a logged-out user - clean up
    console.log("[SessionManager] Orphaned studentId detected, cleaning up");
    clearGuestData();
  }
}

/**
 * Initialize session manager
 * Call this when your app starts
 */
export function initializeSessionManager(): void {
  // Clean up expired sessions on initialization
  cleanupExpiredSessions();

  // Set up periodic cleanup check (every 5 minutes)
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  setInterval(() => {
    cleanupExpiredSessions();
  }, CLEANUP_INTERVAL);

  // Update activity on user interactions
  setupActivityTracking();

  console.log("[SessionManager] Initialized");
}

/**
 * Set up activity tracking for guest users
 */
function setupActivityTracking(): void {
  const events = ["mousedown", "keydown", "scroll", "touchstart"];

  const handleActivity = (): void => {
    // Only track activity for guest users
    if (!isAuthenticated() && isGuestSession()) {
      updateLastActivity();
    }
  };

  // Throttle activity updates to once per minute
  let lastUpdate = 0;
  const THROTTLE_DURATION = 60 * 1000; // 1 minute

  const throttledHandler = (): void => {
    const now = Date.now();
    if (now - lastUpdate > THROTTLE_DURATION) {
      handleActivity();
      lastUpdate = now;
    }
  };

  events.forEach((event) => {
    window.addEventListener(event, throttledHandler, { passive: true });
  });
}

/**
 * Save studentId with proper session tracking
 */
export function saveStudentId(studentId: string, isGuest: boolean): void {
  localStorage.setItem(STORAGE_KEYS.STUDENT_ID, studentId);

  if (isGuest) {
    markAsGuest();
  } else {
    // Authenticated user - clear guest markers
    localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  }

  console.log(
    `[SessionManager] StudentId saved (${isGuest ? "guest" : "authenticated"})`,
  );
}
