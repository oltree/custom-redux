const createStore = (reducer) => {
  let state = reducer(undefined, { type: '__INIT__' });
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
      nextState[key] = reducer(state ? state[key] : state, action);
    });

    return nextState;
  };
};

const rootReducer = combineReducers({
  countState: countReducer,
  userState: userReducer,
});

// const store = createStore(rootReducer);

// console.log(store.getState());

// store.subscribe(() => console.log('change'));

// store.dispatch({ type: 'DECREMENT', payload: 3 });
// store.dispatch(increment(5));
// store.dispatch({ type: 'SUCCESS', payload: { name: 'user' } });

// console.log(store.getState());

const thunk = (store) => (dispatch) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }

  return dispatch(action);
};

const applyMiddleware = (middleware) => {
  return (createStore) => {
    return (reducer) => {
      const store = createStore(reducer);

      return {
        dispatch: (action) => middleware(store)(store.dispatch)(action),
        getState: store.getState,
      };
    };
  };
};

const loadingInitialState = {
  isLoading: false,
};

const loadingReducer = (state = loadingInitialState, action) => {
  switch (action.type) {
    case 'STARTED':
      return {
        ...state,
        isLoading: true,
      };
    case 'SUCCESS':
      return {
        ...state,
        isLoading: false,
      };
    default: {
      return {
        ...state,
      };
    }
  }
};

const someAction = () => {
  return async (dispatch, getState) => {
    dispatch({ type: 'STARTED' });

    await new Promise((resolve) => setTimeout(() => resolve(), 3000));

    dispatch({ type: 'SUCCESS' });
  };
};

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const storeWithMiddleware = createStoreWithMiddleware(loadingReducer);

console.log(storeWithMiddleware.getState());

storeWithMiddleware.dispatch(someAction());

console.log(storeWithMiddleware.getState());

setTimeout(() => {
  console.log(storeWithMiddleware.getState());
}, 5000);
