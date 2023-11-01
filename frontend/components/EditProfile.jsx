import React from "react";

const EditProfile = ({confirmMessage}) => {
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="self-center flex justify-center items-start flex-col mt-6 w-[760px]"
    >
      <div className="flex justify-center items-start flex-col font-semibold gap-4">
        <div>
          <label className="text-pale w-28 inline-block">Username:</label>
          <input
            placeholder={`${username ? username : "Username"}`}
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setUsernameField(e.target.value)}
          />
        </div>
        <div>
          <label className="text-pale w-28 inline-block">Image URL:</label>
          <input
            placeholder="URL"
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setImageField(e.target.value)}
          />
        </div>
      </div>
      <button className="action-button self-end" type="submit">
        {confirmMessage}
      </button>
    </form>
  );
};

export default EditProfile;
