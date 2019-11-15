import { useUniqueId } from '@byteclaw/use-unique-id';
import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, {
  ComponentProps,
  ComponentType,
  ReactElement,
  useMemo,
} from 'react';
import { Box } from './Box';
import { Label } from './Label';
import { InlineError } from './InlineError';
import { TextInput } from './TextInput';

interface FormFieldProps {
  error?: string | boolean;
  hiddenLabel?: boolean;
  id?: string;
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
  id: outerId,
  label,
  name,
  required,
  ...restProps
}: FormFieldProps & { control?: any }) {
  const idTemplate = useUniqueId();
  const id = useMemo(() => {
    return outerId || `field-${idTemplate}-${name || ''}`;
  }, [outerId, idTemplate]);
  return (
    <Box styles={{ my: 1 }}>
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
