import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  BookOpenIcon,
  WrenchIcon,
  ChevronUpDownIcon
} from "@heroicons/react/24/solid"

type Navigation = {
  name: string;
  href?: string;
  icon: React.ElementType;
  current?: boolean;
  children?: Navigation[];
};

const data: { navMain: Navigation[] } = {
  navMain: [
    {
      name: "Tools",
      href: "#",
      icon: WrenchIcon,
      children: [
        {
          name: "Speed run",
          href: "/dashboard/tools/speed-run",
          icon: WrenchIcon,
        },
      ],
    },
    {
      name: "Menu",
      href: "/menu",
      icon: BookOpenIcon,
    },
    {
      name: "Recipes",
      href: "#",
      icon: BookOpenIcon,
      children: [
        {
          name: "Espresso",
          href: "/recipes/espresso",
          icon: () => <span>☕</span>,
        },
        {
          name: "Cortado",
          href: "/recipes/cortado",
          icon: () => <span>☕</span>,
        },
        {
          name: "Latte",
          href: "/recipes/latte",
          icon: () => <span>☕</span>,
        },
      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentPath, setCurrentPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const renderMenuButton = (item: Navigation) => {
    const content = (
      <>
        {item.icon && <item.icon className="mr-2 h-5 w-5" />}
        {item.name}
      </>
    );

    if (item.href) {
      return (
        <a href={item.href} className="flex items-center font-medium">
          {content}
        </a>
      );
    } else {
      return (
        <span className="flex items-center font-medium cursor-default">
          {content}
        </span>
      );
    }
  };

  const renderSubMenuButton = (subItem: Navigation) => {
    const content = (
      <>
        {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
        {subItem.name}
      </>
    );

    if (subItem.href) {
      return (
        <a href={subItem.href} className="flex items-center">
          {content}
        </a>
      );
    } else {
      return (
        <span className="flex items-center cursor-default">
          {content}
        </span>
      );
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Documentation</span>
                  </div>
                  <ChevronUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  {renderMenuButton(item)}
                </SidebarMenuButton>
                {item.children?.length ? (
                  <SidebarMenuSub>
                    {item.children.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.name}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={currentPath === subItem.href}
                        >
                          {renderSubMenuButton(subItem)}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export const navMain = data.navMain;
export type { Navigation };