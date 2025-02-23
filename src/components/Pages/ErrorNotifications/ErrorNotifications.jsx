import {
    Container,
    Text,
    Title,
    Button,
    Center,
}
                                    from '@mantine/core';
import {SVGIllustration404}         from "@components/Pages/ErrorNotifications/SVGIllustration404.jsx";
import {useNavigate, useRouteError} from "react-router-dom";

import classes from './ErrorNotifications.module.css';

const NotFoundError = ({message}) => {
    const navigate = useNavigate()
    return (
        <Container className={classes.root}>
            <SVGIllustration404 className={classes.image} />
            <div className={classes.inner}>
                <Text className={classes.title}>Здесь пусто</Text>
                <Text   className={classes.description}>
                    {message||'Такой страницы не существует. Возможно Вы ввели неправильный адрес'}
                </Text>
            </div>

            <Center>
                <Button variant="outline" onClick={() => navigate('/')} size="xl">Домой</Button>
            </Center>
        </Container>

    )
}
const DefaultError = ({message}) => {

    return (
        <Container className={classes.root}>
            <div className={classes.icon}>🛑</div>
            <div className={classes.inner}>
                <Title c="orange.5" className={classes.title}>Что-то пошло не так...</Title>
                <Text
                    color="yellow.3"
                    size="lg"
                    align="center"
                    className={classes.description}
                >
                    {message}

                </Text>
            </div>
        </Container>
    );
}


export default () => {
    const error = useRouteError();
    console.log(error)
    const errorStatus = error?.status;

    if (!error) {
        return <h1 color="red.5">Произошла ошибка</h1>
    }

    return errorStatus === 404 ? <NotFoundError message={error.message} /> : <DefaultError message={error.message} />
}
