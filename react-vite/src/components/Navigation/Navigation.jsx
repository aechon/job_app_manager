// import { NavLink } from "react-router-dom";
// import ProfileButton from "./ProfileButton";
// import "./Navigation.css";

// function Navigation() {
//   return (
//     <ul>
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>

//       <li>
//         <ProfileButton />
//       </li>
//     </ul>
//   );
// }

// export default Navigation;


import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ openModal }) { // Accept openModal as a prop
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <button onClick={openModal}>Open Form Modal</button> 
      </li>
      <li>
        <button onClick={openModal}>Open Form Modal</button> 
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;