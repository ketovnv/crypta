import {createRoot} from 'react-dom/client'

import App from './App'


ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
import {AppShell, MantineProvider} from '@mantine/core'

c= observer(() =>{
    render() {
        return (
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'dark'
                    ,
                    breakpoints: {
                        xs: 500,
                        sm: 800,
                        md: 1000,
                        lg: 1200,
                        xl: 1400,
                    }
                    ,
                    components: {
                        Button: {
                            styles: (theme) => ({
                                root: {
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        transition: 'transform 200ms ease',
                                    }
                                }
                            })
                        }
                    }
                }

                }
            >
                <AppShell
                    padding="md"
                    navbar={<Navigation/>}
                    header={<Header/>}
                >
                    <Container size="xl">
                        <SimpleGrid
                            cols={3}
                            spacing="lg"
                            breakpoints={[
                                {maxWidth: 'md', cols: 2},
                                {maxWidth: 'sm', cols: 1}
                            ]}
                        >
                            <BalanceCard/>
                            <StatsCard/>
                            <ActivityCard/>
                        </SimpleGrid>
                    </Container>
                </AppShell>
            </MantineProvider>
        )
    }
}
