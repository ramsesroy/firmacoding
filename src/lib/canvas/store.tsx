"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { SignatureState, SignatureRow, SignatureColumn, SignatureElement, ElementType, GlobalStyles } from '@/types/canvas';

// Initial Global Styles
const initialGlobalStyles: GlobalStyles = {
  fontFamily: 'Arial, sans-serif',
  fontSize: 16,
  themeColor: '#1e40af', // Blue-800 equivalent
  textColor: '#000000',
  backgroundColor: '#ffffff'
};

const defaultRows: SignatureRow[] = [
    {
      id: 'row-1',
      style: { paddingBottom: 10, paddingTop: 10 },
      columns: [
        {
          id: 'col-1-1',
          widthPercent: 30,
          verticalAlign: 'top',
          style: { paddingRight: 15 },
          elements: [
            {
              id: 'el-img-1',
              type: 'image',
              content: 'https://picsum.photos/100/100',
              style: { width: 100, borderRadius: 50 },
            }
          ]
        },
        {
          id: 'col-1-2',
          widthPercent: 70,
          verticalAlign: 'middle',
          style: {},
          elements: [
            {
              id: 'el-name',
              type: 'text',
              content: 'Jane Doe',
              style: { fontSize: 24, fontWeight: 'bold', color: '#111827', lineHeight: 1.2, paddingBottom: 4 }
            },
            {
              id: 'el-role',
              type: 'text',
              content: 'Senior Product Designer',
              style: { fontSize: 16, color: '#4B5563', lineHeight: 1.4, paddingBottom: 8 }
            },
            {
              id: 'el-link',
              type: 'text',
              content: '{{email}}',
              url: 'mailto:{{email}}',
              style: { fontSize: 14, color: '#2563EB' }
            }
          ]
        }
      ]
    }
];

// Helper to deep clone and regenerate IDs to avoid React key conflicts
const cloneWithNewIds = (obj: any): any => {
    const json = JSON.parse(JSON.stringify(obj));
    
    const updateIds = (item: any, prefix: string) => {
        if (item.id) {
            item.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        }
        if (item.columns) item.columns.forEach((c: any) => updateIds(c, 'col'));
        if (item.elements) item.elements.forEach((e: any) => updateIds(e, 'el'));
    };

    updateIds(json, json.columns ? 'row' : 'el');
    return json;
};

// Initial State logic with LocalStorage check
const getInitialState = (): SignatureState => {
  // Only access localStorage on client side
  if (typeof window === 'undefined') {
    return {
      selectedId: null,
      selectionType: null,
      globalStyles: initialGlobalStyles,
      rows: defaultRows,
      past: [],
      future: []
    };
  }

  try {
    const saved = localStorage.getItem('signature_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure structure integrity even if loaded from old storage
      return {
        ...parsed,
        past: [],
        future: []
      };
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }

  return {
    selectedId: null,
    selectionType: null,
    globalStyles: initialGlobalStyles,
    rows: defaultRows,
    past: [],
    future: []
  };
};

// Actions
type Action =
  | { type: 'SELECT_ITEM'; id: string | null; itemType: 'row' | 'column' | 'element' | null }
  | { type: 'ADD_ROW'; cols: number }
  | { type: 'ADD_ELEMENT'; columnId: string; elementType: ElementType }
  | { type: 'UPDATE_STYLE'; id: string; style: any }
  | { type: 'UPDATE_CONTENT'; id: string; content: string }
  | { type: 'UPDATE_SOCIAL_LINKS'; id: string; socialLinks: any[] }
  | { type: 'UPDATE_GLOBAL_STYLE'; styles: Partial<GlobalStyles> }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'LOAD_TEMPLATE'; rows: SignatureRow[] }
  | { type: 'UPDATE_COLUMN_WIDTH'; id: string; widthPercent: number }
  | { type: 'MOVE_ELEMENT'; dragId: string; targetId: string; targetType: 'element' | 'column' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'DUPLICATE_ITEM'; id: string; itemType: 'row' | 'element' }
  | { type: 'ADD_PREBUILT_ROW'; row: SignatureRow }
  | { type: 'RESET_CANVAS' };

// Helper to snapshot state for history
const getCurrentStateSnapshot = (state: SignatureState): Omit<SignatureState, 'past' | 'future'> => {
  return {
    rows: state.rows,
    globalStyles: state.globalStyles,
    selectedId: state.selectedId,
    selectionType: state.selectionType
  };
};

