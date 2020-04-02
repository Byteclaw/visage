import { List, ListItem, ListItemLink } from '@byteclaw/visage';
import { Link, Match } from '@reach/router';
import React, { ReactNode } from 'react';
import { CollapsibleNavigationSection } from './CollapsibleNavigationSection';

interface ListItemRouteLink {
  children: ReactNode;
  to: string;
}

function ListItemRouteLink({ to, ...restProps }: ListItemRouteLink) {
  return (
    <Match path={to}>
      {({ match }) => (
        <ListItemLink
          aria-current={match ? 'page' : undefined}
          active={!!match}
          as={Link}
          to={to}
          {...restProps}
        />
      )}
    </Match>
  );
}

export function Sidebar() {
  return (
    <List styles={{ fontSize: 0, fontFamily: 'heading' }} role="navigation">
      <ListItem styles={{ fontWeight: 700, fontSize: 0 }}>
        <ListItemRouteLink to="/">Introduction</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection
          path="/getting-started/*"
          title="Getting started"
        >
          <ListItem>
            <ListItemRouteLink to="/getting-started">
              Installation
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/getting-started/usage">
              Usage
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/getting-started/extending">
              Extending
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/getting-started/theming">
              Theming
            </ListItemRouteLink>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/components/*" title="Components">
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/layout/*"
              title="Layout"
            >
              <ListItem>
                <ListItemRouteLink to="/components/layout/accordion">
                  Accordion
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/layout/box">
                  Box
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/layout/box-skeleton">
                  BoxSkeleton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/layout/card">
                  Card
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/layout/flex">
                  Flex
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/data-and-information/*"
              title="Data and Information"
            >
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/badge">
                  Badge
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/data-table">
                  DataTable
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/description-list">
                  DescriptionList
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/divider">
                  Divider
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/heading">
                  Heading
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/heading-skeleton">
                  HeadingSkeleton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/image">
                  Image
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/list">
                  List
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/paragraph">
                  Paragraph
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/paragraph-skeleton">
                  ParagraphSkeleton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/skeleton-sentence">
                  SkeletonSentence
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/svg-icon">
                  SvgIcon
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/text">
                  Text
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/data-and-information/text-skeleton">
                  TextSkeleton
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/inputs/*"
              title="Inputs"
            >
              <ListItem>
                <ListItemRouteLink to="/components/inputs/autocomplete-input">
                  AutocompleteInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/button">
                  Button
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/close-button">
                  CloseButton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/checkbox">
                  Checkbox
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/chip">
                  Chip
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/field-set">
                  FieldSet
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/file-input">
                  FileInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/form-field">
                  FormField
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/inline-error">
                  InlineError
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/label">
                  Label
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/radio">
                  Radio
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/select">
                  Select
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/slider">
                  Slider
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/textarea">
                  TextArea
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/text-input">
                  TextInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/inputs/toggle">
                  Toggle
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/navigation/*"
              title="Navigation"
            >
              <ListItem>
                <ListItemRouteLink to="/components/navigation/link">
                  Link
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/navigation/menu">
                  Menu
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/navigation/pagination">
                  Pagination
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/navigation/tabs">
                  Tabs
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/feedback/*"
              title="Feedback"
            >
              <ListItem>
                <ListItemRouteLink to="/components/feedback/banner">
                  Banner
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/feedback/loading">
                  Loading
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/feedback/progress-bar">
                  ProgressBar
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/feedback/spinner">
                  Spinner
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/feedback/toast">
                  Toast
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/overlays/*"
              title="Overlays"
            >
              <ListItem>
                <ListItemRouteLink to="/components/overlays/dialog">
                  Dialog
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/overlays/drawer">
                  Drawer
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/overlays/modal">
                  Modal
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/overlays/popover">
                  Popover
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              openOnInit
              path="/components/core/*"
              title="Core"
            >
              <ListItem>
                <ListItemRouteLink to="/components/core/is-breakpoint">
                  IsBreakpoint
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/core/design-system">
                  DesignSystem
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/core/responsive-design-system">
                  ResponsiveDesignSystem
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/core/layer-manager">
                  LayerManager
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/core/toast-manager">
                  ToastManager
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/styles/*" title="Styles">
          <ListItem>
            <ListItemRouteLink to="/styles">Basics</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/styles/advanced">
              Advanced
            </ListItemRouteLink>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection
          path="/customization/*"
          title="Customization"
        >
          <ListItem>
            <ListItemRouteLink to="/customization">Theming</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/customization/components">
              Components
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/customization/default-themes">
              Default themes
            </ListItemRouteLink>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/system/*" title="System">
          <ListItem>
            <ListItemRouteLink to="/system">Basics</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/system/responsive-styles">
              Responsive styles
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/system/as-prop">As prop</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/system/spacing">Spacing</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/system/typography">
              Typography
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/system/layout">Layout</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/system/colors">Colors</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection path="/system/hooks/*" title="Hooks">
              <ListItem>
                <ListItemRouteLink to="/system/hooks/use-layer-manager">
                  useLayerManager
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem styles={{ fontWeight: 700, fontSize: 0 }}>
        <ListItemRouteLink to="/utilities">Utilities</ListItemRouteLink>
      </ListItem>
      <ListItem styles={{ fontWeight: 700, fontSize: 0 }}>
        <ListItemLink href="https://github.com/byteclaw/visage">
          Github
        </ListItemLink>
      </ListItem>
    </List>
  );
}
