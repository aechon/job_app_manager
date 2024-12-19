const SET_NAME = "contact/setname"
const SET_EMAIL = "contact/setemail"
const SET_PHONE = "contact/setphone"
const SET_COMPANY = "contact/setcompany"
const REMOVE_CONTACT = "contact/removeContact"


const setName = (name) =>(
    {
        type: SET_NAME,
        payload: name
    }
)

const setEmail = (email) =>(
    {
        type: SET_EMAIL,
        payload: email
    }
)
  
const setPhone = (phone) =>(
    {
        type: SET_PHONE,
        payload: phone
    }
)

const setCompnay = (company) =>(
    {
        type: SET_COMPANY,
        payload: company
    }
)

const removeContact = () =>({
    type: REMOVE_CONTACT
})