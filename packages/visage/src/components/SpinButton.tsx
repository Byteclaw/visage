import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import React, {
  memo,
  forwardRef,
  Ref,
  useState,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  useMemo,
  useRef,
} from 'react';
import { createComponent } from '../core';
import { getNextIndexFromCycle, createControlFocusShadow } from './shared';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { useCombinedRef, useHandlerRef } from '../hooks';

const SpinButtonBase = createComponent('div', {
  displayName: 'SpinButtonBase',
  styles: {
    display: 'inline-flex',
    flexDirection: 'column',
    ...booleanVariantStyles('disabled', {
      on: {
        opacity: 0.3,
      },
    }),
  },
  variants: [booleanVariant('disabled', true)],
});

const SpinButtonButton = createComponent('button', {
  displayName: 'SpinButtonButton',
  defaultProps: {
    tabIndex: -1,
    type: 'button',
  },
  styles: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    m: 0,
    p: 0,
  },
});

const SpinButtonOtherValue = createComponent('div', {
  displayName: 'SpinButtonOtherValue',
  defaultProps: {
    'aria-hidden': true,
  },
  styles: {
    p: 1,
    opacity: 0.7,
  },
});

const SpinButtonValue = createComponent('div', {
  displayName: 'SpinButtonValue',
  styles: {
    fontWeight: 600,
    outline: 'none',
    p: 1,
    '&:focus': {
      boxShadow: createControlFocusShadow(),
    },
  },
});

const SpinButtonExpander = createComponent('div', {
  defaultProps: {
    'aria-hidden': true,
  },
  styles: {
    overflow: 'hidden',
    height: 0,
    fontWeight: 600,
    maxHeight: 0,
    m: 0,
    py: 0,
    px: 1,
  },
});

interface SpinnerValueProps<TValue> {
  value: TValue;
}

export type SpinnerValueRenderer<TValue> = (
  props: SpinnerValueProps<TValue>,
) => ReactElement;

function defaultRenderValue({ value }: SpinnerValueProps<any>) {
  return <div style={{ textAlign: 'center', width: '100%' }}>{value}</div>;
}

interface SpinButtonProps<TValue = any> {
  baseProps?: ExtractVisageComponentProps<typeof SpinButtonBase>;
  defaultValue?: TValue;
  disabled?: boolean;
  /**
   * Label used as aria-label for assistive technology
   */
  label?: string;
  /**
   * Minimum value (if known) as aria-valuemin for assistive technology
   */
  min?: number;
  /**
   * Maximum value (if known) as aria-valuemax for assistive technology
   */
  max?: number;
  nextButtonProps?: ExtractVisageComponentProps<typeof SpinButtonButton>;
  onChange?: (value: TValue) => void;
  /**
   * Renders a current, previous and next value
   */
  renderValue?: SpinnerValueRenderer<TValue>;
  ref?: Ref<HTMLDivElement>;
  readOnly?: boolean;
  previousButtonProps?: ExtractVisageComponentProps<typeof SpinButtonButton>;
  value?: TValue;
  /**
   * Used as aria-valuetext for user friendly text for assistive technology
   *
   * It can be either provided from outside or generated by a function that receives
   * current value
   */
  valueText?: string | ((value: TValue) => string);
  values: TValue[];
}

function mouseDownHandlerCreator(
  selectedIndex: number,
  lastIndex: number,
  onChange: (index: number) => void,
  shouldIncrement: boolean = true,
): MouseEventHandler {
  return e => {
    // only main button
    if (e.button !== 0) {
      return;
    }

    onChange(
      getNextIndexFromCycle(selectedIndex, shouldIncrement ? 1 : -1, lastIndex),
    );
  };
}

type SpinButtonValueProps = ExtractVisageComponentProps<typeof SpinButtonValue>;

declare function SpinButtonComponent<TValue = any>(
  props: SpinButtonValueProps & SpinButtonProps<TValue>,
): ReactElement<any, any> | null;

