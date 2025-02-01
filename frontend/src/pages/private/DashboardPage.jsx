import EventCalendar from "@/components/EventCalendar";
import { useAuthStore } from "@/store/authStore";

const DashboardPage = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mt-8">Dashboard</h1>
      <p className="text-lg text-gray-600 mt-2">
        Welcome,{" "}
        <span className="font-semibold text-gray-900">{user.firstname}</span>!
      </p>
      <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <EventCalendar />
      </div>
    </div>
  );
};

export default DashboardPage;
