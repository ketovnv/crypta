import {logger} from "@stores/logger.js";
import { action, makeAutoObservable } from 'mobx'


const apiKey = "XTBB7AZ3A7JNRFUPSTDVTYW7Q181DCWM4D"


const address = "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511D"
const chains = [42161, 8453, 10]
const tabs = ['gas', 'tokens', 'balance', 'transactions'];

class EtherStore {
  activeTab = 'gas';
constructor() {
    makeAutoObservable(this, {setActiveTab:action});
}

get apiKey() {
    return apiKey
}



    setActiveTab(tab) {
        this.activeTab = tab;
    }
  async eth() {


    for (const chain of chains) {

        const query = await fetch(`https://api.etherscan.io/v2/api
         ?chainid=${chain}
         &module=account
         &action=balance
         &address=${address}
         &tag=latest&apikey=${this.apiKey}`)


        const response = await query.json()

        const balance = response.result
        logger.log(`Chain ${this.apiKey}`, balance)
    }
}
}
    export const etherStore = new EtherStore();
