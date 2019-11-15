import { createComponent } from '../core';
import { booleanVariant } from '../variants';

export const DataTable = createComponent('table', {
  displayName: 'DataTable',
  defaultStyles: {
    borderSpacing: 0,
    width: '100%',
    '& th, td': {
      verticalAlign: 'top',
    },
  },
});

export const DataTableHeader = createComponent('thead', {
  displayName: 'DataTableHeader',
});

export const DataTableHeaderColumn = createComponent('th', {
  displayName: 'DataTableHeaderColumn',
  defaultStyles: props => ({
    borderColor: 'neutral',
    borderStyle: 'solid',
    borderWidth: 0,
    fontWeight: 400,
    p: 1,
    textAlign: 'left',
    ...(props.numeric ? { textAlign: 'right' } : {}),
    ...(props.total
      ? { backgroundColor: 'neutral', color: 'neutralText', fontWeight: 600 }
      : {}),
    ...(props.inFooter
      ? { borderTopWidth: '.1rem' }
      : { borderBottomWidth: '.1rem' }),
  }),
  variants: [
    booleanVariant('numeric', true),
    booleanVariant('inFooter', true),
    booleanVariant('total', true),
  ],
});

export const DataTableHeaderRow = createComponent('tr', {
  displayName: 'DataTableHeaderRow',
});

export const DataTableFooter = createComponent('tfoot', {
  displayName: 'DataTableFooter',
});

export const DataTableFooterRow = createComponent('tr', {
  displayName: 'DataTableFooterRow',
});

export const DataTableBody = createComponent('tbody', {
  displayName: 'DataTableBody',
});

export const DataTableRow = createComponent('tr', {
  displayName: 'DataTableRow',
  defaultStyles: {
    '&:hover td': {
      backgroundColor: 'neutral',
    },
  },
});

export const DataTableColumn = createComponent('td', {
  displayName: 'DataTableColumn',
  defaultStyles: props => ({
    p: 1,
    textAlign: 'left',
    ...(props.numeric ? { textAlign: 'right' } : {}),
    ...(props.total ? { backgroundColor: 'neutral', fontWeight: 600 } : {}),
  }),
  variants: [booleanVariant('numeric', true), booleanVariant('total', true)],
});

export const DataTableColumnSkeleton = createComponent('td', {
  displayName: 'DataTableColumnSkeleton',
});

export const DataTableNumericColumnSkeleton = createComponent('td', {
  displayName: 'DataTableNumericColumnSkeleton',
});
