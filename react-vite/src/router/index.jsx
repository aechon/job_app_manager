import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import FormModal from '../components/FormModal/FormModal'; 
import EventCalendar from '../components/EventCalendar';
import Layout from './Layout';
import UserForms from '../components/FormModal/UserForms';
import FormsList from '../components/FormModal/FormList';
import JobForm from '../components/FormModal/JobForm';
import ContactListPage from '../components/ContactListPage';
import JobDetails from '../components/JobDetails/JobDetails'; 
import JobList from '../components/JobList/JobList'; 
import JobUserList from '../components/JobList/JobUserList'

// Imports for testing
import OpenModalMenuItem from "../components/Navigation/OpenModalMenuItem";
import { NewEventModal, EventDetailModal } from '../components/EventModal';
let jobId = 7;
let eventId = 25;
// delete all these later


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <JobList />, 
      },
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
        path: "user-jobs", 
        element: <JobUserList />, 
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
        element: <ContactListPage />,
      },
      {
        path: "calendar",
        element: <EventCalendar />,
      },
      
      // route for testing <------ REMOVE LATER     
      {
        path: "test",
        element: 
        <div>
          <h1>Test Page</h1>
          <OpenModalMenuItem
                    itemText="Add Interview"
                    // onItemClick={closeModal}
                    modalComponent={<NewEventModal jobId={jobId} />}
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