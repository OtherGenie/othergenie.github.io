import { useLocation, useParams } from "react-router-dom";
import data from "@/sidebar.json";
import { useEffect, useState } from "react";

type InsightItem = {
  title: string;
  summary: string;
  questions: [{
    question: string;
    answer: string;
  }];
  video_id: string;
}

export function Insights() {
  const [pageData, setPageData] = useState<InsightItem>();
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

  useEffect(() => {
    const _pageData = findPageData(data.tree, path);

    const fetchJSON = async () => {
      // better than location.pathname
      const pageDataPath = ["content", rootPath, subpath, _pageData?.path].filter(Boolean).join("/")
      console.log(pageDataPath)
      const response = await fetch(pageDataPath);
      const data = await response.json();
      setPageData(data);
    }

    fetchJSON();
  }, [location.pathname]);

  if (!pageData) {
    return <h1>404 - Insights Page Not Found</h1>;
  }


  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl mb-2">{pageData?.title}</h1>
      <div className="text-lg mb-5">{pageData?.summary}</div>
      {
        pageData?.video_id && <iframe
          width="560" height="315"
          src={`https://www.youtube.com/embed/${pageData.video_id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
          className="mb-5">
        </iframe>
      }
      {
        pageData?.questions && <ol className="list-decimal pl-5">
          {
            pageData?.questions.map((q: any) => (
              <li key={q.question} className="mb-2">{q.question}</li>
            ))
          }
        </ol>
      }
    </div>
  );
}
