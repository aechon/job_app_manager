
import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import FormModal from '../components/FormModal/FormModal'; 
import Layout from './Layout';
import UserForms from '../components/FormModal/UserForms';
import FormsList from '../components/FormModal/FormList';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
        path: "forms-list", 
        element: <FormsList />,
      },
    ],
  },
]);