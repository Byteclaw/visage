import {
  ExtractVisageComponentProps,
  VisageComponent,
  StyleProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import React, {
  forwardRef,
  ReactNode,
  Ref,
  useState,
  FocusEventHandler,
  memo,
} from 'react';
import { createComponent } from '../core';
import {
  disabledControlStyles,
  visuallyHiddenStyles,
  createControlFocusShadow,
  visuallyHiddenBooleanVariant,
} from './shared';
import { wrapToggleOnChangeHandler } from './events';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { useHandlerRef, useComposedCallbackCreator } from '../hooks';

const ToggleContainer = createComponent('div', {
  displayName: 'ToggleContainer',
  styles: {
    overflow: 'hidden',
    borderRadius: 999,
    width: 'auto',
    display: 'inline-flex',
    height: '1.5em',
    minWidth: '2.75em',
    fontSize: '16px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    outline: 'none',
    userSelect: 'none',
    my: 0.5,
    backgroundColor:
      'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-out',
    '& > div::after': {
      content: '""',
      verticalAlign: 'middle',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.25em',
      height: '1.25em',
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: 'white',
      transitionProperty: 'transform, color',
      transitionDuration: '0.1s',
      transitionTimingFunction: 'ease-out',
    },
    '& > div::before': {
      content: 'attr(data-label-content)',
      position: 'absolute',
      mx: 1,
      fontSize: '0.75em',
      textAlign: 'center',
      color: 'accentText',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      whiteSpace: 'nowrap',
      left: '50%',
    },
    ...booleanVariantStyles('checked', {
      on: {
        backgroundColor: 'primary',
        '& > div': {
          transform: 'translateX(100%) translateX(-1.25em)',
        },
        '& > div::before': {
          left: '-50%',
        },
      },
    }),
    ...booleanVariantStyles('focused', {
      on: {
        boxShadow: createControlFocusShadow(),
        ...booleanVariantStyles('invalid', {
          on: {
            boxShadow: createControlFocusShadow('danger'),
          },
        }),
      },
    }),
    ...booleanVariantStyles('invalid', {
      on: {
        borderColor: 'danger',
      },
    }),
  },
  variants: [
    booleanVariant('checked', true),
    booleanVariant('focused', true),
    booleanVariant('invalid', true),
  ],
});

const ToggleControl = createComponent('input', {
  displayName: 'ToggleControl',
  styles: visuallyHiddenStyles,
});

const Toggler = createComponent('div', {
  displayName: 'ToggleToggler',
  styles: {
    fontSize: 'inherit',
    display: 'inline-block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
    transitionProperty: 'transform, color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-out',
  },
});

const ToggleLabelText = createComponent('span', {
  displayName: 'ToggleLabelText',
  styles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    mx: 1,
    ...booleanVariantStyles('hidden', {
      on: visuallyHiddenStyles,
    }),
  },
  variants: [visuallyHiddenBooleanVariant],
});

const ToggleLabel = createComponent('label', {
  displayName: 'ToggleLabel',
  styles: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    ...booleanVariantStyles('disabled', {
      on: disabledControlStyles,
    }),
    ...booleanVariantStyles('readOnly', {
      on: {
        cursor: 'default',
      },
    }),
  },
  variants: [
    booleanVariant('disabled', true),
    booleanVariant('readOnly', true),
  ],
});

interface ToggleProps
  extends ExtractVisageComponentProps<typeof ToggleControl> {
  /**
   * Hides label visually
   */
  hiddenLabel?: boolean;
  /**
   * Sets the checkbox aria-invalid to true and applies visual style
   */
  invalid?: boolean;
  /**
   * Label of the toggle
   */
  label: ReactNode;
  /**
   * Passes props to the label
   */
  labelProps?: ExtractVisageComponentProps<typeof ToggleLabel>;
  /**
   * Passes props to the label text
   */
  labelTextProps?: ExtractVisageComponentProps<typeof ToggleLabelText>;
  /**
   * Content that should be visible to the left of the toggler
   */
  leftContent?: ReactNode;
  ref?: Ref<HTMLInputElement>;
  /**
   * Content that should be visible to the right of the toggler
   */
  rightContent?: ReactNode;
}

export const Toggle: VisageComponent<ToggleProps> = markAsVisageComponent(
  memo(
    forwardRef(function Toggle(
      {
        $$variants,
        defaultChecked,
        disabled,
        checked,
        hiddenLabel = false,
        invalid,
        label,
        labelProps,
        labelTextProps,
        leftContent,
        rightContent,
        onBlur,
        onChange,
        onFocus,
        readOnly,
        parentStyles,
        styles,
        value,
        ...rest
      }: ToggleProps & StyleProps,
      ref: Ref<HTMLInputElement>,
    ) {
      const [focused, setFocused] = useState(false);
      const [inputChecked, setInputChecked] = useState(
        checked ?? defaultChecked ?? false,
      );
      const onInnerBlur = useHandlerRef(() => setFocused(false));
      const onInnerFocus = useHandlerRef(() => setFocused(true));
      const onBlurHandler = useComposedCallbackCreator<FocusEventHandler>(
        onBlur,
        onInnerBlur,
      );
      const onFocusHandler = useComposedCallbackCreator<FocusEventHandler>(
        onFocus,
        onInnerFocus,
      );
      const onChangeHandler = useStaticCallbackCreator(
        wrapToggleOnChangeHandler,
        [readOnly, onChange, setInputChecked],
      );
      // if onChange is provided then the component is controlled
      const isChecked = checked ?? inputChecked;

      return (
        <ToggleLabel {...labelProps} disabled={disabled} readOnly={readOnly}>
          <ToggleControl
            {...rest}
            aria-invalid={invalid}
            checked={isChecked}
            disabled={disabled}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            onFocus={onFocusHandler}
            ref={ref}
            readOnly={readOnly}
            value={value}
            type="checkbox"
          />
          <ToggleContainer
            checked={isChecked}
            focused={focused}
            invalid={invalid}
            parentStyles={parentStyles}
            styles={styles}
            $$variants={$$variants}
          >
            <Toggler
              data-label-content={isChecked ? rightContent : leftContent}
            />
          </ToggleContainer>
          <ToggleLabelText {...labelTextProps} hidden={hiddenLabel}>
            {label}
          </ToggleLabelText>
        </ToggleLabel>
      );
    }),
  ),
);
