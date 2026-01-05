'use client';

import { useReducer, useEffect } from 'react';

import type { WorkspaceState, WorkspaceAction, Workspace } from './types';

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: true,
  error: null,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_WORKSPACES':
      return {
        ...state,
        workspaces: action.payload,
        currentWorkspace:
          action.payload.length === 1 ? (action.payload[0] as Workspace | null) : null,
        isLoading: false,
        error: null,
      };

    case 'SET_CURRENT_WORKSPACE':
      return {
        ...state,
        currentWorkspace: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'ADD_WORKSPACE':
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
        currentWorkspace: state.workspaces.length === 0 ? action.payload : state.currentWorkspace,
      };

    case 'UPDATE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.map((ws) =>
          ws.id === action.payload.id ? { ...ws, ...action.payload.updates } : ws,
        ),
        currentWorkspace:
          state.currentWorkspace?.id === action.payload.id
            ? { ...state.currentWorkspace, ...action.payload.updates }
            : state.currentWorkspace,
      };

    case 'REMOVE_WORKSPACE':
      const filteredWorkspaces = state.workspaces.filter((ws) => ws.id !== action.payload);
      return {
        ...state,
        workspaces: filteredWorkspaces,
        currentWorkspace:
          state.currentWorkspace?.id === action.payload
            ? filteredWorkspaces.length === 1
              ? (filteredWorkspaces[0] as Workspace | null)
              : null
            : state.currentWorkspace,
      };

    default:
      return state;
  }
}

// Имитация API для демонстрации
function mockWorkspaceApi(): Promise<Workspace[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Случайный выбор сценария для демонстрации
      const scenarios = [
        [], // Нет воркспейсов
        [
          {
            id: 'ws-1',
            name: 'Personal Workspace',
            description: 'My personal tasks and projects',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            members: [
              {
                id: 'member-1',
                userId: 'user-1',
                role: 'owner' as const,
                joinedAt: new Date().toISOString(),
              },
            ],
          },
        ],
        [
          {
            id: 'ws-1',
            name: 'Personal Workspace',
            description: 'My personal tasks and projects',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            members: [
              {
                id: 'member-1',
                userId: 'user-1',
                role: 'owner' as const,
                joinedAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: 'ws-2',
            name: 'Team Workspace',
            description: 'Collaborative projects with the team',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            members: [
              {
                id: 'member-1',
                userId: 'user-1',
                role: 'admin' as const,
                joinedAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: 'ws-3',
            name: 'Project X',
            description: 'Special project workspace',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            members: [
              {
                id: 'member-1',
                userId: 'user-1',
                role: 'member' as const,
                joinedAt: new Date().toISOString(),
              },
            ],
          },
        ],
      ];

      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)] ?? [];
      resolve(randomScenario);
    }, 1000); // Имитация задержки сети
  });
}

export function useWorkspaceState() {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const workspaces = await mockWorkspaceApi();
        dispatch({ type: 'SET_WORKSPACES', payload: workspaces });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load workspaces' });
      }
    };

    loadWorkspaces();
  }, []);

  const actions = {
    setCurrentWorkspace: (workspace: Workspace | null) =>
      dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace }),
    addWorkspace: (workspace: Workspace) => dispatch({ type: 'ADD_WORKSPACE', payload: workspace }),
    updateWorkspace: (id: string, updates: Partial<Workspace>) =>
      dispatch({ type: 'UPDATE_WORKSPACE', payload: { id, updates } }),
    removeWorkspace: (id: string) => dispatch({ type: 'REMOVE_WORKSPACE', payload: id }),
    refetch: () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      mockWorkspaceApi()
        .then((workspaces) => dispatch({ type: 'SET_WORKSPACES', payload: workspaces }))
        .catch(() => dispatch({ type: 'SET_ERROR', payload: 'Failed to load workspaces' }));
    },
  };

  return {
    ...state,
    ...actions,
  };
}