// Actions that should trigger a history save
const HISTORY_ACTIONS = [
  'ADD_ROW', 'ADD_ELEMENT', 'UPDATE_STYLE', 'UPDATE_CONTENT', 
  'UPDATE_SOCIAL_LINKS', 'UPDATE_GLOBAL_STYLE', 'DELETE_ITEM', 
  'LOAD_TEMPLATE', 'UPDATE_COLUMN_WIDTH', 'MOVE_ELEMENT', 'DUPLICATE_ITEM', 'ADD_PREBUILT_ROW', 'RESET_CANVAS'
];

// Reducer
const reducer = (state: SignatureState, action: Action): SignatureState => {
  
  // UNDO / REDO Logic
  if (action.type === 'UNDO') {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    return {
      ...previous,
      past: newPast,
      future: [getCurrentStateSnapshot(state), ...state.future]
    };
  }

  if (action.type === 'REDO') {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      ...next,
      past: [...state.past, getCurrentStateSnapshot(state)],
      future: newFuture
    };
  }

  // Handle History Saving
  let newState = state;
  if (HISTORY_ACTIONS.includes(action.type)) {
    newState = {
      ...state,
      past: [...state.past, getCurrentStateSnapshot(state)].slice(-20), // Limit history to 20 steps
      future: [] // Clear future on new action
    };
  }

  // Business Logic
  switch (action.type) {
    case 'SELECT_ITEM':
      return { ...state, selectedId: action.id, selectionType: action.itemType };

    case 'UPDATE_GLOBAL_STYLE':
      return { ...newState, globalStyles: { ...newState.globalStyles, ...action.styles } };

    case 'LOAD_TEMPLATE':
      return { ...newState, rows: action.rows, selectedId: null, selectionType: null };

    case 'ADD_ROW': {
      const newRowId = `row-${Date.now()}`;
      const newCols: SignatureColumn[] = Array(action.cols).fill(0).map((_, i) => ({
        id: `col-${newRowId}-${i}`,
        widthPercent: 100 / action.cols,
        verticalAlign: 'top',
        style: { paddingLeft: 10, paddingRight: 10 },
        elements: []
      }));
      
      return {
        ...newState,
        rows: [...newState.rows, { id: newRowId, columns: newCols, style: { paddingTop: 10, paddingBottom: 10 } }]
      };
    }

    case 'ADD_ELEMENT': {
      const newEl: SignatureElement = {
        id: `el-${Date.now()}`,
        type: action.elementType,
        content: action.elementType === 'image' ? 'https://picsum.photos/100/50' : 'New Content',
        socialLinks: action.elementType === 'social' ? [{network: 'linkedin', url: 'https://linkedin.com'}] : undefined,
        style: { fontSize: 14, color: '#000000', lineHeight: 1.4 }
      };

      const newRows = newState.rows.map(row => ({
        ...row,
        columns: row.columns.map(col => {
          if (col.id === action.columnId) {
            return { ...col, elements: [...col.elements, newEl] };
          }
          return col;
        })
      }));

      return { ...newState, rows: newRows, selectedId: newEl.id, selectionType: 'element' };
    }

    case 'UPDATE_STYLE': {
      // Deep search and update style
      const updateRows = newState.rows.map(row => {
        if (row.id === action.id) return { ...row, style: { ...row.style, ...action.style } };
        
        const updatedCols = row.columns.map(col => {
          if (col.id === action.id) return { ...col, style: { ...col.style, ...action.style } };
          
          const updatedEls = col.elements.map(el => {
            if (el.id === action.id) return { ...el, style: { ...el.style, ...action.style } };
            return el;
          });
          return { ...col, elements: updatedEls };
        });
        return { ...row, columns: updatedCols };
      });
      return { ...newState, rows: updateRows };
    }

    case 'UPDATE_CONTENT': {
      const updateRows = newState.rows.map(row => ({
        ...row,
        columns: row.columns.map(col => ({
          ...col,
          elements: col.elements.map(el => 
            el.id === action.id ? { ...el, content: action.content } : el
          )
        }))
      }));
      return { ...newState, rows: updateRows };
    }

    case 'UPDATE_SOCIAL_LINKS': {
      const updateRows = newState.rows.map(row => ({
        ...row,
        columns: row.columns.map(col => ({
          ...col,
          elements: col.elements.map(el => 
            el.id === action.id ? { ...el, socialLinks: action.socialLinks } : el
          )
        }))
      }));
      return { ...newState, rows: updateRows };
    }

    case 'UPDATE_COLUMN_WIDTH': {
        const updateRows = newState.rows.map(row => ({
          ...row,
          columns: row.columns.map(col => 
            col.id === action.id ? { ...col, widthPercent: action.widthPercent } : col
          )
        }));
        return { ...newState, rows: updateRows };
    }
    
    case 'MOVE_ELEMENT': {
        const { dragId, targetId, targetType } = action;
        if (dragId === targetId) return newState;

        let draggedElement: SignatureElement | null = null;
        const newRows = JSON.parse(JSON.stringify(newState.rows));

        for (let r = 0; r < newRows.length; r++) {
            for (let c = 0; c < newRows[r].columns.length; c++) {
                const els = newRows[r].columns[c].elements;
                const index = els.findIndex((e: SignatureElement) => e.id === dragId);
                if (index !== -1) {
                    draggedElement = els[index];
                    els.splice(index, 1);
                    break;
                }
            }
            if (draggedElement) break;
        }

        if (!draggedElement) return newState;

        if (targetType === 'column') {
             for (const row of newRows) {
                const col = row.columns.find((c: SignatureColumn) => c.id === targetId);
                if (col) {
                    col.elements.push(draggedElement);
                    break;
                }
            }
        } else if (targetType === 'element') {
            outerLoop: for (let r = 0; r < newRows.length; r++) {
                for (let c = 0; c < newRows[r].columns.length; c++) {
                    const els = newRows[r].columns[c].elements;
                    const index = els.findIndex((e: SignatureElement) => e.id === targetId);
                    if (index !== -1) {
                        els.splice(index, 0, draggedElement);
                        break outerLoop;
                    }
                }
            }
        }

        return { ...newState, rows: newRows, selectedId: dragId, selectionType: 'element' };
    }

    case 'DUPLICATE_ITEM': {
        if (action.itemType === 'row') {
            const rowIndex = newState.rows.findIndex(r => r.id === action.id);
            if (rowIndex === -1) return newState;
            
            const rowToClone = newState.rows[rowIndex];
            const newRow = cloneWithNewIds(rowToClone);
            
            const newRows = [...newState.rows];
            newRows.splice(rowIndex + 1, 0, newRow);
            
            return { ...newState, rows: newRows };
        }
        
        if (action.itemType === 'element') {
            const updateRows = newState.rows.map(row => ({
                ...row,
                columns: row.columns.map(col => {
                    const elIndex = col.elements.findIndex(e => e.id === action.id);
                    if (elIndex !== -1) {
                        const newEl = cloneWithNewIds(col.elements[elIndex]);
                        const newEls = [...col.elements];
                        newEls.splice(elIndex + 1, 0, newEl);
                        return { ...col, elements: newEls };
                    }
                    return col;
                })
            }));
            return { ...newState, rows: updateRows };
        }
        
        return newState;
    }

    case 'ADD_PREBUILT_ROW': {
        return {
            ...newState,
            rows: [...newState.rows, cloneWithNewIds(action.row)]
        };
    }

    case 'RESET_CANVAS': {
        return {
            ...newState,
            rows: [],
            selectedId: null,
            selectionType: null
        };
    }

    case 'DELETE_ITEM': {
      if (newState.selectionType === 'element') {
        return {
           ...newState,
           selectedId: null,
           selectionType: null,
           rows: newState.rows.map(row => ({
             ...row,
             columns: row.columns.map(col => ({
               ...col,
               elements: col.elements.filter(el => el.id !== action.id)
             }))
           }))
        };
      }
      if (newState.selectionType === 'row') {
        return {
          ...newState,
          selectedId: null,
          selectionType: null,
          rows: newState.rows.filter(row => row.id !== action.id)
        };
      }
      return newState;
    }

    default:
      return newState;
  }
};

// Context
const StoreContext = createContext<{ state: SignatureState; dispatch: React.Dispatch<Action> } | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  // Auto-Save Effect (only on client)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Debounce saving slightly to avoid thrashing storage
    const timer = setTimeout(() => {
        const stateToSave = getCurrentStateSnapshot(state);
        localStorage.setItem('signature_state', JSON.stringify(stateToSave));
    }, 500);
    return () => clearTimeout(timer);
  }, [state.rows, state.globalStyles]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
