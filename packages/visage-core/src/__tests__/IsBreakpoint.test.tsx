import React from 'react';
import { render } from '@testing-library/react';
import { IsBreakpoint } from '..';
import { DesignSystem } from './designSystem';

describe('IsBreakpoint', () => {
  describe('is', () => {
    it('matches if equal or contains', () => {
      const { asFragment } = render(
        <DesignSystem is={0}>
          <IsBreakpoint is={0}>Match scalar</IsBreakpoint>
          <IsBreakpoint is={[0, 1]}>Match array</IsBreakpoint>
          <IsBreakpoint is={0}>{() => 'Match scalar fn'}</IsBreakpoint>
          <IsBreakpoint is={[0, 1]}>{() => 'Match array fn'}</IsBreakpoint>
          <IsBreakpoint is={1}>{() => 'Do not match'}</IsBreakpoint>
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                        <DocumentFragment>
                          Match scalarMatch arrayMatch scalar fnMatch array fn
                        </DocumentFragment>
                  `);
    });
  });

  describe('not', () => {
    it('matches if not equal or does not contain', () => {
      const { asFragment } = render(
        <DesignSystem is={1}>
          <IsBreakpoint not={0}>Match scalar</IsBreakpoint>
          <IsBreakpoint not={[0, 2]}>Match array</IsBreakpoint>
          <IsBreakpoint not={0}>{() => 'Match scalar fn'}</IsBreakpoint>
          <IsBreakpoint not={[0, 2]}>{() => 'Match array fn'}</IsBreakpoint>
          <IsBreakpoint not={1}>{() => 'Do not match'}</IsBreakpoint>
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                <DocumentFragment>
                  Match scalarMatch arrayMatch scalar fnMatch array fn
                </DocumentFragment>
            `);
    });
  });

  describe('gte', () => {
    it('matches if greater or equal', () => {
      const { asFragment } = render(
        <DesignSystem is={1}>
          <IsBreakpoint gte={0}>Match</IsBreakpoint>
          <IsBreakpoint gte={0}>{() => 'Match fn'}</IsBreakpoint>
          <IsBreakpoint gte={2}>Do not match</IsBreakpoint>
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          MatchMatch fn
        </DocumentFragment>
      `);
    });
  });

  describe('lte', () => {
    it('matches less than or equal', () => {
      const { asFragment } = render(
        <DesignSystem is={1}>
          <IsBreakpoint lte={1}>Match</IsBreakpoint>
          <IsBreakpoint lte={1}>{() => 'Match fn'}</IsBreakpoint>
          <IsBreakpoint lte={0}>Do not match</IsBreakpoint>
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          MatchMatch fn
        </DocumentFragment>
      `);
    });
  });
});
