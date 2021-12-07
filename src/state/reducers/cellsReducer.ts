import { ActionType } from "../action-types";
import {
  Action,
  DeleteCellAction,
  InsertCellBeforeAction,
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
      case ActionType.UPDATE_CELL:
        return updateCell(action, state);
      case ActionType.DELETE_CELL:
        return deleteCell(action, state);
      case ActionType.MOVE_CELL:
        return moveCell(action, state);
      case ActionType.INSERT_CELL_BEFORE:
        return insertCellBefore(action, state);
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

const insertCellBefore = (
  action: InsertCellBeforeAction,
  state: CellsState
) => {
  const cell: Cell = {
    content: "",
    type: action.payload.type,
    id: randomId(),
  };
  state.data[cell.id] = cell;
  const foundIndex = state.order.findIndex((id) => id === action.payload.id);
  if (foundIndex < 0) {
    state.order.push(cell.id);
  } else {
    state.order.splice(foundIndex, 0, cell.id);
  }
  return state;
};

export default reducer;
