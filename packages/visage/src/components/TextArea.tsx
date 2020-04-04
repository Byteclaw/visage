import React, {
  ChangeEventHandler,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
} from './shared';
import { TextInputBaseStyles } from './TextInput';

const TextAreaBaseControl = createComponent('textarea', {
  displayName: 'TextArea',
  styles: props => ({
    ...TextInputBaseStyles,
    m: 0,
    resize: 'none',
    p: 1,
    width: '100%',
    ...(props.disabled ? disabledControlStyles : {}),
    ...(props.invalid ? invalidControlStyles : {}),
    '::placeholder': {
      color: 'currentColor',
      opacity: 0.3,
    },
  }),
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
});

const TextAreaBase = createComponent('div', {
  displayName: 'TextAreaBase',
  styles: {
    display: 'flex',
    position: 'relative',
  },
});

interface TextAreaProps {
  autoResize?: boolean;
  baseProps?: ExtractVisageComponentProps<typeof TextAreaBase>;
}

export const TextArea: VisageComponent<ExtractVisageComponentProps<
  typeof TextAreaBaseControl
> &
  TextAreaProps> = forwardRef(
  (
    {
      autoResize,
      baseProps,
      defaultValue,
      onChange,
      value,
      ...restProps
    }: TextAreaProps & JSX.IntrinsicElements['textarea'],
    ref: any,
  ) => {
    const outerValueRef = useRef(value || defaultValue);
    const heightRef = useRef<number | undefined>(undefined);
    const [innerValue, setValue] = useState(value || defaultValue);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const innerOnChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      e => {
        if (onChange) {
          onChange(e);
        }

        setValue(e.currentTarget.value);
      },
      [onChange],
    );

    if (outerValueRef.current !== value) {
      outerValueRef.current = value;
      setValue(value);
    }

    useLayoutEffect(() => {
      if (autoResize && textAreaRef.current) {
        const {
          borderBottomWidth,
          borderTopWidth,
          lineHeight,
        } = getComputedStyle(textAreaRef.current);
        const currentHeight = textAreaRef.current.scrollHeight;
        const lineHeightNum = parseInt(lineHeight, 10);
        const borderBottomWidthNum = parseInt(borderBottomWidth, 10);
        const borderTopWidthNum = parseInt(borderTopWidth, 10);

        if (heightRef.current !== currentHeight) {
          // keep current height in ref but subtract borders
          // because borders are added by browser to height
          heightRef.current =
            currentHeight +
            lineHeightNum -
            borderBottomWidthNum -
            borderTopWidthNum;
          textAreaRef.current.style.height = `${currentHeight +
            lineHeightNum}px`;
        }
      }
    });

    return (
      <TextAreaBase {...baseProps}>
        <TextAreaBaseControl
          ref={r => {
            textAreaRef.current = r;

            if (ref) {
              if (typeof ref === 'function') {
                ref(r);
              } else {
                // eslint-disable-next-line
                ref.current = r;
              }
            }
          }}
          {...restProps}
          onChange={innerOnChange}
          value={innerValue}
        />
      </TextAreaBase>
    );
  },
) as any;