export const SpinButton: typeof SpinButtonComponent = markAsVisageComponent(
  memo(
    forwardRef(
      (
        {
          baseProps,
          defaultValue,
          disabled,
          label,
          min,
          max,
          nextButtonProps,
          onChange,
          readOnly,
          renderValue = defaultRenderValue,
          previousButtonProps,
          value,
          valueText,
          values = [],
          ...restProps
        }: SpinButtonValueProps & SpinButtonProps,
        ref: Ref<HTMLDivElement>,
      ) => {
        // component is controlled only if value is not null / undefined
        const isControlled = value != null;
        const [selectedIndex, setSelectedIndex] = useState(() =>
          Math.max(values.indexOf(value ?? defaultValue), 0),
        );
        const currentIndex = isControlled
          ? Math.max(values.indexOf(value ?? defaultValue), 0)
          : selectedIndex;
        const currentValue = values[currentIndex];
        const valuesLengthRef = useRef(values.length);
        const valueTextFn = useMemo(() => {
          if (typeof valueText === 'function') {
            return valueText;
          }

          return (val: any) => {
            if (valueText) {
              return valueText;
            }

            const currentValueType = typeof val;

            if (
              currentValueType === 'number' ||
              currentValueType === 'string'
            ) {
              return val.toString();
            }

            return undefined;
          };
        }, [valueText]);
        const valueElementRef = useCombinedRef(ref);
        const handleChange = useHandlerRef((index: number) => {
          if (!isControlled) {
            setSelectedIndex(index);
          } else if (onChange) {
            onChange(values[index]);
          }
        });
        const onIncrementMouseDown = useStaticCallbackCreator(
          mouseDownHandlerCreator,
          [currentIndex, values.length - 1, handleChange, true],
        );
        const onDecrementMouseDown = useStaticCallbackCreator(
          mouseDownHandlerCreator,
          [currentIndex, values.length - 1, handleChange, false],
        );
        const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useHandlerRef(
          e => {
            switch (e.key) {
              case 'ArrowDown': {
                e.preventDefault();
                handleChange(
                  getNextIndexFromCycle(currentIndex, 1, values.length - 1),
                );
                break;
              }
              case 'ArrowUp': {
                e.preventDefault();
                handleChange(
                  getNextIndexFromCycle(currentIndex, -1, values.length - 1),
                );
                break;
              }
              case 'PageUp': {
                e.preventDefault();
                handleChange(
                  getNextIndexFromCycle(currentIndex, -5, values.length - 1),
                );
                break;
              }
              case 'PageDown': {
                e.preventDefault();
                handleChange(
                  getNextIndexFromCycle(currentIndex, 5, values.length - 1),
                );
                break;
              }
              case 'Home': {
                e.preventDefault();
                handleChange(0);
                break;
              }
              case 'End': {
                e.preventDefault();
                handleChange(values.length - 1);
                break;
              }
            }
          },
        );

        // if values length changes, reset value but only if uncontrolled
        if (values.length !== valuesLengthRef.current) {
          valuesLengthRef.current = values.length;

          if (!isControlled) {
            // reset to initial if selected index is out of bounds
            if (
              selectedIndex < 0 ||
              selectedIndex > valuesLengthRef.current - 1
            ) {
              setSelectedIndex(0);
            }
          }
        }

        return (
          <SpinButtonBase {...baseProps} disabled={disabled}>
            {/* eslint-disable react/no-array-index-key */}
            <SpinButtonExpander>
              {values.map((val, i) => (
                <div key={i}>{renderValue({ value: val })}</div>
              ))}
            </SpinButtonExpander>
            {/* eslint-enable react/no-array-index-key */}
            <SpinButtonButton
              aria-label="Previous value"
              {...previousButtonProps}
              disabled={disabled || readOnly}
              onMouseDown={onDecrementMouseDown}
            >
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </SpinButtonButton>
            <SpinButtonOtherValue>
              {renderValue({
                value:
                  values[
                    getNextIndexFromCycle(currentIndex, -1, values.length - 1)
                  ],
              })}
            </SpinButtonOtherValue>
            {/* eslint-disable jsx-a11y/interactive-supports-focus */}
            <SpinButtonValue
              {...restProps}
              aria-disabled={disabled}
              aria-label={label}
              aria-valuemin={min ?? 0}
              aria-valuemax={max ?? values.length - 1}
              aria-valuenow={currentIndex}
              aria-valuetext={valueTextFn(currentValue)}
              aria-readonly={readOnly}
              onChange={onChange}
              onKeyDown={disabled || readOnly ? undefined : onKeyDown}
              ref={valueElementRef}
              role="spinbutton"
              tabIndex={disabled ? undefined : 0}
            >
              {renderValue({ value: currentValue })}
            </SpinButtonValue>
            {/* eslint-enable jsx-a11y/interactive-supports-focus */}
            <SpinButtonOtherValue>
              {renderValue({
                value:
                  values[
                    getNextIndexFromCycle(currentIndex, 1, values.length - 1)
                  ],
              })}
            </SpinButtonOtherValue>
            <SpinButtonButton
              aria-label="Next value"
              {...nextButtonProps}
              disabled={disabled || readOnly}
              onMouseDown={onIncrementMouseDown}
            >
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </SpinButtonButton>
          </SpinButtonBase>
        );
      },
    ),
  ),
);