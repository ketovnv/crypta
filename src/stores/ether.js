import {logger} from "@stores/logger.js";
import {action, flow, makeAutoObservable} from 'mobx'


const apiKey = "XTBB7AZ3A7JNRFUPSTDVTYW7Q181DCWM4D"
const BASE_URL = 'https://api.etherscan.io/api';

const networks = {
    '1': 'Etherium Mainnet',
    '17000': 'Holesky Testnet',
    '11155111': 'Sepolia Testnet'}

const address = "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511D"
const chains = [42161, 8453, 10]
const tabs = ['gas', 'tokens', 'balance', 'transactions'];

class EtherStore {
    activeTab = 'gas'
    ethPrice = null


    constructor() {
        makeAutoObservable(this, {
            setActiveTab: action,
            setEthPrice: action,
            fetchParallel: action,
            fetchAll: action
        });
}


    setActiveTab(tab) {
        this.activeTab = tab;
    }

    get getEthPrice() {
        return this.ethPrice
    }

    get apiKey() {
        return apiKey
    }

    get activeTab() {
        return this.activeTab;
    }

    etherscanFetch = flow(function* (module, action, params = {}) {
        try {
            const url = new URL(BASE_URL);
            //@ts-ignore
            const searchParams = new URLSearchParams({
                module,
                action,
                apikey: apiKey,
                ...params,
            });

            url.search = searchParams;

            const response = yield fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = yield response.json();

            if (data.status === '1') {
                return data.result;
            } else {
                throw new Error(data.message || 'API Error');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    });

    setEthPrice = flow(function* () {
        try {
            this.balance = yield this.etherscanFetch('getEthPrice ', 'ethprice');
        } catch (error) {
            // Обработка ошибок
        }
    })
    fetchParallel = flow(function* () {
        const abortController = new AbortController();

        try {
            const fetchers = [1, 2, 3].map(id =>
                fetch(`/api/${id}`, {signal: abortController.signal})
            );

            const results = yield Promise.all(fetchers);
            return yield Promise.all(results.map(r => r.json()));
        } finally {
            abortController.abort(); // Автоматическая отмена при прерывании
        }
    })


    fetchAll = flow(function* () {
        try {
            const [data1, data2] = yield Promise.all([
                this.getEthPrice(),
                this.fetchItem(2)
            ]);

            // Работаем с результатами
            return {data1, data2};
        } catch (error) {
            // Обработка ошибок
        }
    });





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
