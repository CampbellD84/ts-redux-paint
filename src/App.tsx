import { MouseEvent, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { beginStroke, updateStroke, endStroke } from './actions';
import { RootState } from "./types"
import { drawStroke, clearCanvas, setCanvasSize } from './canvasUtils';
import { ColorPanel } from './ColorPanel';
import { EditPanel } from "./EditPanel"

const WIDTH = 1024
const HEIGHT = 768

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useSelector<RootState>(
    (state) => !!state.currentStroke.points.length
  )
  const historyIndex = useSelector<RootState, RootState["historyIndex"]>(
    (state: RootState) => state.historyIndex
  )
  const strokes = useSelector<RootState, RootState["strokes"]>(
    (state: RootState) => state.strokes
  )
  const currentStroke = useSelector<RootState, RootState["currentStroke"]>(
    (state: RootState) => state.currentStroke
  )
  const getCanvasWithContext = (canvas = canvasRef.current) => {
    return { canvas, context: canvas?.getContext("2d") }
  }
  const dispatch = useDispatch()

  const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent
    dispatch(beginStroke(offsetX, offsetY))
  }

  useEffect(() => {
    const { context } = getCanvasWithContext()
    if (!context) {
      return
    }
    requestAnimationFrame(() =>
      drawStroke(context, currentStroke.points, currentStroke.color)
    )
  }, [currentStroke])

  const endDrawing = () => {
    if (isDrawing) {
      dispatch(endStroke())
    }
  }

  const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return
    }
    const { offsetX, offsetY } = nativeEvent

    dispatch(updateStroke(offsetX, offsetY))
  }

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext()
    if (!context || !canvas) {
      return
    }
    requestAnimationFrame(() => {
      clearCanvas(canvas)

      strokes.slice(0, strokes.length - historyIndex).forEach((stroke) => {
        drawStroke(context, stroke.points, stroke.color)
      })
    })
  })

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext()
    if (!canvas || !context) {
      return
    }

    setCanvasSize(canvas, WIDTH, HEIGHT)

    context.lineJoin = "round"
    context.lineCap = "round"
    context.lineWidth = 5
    context.strokeStyle = "black"

    clearCanvas(canvas)
  }, [])

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Redux Paint</div>
        <div className="title-bar-controls">
          <button aria-label="Close" />
        </div>
      </div>
      <EditPanel />
      <ColorPanel />
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  )
}

export default App;
