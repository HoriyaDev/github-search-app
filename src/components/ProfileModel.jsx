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
    <div className="fixed bg-black bg-opacity-50 top-0 right-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-white w-[750px] h-auto rounded-2xl p-10 relative">
        {/* Cancel Button */}
        <button
          onClick={onCloseModel}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <MdOutlineCancel size={25} />
        </button>

        <div className="flex justify-around items-start">
          <img
            src={data?.avatar_url}
            alt={data?.login}
            className="w-28 h-28 rounded-full object-cover"
          />
          <div className="flex flex-col ml-4 text-xl font-serif">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-2xl font-serif">{data?.login}</h1>
              <p className="mt-1 ml-14 font-serif text-xl">
                Joined: {formattedDate}
              </p>
            </div>
            <p className="mt-2">ID: {data?.id}</p>
            {data?.bio ? (
              <p className="mt-3">{data.bio}</p>
            ) : (
              <p className="mt-3">This profile has no bio</p>
            )}

            <div className="flex justify-between items-center gap-4 mt-4 bg-gray-100 p-4 rounded-lg">
              <p className="mt-1">Followers: {data?.followers}</p>
              <p className="mt-1">Following: {data?.following}</p>
              <p className="mt-1">Repos: {data?.public_repos}</p>
            </div>
            {data?.email ? (
              <a
                href={`mailto:${data.email}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline mt-3 mb-7"
              >
                {data.email}
              </a>
            ) : (
              <p className="mt-3 mb-7 ">No email</p>
            )}
          </div>
        </div>
        <a href={data?.html_url} target="_blank" rel="noreferrer" >
          <button
            className="absolute   bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            View Profile
          </button>
        </a>
      </div>
    </div>
  );
};

export default ProfileModel;
