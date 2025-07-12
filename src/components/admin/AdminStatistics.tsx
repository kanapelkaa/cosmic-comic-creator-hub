
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Check, Clock } from "lucide-react";
import { Comic } from "@/hooks/useComics";
import TopUsersCard from "./TopUsersCard";

interface AdminStatisticsProps {
  visitorCount: number;
  publishedComics: Comic[];
  pendingComics: Comic[];
  topUsers: Array<{ userId: string; count: number }>;
}

const AdminStatistics = ({ visitorCount, publishedComics, pendingComics, topUsers }: AdminStatisticsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Количество просмотров</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorCount}</div>
            <p className="text-xs text-muted-foreground">Посещение сайта</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Опубликованные</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedComics.length}</div>
            <p className="text-xs text-muted-foreground">Активные комиксы</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На модерации</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComics.length}</div>
            <p className="text-xs text-muted-foreground">Ожидают проверки</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего страниц</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publishedComics.reduce((total, comic) => total + comic.images.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Страницы комиксов</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Users Section */}
      <TopUsersCard topUsers={topUsers} />
    </div>
  );
};

export default AdminStatistics;
