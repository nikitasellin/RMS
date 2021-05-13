import {
  LOAD_DIRECTIONS,
  LOAD_EXECUTION_VARIANTS,
  LOAD_STATUSES,
  CLEAR_TASK_OPTIONS,
} from '../actions/types';

const directionsList = localStorage.getItem('directions');
const executionVariantsList = localStorage.getItem('executionVariants');
const statusList = localStorage.getItem('statusList');

const directions = directionsList 
? { directionsLoaded: true, directionsList } 
: { directionsLoaded: false, directions: null };

const executionVariants = executionVariantsList
? { executionVariantsLoaded: true, executionVariantsList } 
: { executionVariantsLoaded: false, executionVariants: null };

const statuses = statusList
? { statusesLoaded: true, statusList } 
: { statusesLoaded: false, statuses: null };

const initialState = { 
  'directions': directions,
  'executionVariants': executionVariants,
  'statuses': statuses,
 };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_DIRECTIONS:
      return {
        ...state,
        directionsLoaded: true,
        directions: payload.directions,
      };
    case LOAD_EXECUTION_VARIANTS:
      return {
        ...state,
        executionVariantsLoaded: true,
        executionVariants: payload.executionVariants,
      };  
    case LOAD_STATUSES:
      return {
        ...state,
        statusesLoaded: true,
        statuses: payload.statuses,
      };  
    case CLEAR_TASK_OPTIONS:
      return {
        ...state,
        directionsLoaded: false,
        directions: null,
        executionVariantsLaded: false,
        executionVariants: null,
        statusesLoaded: false,
        statuses: null,
      };
    default:
      return state;
  }
}
