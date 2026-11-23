import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';

/** Champ de formulaire relié à react-hook-form, erreurs traduites. */
export function FormField<T extends FieldValues>({ control, name, ...props }: { control: Control<T>; name: Path<T> } & React.ComponentProps<typeof Input>) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
          {...props}
        />
      )}
    />
  );
}
