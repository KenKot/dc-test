import { useAuthStore } from "@/store/authStore";

const DashboardPage = () => {
  console.log("Dashboard.jsx");
  const { user, isCheckingAuth } = useAuthStore();

  console.log("DashboardPage.jsx's 'user': ,", user);

  if (isCheckingAuth) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* <p>welcome, {user.name}</p> */}
    </div>
  );
};

export default DashboardPage;
