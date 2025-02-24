import { isNetworkName } from "@zetachain/addresses";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { ERC20_CUSTODY_ZETA_FEE, ERC20_CUSTODY_ZETA_MAX_FEE } from "lib/contracts.constants";

import { getAddress } from "../../../lib/address.helpers";
import { calculateBestSalt } from "../../../lib/deterministic-deploy.helpers";
import { ERC20Custody__factory } from "../../../typechain-types";

const MAX_ITERATIONS = BigNumber.from(1000000);

export const deterministicDeployGetSaltERC20Custody = async () => {
  if (!isNetworkName(network.name)) {
    throw new Error(`network.name: ${network.name} isn't supported.`);
  }

  const accounts = await ethers.getSigners();
  const [signer] = accounts;

  const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS || signer.address;

  const zetaToken = getAddress("zetaToken");
  const tss = getAddress("tss");
  const tssUpdater = getAddress("tssUpdater");

  const zetaFee = ERC20_CUSTODY_ZETA_FEE;
  const zetaMaxFee = ERC20_CUSTODY_ZETA_MAX_FEE;

  const constructorTypes = ["address", "address", "uint256", "uint256", "address"];
  const constructorArgs = [tss, tssUpdater, zetaFee.toString(), zetaMaxFee.toString(), zetaToken];
  const contractBytecode = ERC20Custody__factory.bytecode;

  calculateBestSalt(MAX_ITERATIONS, DEPLOYER_ADDRESS, constructorTypes, constructorArgs, contractBytecode);
};

if (!process.env.EXECUTE_PROGRAMMATICALLY) {
  deterministicDeployGetSaltERC20Custody()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
