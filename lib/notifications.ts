/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show a browser notification
 */
export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  }
}

/**
 * Schedule a notification for a specific time
 */
export function scheduleNotification(
  time: Date,
  title: string,
  body: string
): number | null {
  const now = new Date();
  const delay = time.getTime() - now.getTime();

  if (delay <= 0) {
    // Time has passed, show immediately
    showNotification(title, { body });
    return null;
  }

  // Schedule for future
  const timeoutId = window.setTimeout(() => {
    showNotification(title, { body });
  }, delay);

  return timeoutId;
}

/**
 * Cancel a scheduled notification
 */
export function cancelScheduledNotification(timeoutId: number) {
  window.clearTimeout(timeoutId);
}

/**
 * Check if reminders are due and show notifications
 */
export async function checkReminders(
  reminders: Array<{ id: string; time: string; text: string; completed: boolean }>
) {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const now = new Date();
  const upcomingWindow = 60 * 60 * 1000; // 1 hour

  reminders.forEach((reminder) => {
    if (reminder.completed) return;

    const reminderTime = new Date(reminder.time);
    const diff = reminderTime.getTime() - now.getTime();

    // Show notification if within 1 hour
    if (diff > 0 && diff <= upcomingWindow) {
      showNotification('FinWise Reminder', {
        body: reminder.text,
        tag: reminder.id,
        requireInteraction: true,
      });
    }
  });
}
