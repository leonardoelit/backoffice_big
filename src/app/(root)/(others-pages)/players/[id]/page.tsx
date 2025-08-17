"use client";

import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTablePlayer from "@/components/tables/BasicTablePlayer";
import BasicTableFavPlayers from "@/components/tables/BasicTableFavPlayers";

export default function BasicTables() {
  const params = useParams();
  const id = params.id as string;

  const contentMap: Record<string, string> = {
    "without-invesment": "Players Without Investment",
    "all-players": "All Players",
    "fav-players": "Favorite Players",
    "GGA": "GGA"
  };

  const contentHeader = contentMap[id] || "Search Results";

  return (
    <div>
      <PageBreadcrumb pageTitle={contentHeader === "Players Without Investment" ? 'Yatırımsız Oyuncular' : contentHeader === 'All Players' ? 'Tüm Oyuncular' : contentHeader === 'Favorite Players' ? 'Favori Oyuncular' : contentHeader === 'GGA' ? 'GGA' : 'Arama Sonuçları' } />
      <div className="space-y-6">
          {contentHeader === 'Favorite Players' ? (
            <BasicTableFavPlayers />
          ) : (
            <BasicTablePlayer contentType={contentHeader === "Search Results" ? id : contentHeader} />
          )}
      </div>
    </div>
  );
}
