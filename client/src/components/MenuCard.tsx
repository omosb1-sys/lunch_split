import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface MenuCardProps {
  icon: LucideIcon;
  name: string;
  voteCount?: number;
  votePercentage?: number;
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function MenuCard({
  icon: Icon,
  name,
  voteCount,
  votePercentage,
  selected = false,
  onClick,
  children,
}: MenuCardProps) {
  return (
    <Card
      className={`relative min-h-[200px] p-6 flex flex-col items-center justify-between transition-all hover-elevate active-elevate-2 cursor-pointer ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onClick}
      data-testid={`card-menu-${name}`}
    >
      {voteCount !== undefined && voteCount > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 px-2.5 py-1 text-sm font-medium"
          data-testid={`badge-vote-count-${name}`}
        >
          {voteCount}표
        </Badge>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
          <Icon className="w-12 h-12 text-primary" />
        </div>

        <h3 className="text-lg font-medium text-center" data-testid={`text-menu-name-${name}`}>
          {name}
        </h3>
      </div>

      {votePercentage !== undefined && (
        <div className="w-full mt-4">
          <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${votePercentage}%` }}
              data-testid={`progress-vote-${name}`}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2" data-testid={`text-percentage-${name}`}>
            {votePercentage.toFixed(0)}%
          </p>
        </div>
      )}

      {children && <div className="w-full mt-4">{children}</div>}
    </Card>
  );
}
