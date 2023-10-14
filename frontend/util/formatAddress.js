const formatAddress = (address) => {
    return `${address.slice(0,5)}...${address.slice(38,42)}`;
}

export default formatAddress;