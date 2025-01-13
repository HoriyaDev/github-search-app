import { MdOutlineCancel } from "react-icons/md";

const ProfileModel = ({ open, data, onCloseModel }) => {
  if (!open) return null;

  // Format the created_at date
  const formattedDate = data?.created_at
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(data.created_at))
    : "No date available";

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 sm:w-[400px] md:w-[600px] lg:w-[750px] max-w-3xl h-auto rounded-2xl p-6 sm:p-16 relative">
        {/* Cancel Button */}
        <button
          onClick={onCloseModel}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <MdOutlineCancel size={25} />
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6">
          {/* Profile Image */}
          <img
            src={data?.avatar_url}
            alt={data?.login}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
          />

          <div className="flex flex-col text-center md:text-left mt-4 md:mt-0">
            <h1 className="font-bold text-lg sm:text-2xl">{data?.login}</h1>
            <p className="mt-1 text-sm sm:text-base">
              Joined: {formattedDate}
            </p>
            <p className="mt-2 text-sm sm:text-base">ID: {data?.id}</p>
            {data?.bio ? (
              <p className="mt-3 text-sm sm:text-base">{data.bio}</p>
            ) : (
              <p className="mt-3 text-sm sm:text-base">This profile has no bio</p>
            )}

            {/* Stats Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 bg-gray-100 p-4 rounded-lg">
              <p className="mt-1 text-sm sm:text-base">
                Followers: {data?.followers}
              </p>
              <p className="mt-1 text-sm sm:text-base">
                Following: {data?.following}
              </p>
              <p className="mt-1 text-sm sm:text-base">
                Repos: {data?.public_repos}
              </p>
            </div>

            {/* Email */}
            {data?.email ? (
              <a
                href={`mailto:${data.email}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline mt-6 text-sm sm:text-base"
              >
                {data.email}
              </a>
            ) : (
              <p className="mt-6  text-sm sm:text-base">No email</p>
            )}
          </div>
        </div>


        <div className="flex flex-col items-center justify-center mt-3 ">
  <a href={data?.html_url} target="_blank" rel="noreferrer">
    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base">
      View Profile
    </button>
  </a>
</div>

      </div>
    </div>
  );
};

export default ProfileModel;
