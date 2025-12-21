import { cn } from '@/shared/lib/utils';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, onClick, onChange, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className={cn(
          'h-5 w-5 rounded-sm border-[1.5px] transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
          props.checked ? 'bg-blue-600 border-blue-600' : 'border-slate-400 hover:border-blue-500',
          className,
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onChange={(e) => {
          e.stopPropagation();
          onChange?.(e);
        }}
        {...props}
      />
      {props['aria-label'] && <span className="sr-only">{props['aria-label']}</span>}
    </label>
  );
}
