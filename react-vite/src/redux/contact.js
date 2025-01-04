const CREATE_CONTACT = "contact/createContact";
const GET_ALL_CONTACTS = "contact/getAllContacts";
// const GET_CONTACT_BY_ID = "contact/getContactById";
const UPDATE_CONTACT = "contact/updateContact";
const DELETE_CONTACT = "contact/deleteContact";

const createContactAction = (contact) => ({
  type: CREATE_CONTACT,
  payload: contact,
});

const getAllContactsAction = (contacts) => ({
  type: GET_ALL_CONTACTS,
  payload: contacts,
});

// const getContactByIdAction = (contact) => ({
//   type: GET_CONTACT_BY_ID,
//   payload: contact,
// });

const updateContactAction = (contact) => ({
  type: UPDATE_CONTACT,
  payload: contact,
});

const deleteContactAction = (contactId) => ({
  type: DELETE_CONTACT,
  payload: contactId,
});



const initialState = {
  contacts: [],
  currentContact: null,
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
      };
    case GET_ALL_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };
    // case GET_CONTACT_BY_ID:
    //   return {
    //     ...state,
    //     currentContact: action.payload,
    //   };
    case UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map((contact) => (contact.id === action.payload.id ? action.payload : contact)),
      };
    case DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact.id !== action.payload),
      };
    default:
      return state;
  }
};



export const createContactThunk = (contactData) => async (dispatch) => {
  try {
    const response = await fetch("/api/contacts/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });

    if (response.ok) {
      const newContact = await response.json();
      dispatch(createContactAction(newContact));
    } else {
      const errorData = await response.json();
      console.error("Error creating contact:", errorData.errors);
      return errorData;
    }
  } catch (error) {
    console.error("Error creating contact:", error);
  }
};

export const getAllContactsThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/contacts/session");

    if (response.ok) {
      const contacts = await response.json();
      dispatch(getAllContactsAction(contacts));
    } else {
      console.error("Error fetching contacts");
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
};

// export const getContactByIdThunk = (contactId) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/contacts/${contactId}`);

//     if (response.ok) {
//       const contact = await response.json();
//       dispatch(getContactByIdAction(contact));
//     } else {
//       console.error(`Error fetching contact with ID: ${contactId}`);
//     }
//   } catch (error) {
//     console.error("Error fetching contact by ID:", error);
//   }
// };

export const updateContactThunk = (contactId, updatedData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedContact = await response.json();
      dispatch(updateContactAction(updatedContact));
    } else {
      console.error(`Error updating contact with ID: ${contactId}`);
    }
  } catch (error) {
    console.error("Error updating contact:", error);
  }
};

export const deleteContactThunk = (contactId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteContactAction(contactId));
    } else {
      console.error(`Error deleting contact with ID: ${contactId}`);
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
};


export default contactReducer;


