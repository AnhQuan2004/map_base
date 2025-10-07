import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserPopupProps {
  user: User;
  onClose: () => void;
}

export const UserPopup = ({ user, onClose }: UserPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          &times;
        </button>
        <div className="flex items-center gap-4 mb-4">
          <img src={user.image_url} alt={user.display_name} className="w-20 h-20 rounded-full border-2 border-primary" />
          <div>
            <h2 className="text-2xl font-bold">{user.display_name}</h2>
            <p className="text-muted-foreground">@{user.name}</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{user.bio}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{user.builder_score.points}</p>
            <p className="text-sm text-muted-foreground">Builder Score</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {user.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="flex gap-4">
          <Button className="flex-1">View Profile</Button>
          <Button variant="outline" className="flex-1">Message</Button>
        </div>
      </div>
    </div>
  );
};
