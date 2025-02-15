'use client';

import { AppSidebar } from "@/app/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';


// const findNavigationItem = (
//   path: string,
//   items: Navigation[] | undefined
// ): Navigation | null => {
//   if (!items) return null;

//   for (const item of items) {
//     if (item.href === path) return item;
//     if (item.children) {
//       const found = findNavigationItem(path, item.children);
//       if (found) return found;
//     }
//   }
//   return null;
// };

// const generateBreadcrumbs = (
//   path: string,
//   items: Navigation[]
// ): Navigation[] => {
//   const parts = path.split('/').filter(Boolean);
//   const breadcrumbs: Navigation[] = [];

//   let currentPath = '';

//   for (const part of parts) {
//     currentPath += `/${part}`;
//     const item = findNavigationItem(currentPath, items);
//     if (item) breadcrumbs.push(item);
//   }

//   return breadcrumbs;
// };

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();
  // const breadcrumbs = generateBreadcrumbs(pathname, nav);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator />

                  {/* {breadcrumbs.map((item, index) => (
                    <React.Fragment key={item.href}>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{item.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.href}>
                            {item.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))} */}
                </BreadcrumbList>
              </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
