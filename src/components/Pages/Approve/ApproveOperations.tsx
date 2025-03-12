import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Text, Button, TextInput, Group, Stack, Alert, Loader } from '@mantine/core';
import { IoAlertCircleSharp } from "react-icons/io5"
import { walletStore } from '../../../stores/wallet'
import {loggerStore} from "../../../stores/logger";
loggerStore.warning("🎖️ ", "Компонент Токен");
const ApproveOperations = observer(() => {
    const [spenderAddress, setSpenderAddress] = useState('');
    const [approveAmount, setApproveAmount] = useState('');

    const handleApprove = async () => {
        if (!spenderAddress || !approveAmount) {
            return;
        }

        const USDT_ADDRESS = '0x6175a8471C2122f4b44A8dd1fA6214dB545192B8';
        // walletStore.approveToken(USDT_ADDRESS, spenderAddress, approveAmount);
    };

    if (!walletStore.getAccountData()) {
        return (
            <Alert icon={<IoAlertCircleSharp size={16} />} title="Not connected" color="orange">
                Please connect your wallet first
            </Alert>
        );
    }

    return (
        <Card shadow="sm" padding="lg" radius="md">
            <Stack>
                <Text size="xl" fw={500}>🎖️ Token Operations ️️ ️  🎖️</Text>

                {/*{walletStore.loading && <Loader size="sm" />}*/}

                <Group>
                    <Text>Your USDT Balance:</Text>
                    <Text fw={500}>
                        {/*{Number(walletStore.usdtBalance) / 1e18} USDT*/}
                    </Text>
                </Group>

                <TextInput
                    label="Spender Address"
                    placeholder="Enter address to approve"
                    value={spenderAddress}
                    onChange={(e) => setSpenderAddress(e.target.value)}
                />

                <TextInput
                    label="Amount to Approve"
                    placeholder="Enter amount"
                    value={approveAmount}
                    onChange={(e) => setApproveAmount(e.target.value)}
                    type="number"
                />

                {/*{walletStore.error && (*/}
                {/*    <Alert icon={<IoAlertCircleSharp size={16} />} title="Error" color="red">*/}
                {/*        {walletStore.error}*/}
                {/*    </Alert>*/}
                {/*)}*/}

                <Button
                    onClick={handleApprove}
                    fullWidth
                    // loading={walletStore.loading}
                >
                    Approve USDT
                </Button>
            </Stack>
        </Card>
    );
});

export default ApproveOperations;
