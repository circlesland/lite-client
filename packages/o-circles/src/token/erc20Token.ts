import Web3 from "web3";
import type {AbiItem} from "web3-utils";
import {ERC20_ABI, HUB_BLOCK, ZERO_ADDRESS} from "../consts";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {Web3Contract} from "../web3Contract";
import {SafeOps} from "../model/safeOps";

export class Erc20Token extends Web3Contract
{
  constructor(web3: Web3, tokenAddress: string)
  {
    super(web3, tokenAddress, new web3.eth.Contract(<AbiItem[]>ERC20_ABI, tokenAddress));
  }

  static readonly TransferEvent = "Transfer";
  static readonly ApprovalEvent = "Approval";

  static queryPastTransfers(from?: string, to?: string, fromBlock?: number, toBlock?: number)
  {
    if (!from && !to)
      throw new Error("At least one of the two parameters has to be set to a value.");

    let f: any = {};
    if (from)
      f.from = from;
    if (to)
      f.to = to;

    return {
      event: "Transfer",
      filter: f,
      fromBlock: fromBlock ?? HUB_BLOCK,
      toBlock: toBlock ?? "latest"
    };
  }

  async transfer(privateKey: string, safeProxy: GnosisSafeProxy, to: string, amount: BN)
  {
    const txData = this.contract.methods.transfer(to, amount).encodeABI();

    return await safeProxy.execTransaction(
      privateKey,
      {
        to: this.address,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: SafeOps.CALL
      });
  }

  async getBalanceOf(address: string)
  {
    const balance = await this.contract.methods.balanceOf(address).call();
    return new BN(balance);
  }
}
