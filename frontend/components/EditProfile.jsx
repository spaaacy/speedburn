const EditProfile = ({
  headerMessage,
  confirmMessage,
  handleSubmit,
  setUsernameField,
  setImageField,
  delegate,
  setAccountDelegate,
  account
}) => {
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col w-[760px]">
      {/* TODO: Add form validation */}
      <div className="flex justify-center items-start flex-col gap-4">
        <h2 className="text-3xl font-bold">{headerMessage}</h2>
        <div className="mt-4">
          <label className="font-bold w-28 inline-block">Username:</label>
          <input
            placeholder={`${"Username"}`}
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setUsernameField(e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold w-28 inline-block">Image:</label>
          <input
            placeholder="URL"
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setImageField(e.target.value)}
          />
        </div>
        {delegate && (
          <p>
            <span className="font-bold">{`Current delegated address: `}</span>
            {`${delegate}`}
            <span className="font-bold">{account == delegate.toLowerCase() ? " (YOU)" : ""}</span>
          </p>
        )}
      </div>
      <div className="flex items-center mt-4">
        {account && delegate && account != delegate.toLowerCase() && (
          <button className="action-button-dark" type="button" onClick={setAccountDelegate}>
            Delegate yourself
          </button>
        )}
        <button className="action-button-dark ml-auto" type="submit">
          {confirmMessage}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
