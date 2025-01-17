import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
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
import { Link, useLocation } from "react-router-dom";
import data from "@/sidebar.json"

const findTitleBasedOnPath = (currentPath: string) => {
  const findPageData: any = (items: any, path: string) => {
    for (const item of items) {
      if (item.url === `${path}`) return item;
      if (item.items) {
        const subItem = findPageData(item.items, path);
        if (subItem) return subItem;
      }
    }
    return null;
  };

  const pageData = findPageData(data.tree, currentPath);

  return pageData?.title;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                {pathnames.map((value, index) => {
                  const title = findTitleBasedOnPath(value)
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathnames.length - 1;
                  return (
                    <React.Fragment key={to}>
                      {isLast ? (
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbPage>{title}</BreadcrumbPage>
                        </BreadcrumbItem >
                      ) : (
                        <>
                          <BreadcrumbItem className={isLast ? '' : 'hidden md:block'}>
                            <Link to={to}>
                              {title}
                            </Link>
                          </BreadcrumbItem>
                          {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>

          </div>
        </header>

        <div className="p-2 ml-12">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

