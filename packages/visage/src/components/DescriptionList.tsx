import { VisageComponent } from '@byteclaw/visage-core';
import React, { ReactNode, Children, Fragment } from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import { Divider } from './Divider';

export const DescriptionListBase = createComponent('dl', {
  displayName: 'DescriptionList',
  defaultStyles: {
    display: ['block', 'flex'],
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    m: 0,
    p: 0,
  },
});

export const Description = createComponent('dd', {
  displayName: 'Description',
  defaultStyles: {
    display: 'block',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '51%',
    pt: [0, 2],
    pb: 2,
    m: 0,
  },
});

export const Term = createComponent('dt', {
  displayName: 'Term',
  defaultStyles: {
    display: 'block',
    fontWeight: 'bolder',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: '25%',
    pt: 2,
    pb: [1, 2],
    pr: [0, 2],
    m: 0,
  },
});

export interface DescriptionListItemProps {
  description: string;
  prefix: ReactNode;
  suffix: ReactNode;
  term: string;
}

export interface DescriptionListProps {
  children: ReactNode;
}

export function DescriptionListItem({
  description,
  prefix = [],
  suffix = [],
  term,
}: DescriptionListItemProps) {
  return [
    prefix,
    <Term>{term}</Term>,
    <Description>{description}</Description>,
    suffix,
  ];
}

export const DescriptionList: VisageComponent<
  DescriptionListProps,
  StyleProps
> = function DescriptionList({ children, ...restProps }: DescriptionListProps) {
  return (
    <DescriptionListBase {...restProps}>
      {Children.map(children, (item, i) => {
        return (
          <Fragment>
            {item}
            {i + 1 < Children.count(children) && <Divider />}
          </Fragment>
        );
      })}
    </DescriptionListBase>
  );
};
