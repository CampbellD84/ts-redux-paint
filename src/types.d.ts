export type RootState = {
  currentStroke: Stroke
  strokes: Stroke[]
  historyIndex: number
}
export type Stroke = {
  points: Point[]
  color: string
}

export type Point = {
  x: number
  y: number
}

export type Project = {
  image: string
  name: string
  id: string
}