import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, MouseEvent } from 'react';
import {
  DangerIcon,
  InfoIcon,
  NeutralMessageIcon,
  SuccessIcon,
  WarningIcon,
} from '../assets';
import { createComponent } from '../core';
import { booleanVariant, variant } from '../variants';
import { EmotionStyleSheet } from '../types';
import { Box } from './Box';
import { CloseButton } from './CloseButton';
import { Flex } from './Flex';
import { Heading } from './Heading';
import { SvgIcon } from './SvgIcon';
import { createControlFocusShadow } from './shared';

const statusIcons = {
  default: NeutralMessageIcon,
  critical: DangerIcon,
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
};

const variantStyles: { [key: string]: EmotionStyleSheet } = {
  critical: {
    borderColor: 'danger.1',
    backgroundColor: 'danger',
    color: 'dangerText',
    '&:focus': {
      boxShadow: createControlFocusShadow('danger'),
    },
  },
  info: {
    borderColor: 'info.1',
    backgroundColor: 'info',
    color: 'infoText',
    '&:focus': {
      boxShadow: createControlFocusShadow('info'),
    },
  },
  success: {
    borderColor: 'success.1',
    backgroundColor: 'success',
    color: 'successText',
    '&:focus': {
      boxShadow: createControlFocusShadow('success'),
    },
  },
  warning: {
    borderColor: 'warning.1',
    backgroundColor: 'warning',
    color: 'warningText',
    '&:focus': {
      boxShadow: createControlFocusShadow('warning'),
    },
  },
  default: {
    borderColor: 'neutral.1',
    backgroundColor: 'neutral',
    color: 'neutralText',
    '&:focus': {
      boxShadow: createControlFocusShadow('neutral'),
    },
  },
};

const BannerBase = createComponent(Flex, {
  displayName: 'Banner',
  styles: props => ({
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    outline: 'none',
    p: 2,
    my: 1,
    transition: 'box-shadow 150ms ease-out',
    ...(props.flat
      ? {
          off: {
            boxShadow:
              '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
          },
        }
      : {}),
    ...(variantStyles[props.status || 'default'] || variantStyles.default),
  }),
  variants: [
    booleanVariant('flat', true),
    variant('status', true, [
      'critical',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const ribbonVariantStyles: { [key: string]: EmotionStyleSheet } = {
  critical: {
    color: 'danger.3',
  },
  info: {
    color: 'info.3',
  },
  success: {
    color: 'success.3',
  },
  warning: {
    color: 'warning.3',
  },
  default: {
    color: 'neutral.3',
  },
};

const BannerRibbon = createComponent('div', {
  displayName: 'BannerRibbon',
  styles: props => ({
    fontSize: 1,
    mr: 2,
    ...(ribbonVariantStyles[props.status || 'default'] ||
      ribbonVariantStyles.default),
  }),
  variants: [
    variant('status', true, [
      'critical',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const BannerContent = createComponent(Box, {
  displayName: 'BannerContent',
  styles: {
    width: '100%',
  },
});

const BannerHeading = createComponent(Heading, {
  displayName: 'BannerHeading',
  defaultProps: {
    // @ts-ignore
    as: 'h5',
    level: 5,
  },
  styles: {
    fontSize: 1,
    fontWeight: 500,
    lineHeight: 1,
    mt: 0,
    mb: 1,
    pt: 0,
  },
});

const BannerCloseButtonWrapper = createComponent(Box, {
  displayName: 'BannerCloseButtonWrapper',
  styles: {
    mr: -1,
    mt: -1,
  },
});

interface BannerProps
  extends Omit<ExtractVisageComponentProps<typeof BannerBase>, 'title'> {
  children: ReactNode;
  dismissLabel?: string;
  icon?: ReactNode;
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  title?: ReactNode;
}

export const Banner: VisageComponent<BannerProps> = ({
  children,
  dismissLabel = 'Dismiss notification',
  icon,
  status = 'default',
  onDismiss,
  title,
  ...restProps
}: BannerProps) => {
  return (
    <BannerBase
      aria-live="polite"
      role={status === 'critical' || status === 'warning' ? 'alert' : 'status'}
      tabIndex={0}
      status={status}
      {...restProps}
    >
      <BannerRibbon aria-hidden status={status}>
        {icon != null ? (
          icon
        ) : (
          <SvgIcon
            aria-hidden
            icon={
              statusIcons[(status as any) as keyof typeof statusIcons] ||
              statusIcons.default
            }
          />
        )}
      </BannerRibbon>
      <BannerContent>
        {title != null ? <BannerHeading>{title}</BannerHeading> : null}
        {children}
      </BannerContent>
      {onDismiss ? (
        <BannerCloseButtonWrapper>
          <CloseButton aria-label={dismissLabel} onClick={onDismiss} />
        </BannerCloseButtonWrapper>
      ) : null}
    </BannerBase>
  );
};

markAsVisageComponent(Banner);
