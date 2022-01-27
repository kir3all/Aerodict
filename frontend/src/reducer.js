import { combineReducers } from "redux";
import aerodict from "./reducers/aerodict";

const createRootReducer = () =>
    combineReducers({
        aerodict,
    });

export default createRootReducer;