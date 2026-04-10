'use client'

import {
  FieldValues,
  Resolver,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomFormProps } from '@/types/customs'
import { CustomFormProvider } from '@/providers/CustomFormProvider'

export function CustomForm<T extends FieldValues>({
  children,
  defaultValues,
  schema,
  resolver,
  config,
  formId,
  onSubmit
}: CustomFormProps<T>) {

  const formResolver = resolver ?? (schema ? (yupResolver(schema) as Resolver<T>) : undefined)

  const methods = useForm<T>({
    ...config,
    defaultValues,
    resolver: formResolver,
    mode: 'onBlur'
  })

  return (
    <CustomFormProvider<T>
      methods={methods}
      formId={formId}
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      {children}
    </CustomFormProvider>
  )
}