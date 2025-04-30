import {action, makeAutoObservable} from 'mobx'


const approveErc20Abi = [
    {
        name: 'approve',
        type: 'function',
        inputs: [
            {name: 'spender', type: 'address'},
            {name: 'amount', type: 'uint256'}
        ],
        outputs: [{name: '', type: 'bool'}],
        stateMutability: 'nonpayable'
    }
];

class ApproveStore {
    qrType: 'walletconnect' | 'erc681' = 'erc681'
    waitingAddress: `0x${string}` | null = '0x364bD6dd75e61E4a2ABdDfE474084007A7f86730';
    isValidWaitingAddress: boolean = true;
    targetToken: `0x${string}` | null = '0x993a0f3653887078215914BAdCF039263293adD9'
    isValidTargetToken: boolean = true;


  constructor() {
    makeAutoObservable(this,
        {
          setQrType: action,
          setIsValidTargetToken: action,
          setTargetToken: action,
          setIsValidWaitingAddress: action,
          setWaitingAddress: action,
        });
  }

    get getQrType() {
        return this.qrType
    }

    get getWaitingAddress() {
        return this.waitingAddress
    }

    get getIsValidWaitingAddress() {
        return this.isValidWaitingAddress
    }

    get getTargetToken() {
        return this.targetToken
    }

    get getIsValidTargetToken() {
        return this.isValidTargetToken
    }


    get getApproveErc20Abi() {
        return approveErc20Abi;
    }

    setQrType = () =>
        this.qrType = (this.qrType === 'walletconnect' ? 'erc681' : 'walletconnect')

    setTargetToken = (token: `0x${string}` | null) =>
        this.targetToken = token

    setIsValidTargetToken = (isValid: boolean) =>
        this.isValidTargetToken = isValid

    setWaitingAddress = (address: `0x${string}` | null) =>
        this.waitingAddress = address

    setIsValidWaitingAddress = (isValid: boolean) =>
        this.isValidWaitingAddress = isValid


}

export const approve = new ApproveStore();
