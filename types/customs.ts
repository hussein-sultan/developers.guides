import { ReactElement, ReactNode, SubmitEventHandler } from "react"
import {
  DefaultValues,
  FieldValues,
  Resolver,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form"
import { ObjectSchema } from "yup"

export type CustomAlertProps = {
  icon?: ReactNode;
  duration?: number
  trigger?: ReactElement;
  message?: string | ReactNode; // immediately show the alert when the message passes or changes
  variant?: 'filled' | 'outlined' | 'standard';
  severity: 'success' | 'error' | 'warning' | 'info';
}

export type CustomDialogProps = {
  title?: string,
  actions?: ReactNode,
  open?: boolean,
  setOpen?: (open: boolean) => void,
  children: ReactNode,
  trigger: ReactElement,
}

export type CustomFormProps<T extends FieldValues> = {
  defaultValues?: DefaultValues<T>
  schema?: ObjectSchema<T>
  resolver?: Resolver<T>
  config?: Omit<UseFormProps<T>, "defaultValues" | "resolver">
  formId?: string
  onSubmit: SubmitHandler<T>
  children: ReactNode
}

export type CustomFormProviderProps<T extends FieldValues> = {
  methods: UseFormReturn<T>
  onSubmit: SubmitEventHandler<HTMLFormElement>
  formId?: string
  children: ReactNode
}