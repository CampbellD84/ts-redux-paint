import { RootState } from "./types"
import { Action, BEGIN_STROKE, UPDATE_STROKE, END_STROKE, SET_STROKE_COLOR } from "./actions"

const initialState: RootState = {
  currentStroke: { points: [], color: "#000" },
  strokes: []
}

export const rootReducer = (
  state: RootState = initialState,
  action: Action
) => {
  switch (action.type) {
    case BEGIN_STROKE: {
      return {
        ...state,
        currentStroke: {
          ...state.currentStroke,
          points: [action.payload]
        }
      }
    }
    case UPDATE_STROKE: {
      return {
        ...state,
        currentStroke: {
          ...state.currentStroke,
          points: [...state.currentStroke.points, action.payload]
        }
      }
    }
    case SET_STROKE_COLOR: {
      return {
        ...state,
        currentStroke: {
          ...state.currentStroke,
          ...{ color: action.payload }
        }
      }
    }
    case END_STROKE: {
      if (!state.currentStroke.points.length) {
        return state
      }
      const newState = {
        ...state,
        historyIndex: 0,
        currentStroke: {
          ...state.currentStroke, points: []
        },
        strokes: [...state.strokes, state.currentStroke]
      }
      return newState
    }
    default:
      return state
  }
}