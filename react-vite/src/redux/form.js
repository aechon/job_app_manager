const ADD_FORM = 'ADD_FORM';
const SET_FORM_ERRORS = 'SET_FORM_ERRORS';
const SET_USER_FORMS = 'SET_USER_FORMS';

// Action Creators
const addForm = (form) => ({
  type: ADD_FORM,
  form,
});

const setFormErrors = (errors) => ({
  type: SET_FORM_ERRORS,
  errors,
});

const setUserForms = (forms) => ({
  type: SET_USER_FORMS,
  forms,
});

// Thunk Action Creator for fetching user forms
export const fetchUserForms = () => async (dispatch) => {
  try {
    const response = await fetch('/api/forms/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any authentication tokens if necessary
      },
    });

    if (response.ok) {
      const forms = await response.json();
      dispatch(setUserForms(forms));
    } else {
      const errorData = await response.json();
      dispatch(setFormErrors(errorData)); 
    }
  } catch (error) {
    console.error('Error fetching user forms:', error);
    dispatch(setFormErrors({ server: 'An unexpected error occurred.' }));
  }
};

// Thunk Action Creator for creating a form
export const createForm = (formData) => async (dispatch) => {
  const response = await fetch('/api/forms/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const newForm = await response.json();
    dispatch(addForm(newForm)); // Add the new form to the state
    dispatch(fetchUserForms()); // Fetch updated user forms to ensure the list is current
    return null; // No errors
  } else {
    const errorData = await response.json();
    dispatch(setFormErrors(errorData));
    return errorData; 
  }
};

// Initial State
const initialState = {
  forms: [],
  userForms: [], 
  errors: {},
};

// Reducer
const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FORM:
      return {
        ...state,
        forms: [...state.forms, action.form],
        errors: {}, 
      };
    case SET_USER_FORMS: 
      return {
        ...state,
        userForms: action.forms,
      };
    case SET_FORM_ERRORS:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default formReducer;