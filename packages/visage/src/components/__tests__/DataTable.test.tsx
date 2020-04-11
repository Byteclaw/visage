import React from 'react';
import { createTestTheme, render } from './render';
import {
  DataTable,
  DataTableBody,
  DataTableColumn,
  DataTableColumnSkeleton,
  DataTableFooter,
  DataTableFooterRow,
  DataTableHeader,
  DataTableHeaderColumn,
  DataTableHeaderRow,
  DataTableNumericColumnSkeleton,
  DataTableRow,
} from '../DataTable';

describe('DataTable', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<DataTable />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTable face', () => {
    const { asFragment } = render(<DataTable />, {
      ds: {
        theme: createTestTheme({
          DataTable: {
            color: 'black',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableBody', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <DataTableBody />
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableBody face', () => {
    const { asFragment } = render(
      <table>
        <DataTableBody />
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableBody: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableColumn', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <DataTableColumn />
          </tr>
        </tbody>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableColumn face', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <DataTableColumn />
          </tr>
        </tbody>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableColumn: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableColumnSkeleton', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <DataTableColumnSkeleton />
          </tr>
        </tbody>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableColumnSkeleton face', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <DataTableColumnSkeleton />
          </tr>
        </tbody>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableColumnSkeleton: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableFooter', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <DataTableFooter />
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableFooter face', () => {
    const { asFragment } = render(
      <table>
        <DataTableFooter />
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableFooter: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableFooterRow', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <tfoot>
          <DataTableFooterRow />
        </tfoot>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableFooterRow face', () => {
    const { asFragment } = render(
      <table>
        <tfoot>
          <DataTableFooterRow />
        </tfoot>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableFooterRow: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableHeader', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <DataTableHeader />
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableHeader face', () => {
    const { asFragment } = render(
      <table>
        <DataTableHeader />
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableHeader: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableHeaderColumn', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <thead>
          <tr>
            <DataTableHeaderColumn />
          </tr>
        </thead>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableHeaderColumn face', () => {
    const { asFragment } = render(
      <table>
        <thead>
          <tr>
            <DataTableHeaderColumn />
          </tr>
        </thead>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableHeaderColumn: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableHeaderRow', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <thead>
          <DataTableHeaderRow />
        </thead>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableHeaderRow face', () => {
    const { asFragment } = render(
      <table>
        <thead>
          <DataTableHeaderRow />
        </thead>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableHeaderRow: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableNumericColumnSkeleton', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <DataTableNumericColumnSkeleton />
          </tr>
        </tbody>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableNumericColumnSkeleton face', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <DataTableNumericColumnSkeleton />
          </tr>
        </tbody>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableNumericColumnSkeleton: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTableRow', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <DataTableRow />
        </tbody>
      </table>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DataTableRow face', () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <DataTableRow />
        </tbody>
      </table>,
      {
        ds: {
          theme: createTestTheme({
            DataTableRow: {
              color: 'black',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
