import {makeAutoObservable, flow} from 'mobx';

export const statsStore = makeAutoObservable({

    stats: {
        users: {value: 0, diff: 0},
        activity: {value: 0, diff: 0},
        sales: {value: 0, diff: 0},
        products: {value: 0, diff: 0}
    },
    isLoading: false,
    error: null,
    fetchStats: flow(function* () {
        statsStore.isLoading = true;
        statsStore.error = null;

            try {
                // Имитация API запроса
                yield new Promise(resolve => setTimeout(resolve, 1000));

                statsStore.stats = {
                    users: {value: '13,456', diff: 12},
                    activity: {value: '891', diff: -3},
                    sales: {value: '$34,234', diff: 18},
                    products: {value: '145', diff: 7}
                };
            } catch (error) {
                this.error = error.message;
            } finally {
                this.isLoading = false;
            }
        }
    )
})




