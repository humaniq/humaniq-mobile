import { ethers } from "ethers";
import { abiERC20, abiERC721, abiERC1155 } from "@metamask/metamask-eth-abis"

const erc20Interface = new ethers.utils.Interface(abiERC20);
const erc721Interface = new ethers.utils.Interface(abiERC721);
const erc1155Interface = new ethers.utils.Interface(abiERC1155);

/**
 * Attempts to decode transaction data using ABIs for three different token standards: ERC20, ERC721, ERC1155.
 * The data will decode correctly if the transaction is an interaction with a contract that matches one of these
 * contract standards
 *
 * @param data - encoded transaction data
 * @returns {EthersContractCall | undefined}
 */
export function parseStandardTokenTransactionData(data) {
    try {
        return erc20Interface.parseTransaction({ data });
    } catch {
        // ignore and next try to parse with erc721 ABI
    }

    try {
        return erc721Interface.parseTransaction({ data });
    } catch {
        // ignore and next try to parse with erc1155 ABI
    }

    try {
        return erc1155Interface.parseTransaction({ data });
    } catch {
        // ignore and return undefined
    }

    return undefined;
}