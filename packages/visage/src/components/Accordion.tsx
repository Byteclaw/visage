import { useUniqueId } from '@byteclaw/use-unique-id';
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
import { getNextIndexFromCycle } from './shared';
import { booleanVariant } from '../variants';

const AccordionTrigger = createComponent('div', {
  defaultStyles: {
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
    outlineWidth: 3,
    outlineColor: 'darkAccent',
    m: 0,
    p: 0,
    py: 1,
    width: '100%',
  },
  defaultProps: { role: 'button' },
});

type AccordionTriggerProps = ExtractVisageComponentProps<
  typeof AccordionTrigger
>;

const AccordionRegion = createComponent('div', {
  defaultStyles: props => ({
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

interface AccordionItemProps {
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
        aria-disabled={open}
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

interface AccordionProps {
  id?: string;
  children: ReactElement<AccordionItemProps>[];
}

export function Accordion({ children, id }: AccordionProps) {
  const accordionNumId = useUniqueId();
  const accordionId = id || `accordion-${accordionNumId}`;
  const [openItem, setOpenItem] = useState(() => {
    const idx = Children.toArray(children).findIndex(item => item.props.open);

    return idx === -1 ? 0 : 1;
  });

  return Children.map(children, (item, i) =>
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

          if (typeof document !== 'undefined') {
            const itemToFocus = document.getElementById(
              `${accordionId}-${getNextIndexFromCycle(
                i,
                e.key === 'ArrowUp' ? -1 : 1,
                children.length,
              )}-trigger`,
            );

            if (itemToFocus) {
              itemToFocus.focus();
            }
          }
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();

          if (typeof document !== 'undefined') {
            const itemToFocus = document.getElementById(
              `${accordionId}-${
                e.key === 'Home' ? 0 : children.length - 1
              }-trigger`,
            );

            if (itemToFocus) {
              itemToFocus.focus();
            }
          }
        }

        if (item.props.onTriggerKeyDown) {
          item.props.onTriggerKeyDown(e);
        }
      },
    }),
  );
}
