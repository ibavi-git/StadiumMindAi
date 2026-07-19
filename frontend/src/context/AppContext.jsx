import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  selectedRole: null,       // 'volunteer' | 'organizer'
  selectedLanguage: 'English',
  volunteerId: null,        // selected volunteer's ID
  volunteerName: null,
  volunteerZone: null,
  activeZone: null,
  isLoading: false,
  notifications: [],        // [{id, type, message, timestamp}]
};

const AppContext = createContext(initialState);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, selectedRole: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, selectedLanguage: action.payload };
    case 'SET_VOLUNTEER':
      return { 
        ...state, 
        volunteerId: action.payload.id,
        volunteerName: action.payload.name,
        volunteerZone: action.payload.zone
      };
    case 'SET_ACTIVE_ZONE':
      return { ...state, activeZone: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, { ...action.payload, id: Date.now(), timestamp: new Date().toISOString() }] 
      };
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
