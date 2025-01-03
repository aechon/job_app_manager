// src/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import FormModal from '../components/FormModal/FormModal'; 
import EventCalendar from '../components/EventCalendar';
import Layout from './Layout';
import UserForms from '../components/FormModal/UserForms';
import FormsList from '../components/FormModal/FormList';
import JobForm from '../components/FormModal/JobForm';
import Contacts from '../components/Contacts/Contact-component'
import JobDetails from '../components/JobDetails/JobDetails'; 

//imports for testing
import OpenModalMenuItem from "../components/Navigation/OpenModalMenuItem";
import { NewEventModal, EditEventModal, EventDetailModal } from '../components/EventModal';
let jobId = 1;
let eventId = 26;
let contacts = [{name: 'test', id: 1} , {name: 'test2', id: 2}, {name: 'test3', id: 4}];
// delete all these later


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      // Deprecated since we're using the modal versions instead
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "form", 
        element: <FormModal />,
      },
      {
        path: "user-forms",
        element: <UserForms />,
      },
      {
        path: "jobs/:jobId", 
        element: <JobDetails />,
      },
      {
        path: "forms-list", 
        element: <FormsList />,
      },
      {
        path: "jobs/:jobId/forms", 
        element: <JobForm />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },

      // route for testing <------ REMOVE LATER
      {
        path: "calendar",
        element: <EventCalendar />,
      },
      {
        path: "test",
        element: 
        <div>
          <h1>Test Page</h1>
          <OpenModalMenuItem
                    itemText="Add Interview"
                    // onItemClick={closeModal}
                    modalComponent={<NewEventModal jobId={jobId} contacts={contacts} />}
                    className="new-event-button" 
                  />
          <OpenModalMenuItem
                    itemText="Edit Interview"
                    // onItemClick={closeModal}
                    modalComponent={<EditEventModal 
                      eventId={eventId} 
                      jobId={jobId} 
                      contacts={contacts} />}
                    className="new-event-button" 
                  />
            <OpenModalMenuItem
                    itemText="Event Details"
                    // onItemClick={closeModal}
                    modalComponent={<EventDetailModal 
                      eventId={eventId} />}
                    className="new-event-button" 
                  />
        </div>,
      },
    ],
  },
]);