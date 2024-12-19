// redux/form.js
const ADD_FORM = 'ADD_FORM';
const SET_FORM_ERRORS = 'SET_FORM_ERRORS';

// Action Creators
const addForm = (form) => ({
  type: ADD_FORM,
  form,
});

const setFormErrors = (errors) => ({
  type: SET_FORM_ERRORS,
  errors,
});


const SET_USER_FORMS = 'SET_USER_FORMS';

// Action Creators
const setUserForms = (forms) => ({
  type: SET_USER_FORMS,
  forms,
});




// Thunk Action Creator for fetching user forms
export const fetchUserForms = () => async (dispatch) => {
    try {
      const response = await fetch('/api/forms/current', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include any authentication tokens if necessary
        },
      });
  
      if (response.ok) {
        const forms = await response.json();
        dispatch(setUserForms(forms)); // Dispatch the action to set user forms
      } else {
        const errorData = await response.json();
        dispatch(setFormErrors(errorData)); // Handle errors appropriately
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
    dispatch(addForm(newForm));
    return null; // No errors
  } else {
    const errorData = await response.json();
    dispatch(setFormErrors(errorData));
    return errorData; // Return server errors
  }
};

// Initial State
const initialState = {
    forms: [],
    userForms: [], // Add this line to store user forms
    errors: {},
  };
  
  // Reducer
  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_FORM:
        return {
          ...state,
          forms: [...state.forms, action.form],
          errors: {}, // Clear errors on successful form creation
        };
      case SET_USER_FORMS: // Handle the new action type
        return {
          ...state,
          userForms: action.forms, // Store the fetched user forms
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