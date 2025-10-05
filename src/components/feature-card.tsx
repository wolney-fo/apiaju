import { Badge } from "./ui/badge";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  isComingSoon = false,
}: FeatureCardProps) {
  return (
    <div
      data-soon={isComingSoon}
      className="flex flex-col items-start justify-center gap-4 p-4 rounded-lg shadow-lg data-[soon=true]:opacity-70"
    >
      <div className="w-12 h-12 text-primary bg-primary-foreground rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">{title}</h3>{" "}
          {isComingSoon && (
            <Badge variant="outline" className="text-primary border-primary">
              Em breve
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
