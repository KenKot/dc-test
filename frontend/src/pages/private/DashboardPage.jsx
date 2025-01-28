import EventCalendar from "@/components/EventCalendar";
import { useAuthStore } from "@/store/authStore";

const DashboardPage = () => {
  const { user, isCheckingAuth } = useAuthStore();

  console.log("DashboardPage.jsx's 'user': ,", user);

  if (isCheckingAuth) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>welcome, {user.firstname}</p>
      <EventCalendar />
    </div>
  );
};

export default DashboardPage;
