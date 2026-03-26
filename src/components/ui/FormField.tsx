import { Input } from './input';
import { Label } from './label';

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export function FormField({ label, error, id, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
