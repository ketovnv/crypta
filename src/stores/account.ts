import type { AccountType, AccountControllerState } from "@reown/appkit/react";
import type { CaipAddress } from "@reown/appkit-common";
import { action, makeAutoObservable } from "mobx";

class AccountStore {
  allAccounts: AccountType[];
  caipAddress: CaipAddress | undefined;
  address: string | undefined;
  isConnected: boolean;
  embeddedWalletInfo: {
    user: AccountControllerState["user"];
    authProvider: AccountControllerState["socialProvider"] | "email";
    accountType: AccountType | undefined;
    isSmartAccountDeployed: boolean;
  };
  status: AccountControllerState["status"];

  constructor() {
    makeAutoObservable(this, {
      setAccountData: action,
    });
  }

  getAccount = () =>
    this.isConnected
      ? {
          allAccounts: this.allAccounts,
          caipAddress: this.caipAddress,
          address: this.address,
          isConnected: this.isConnected,
          embeddedWalletInfo: this.embeddedWalletInfo,
          status: this.status,
        }
      : null;

  setAccountData(data: any) {
    this.allAccounts = data.allAccounts;
    this.caipAddress = data.caipAddress;
    this.address = data.address;
    this.isConnected = data.isConnected;
    this.embeddedWalletInfo = data.embeddedWalletInfo;
    this.status = data.status;
  }
}

export const accountStore = new AccountStore();
