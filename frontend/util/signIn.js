const signIn = async (setAccount) => {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  setAccount(accounts[0]);
};

export default signIn;