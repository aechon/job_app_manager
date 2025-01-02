import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import EventCalendar from '../components/EventCalendar';

import Layout from './Layout';


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


      // route for testing <------ REMOVE LATER
      {
        path: "calendar",
        element: <EventCalendar />,
      },
    ],
  },
]);