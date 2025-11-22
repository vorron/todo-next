import { cn } from "@/shared/lib/utils";

interface TodoStatusBadgeProps {
  completed: boolean;
  className?: string;
}

export function TodoStatusBadge({
  completed,
  className,
}: TodoStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        completed
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800",
        className
      )}
    >
      {completed ? (
        <>
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Completed
        </>
      ) : (
        <>
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          Active
        </>
      )}
    </span>
  );
}
