import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 8;

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [currPage, setCurrPage] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [numOfProfiles, setNumOfProfiles] = useState(0);

  useEffect(() => {
    fetchProfiles(currPage);
  }, [currPage]);

  const fetchProfiles = async (page) => {
    try {
      const skip = page * ITEMS_PER_PAGE;
      const response = await axios.get(
        `${BASE_URL}/api/profiles?skip=${skip}&limit=${ITEMS_PER_PAGE}&getCount=true`,
        {
          withCredentials: true,
        }
      );

      setProfiles(response.data.activeMembers || []);
      setNumOfProfiles(response.data.numOfProfiles || 0);

      // Calculate how many pages in total
      const totalProfiles = response.data.numOfProfiles || 0;
      setNumOfPages(Math.ceil(totalProfiles / ITEMS_PER_PAGE));
    } catch (error) {
      console.log("Error fetching profiles:", error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrPage(selected);
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">No members yet</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Member Directory ({numOfProfiles})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {profiles.map((profile) => (
          <Link
            to={`/profile/${profile._id}`}
            key={profile._id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              {profile.profileImage?.url ? (
                <img
                  src={profile.profileImage.url}
                  alt={`${profile.firstname} ${profile.lastname}`}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
                  {profile.firstname.charAt(0)}
                  {profile.lastname.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-blue-600">
                  {profile.firstname} {profile.lastname}
                </p>
                <p className="text-gray-500">{profile.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageCount={numOfPages}
        onPageChange={handlePageChange}
        forcePage={currPage}
        containerClassName="flex items-center justify-center gap-2 my-8"
        pageClassName="px-3 py-1 rounded border hover:bg-gray-100"
        previousClassName="px-3 py-1 rounded border hover:bg-gray-100"
        nextClassName="px-3 py-1 rounded border hover:bg-gray-100"
        activeClassName="bg-yellow-500 text-black border-yellow-500"
        disabledClassName="opacity-50 cursor-not-allowed"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default ProfilesPage;
