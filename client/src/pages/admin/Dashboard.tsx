import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoreList from "../../components/StoreList";
import UserList from "../../components/UserList";
import { getDashboardDetailsService } from "@/services/admin.service";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getDashboardDetailsService();
      if (response) {
        setTotalUsers(response.data.totalUsers || 0);
        setTotalStores(response.data.totalStores || 0);
        setTotalRatings(response.data.totalRatings || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Total Stores", value: totalStores },
          { label: "Total Submitted Ratings", value: totalRatings }
        ].map((item, index) => (
          <Card
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700 text-center">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-4xl font-bold text-indigo-600">
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto text-gray-400" />
                ) : (
                  item.value
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Store List */}
      <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Store List</h2>
        <StoreList />
      </section>

      {/* User List */}
      <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User List</h2>
        <UserList />
      </section>
    </div>
  );
};

export default Dashboard;
