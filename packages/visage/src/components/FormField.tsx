import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ComponentProps, ComponentType, ReactElement } from 'react';
import { Box } from './Box';
import { Label } from './Label';
import { InlineError } from './InlineError';
import { TextInput } from './TextInput';

interface FormFieldProps {
  error?: string | boolean;
  hiddenLabel?: boolean;
  id: string;
  label?: string;
  name?: string;
  required?: boolean;
}

interface FormFieldComponent {
  <TControl extends ComponentType<any>>(
    p: { control: TControl } & ComponentProps<TControl> & FormFieldProps,
  ): ReactElement;
  <TControl extends VisageComponent<any, any>>(
    p: { control: TControl } & ExtractVisageComponentProps<TControl> &
      FormFieldProps,
  ): ReactElement;
  <TControl extends keyof JSX.IntrinsicElements>(
    p: {
      control: TControl;
    } & JSX.IntrinsicElements[TControl] &
      FormFieldProps,
  ): ReactElement;
  (p: { control?: undefined } & FormFieldProps): ReactElement;
}

export const FormField: FormFieldComponent = function FormField({
  control: Control = TextInput,
  error,
  hiddenLabel,
  id,
  label,
  name,
  required,
  ...restProps
}: FormFieldProps & { control?: any }) {
  return (
    <Box>
      {label ? (
        <Label htmlFor={id} required={required} hidden={hiddenLabel}>
          {label}
        </Label>
      ) : null}
      <Control
        {...restProps}
        id={id}
        invalid={!!error}
        name={name}
        required={required}
      />
      {typeof error === 'string' && error ? (
        <InlineError>{error}</InlineError>
      ) : null}
    </Box>
  );
};
