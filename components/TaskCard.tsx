// components/TaskCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Task } from "@/lib/types"

export function TaskCard({ time, title, imageUrl, description, color = "blue" }: Task) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
    purple: "bg-purple-500",
  }

  return (
    <Card className="mb-3 shadow-md border-none bg-background">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Badge className={`${colorMap[color]} text-white px-2 py-1 rounded-md text-xs`}>
            {time}
          </Badge>
        </div>

        <div className="font-semibold text-sm">{title}</div>

        {imageUrl && (
          <div className="w-full h-32 relative rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        )}

        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  )
}
