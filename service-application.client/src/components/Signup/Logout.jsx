import { useAuth } from "../Auth/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
};
