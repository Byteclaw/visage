/* eslint-disable react/no-multi-comp, react/prefer-stateless-function, max-classes-per-file */
import React from 'react';
import { isValidElementType } from 'react-is';
import {
  createComponent,
  displayName,
  isVisageComponent,
  markAsVisageComponent,
} from '..';
import { StyleProps } from '../types';

describe('core', () => {
  describe('displayName', () => {
    it('works correctly', () => {
      const Anonymous = () => <div />;

      function Named() {
        return <div />;
      }

      expect(displayName('a')).toBe('a');
      expect(displayName('' as any)).toBe('Unknown');
      expect(displayName(Anonymous)).toBe('Anonymous');
      expect(displayName(Named)).toBe('Named');
      expect(displayName(() => <div />)).toBe('Unknown');
      expect(displayName(class extends React.Component {})).toBe('Unknown');
      expect(displayName(class Trolo extends React.Component {})).toBe('Trolo');
      expect(displayName(createComponent('a'))).toBe('VisageComponent(a)');
      expect(displayName(createComponent(Anonymous))).toBe(
        'VisageComponent(Anonymous)',
      );
      expect(displayName(createComponent(Named))).toBe(
        'VisageComponent(Named)',
      );
      expect(
        displayName(createComponent(class extends React.Component {})),
      ).toBe('VisageComponent(Unknown)');
      expect(
        displayName(createComponent(class Trolo extends React.Component {})),
      ).toBe('VisageComponent(Trolo)');
    });
  });

  describe('isVisageComponent', () => {
    it('works correctly', () => {
      expect(isVisageComponent('a')).toBe(false);
      expect(isVisageComponent(() => <div />)).toBe(false);
      expect(isVisageComponent(class extends React.Component {})).toBe(false);
      expect(isVisageComponent(createComponent('a'))).toBe(true);
    });
  });

  describe('markAsVisageComponent', () => {
    it('marks functional component as visage component', () => {
      const C = class extends React.Component<{ test: boolean } & StyleProps> {
        render() {
          return <div />;
        }
      };

      expect(isVisageComponent(C)).toBe(false);
      expect(isVisageComponent(markAsVisageComponent(C))).toBe(true);
    });

    it('marks class component as visage component', () => {
      const C = () => <div />;

      expect(isVisageComponent(C)).toBe(false);
      expect(isVisageComponent(markAsVisageComponent(C))).toBe(true);
    });

    it('does nothing with visage component', () => {
      const C = createComponent('a');

      expect(isVisageComponent(markAsVisageComponent(C))).toBe(true);
    });
  });

  describe('createComponent', () => {
    it('returns a component', () => {
      const A = createComponent('a');

      expect(isValidElementType(A)).toBe(true);
      expect(isVisageComponent(A)).toBe(true);
    });
  });
});
