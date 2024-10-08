export const formatDate = (timestamp) => {
  var d = new Date(timestamp),
    // Use with solidity timestamp
    // var d = new Date(Number(timestamp)),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("/");
};

export const formatAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(38, 42)}`;
};

export const formatProposalid = (proposalId) => {
  return `${proposalId.slice(0, 5)}...${proposalId.slice(-5)}`;
}

export const calculateTimeLeft = (currentBlock, endBlock) => {
  const secondsPerBlock = 12;
  const result = parseInt(endBlock) - currentBlock
  return {seconds: result * secondsPerBlock, blocks: result};
}