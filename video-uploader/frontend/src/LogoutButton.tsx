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
