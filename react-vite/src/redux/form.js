const ADD_FORM = 'ADD_FORM';
const SET_FORM_ERRORS = 'SET_FORM_ERRORS';
const SET_USER_FORMS = 'SET_USER_FORMS';
const DELETE_FORM = 'DELETE_FORM';
const UPDATE_FORM = 'UPDATE_FORM';

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

const deleteFormSuccess = (formId) => ({
  type: DELETE_FORM,
  formId,
});

const updateForm = (updatedForm) => ({
  type: UPDATE_FORM,
  updatedForm,
});

// Thunk Action Creators
export const fetchUserForms = () => async (dispatch) => {
  try {
    const response = await fetch('/api/forms/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    dispatch(fetchUserForms()); 
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setFormErrors(errorData));
    return errorData; 
  }
};

export const deleteForm = (formId) => async (dispatch) => {
  const response = await fetch(`/api/forms/${formId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteFormSuccess(formId)); 
  } else {
    const errorData = await response.json();
    console.error("Error deleting form:", errorData);

  }
};

export const editForm = (formData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/forms/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedForm = await response.json();
      dispatch(updateForm(updatedForm)); 
    } else {
      const errorData = await response.json();
      dispatch(setFormErrors(errorData));
    }
  } catch (error) {
    console.error('Error editing form:', error);
    dispatch(setFormErrors({ server: 'An unexpected error occurred.' }));
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
        userForms: [...state.userForms, action.form], 
        errors: {},
      };
    case SET_USER_FORMS:
      return {
        ...state,
        userForms: action.forms,
      };
    case DELETE_FORM:
      return {
        ...state,
        userForms: state.userForms.filter((form) => form.id !== action.formId),
      };
    case UPDATE_FORM:
      return {
        ...state,
        userForms: state.userForms.map((form) =>
          form.id === action.updatedForm.id ? action.updatedForm : form
        ),
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