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
import { StyleProps } from '../types';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
} from './shared';

const TextAreaBaseControl = createComponent('textarea', {
  displayName: 'TextArea',
  defaultStyles: props => ({
    borderColor: 'textInputBorder',
    borderRadius: 'controlBorderRadius',
    borderStyle: 'solid',
    borderWidth: '1px',
    backgroundColor: 'textInput',
    color: 'currentColor',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outlineColor: 'transparent',
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineOffset: '-2px',
    m: 0,
    resize: 'none',
    p: 1,
    width: '100%',
    // data-focused is used by text input on base
    '&:focus, &[data-focused="true"]': {
      outlineColor: 'darkAccent',
    },
    ...(props.disabled ? disabledControlStyles : {}),
    ...(props.invalid ? invalidControlStyles : {}),
  }),
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
});

const TextAreaBase = createComponent('div', {
  displayName: 'TextAreaBase',
  defaultStyles: {
    display: 'flex',
    position: 'relative',
  },
});

const TextAreaShadow = createComponent('div', {
  displayName: 'TextAreaShadow',
  defaultStyles: {
    backgroundColor: 'transparent',
    color: 'transparent',
    opacity: 0,
    minHeight: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    visibility: 'hidden',
    width: '100%',
    zIndex: -100,
  },
});

interface TextAreaControlProps {
  autoResize?: boolean;
  baseProps?: ExtractVisageComponentProps<typeof TextAreaBase>;
}

export const TextArea: VisageComponent<
  ExtractVisageComponentProps<typeof TextAreaBaseControl> &
    TextAreaControlProps,
  StyleProps
> = forwardRef(
  (
    {
      autoResize,
      baseProps,
      defaultValue,
      onChange,
      value,
      ...restProps
    }: TextAreaControlProps & JSX.IntrinsicElements['textarea'],
    ref: any,
  ) => {
    const outerValueRef = useRef(value || defaultValue);
    const heightRef = useRef<number | undefined>(undefined);
    const [innerValue, setValue] = useState(value || defaultValue);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const shadowRef = useRef<HTMLDivElement | null>(null);
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
      if (autoResize && shadowRef.current && textAreaRef.current) {
        shadowRef.current.style.lineHeight =
          textAreaRef.current.style.lineHeight;
        shadowRef.current.style.fontSize = textAreaRef.current.style.fontSize;
        const currentHeight = shadowRef.current.clientHeight;

        if (heightRef.current !== currentHeight) {
          heightRef.current = currentHeight + 20;
          setHeight(currentHeight + 20);
        }
      }
    });

    return (
      <TextAreaBase {...baseProps}>
        {autoResize ? (
          <TextAreaShadow
            aria-hidden
            dangerouslySetInnerHTML={{
              __html: `${(innerValue || '')
                .toString()
                .replace(/(?:\r\n|\r|\n)/g, '<br />')}<br />`,
            }}
            ref={shadowRef}
            role="presentation"
          />
        ) : null}
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
          styles={{ ...((restProps as any).styles || {}), height }}
        />
      </TextAreaBase>
    );
  },
) as any;
