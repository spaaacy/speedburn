"use client";

import EditProfile from "@/components/EditProfile";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useState } from "react";

const Account = () => {
  const [usernameField, setUsernameField] = useState("");
  const [imageField, setImageField] = useState("");
  const { account } = useContext(Web3Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${account}/edit-details`, {
        method: "PATCH",
        body: JSON.stringify({
          username: usernameField,
          image: imageField,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <main className="w-full max-width flex justify-start items-center flex-col">
      <EditProfile
        headerMessage={"Change account details"}
        confirmMessage={"Save changes"}
        handleSubmit={handleSubmit}
        setUsernameField={setUsernameField}
        setImageField={setImageField}
      />
    </main>
  );
};

export default Account;
