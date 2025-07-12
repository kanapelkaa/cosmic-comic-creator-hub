
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TopUsersCardProps {
  topUsers: Array<{ userId: string; count: number }>;
}

const TopUsersCard = ({ topUsers }: TopUsersCardProps) => {
  const { user } = useAuth();

  const getUserName = (userId: string) => {
    // In a real app, you'd fetch user details by ID
    // For now, we'll show the userId or a placeholder
    return userId === user?.id ? user.username : `User ${userId.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Топ 5 авторов
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Пока нет опубликованных комиксов от пользователей.
          </p>
        ) : (
          <div className="space-y-3">
            {topUsers.map((userStat, index) => (
              <div key={userStat.userId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{getUserName(userStat.userId)}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {userStat.count} комикс{userStat.count === 1 ? '' : userStat.count < 5 ? 'а' : 'ов'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopUsersCard;
