// import { googleLogout } from "@react-oauth/google";

// interface LogoutButtonProps {
//   onLogout: () => void;
// }

// const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
//   const handleLogout = () => {
//     googleLogout(); // End session
//     localStorage.removeItem("googleUser"); // Remove stored user
//     onLogout(); // Notify parent to update UI
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       style={{
//         padding: "10px 20px",
//         backgroundColor: "#db4437",
//         color: "#fff",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//       }}
//     >
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;


import { googleLogout } from "@react-oauth/google";

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <button
      onClick={() => {
        googleLogout();
        onLogout();
      }}
      style={{
        backgroundColor: "#db4437",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
