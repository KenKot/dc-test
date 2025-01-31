import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";

const AccountApprovalPending = () => {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <h1>
        Hello! Your account is awaiting to be activated. You will receieve an
        email when it's been approved.
      </h1>
      {/* {<Button onClick={logout}>Logout</Button>} */}
      {/* need to hide button if no user found and redirect them  */}
    </div>
  );
};

export default AccountApprovalPending;
