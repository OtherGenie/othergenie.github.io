import { useLocation, useParams } from "react-router-dom";
import data from "@/sidebar.json";

export function Insights() {
  const location = useLocation();
  const rootPath = location.pathname.split("/")[1];

  const { subpath, path } = useParams();

  const findPageData: any = (items: any, path: any) => {
    for (const item of items) {
      if (item.items) {
        const subItem = findPageData(item.items, path);
        if (subItem) return subItem;
      }

      if (item.url === path || item.url === subpath || item.url === rootPath) return item;
    }

    return null;
  };


  const pageData = findPageData(data.tree, path);

  if (!pageData) {
    return <h1>404 - Page Not Found</h1>;
  }

  return (
    <div>
      <h1>{pageData.title}</h1>
    </div>
  );
}
