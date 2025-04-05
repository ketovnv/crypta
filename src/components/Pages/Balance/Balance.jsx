import {observer} from "mobx-react-lite";
import {Center, TextInput} from "@mantine/core";
import {useState} from "react";
import {animation} from "@stores/animation.js";
import {motion} from "motion/react";

const Balance = observer(() => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState("");
    const floating = focused || value.length > 0 || undefined;
    return (
        <Center
            style={{
                borderRadius: 20,
                height: 575,
                // background: "linear-gradient(#1050FF,#4079ff,#1050FF,#1050FF)",
            }}
        >
            {/*<Title order={2} mb="xl">*/}
            {/*  Управление токенами*/}
            {/*</Title>*/}

            <motion.div className="pageCard" animate={{background: animation.getThemeColors.background}}
                        transition={{duration: 3, ease: "easeInOut"}}>
                <h1>BalanceTracker</h1>
                <TextInput
                    label="Floating label input"
                    labelProps={{"data-floating": floating}}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                />
                {/*<BalanceTracker />*/}
            </motion.div>
            {/*{walletStore.getAccountData() ? (*/}

            {/*    <TokenOperations />*/}
            {/*) : (*/}
            {/*    <Title order={3} c="dimmed">Подключите кошелёк для управления токенами</Title>*/}
            {/*)}*/}
        </Center>
    );
});

export default Balance;
