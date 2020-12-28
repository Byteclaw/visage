import {
  VisageComponent,
  markAsVisageComponent,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  ReactNode,
  ReactElement,
  MouseEventHandler,
  memo,
} from 'react';
import { createComponent } from '../core';
import { CloseButton } from './CloseButton';
import { createSurfaceFocusShadow } from './shared';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles as createVariantStyles,
} from '../variants';

const variantStyles: { [key: string]: VisageStyleSheet } = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
  },
  info: {
    backgroundColor: 'info',
    color: 'infoText',
  },
  primary: {
    backgroundColor: 'primary',
    color: 'primaryText',
  },
  success: {
    backgroundColor: 'success',
    color: 'successText',
  },
  warning: {
    backgroundColor: 'warning',
    color: 'warningText',
  },
  default: {
    backgroundColor: 'neutral',
    color: 'neutralText',
  },
};

const outlinedVariantStyles: { [key: string]: VisageStyleSheet } = {
  success: {
    borderColor: 'success',
    color: 'success',
  },
  danger: {
    borderColor: 'danger',
    color: 'danger',
  },
  info: {
    borderColor: 'info',
    color: 'info',
  },
  warning: {
    borderColor: 'warning',
    color: 'warning',
  },
  primary: {
    borderColor: 'primary',
    color: 'primary',
  },
  default: {
    borderStyle: 'solid',
    color: 'shadesText',
  },
};

const ChipBase = createComponent('div', {
  displayName: 'Chip',
  styles: {
    borderRadius: '16px',
    display: 'inline-flex',
    fontFamily: 'heading',
    fontSize: -1,
    lineHeight: -1,
    position: 'relative',
    outline: 'none',
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
    '&:focus, &[aria-selected="true"]': {
      boxShadow: createSurfaceFocusShadow(),
    },
    transition: 'all 150ms',
    ...booleanVariantStyles('outlined', {
      on: {
        backgroundColor: 'transparent',
        borderColor: 'accent',
        borderWidth: 1,
        ...createVariantStyles('variant', outlinedVariantStyles),
      },
      off: createVariantStyles('variant', variantStyles),
    }),
    /* ...(props.outlined
      ? outlinedVariantStyles[props.variant || 'default'] ||
        outlinedVariantStyles.default
      : variantStyles[props.variant || 'default'] || variantStyles.default), */
  },
  variants: [
    booleanVariant('outlined', true),
    variant('variant', true, [
      'danger',
      'info',
      'primary',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const ChipLabel = createComponent('span', {
  displayName: 'ChipLabel',
  styles: {
    alignSelf: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    px: 1.5,
    py: 0.5,
    lineHeight: '1.2rem',
    ...booleanVariantStyles('size', {
      on: {
        px: 1,
      },
    }),
  },
  variants: [booleanVariant('small', false)],
});

const ChipDeleteButton = createComponent(CloseButton, {
  displayName: 'ChipDeleteButton',
  styles: {
    mr: 1,
    ml: -0.5,
    my: 0.5,
    p: 0.5,
  },
});

const defaultChipDeleteRenderer = (props: {
  onClick: MouseEventHandler<any>;
}) => <ChipDeleteButton {...props} />;

type ChipBaseProps = Omit<ExtractVisageComponentProps<typeof ChipBase>, 'ref'>;

interface ChipProps extends ChipBaseProps {
  children: ReactNode;
  labelProps?: ExtractVisageComponentProps<typeof ChipLabel>;
  /**
   * Called when clicked or chip is focused and Space/Enter is pressed on chip and chip is not readOnly
   */
  onClick?: (e: KeyboardEvent<any> | MouseEvent<any>) => void;
  /**
   * Makes chip deletable
   *
   * Called when user click on delete element or presses Backspace / Delete
   */
  onDelete?: (e: KeyboardEvent<any> | MouseEvent<any>) => void;
  renderDeleter?: (props: { onClick: MouseEventHandler<any> }) => ReactElement;
  small?: boolean;
}

export const Chip: VisageComponent<ChipProps> = markAsVisageComponent(
  memo(
    React.forwardRef(
      (
        {
          children,
          labelProps,
          onClick,
          onDelete,
          renderDeleter = defaultChipDeleteRenderer,
          small,
          ...restProps
        }: ChipProps,
        ref: any,
      ) => {
        const onChipClick = useCallback(
          (e: MouseEvent<any>) => {
            if (onClick) {
              onClick(e);
            }
          },
          [onClick],
        );
        const onDeleteClick = useCallback(
          (e: MouseEvent<any>) => {
            // stop propagation of event to ChipBase, because we don't want to invoke onclick
            e.stopPropagation();

            if (onDelete) {
              onDelete(e);
            }
          },
          [onDelete],
        );
        const onDeleteKeyDown = useCallback(
          (e: KeyboardEvent<any>) => {
            switch (e.key) {
              case 'Backspace':
              case 'Delete':
                if (onDelete) {
                  e.preventDefault();
                  onDelete(e);
                }
                break;
              case 'Enter':
              case ' ':
                if (onClick) {
                  e.preventDefault();
                  onClick(e);
                }
            }
          },
          [onDelete, onClick],
        );

        return (
          <ChipBase
            role={onClick ? 'button' : undefined}
            data-clickable={onClick != null}
            onClick={onChipClick}
            onKeyDown={onDeleteKeyDown}
            tabIndex={onClick ? 0 : undefined}
            {...restProps}
            ref={ref}
          >
            <ChipLabel small={small} {...labelProps}>
              {children}
            </ChipLabel>
            {onDelete ? renderDeleter({ onClick: onDeleteClick }) : null}
          </ChipBase>
        );
      },
    ),
  ),
);
