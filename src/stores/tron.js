// store/TokenStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import TronWeb from "tronweb";

export class TronStore {
  tronWeb = null;
  tokenAddress = "";
  contract = null;
  balance = "";
  symbol = "";
  name = "";

  constructor() {
    makeAutoObservable(this);
    this.tronWeb = new TronWeb({ fullHost: "https://api.trongrid.io" });
  }

  async init(address) {
    this.tokenAddress = address;
    const contract = await this.tronWeb.contract().at(address);
    runInAction(() => {
      this.contract = contract;
    });
    await this.fetchInfo();
  }

  async fetchInfo() {
    const symbol = await this.contract.symbol().call();
    const name = await this.contract.name().call();
    runInAction(() => {
      this.symbol = symbol;
      this.name = name;
    });
  }

  async getBalance(address) {
    const res = await this.contract.balanceOf(address).call();
    runInAction(() => {
      this.balance = res;
    });
  }

  async approve(spender, amount) {
    const tx = await this.contract
      .approve(spender, amount)
      .send({ feeLimit: 1_000_000 });
    return tx;
  }

  async transfer(to, amount) {
    const tx = await this.contract
      .transfer(to, amount)
      .send({ feeLimit: 1_000_000 });
    return tx;
  }

  async generateApproveQR(spender, amount) {
    const parameter = [
      { type: "address", value: spender },
      { type: "uint256", value: amount },
    ];

    const tx = await this.tronWeb.transactionBuilder.triggerSmartContract(
      this.tokenAddress,
      "approve(address,uint256)",
      { feeLimit: 1_000_000 },
      parameter,
      this.tronWeb.defaultAddress.base58,
    );

    const raw = Buffer.from(JSON.stringify(tx.transaction)).toString("base64");
    return `tron:tx:${raw}`;
  }
}

export const tronStore = new TronStore();
