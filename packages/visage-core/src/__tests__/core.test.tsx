/* eslint-disable react/no-multi-comp, react/prefer-stateless-function, max-classes-per-file */
import React from 'react';
import { isValidElementType } from 'react-is';
import { createComponent, displayName, isVisageComponent } from '..';

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

  describe('createComponent', () => {
    it('returns a component', () => {
      const A = createComponent('a');

      expect(isValidElementType(A)).toBe(true);
      expect(isVisageComponent(A)).toBe(true);
    });
  });
});
