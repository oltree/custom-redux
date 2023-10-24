const createStore = (reducer) => {
  let state = reducer({}, { type: '__INIT__' });
  let subscribers = [];

  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      subscribers.forEach((callback) => callback());
    },
    subscribe: (callback) => subscribers.push(callback),
  };
};

const countInitialState = {
  count: 0,
};

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const increment = (count) => ({
  type: INCREMENT,
  payload: count,
});
const decrement = (count) => ({
  type: DECREMENT,
  payload: count,
});

const countReducer = (state = countInitialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + action.payload,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - action.payload,
      };
    default: {
      return {
        ...state,
      };
    }
  }
};

const userInitialState = {
  users: [],
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'SUCCESS':
      return {
        ...state,
        users: action.payload,
      };
    default: {
      return {
        ...state,
      };
    }
  }
};

/* const reducer = (state, action) => {
  return {
    countState: countReducer(state.countState, action),
    userState: userReducer(state.userState, action),
  };
}; */

const combineReducers = (reducersMap) => {
  return (state, action) => {
    const nextState = {};

    Object.entries(reducersMap).forEach(([key, reducer]) => {
      nextState[key] = reducer(state[key], action);
    });

    return nextState;
  };
};

const rootReducer = combineReducers({
  countState: countReducer,
  userState: userReducer,
});

const store = createStore(rootReducer);

console.log(store.getState());

// store.subscribe(() => console.log('change'));

store.dispatch({ type: 'DECREMENT', payload: 3 });
store.dispatch(increment(5));
store.dispatch({ type: 'SUCCESS', payload: { name: 'user' } });

console.log(store.getState());
