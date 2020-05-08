import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useState,
  MouseEventHandler,
  MouseEvent,
  KeyboardEventHandler,
  KeyboardEvent,
} from 'react';
import { createComponent } from '../core';
import {
  getNextIndexFromCycle,
  createControlActiveShadow,
  createControlFocusShadow,
} from './shared';
import { booleanVariant } from '../variants';
import { useUniqueId } from '../hooks';

const AccordionTrigger = createComponent('div', {
  displayName: 'AccordionTrigger',
  styles: {
    borderColor: 'transparent',
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderBottomColor: 'neutral',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 1,
    fontFamily: 'heading',
    fontWeight: 'bolder',
    lineHeight: 1,
    outline: 'none',
    m: 0,
    p: 0,
    py: 1,
    width: '100%',
    '&:focus': {
      boxShadow: createControlFocusShadow(),
    },
    '&:focus:active': {
      boxShadow: createControlActiveShadow(),
    },
  },
  defaultProps: { role: 'button' },
});

type AccordionTriggerProps = ExtractVisageComponentProps<
  typeof AccordionTrigger
>;

const AccordionRegion = createComponent('div', {
  displayName: 'AccordionRegion',
  styles: props => ({
    height: props.open ? 'auto' : 0,
    opacity: props.open ? 1 : 0,
    m: 0,
    p: 0,
    py: props.open ? 1 : 0,
    visibility: props.open ? 'visible' : 'hidden',
    transition:
      'height cubic-bezier(0.2, 0, 0.38, 0.9) 110ms, padding cubic-bezier(0.2, 0, 0.38, 0.9) 110ms',
  }),
  defaultProps: { role: 'region' },
  variants: [booleanVariant('open', true)],
});

type AccordionRegionProps = ExtractVisageComponentProps<typeof AccordionRegion>;

export interface AccordionItemProps {
  children: ReactNode | (() => ReactNode);
  open?: boolean;
  onTriggerClick?: MouseEventHandler<HTMLDivElement>;
  onTriggerKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  title: ReactNode;
  regionId?: string;
  regionProps?: AccordionRegionProps;
  triggerId?: string;
  triggerProps?: AccordionTriggerProps;
}

export function AccordionItem({
  children,
  onTriggerClick,
  onTriggerKeyDown,
  open,
  // passed from Accordion
  regionId,
  regionProps,
  title,
  // passed from Accordion
  triggerId,
  triggerProps,
}: AccordionItemProps) {
  return (
    <>
      <AccordionTrigger
        {...regionProps}
        aria-controls={regionId}
        aria-expanded={open}
        id={triggerId}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        tabIndex={0}
      >
        {title}
      </AccordionTrigger>
      <AccordionRegion
        {...triggerProps}
        aria-labelledby={triggerId}
        id={regionId}
        open={open}
      >
        {typeof children === 'function' ? children() : children}
      </AccordionRegion>
    </>
  );
}

type AccordionItemElement = ReactElement<AccordionItemProps>;

interface AccordionProps {
  id?: string;
  children: AccordionItemElement | AccordionItemElement[];
}

export function Accordion({ children, id }: AccordionProps) {
  const accordionId = useUniqueId(id, 'accordion');

  const items: ReactElement<AccordionItemProps>[] = Children.toArray(
    children,
  ) as ReactElement<AccordionItemProps>[];

  const [openItem, setOpenItem] = useState(() => {
    const idx = items.findIndex(item => item.props.open);

    return idx === -1 ? 0 : 1;
  });

  // if out of bounds
  if (openItem >= items.length || openItem < 0) {
    setOpenItem(0);
  }

  return (
    <>
      {items.map((item, i) =>
        cloneElement(item, {
          regionId: `${accordionId}-${i}-region`,
          triggerId: `${accordionId}-${i}-trigger`,
          open: openItem === i,
          onTriggerClick: (e: MouseEvent<HTMLDivElement>) => {
            setOpenItem(i);

            if (item.props.onTriggerClick) {
              item.props.onTriggerClick(e);
            }
          },
          onTriggerKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();

              setOpenItem(i);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();

              const itemToFocus = document.getElementById(
                `${accordionId}-${getNextIndexFromCycle(
                  i,
                  e.key === 'ArrowUp' ? -1 : 1,
                  items.length - 1,
                )}-trigger`,
              );

              if (itemToFocus) {
                itemToFocus.focus();
              }
            } else if (e.key === 'Home' || e.key === 'End') {
              e.preventDefault();

              const itemToFocus = document.getElementById(
                `${accordionId}-${
                  e.key === 'Home' ? 0 : items.length - 1
                }-trigger`,
              );

              if (itemToFocus) {
                itemToFocus.focus();
              }
            }

            if (item.props.onTriggerKeyDown) {
              item.props.onTriggerKeyDown(e);
            }
          },
        }),
      )}
    </>
  );
}
