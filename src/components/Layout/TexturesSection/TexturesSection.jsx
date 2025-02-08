import {
    Button,
    ScrollArea
} from '@mantine/core';



export const TexturesSection = () => {
    return (
        <ScrollArea.Autosize mx="auto" maw={1200} h={500}>
            <WelcomeSection/>

            <Highlight
                ta="center"
                highlight={['highlighted', 'default']}
                highlightStyles={{
                    backgroundImage:
                        'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                    fontWeight: 700,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                You can change styles of highlighted part if you do not like default styles
            </Highlight>
            <Button variant="gradient" leftIcon={<img src="/assets/settings.svg" alt="React" style={{width: '50px', height: '50px'}}/>}
                    gradient={{from: 'cyan', to: 'blue', deg: 90}}>Mantine button</Button>



            <StatsGrid/>
        </ScrollArea.Autosize>
    );
};