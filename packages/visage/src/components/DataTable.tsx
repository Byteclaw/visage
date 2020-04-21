import { createComponent } from '../core';
import { booleanVariant } from '../variants';

export const DataTable = createComponent('table', {
  displayName: 'DataTable',
  styles: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
    width: '100%',
    '& th, td': {
      verticalAlign: 'top',
    },
  },
});

export const DataTableHeader = createComponent('thead', {
  displayName: 'DataTableHeader',
  styles: {
    '& th': {
      borderBottomStyle: 'solid',
      borderBottomColor:
        'color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
      borderBottomWidth: '1px',
    },
  },
});

const totalStyles: VisageStyleSheet = {
  backgroundColor:
    'color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
  color: 'shadesText',
  fontWeight: 600,
};

export const DataTableHeaderColumn = createComponent('th', {
  displayName: 'DataTableHeaderColumn',
  styles: props => ({
    fontWeight: 600,
    p: 2,
    textAlign: 'left',
    ...(props.numeric ? { textAlign: 'right' } : {}),
    ...(props.total ? totalStyles : {}),
  }),
  variants: [booleanVariant('numeric', true), booleanVariant('total', true)],
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
  styles: {
    '&:hover td': {
      color: 'shadesText',
      backgroundColor:
        'color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
    },
  },
});

export const DataTableColumn = createComponent('td', {
  displayName: 'DataTableColumn',
  styles: props => ({
    p: 2,
    textAlign: 'left',
    ...(props.numeric ? { textAlign: 'right' } : {}),
    ...(props.total ? totalStyles : {}),
  }),
  variants: [booleanVariant('numeric', true), booleanVariant('total', true)],
});

export const DataTableColumnSkeleton = createComponent('td', {
  displayName: 'DataTableColumnSkeleton',
});

export const DataTableNumericColumnSkeleton = createComponent('td', {
  displayName: 'DataTableNumericColumnSkeleton',
});
