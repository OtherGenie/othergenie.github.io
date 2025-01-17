import * as React from "react"
import { Link } from "react-router-dom"
import {
  BookOpen,
  ChevronRight,
  HomeIcon,
  LucideIcon,
  Settings,
} from "lucide-react"
import data from "@/sidebar.json"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type IconName = keyof typeof iconMap;

type Item = {
  title: string;
  url: string;
  icon?: IconName;
  path?: string; // 000_<url>.json
  items?: Item[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tree.map((item, index) => (
                <TreeItem key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

    </Sidebar>
  )
}

type IconMap = {
  [key: string]: LucideIcon;
}

const iconMap: IconMap = {
  "book-open": BookOpen,
  "settings": Settings,
  "home": HomeIcon,
}

export function TreeItem({ item, parentUrl = '' }: { item: Item, parentUrl?: string }) {
  const hasSubItems = item.items && item.items.length > 0;
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  React.useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [item.title]);

  const IconComponent = item.icon ? iconMap[item.icon] : null;
  const itemUrl = item.url !== "" ? `${parentUrl}/${item.url}` : parentUrl;

  const renderButtonContent = () => (
    <>
      {IconComponent && <IconComponent />}
      <span ref={textRef} className="truncate">{item.title}</span>
    </>
  );

  if (!hasSubItems) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={itemUrl}>
              <SidebarMenuButton>
                {renderButtonContent()}
              </SidebarMenuButton>
            </Link>
          </TooltipTrigger>

          {isTruncated && (
            <TooltipContent side="right">
              {item.title}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
        defaultOpen={false}
      >
        <TooltipProvider>
          <Tooltip>
            <CollapsibleTrigger asChild>
              <TooltipTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {renderButtonContent()}
                  <ChevronRight className="ml-auto transition-transform" />
                </SidebarMenuButton>
              </TooltipTrigger>
            </CollapsibleTrigger>

            {isTruncated && (
              <TooltipContent side="right">
                {item.title}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <CollapsibleContent>
          <SidebarMenuSub className="pr-0 mr-0 my-1">
            {item.items?.map((subItem, index) => (
              <TreeItem key={index} item={subItem} parentUrl={itemUrl} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
