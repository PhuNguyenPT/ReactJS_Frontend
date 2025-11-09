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
const GUEST_INACTIVITY_DURATION = Number(
  import.meta.env.VITE_GUEST_INACTIVITY_DURATION,
); // 24 hours in milliseconds

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
}

/**
 * Clear all session data (for authenticated users who log out)
 */
export function clearAllSessionData(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
  localStorage.removeItem(STORAGE_KEYS.BEARER_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
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
  } else if (isGuestSession()) {
    // Guest user - check for inactivity
    if (isGuestSessionExpired()) {
      clearGuestData();
    }
  } else {
    // StudentId exists but no bearer token and not marked as guest
    // This could be a logged-out user - clean up
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
  const CLEANUP_INTERVAL = Number(import.meta.env.VITE_CLEANUP_INTERVAL);
  setInterval(() => {
    cleanupExpiredSessions();
  }, CLEANUP_INTERVAL);

  // Update activity on user interactions
  setupActivityTracking();
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
  const THROTTLE_DURATION = Number(import.meta.env.VITE_THROTTLE_DURATION); // 1 minute

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
}
