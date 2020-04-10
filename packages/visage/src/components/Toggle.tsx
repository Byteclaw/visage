import {
  ExtractVisageComponentProps,
  VisageComponent,
  StyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEvent,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useState,
} from 'react';
import { createComponent } from '../core';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  visuallyHiddenStyles,
  createControlFocusShadow,
  visuallyHiddenBooleanVariant,
} from './shared';

const ToggleContainer = createComponent('div', {
  displayName: 'ToggleContainer',
  styles: {
    overflow: 'hidden',
    borderRadius: 999,
    width: 'auto',
    display: 'inline-flex',
    height: '1.5em',
    minWidth: '2.75em',
    backgroundColor: 'transparent',
    fontSize: '16px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    outline: 'none',
    userSelect: 'none',
    my: 0.5,
  },
});

const ToggleControl = createComponent('input', {
  displayName: 'ToggleControl',
  styles: {
    ...visuallyHiddenStyles,
    '&:checked + div > div': {
      transform: 'translateX(calc(100% - 1.25em - 0px))',
    },
    '& + div > div::after': {
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
    '& + div > div::before': {
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
    '&:checked + div > div::before': {
      left: '-50%',
    },
    '& + div': {
      backgroundColor: 'neutral',
      transitionProperty: 'all',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out',
    },
    '&:checked + div': {
      backgroundColor: 'primary',
    },
    '&:focus + div': {
      boxShadow: createControlFocusShadow(),
    },
    '&[aria-invalid="true"] + div': {
      borderColor: 'danger',
    },
    '&[aria-invalid="true"]:focus + div': {
      boxShadow: createControlFocusShadow('danger'),
    },
  },
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
  styles: props => ({
    fontSize: 'inherit',
    lineHeight: 'inherit',
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    mx: 1,
    ...(props.hidden ? visuallyHiddenStyles : {}),
  }),
  variants: [visuallyHiddenBooleanVariant],
});

const ToggleLabel = createComponent('label', {
  displayName: 'ToggleLabel',
  styles: props => ({
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    ...(props.disabled ? disabledControlStyles : {}),
  }),
  variants: [disabledControlBooleanVariant],
});

interface ToggleProps
  extends ExtractVisageComponentProps<typeof ToggleControl> {
  hiddenLabel?: boolean;
  invalid?: boolean;
  label: ReactNode;
  /**
   * Passes props to the label
   */
  labelProps?: ExtractVisageComponentProps<typeof ToggleLabel>;
  /**
   * Passes props to the label text
   */
  labelTextProps?: ExtractVisageComponentProps<typeof ToggleLabelText>;
  leftContent?: ReactNode;
  ref?: React.RefObject<HTMLInputElement>;
  rightContent?: ReactNode;
  wrapper?: ReactElement;
}

export const Toggle: VisageComponent<ToggleProps> = forwardRef(function Toggle(
  {
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
    onChange: outerOnChange,
    readOnly,
    styles,
    value,
    ...rest
  }: ToggleProps & StyleProps,
  ref: Ref<HTMLInputElement>,
) {
  const [inputChecked, setInputChecked] = useState(checked);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInputChecked(e.target.checked);

      if (outerOnChange) {
        outerOnChange(e);
      }
    },
    [outerOnChange],
  );

  return (
    <ToggleLabel {...labelProps} disabled={disabled}>
      <ToggleControl
        {...rest}
        aria-invalid={invalid}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        ref={ref}
        readOnly={readOnly}
        value={value}
        type="checkbox"
      />
      <ToggleContainer styles={styles}>
        <Toggler
          data-label-content={inputChecked ? rightContent : leftContent}
        />
      </ToggleContainer>
      <ToggleLabelText {...labelTextProps} hidden={hiddenLabel}>
        {label}
      </ToggleLabelText>
    </ToggleLabel>
  );
});
