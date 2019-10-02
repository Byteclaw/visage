import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  ReactElement,
  ReactNode,
  ChangeEventHandler,
  forwardRef,
  Ref,
  useMemo,
} from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import {
  visuallyHiddenStripped,
  visuallyHiddenStyles,
  disabledControl,
  invalidControl,
} from './shared';
import { Flex } from './Flex';
import { useGenerateId } from '../hooks';

const Svg = createComponent('svg', {
  displayName: 'Svg',
});

const CheckboxControl = createComponent('input', {
  displayName: 'CheckboxControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    // prevent blinking when clicking on already focused checkbox
    '&[aria-invalid="true"] + div': {
      boxShadow: '0 0 0 2px red',
    },
    '&:focus + div, &:active:not([disabled]) + div': {
      boxShadow: '0 0 0 3px blue',
    },
    '& + div': {
      background: 'papayawhip',
    },
    '&:checked + div': {
      background: 'salmon',
    },
    '& + div > svg': {
      visibility: 'hidden',
    },
    '&:checked + div > svg': {
      visibility: 'visible',
    },
  },
});

const CheckboxLabel = disabledControl(
  invalidControl(
    createComponent('label', {
      displayName: 'CheckboxLabel',
      defaultStyles: {
        display: 'flex',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        cursor: 'pointer',
        position: 'relative',
        outline: 'none',
        userSelect: 'none',
      },
    }),
  ),
);

const CheckboxLabelText = visuallyHiddenStripped(
  createComponent('span', {
    displayName: 'CheckboxLabelText',
    defaultStyles: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
    },
  }),
);

const CheckboxWrapper = createComponent('div', {
  displayName: 'CheckboxWrapper',
  defaultStyles: {
    display: 'flex',
    flex: '1',
    fontSize: 0,
    lineHeight: 0,
    alignItems: 'flex-start',
    m: 0,
    mb: 1,
    p: 0,
  },
});

interface CheckboxProps extends VisageStyleProps<StyleProps> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
  id?: string;
  invalid?: boolean;
  label: ReactNode;
  /**
   * Name is required for proper control id
   * If name is not unique, use id
   */
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  toggler?: boolean | ReactElement;
  value?: any;
  wrapper?: ReactElement;
}

const togglerStyles = {
  alignSelf: 'center',
  transition: 'all 150ms',
  borderRadius: '3px',
  mr: 1,
};

export const Checkbox: VisageComponent<CheckboxProps, StyleProps> = forwardRef(
  function Checkbox(
    {
      defaultChecked,
      disabled,
      checked,
      hiddenLabel = false,
      id: outerId,
      invalid,
      label,
      name,
      onChange,
      readOnly,
      styles,
      toggler,
      value,
    }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) {
    const idTemplate = useGenerateId();
    const id = useMemo(() => {
      return `chkbx-${idTemplate}-${name || ''}`;
    }, [outerId, idTemplate]);

    return (
      <CheckboxWrapper styles={styles}>
        <CheckboxLabel invalid={invalid} disabled={disabled} htmlFor={id}>
          <CheckboxControl
            aria-invalid={invalid}
            defaultChecked={defaultChecked}
            checked={checked}
            disabled={disabled}
            id={id}
            name={name}
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
            onChange={onChange}
            ref={ref}
            readOnly={readOnly}
            tabIndex={0}
            type="checkbox"
            value={value}
            htmlOnly={toggler === false}
          />
          <Flex aria-hidden styles={togglerStyles}>
            <Svg
              viewBox="0 0 24 24"
              styles={{
                width: '1em',
                height: '1em',
                stroke: 'white',
                strokeWidth: '2px',
                fill: 'none',
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </Svg>
          </Flex>
          <CheckboxLabelText hidden={hiddenLabel}>{label}</CheckboxLabelText>
        </CheckboxLabel>
      </CheckboxWrapper>
    );
  },
);
