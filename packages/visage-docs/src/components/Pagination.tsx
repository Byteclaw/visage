import {
  createComponent,
  Flex,
  SmallText,
  Text,
  variant,
  variantStyles,
} from '@byteclaw/visage';
import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby';
import React, { ReactNode } from 'react';

const PaginatorLink = createComponent(GatsbyLink, {
  displayName: 'PaginatorLink',
  styles: {
    fontSize: 2,
    display: 'inline-flex',
    flexDirection: 'column',
    ...variantStyles('direction', {
      next: {
        ml: 'auto',
        textAlign: 'right',
      },
      prev: {
        mr: 'auto',
      },
    }),
    '&:hover': {
      textDecoration: 'none',
    },
    my: 2,
    minHeight: 100,
    maxWidth: 250,
  },
  variants: [variant('direction', true, ['next', 'prev'] as const)],
});

interface PaginatorProps {
  children: ReactNode;
}

export function Paginator({ children }: PaginatorProps) {
  return <Flex styles={{ mt: 4, width: '100%' }}>{children}</Flex>;
}

interface PaginatorButtonProps {
  direction?: 'next' | 'prev';
}

export function PaginatorButton({
  children,
  direction = 'next',
  ...restProps
}: GatsbyLinkProps<any> & PaginatorButtonProps) {
  return (
    <PaginatorLink direction={direction} {...restProps}>
      <SmallText styles={{ display: 'block', fontFamily: 'monospace' }}>
        {direction === 'next' ? 'Next' : 'Previous'}
      </SmallText>
      <Text styles={{ display: 'block' }}>{children}</Text>
    </PaginatorLink>
  );
}
