import React, { forwardRef, useEffect, useRef } from 'react';
import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
} from './shared';
import { TextInputBaseStyles } from './TextInput';
import { useCombinedRef } from '../hooks';
import { booleanVariantStyles } from '../variants';

const TextAreaBaseControl = createComponent('textarea', {
  displayName: 'TextArea',
  styles: {
    ...TextInputBaseStyles,
    m: 0,
    resize: 'none',
    p: 1,
    width: '100%',
    '&[disabled]': disabledControlStyles,
    ...booleanVariantStyles('invalid', {
      on: invalidControlStyles,
    }),
    '::placeholder': {
      color: 'color(shadesText alpha(0.3))',
    },
  },
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
});

type TextAreaControlProps = ExtractVisageComponentProps<
  typeof TextAreaBaseControl
>;

interface TextAreaProps extends TextAreaControlProps {
  autoResize?: boolean;
}

const recomputeTextAreaHeight = (textArea: HTMLTextAreaElement) => {
  /* eslint-disable no-param-reassign */
  textArea.style.height = 'auto';
  textArea.style.height = `${textArea.scrollHeight}px`;
  /* eslint-enable no-param-reassign */
};

export const TextArea = markAsVisageComponent(
  forwardRef(
    (
      { autoResize, defaultValue, value, ...restProps }: TextAreaProps,
      ref: React.Ref<HTMLTextAreaElement>,
    ) => {
      const textAreaRef = useRef<HTMLTextAreaElement>(null);
      const textAreaRefCallback = useCombinedRef(textAreaRef, ref);

      useEffect(() => {
        const { current: textArea } = textAreaRef;

        if (!autoResize || textArea == null) {
          return;
        }

        const listener = (e: Event) => {
          if (e.currentTarget instanceof HTMLTextAreaElement) {
            recomputeTextAreaHeight(e.currentTarget);
          }
        };

        textArea.addEventListener('input', listener);

        return () => {
          textArea.removeEventListener('input', listener);
        };
      }, [autoResize]);

      useEffect(() => {
        const { current: textArea } = textAreaRef;

        if (autoResize && textArea) {
          recomputeTextAreaHeight(textArea);
        }
      }, [autoResize, defaultValue, value]);

      return (
        <TextAreaBaseControl
          aria-invalid={restProps.invalid ?? undefined}
          ref={textAreaRefCallback}
          defaultValue={defaultValue}
          value={value}
          {...restProps}
        />
      );
    },
  ),
);

TextArea.displayName = 'TextArea';
