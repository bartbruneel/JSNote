import { ActionType } from "../action-types";
import {
  Action,
  DeleteCellAction,
  InsertCellAfterAction,
  MoveCellAction,
  UpdateCellAction,
} from "../actions";
import { Cell } from "../cell";
import produce from "immer";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState["data"]);
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = null;
        return state;
      case ActionType.UPDATE_CELL:
        return updateCell(action, state);
      case ActionType.DELETE_CELL:
        return deleteCell(action, state);
      case ActionType.MOVE_CELL:
        return moveCell(action, state);
      case ActionType.INSERT_CELL_AFTER:
        return insertCellAfter(action, state);
      default:
        return state;
    }
  }
);

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

const moveCell = (action: MoveCellAction, state: CellsState) => {
  const { direction } = action.payload;
  const index = state.order.findIndex((id) => id === action.payload.id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex > state.order.length - 1) {
    return state;
  }
  state.order[index] = state.order[targetIndex];
  state.order[targetIndex] = action.payload.id;
  return state;
};

const deleteCell = (action: DeleteCellAction, state: CellsState) => {
  delete state.data[action.payload];
  state.order = state.order.filter((id) => id !== action.payload);
  return state;
};

const updateCell = (action: UpdateCellAction, state: CellsState) => {
  const { id, content } = action.payload;
  state.data[id].content = content;
  return state;
};

const insertCellAfter = (action: InsertCellAfterAction, state: CellsState) => {
  const cell: Cell = {
    content: "",
    type: action.payload.type,
    id: randomId(),
  };
  state.data[cell.id] = cell;
  const foundIndex = state.order.findIndex((id) => id === action.payload.id);
  if (foundIndex < 0) {
    state.order.unshift(cell.id);
  } else {
    state.order.splice(foundIndex + 1, 0, cell.id);
  }
  return state;
};

export default reducer;
