import { Users } from "lucide-react";
import { useUsers } from "@/hooks/use-users";

export const ActiveUsersCard = () => {
  const { data: apiResponse } = useUsers();
  const activeUsers = apiResponse?.connections.length || 0;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="bg-background/70 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold text-foreground">{activeUsers.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
