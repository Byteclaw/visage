import React, {
  forwardRef,
  memo,
  ReactElement,
  Ref,
  ComponentType,
} from 'react';
import {
  markAsVisageComponent,
  VisageComponent,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles,
} from '../variants';
import { SvgIcon } from './SvgIcon';
import {
  disabledControlStyles,
  createControlActiveShadow,
  createSurfaceFocusShadow,
} from './shared';

const strokedVariantStyles = booleanVariantStyles('stroked', {
  on: {
    svg: {
      stroke: 'currentColor',
    },
  },
  off: {
    svg: {
      fill: 'currentColor',
    },
  },
});

const IconButtonComponent = createComponent('button', {
  displayName: 'IconButton',
  styles: {
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '100%',
    cursor: 'pointer',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    p: 0,
    outline: 'none',
    ...booleanVariantStyles('disabled', {
      on: disabledControlStyles,
    }),
    ...booleanVariantStyles('monochromatic', {
      on: {
        color: 'inherit',
      },
      off: variantStyles('variant', {
        primary: {
          color: 'primary',
        },
        danger: {
          color: 'danger',
        },
        default: {
          color: 'shadesText',
        },
      }),
    }),
    // we don't need on clause in monochromatic, because it works by default like this
    ...strokedVariantStyles,
    '&:hover': {
      opacity: 0.5,
    },
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('currentColor'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('currentColor'),
    },
  },
  variants: [
    booleanVariant('disabled', false),
    booleanVariant('monochromatic', true),
    booleanVariant('stroked', true),
    variant('variant', true, ['primary', 'danger']),
  ],
});

interface IconButtonProps
  extends Omit<ExtractVisageComponentProps<typeof IconButtonComponent>, 'ref'> {
  icon: ReactElement | ComponentType<any>;
  iconProps?: ExtractVisageComponentProps<typeof SvgIcon>;
  label: string;
  ref?: Ref<HTMLButtonElement>;
}

export const IconButton: VisageComponent<IconButtonProps> = markAsVisageComponent(
  memo(
    forwardRef(
      (
        { icon, iconProps, label, ...restProps },
        ref: Ref<HTMLButtonElement>,
      ) => {
        return (
          <IconButtonComponent aria-label={label} ref={ref} {...restProps}>
            <SvgIcon icon={icon} {...iconProps} />
          </IconButtonComponent>
        );
      },
    ),
  ),
);
