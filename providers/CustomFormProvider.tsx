import { CustomFormProviderProps } from "@/types/customs";
import { FieldValues, FormProvider } from "react-hook-form";

export function CustomFormProvider<T extends FieldValues>({
  methods, formId, onSubmit, children
}: CustomFormProviderProps<T>) {
  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  )
}