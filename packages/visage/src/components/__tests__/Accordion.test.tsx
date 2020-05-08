import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, createTestTheme } from './render';
import { Accordion, AccordionItem } from '../Accordion';

describe('Accordion', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Accordion>
        <AccordionItem title="A">A</AccordionItem>
      </Accordion>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('reacts to keyboard events', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem title="A">A</AccordionItem>
        <AccordionItem title="B">B</AccordionItem>
        <AccordionItem title="C">C</AccordionItem>
      </Accordion>,
    );
    const A = container.querySelector(
      '#accordion-1-0-trigger',
    ) as HTMLDivElement;
    const B = container.querySelector(
      '#accordion-1-1-trigger',
    ) as HTMLDivElement;
    const C = container.querySelector(
      '#accordion-1-2-trigger',
    ) as HTMLDivElement;

    // A should be expanded by default
    expect(A).toHaveAttribute('aria-expanded', 'true');

    A.focus();

    expect(A).toHaveFocus();

    // focus B
    B.focus();

    expect(B).toHaveFocus();

    // expand B by Enter keydown
    fireEvent.keyDown(B, {
      key: 'Enter',
    });

    expect(A).toHaveAttribute('aria-expanded', 'false');
    expect(B).toHaveAttribute('aria-expanded', 'true');
    expect(C).toHaveAttribute('aria-expanded', 'false');

    // press space, does nothing
    fireEvent.keyDown(B, {
      key: ' ',
    });

    expect(B).toHaveAttribute('aria-expanded', 'true');

    // focus next using arrow down
    fireEvent.keyDown(B, {
      key: 'ArrowDown',
    });

    expect(C).toHaveFocus();

    // now expand using space
    // focus next using arrow down
    fireEvent.keyDown(C, {
      key: ' ',
    });

    expect(C).toHaveAttribute('aria-expanded', 'true');

    // arrow down goes back to A
    fireEvent.keyDown(C, {
      key: 'ArrowDown',
    });

    expect(A).toHaveFocus();

    // arrow up returns back to C
    fireEvent.keyDown(A, {
      key: 'ArrowUp',
    });

    expect(C).toHaveFocus();

    // Home returns back to A
    fireEvent.keyDown(C, {
      key: 'Home',
    });

    expect(A).toHaveFocus();

    // End returns back to C
    fireEvent.keyDown(A, {
      key: 'End',
    });

    expect(C).toHaveFocus();
  });

  it('reacts to mouse events', () => {
    const { container } = render(
      <Accordion>
        {['A', 'B', 'C'].map(title => (
          <AccordionItem key={title} title={title}>
            {title}
          </AccordionItem>
        ))}
      </Accordion>,
    );
    const A = container.querySelector('#accordion-1-0-trigger');
    const B = container.querySelector('#accordion-1-1-trigger');
    const C = container.querySelector('#accordion-1-2-trigger');

    // A should be expanded by default
    expect(A).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(B);

    expect(A).toHaveAttribute('aria-expanded', 'false');
    expect(B).toHaveAttribute('aria-expanded', 'true');
    expect(C).toHaveAttribute('aria-expanded', 'false');
  });

  it('can be styles using AccordionRegion face', () => {
    const { asFragment } = render(
      <Accordion>
        <AccordionItem title="A">A</AccordionItem>
      </Accordion>,
      {
        ds: {
          theme: createTestTheme({
            AccordionRegion: {
              color: 'blue',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('can be styles using AccordionTrigger face', () => {
    const { asFragment } = render(
      <Accordion>
        <AccordionItem title="A">A</AccordionItem>
      </Accordion>,
      {
        ds: {
          theme: createTestTheme({
            AccordionTrigger: {
              color: 'blue',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
