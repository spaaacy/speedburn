import React from "react";

const EditProfile = ({ headerMessage, confirmMessage, handleSubmit, setUsernameField, setImageField }) => {
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex justify-center items-start flex-col w-[760px]"
    >
      {/* TODO: Add form validation */}
      <div className="flex justify-center items-start flex-col font-semibold gap-4">
        <h2 className="text-3xl font-bold">{headerMessage}</h2>
        <div className="mt-4">
          <label className=" w-28 inline-block">Username:</label>
          <input
            placeholder={`${"Username"}`}
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setUsernameField(e.target.value)}
          />
        </div>
        <div>
          <label className=" w-28 inline-block">Image:</label>
          <input
            placeholder="URL"
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setImageField(e.target.value)}
          />
        </div>
      </div>
      <button className="action-button-dark self-end" type="submit">
        {confirmMessage}
      </button>
    </form>
  );
};

export default EditProfile;
