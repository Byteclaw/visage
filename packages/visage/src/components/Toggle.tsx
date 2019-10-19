import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useState,
  useMemo,
} from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import { Flex } from './Flex';
import { disabledControl, visuallyHiddenStyles } from './shared';
import { Box } from './Box';
import { useGenerateId } from '../hooks';

interface ToggleProps extends VisageStyleProps<StyleProps> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
  label: ReactNode;
  leftContent?: ReactNode;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  rightContent?: ReactNode;
  wrapper?: ReactElement;
}

const ToggleContainer = createComponent('div', {
  displayName: 'ToggleContainer',
  defaultStyles: {
    overflowX: 'hidden',
    overflowY: 'visible',
    borderRadius: 999,
    width: 'auto',
    display: 'inline-flex',
    height: '1.5em',
    minWidth: '2.75em',
    backgroundColor: 'primary',
    fontSize: '16px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    outline: 'none',
    userSelect: 'none',
  },
});

const ToggleControl = createComponent('input', {
  displayName: 'ToggleControl',
  defaultStyles: {
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
      color: 'white',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      whiteSpace: 'nowrap',
      left: '50%',
    },
    '&:checked + div > div::before': {
      left: '-50%',
    },
    '& + div': {
      cursor: 'pointer',
      backgroundColor: 'neutral.1',
      transitionProperty: 'all',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out',
    },
    '&:checked + div': {
      backgroundColor: 'salmon',
    },
    '&:focus + div, &:active:not([disabled]) + div': {
      boxShadow: '0 0 0 2px blue',
    },
    '&[disabled] + div': {
      backgroundColor: 'neutral.0',
      cursor: 'not-allowed',
    },
  },
});

const Toggler = createComponent('div', {
  displayName: 'Toggler',
  defaultStyles: {
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

const ToggleLabel = disabledControl(
  createComponent('label', {
    displayName: 'ToggleLabel',
    defaultStyles: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      cursor: 'pointer',
      position: 'relative',
      outline: 'none',
      userSelect: 'none',
      mx: 1,
    },
  }),
);

export const Toggle: VisageComponent<ToggleProps, StyleProps> = forwardRef(
  function Toggle(
    {
      defaultChecked,
      disabled,
      checked,
      hiddenLabel = false,
      label,
      leftContent,
      rightContent,
      id: outerId,
      name,
      onChange,
      onBlur,
      onFocus,
      readOnly,
      styles,
      value,
    }: ToggleProps,
    ref: Ref<HTMLInputElement>,
  ) {
    const [inputChecked, setInputChecked] = useState(checked);
    const idTemplate = useGenerateId();
    const id = useMemo(() => {
      return outerId || `toggle-${idTemplate}-${name || ''}`;
    }, [outerId, idTemplate]);

    return (
      <Flex styles={{ display: 'flex', mb: 1 }}>
        <Box styles={{ display: 'flex', alignItems: 'center' }} as="label">
          <ToggleControl
            defaultChecked={defaultChecked}
            checked={checked}
            disabled={disabled}
            id={id}
            name={name}
            onChange={e => {
              setInputChecked(e.target.checked);
              if (onChange) {
                onChange(e);
              }
            }}
            ref={ref}
            readOnly={readOnly}
            value={value}
            tabIndex={0}
            type="checkbox"
            onKeyDown={e => {
              if (readOnly && e.key === ' ') {
                e.preventDefault();
              }
            }}
            onClick={e => {
              if (readOnly) {
                e.preventDefault();
              }
            }}
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <ToggleContainer styles={styles}>
            <Toggler
              checked={checked}
              data-label-content={inputChecked ? rightContent : leftContent}
            />
          </ToggleContainer>
          {label != null && (
            <ToggleLabel disabled={disabled} htmlFor={id} hidden={hiddenLabel}>
              {label}
            </ToggleLabel>
          )}
        </Box>
      </Flex>
    );
  },
);
