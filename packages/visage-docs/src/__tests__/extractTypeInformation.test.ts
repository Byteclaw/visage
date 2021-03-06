import { createProgram, VisitorContext } from '../extractTypeInformations';

const components = [
  'Accordion',
  'AccordionItem',
  'AutocompleteInput',
  'Badge',
  'Banner',
  'Blockquote',
  'Box',
  'Button',
  'Card',
  'Checkbox',
  'Chip',
  'Cite',
  'CloseButton',
  'CloseListenerManager',
  'Code',
  'DataTable',
  'DataTableBody',
  'DataTableColumn',
  'DataTableFooter',
  'DataTableFooterColumn',
  'DataTableFooterRow',
  'DataTableHeader',
  'DataTableHeaderColumn',
  'DataTableHeaderRow',
  'DataTableRow',
  'DescriptionList',
  'DescriptionListItem',
  'Dialog',
  'Divider',
  'Drawer',
  'FieldSet',
  'FileInput',
  'Flex',
  'FormField',
  'Grid',
  'Group',
  'Header',
  'Heading',
  'HeadingSkeleton',
  'IconButton',
  'Image',
  'InlineError',
  'KeyboardKey',
  'Label',
  'LayerManager',
  'Layout',
  'Link',
  'List',
  'ListItem',
  'Loading',
  'Loading',
  'Menu',
  'MenuItem',
  'Message',
  'Modal',
  'Pagination',
  'PaginationNextPageButton',
  'PaginationPreviousPageButton',
  'Paragraph',
  'ParagraphSkeleton',
  'Popper',
  'Popover',
  'Portal',
  'ProgressBar',
  'Quote',
  'Radio',
  'Select',
  'SkeletonSentence',
  'Slider',
  'SpinButton',
  'Spinner',
  'Subscript',
  'Superscript',
  'Svg',
  'SvgIcon',
  'Tab',
  'Tabs',
  'Text',
  'TextArea',
  'TextInput',
  'TextSkeleton',
  'Toast',
  'ToastManager',
  'Toggle',
  'Tooltip',
].sort();

jest.setTimeout(10 * 60 * 1000);

xdescribe('extracting type information', () => {
  let ctx: VisitorContext = {};

  beforeAll(() => {
    ctx = createProgram();
  });

  it.each(components)('extracts information from %s component', component => {
    expect(ctx[component]).toMatchSnapshot();
  });
});
