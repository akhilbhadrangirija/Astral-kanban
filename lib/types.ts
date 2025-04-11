export type TaskColor = "blue" | "green" | "purple" | "red" | "yellow";
export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
}

export interface EventsByDate {
  [date: string]: Event[];
}

export type Task = {
  id: string
  title: string
  description: string
  imageUrl: string
  time: string
  color?: TaskColor
}
