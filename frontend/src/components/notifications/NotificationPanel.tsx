import { useState, useEffect } from "react";
import { X, Bell, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
}

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationStyles = {
  success: "border-secondary/50 bg-secondary/10",
  error: "border-destructive/50 bg-destructive/10",
  warning: "border-yellow-500/50 bg-yellow-500/10",
  info: "border-primary/50 bg-primary/10",
};

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications - in a real app, these would come from an API or context
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "System Secure",
        message: "All systems operating normally. No threats detected in the last hour.",
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: "2",
        type: "info",
        title: "New Data Available",
        message: "Recent log analysis completed. 15 new events processed.",
        timestamp: new Date(Date.now() - 15 * 60000),
      },
      {
        id: "3",
        type: "warning",
        title: "High Traffic Detected",
        message: "Unusual traffic pattern detected from IP 192.168.1.100. Review recommended.",
        timestamp: new Date(Date.now() - 30 * 60000),
      },
    ];
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.length);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 z-50 animate-scale-up">
            <div className="cyber-card p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold text-primary bg-primary/10 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {notifications.map((notification) => {
                      const Icon = notificationIcons[notification.type];
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 hover:bg-muted/50 transition-colors relative group",
                            notificationStyles[notification.type]
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <Icon
                                className={cn(
                                  "w-5 h-5",
                                  notification.type === "success" && "text-secondary",
                                  notification.type === "error" && "text-destructive",
                                  notification.type === "warning" && "text-yellow-500",
                                  notification.type === "info" && "text-primary"
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground text-sm mb-1">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {notification.message}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeNotification(notification.id)}
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground/70 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

