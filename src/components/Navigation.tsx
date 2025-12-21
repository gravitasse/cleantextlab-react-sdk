import SideNavigation from '@cloudscape-design/components/side-navigation';
import type { SideNavigationProps } from '@cloudscape-design/components/side-navigation';
import { tools, getCategories } from '../config/tools';

interface NavigationProps {
  activeToolId: string | null;
  onToolChange: (toolId: string) => void;
}

/**
 * Navigation component that displays all tools organized by category
 * Automatically generates navigation from the tools configuration array
 */
export default function Navigation({ activeToolId, onToolChange }: NavigationProps) {
  const categories = getCategories();

  // Build navigation items organized by category
  const navigationItems: SideNavigationProps.Item[] = categories.map((category) => {
    const categoryTools = tools.filter((tool) => tool.category === category);

    return {
      type: 'section',
      text: category,
      items: categoryTools.map((tool) => ({
        type: 'link',
        text: tool.name,
        href: `#${tool.id}`,
        info: undefined,
      })),
    };
  });

  // Add header item
  const items: SideNavigationProps.Item[] = [
    {
      type: 'link',
      text: 'CleanTextLab POC',
      href: '#',
    },
    { type: 'divider' },
    ...navigationItems,
  ];

  return (
    <SideNavigation
      activeHref={activeToolId ? `#${activeToolId}` : '#'}
      items={items}
      onFollow={(event) => {
        event.preventDefault();
        const href = event.detail.href;
        
        if (href === '#') {
          onToolChange('');
          return;
        }

        // Extract tool ID from href (e.g., "#line-break-remover" -> "line-break-remover")
        const toolId = href.replace('#', '');
        onToolChange(toolId);
      }}
    />
  );
}
