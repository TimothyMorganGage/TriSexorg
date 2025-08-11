import { ExternalLink } from "lucide-react";

interface ReplitBadgeProps {
  variant?: "default" | "compact" | "icon-only";
  theme?: "light" | "dark";
  className?: string;
}

export function ReplitBadge({ variant = "default", theme = "dark", className = "" }: ReplitBadgeProps) {
  const baseClasses = "inline-flex items-center space-x-2 text-sm transition-colors duration-200";
  const themeClasses = theme === "dark" 
    ? "text-gray-300 hover:text-white" 
    : "text-gray-600 hover:text-gray-900";
  
  const ReplitIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
      <path d="M7 5.5C7 4.67 7.67 4 8.5 4h15C24.33 4 25 4.67 25 5.5v21c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-21zM14 10v12l6-6-6-6z"/>
    </svg>
  );

  if (variant === "icon-only") {
    return (
      <a 
        href="https://replit.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${baseClasses} ${themeClasses} ${className}`}
        title="Made on Replit"
      >
        <ReplitIcon />
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a 
        href="https://replit.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${baseClasses} ${themeClasses} ${className}`}
      >
        <ReplitIcon />
        <span>Replit</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <a 
      href="https://replit.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${baseClasses} ${themeClasses} ${className}`}
    >
      <span>Made on</span>
      <ReplitIcon />
      <span>Replit</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}