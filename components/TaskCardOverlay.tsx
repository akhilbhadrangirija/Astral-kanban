import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { TaskCardProps } from '@/lib/types'

export function TaskCardOverlay({
  time,
  title,
  imageUrl,
  description,
  color = 'blue',
  onSelect
}: TaskCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }

  return (
    <>
      <div
        className={`mb-3 overflow-hidden rounded-lg shadow-md bg-white cursor-grab transition-opacity`}
        onClick={onSelect}>
        <div className="relative">
          <div className="w-full h-48 relative">
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={title}
              fill
              sizes="auto"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="absolute top-4 right-4">
            <div>
              <Badge
                className={`${colorMap[color]} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {time}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-gray-500 line-clamp-1">{description}</p>
        </div>
      </div>
    </>
  )
}
