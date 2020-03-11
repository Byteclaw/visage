import { Divider, List, ListItem, ListItemLink } from '@byteclaw/visage';
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
    <List styles={{ fontSize: -1 }} role="navigation">
      <ListItem styles={{ fontWeight: 600 }}>
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
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/styles/*" title="Styles">
          <ListItem>
            <ListItemRouteLink to="/styles">Introduction</ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/styles/emotion-style-generator">
              Emotion style generator
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/styles/emotion-responsive-style-generator">
              Emotion responsive style generator
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/styles/custom-style-generators">
              Custom style generators
            </ListItemRouteLink>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/themes/*" title="Themes">
          <ListItem>
            <ListItemRouteLink to="/themes">Introduction</ListItemRouteLink>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/components/*" title="Components">
          <ListItem>
            <ListItemRouteLink to="/components/design-system">
              DesignSystem
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/components/responsive-design-system">
              ResponsiveDesignSystem
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/components/layer-manager">
              LayerManager
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <ListItemRouteLink to="/components/toast-manager">
              ToastManager
            </ListItemRouteLink>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/actions/*"
              title="Actions"
            >
              <ListItem>
                <ListItemRouteLink to="/components/actions/close-button">
                  CloseButton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/actions/button">
                  Button
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/actions/menu">
                  Menu
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/data-and-information/*"
              title="Data and Information"
            >
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
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
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
              path="/components/forms/*"
              title="Forms"
            >
              <ListItem>
                <ListItemRouteLink to="/components/forms/autocomplete-input">
                  AutocompleteInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/checkbox">
                  Checkbox
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/chip">
                  Chip
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/field-set">
                  FieldSet
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/file-input">
                  FileInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/form-field">
                  FormField
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/inline-error">
                  InlineError
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/label">
                  Label
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/radio">
                  Radio
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/select">
                  Select
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/slider">
                  Slider
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/textarea">
                  TextArea
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/text-input">
                  TextInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/forms/toggle">
                  Toggle
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/images-icons/*"
              title="Images and icons"
            >
              <ListItem>
                <ListItemRouteLink to="/components/images-icons/badge">
                  Badge
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/images-icons/image">
                  Image
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/images-icons/svg-icon">
                  SvgIcon
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/layout/*"
              title="Layout"
            >
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
                <ListItemRouteLink to="/components/layout/flex">
                  Flex
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/misc/*"
              title="Misc"
            >
              <ListItem>
                <ListItemRouteLink to="/components/misc/divider">
                  Divider
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/navigation/*"
              title="Navigation"
            >
              <ListItem>
                <ListItemRouteLink to="/components/navigation/link">
                  Link
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/navigation/list">
                  List
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
              path="/components/responsive-utils/*"
              title="Responsive utilities"
            >
              <ListItem>
                <ListItemRouteLink to="/components/responsive-utils/is-breakpoint">
                  IsBreakpoint
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/structure/*"
              title="Structure"
            >
              <ListItem>
                <ListItemRouteLink to="/components/structure/accordion">
                  Accordion
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/structure/card">
                  Card
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
          <ListItem>
            <CollapsibleNavigationSection
              path="/components/typography/*"
              title="Typography"
            >
              <ListItem>
                <ListItemRouteLink to="/components/typography/heading">
                  Heading
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/typography/heading-skeleton">
                  HeadingSkeleton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/typography/paragraph">
                  Paragraph
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/typography/paragraph-skeleton">
                  ParagraphSkeleton
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/typography/skeleton-sentence">
                  SkeletonSentence
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/typography/text">
                  Text
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/typography/text-skeleton">
                  TextSkeleton
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleNavigationSection>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem>
        <CollapsibleNavigationSection path="/hooks/*" title="Hooks">
          <ListItem>
            <ListItemRouteLink to="/hooks/use-layer-manager">
              useLayerManager
            </ListItemRouteLink>
          </ListItem>
        </CollapsibleNavigationSection>
      </ListItem>
      <ListItem styles={{ fontWeight: 600 }}>
        <ListItemRouteLink to="/utilities">Utilities</ListItemRouteLink>
      </ListItem>
      <Divider styles={{ color: 'neutral' }} />
      <ListItem styles={{ fontWeight: 600 }}>
        <ListItemLink href="https://github.com/byteclaw/visage">
          Github
        </ListItemLink>
      </ListItem>
    </List>
  );
}
