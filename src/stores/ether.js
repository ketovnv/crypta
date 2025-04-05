import {logger} from "@stores/logger.js";


const ETHER_KEY = "TBB7AZ3A7JNRFUPSTDVTYW7Q181DCWM4D"
const address = "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511D"
const chains = [42161, 8453, 10]

class EtherStore {}

async function main() {


    for (const chain of chains) {

        const query = await fetch(`https://api.etherscan.io/v2/api
         ?chainid=${chain}
         &module=account
         &action=balance
         &address=${address}
         &tag=latest&apikey=${ETHER_KEY}`)


        const response = await query.json()

        const balance = response.result
        logger.log(`Chain ${ETHER_KEY}`, balance)
    }
}


export const etherStore = new EtherStore();
