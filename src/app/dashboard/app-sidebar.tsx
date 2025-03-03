import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { Input } from "@/components/ui/input"

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

import drinksData from '@/data/drinks.json'

const recipesNavigation: Navigation = {
  name: "Recipes",
  href: "#",
  icon: BookOpenIcon,
  children: drinksData.reduce<Navigation[]>((acc, drink) => {
    acc.push({
      name: drink.name,
      href: `/recipes/${drink.key}`,
      icon: () => <span>{drink.icon}</span>,
    });
    return acc;
  }, [])
};

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
    recipesNavigation,
  ],
};

function fuzzyMatch(str: string, pattern: string): boolean {
  const strLower = str.toLowerCase();
  const patternLower = pattern.toLowerCase();
  let j = 0;
  for (let i = 0; i < strLower.length && j < patternLower.length; i++) {
    if (strLower[i] === patternLower[j]) {
      j++;
    }
  }
  return j === patternLower.length;
}


// Add this function for edit distance calculation
function editDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  return dp[m][n];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentPath, setCurrentPath] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredNavigation, setFilteredNavigation] = React.useState(data.navMain);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const renderMenuButton = (item: Navigation) => {
    const content = (
      <>
        {item.icon && <item.icon className="mr-2 h-8 w-5 my-2 flex-shrink-0" />}
        <span className="flex-grow">{item.name}</span>
      </>
    );

    if (item.href) {
      return (
        <a href={item.href} className="my-2 flex items-center font-medium">
          {content}
        </a>
      );
    } else {
      return (
        <span className="my-2 flex items-center font-medium cursor-default">
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


  React.useEffect(() => {
    if (searchTerm) {
      const filtered = data.navMain.map(item => {
        const newItem = { ...item };
        if (newItem.children) {
          newItem.children = newItem.children.filter(child =>
            fuzzyMatch(child.name, searchTerm) || editDistance(child.name, searchTerm) <= 3
          );
        }
        return newItem;
      }).filter(item => 
        fuzzyMatch(item.name, searchTerm) || 
        editDistance(item.name, searchTerm) <= 3 ||
        (item.children && item.children.length > 0)
      );
      setFilteredNavigation(filtered);
    } else {
      setFilteredNavigation(data.navMain);
    }
  }, [searchTerm]);


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </SidebarMenuItem>
          {/* ... (DropdownMenu remains the same) */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredNavigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild className="whitespace-normal py-2 leading-tight">
                  {renderMenuButton(item)}
                </SidebarMenuButton>

                {item.children?.length ? (
                  <SidebarMenuSub>
                    {item.children.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.name}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={currentPath === subItem.href}
                          className="whitespace-normal py-1 leading-tight"
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