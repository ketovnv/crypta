import AnimatedNumber               from "@components/Animations/AnimatedNumber.jsx";
import {SVGIllustration404}         from "@components/Pages/ErrorNotifications/SVGIllustration404.jsx";
import {
    Container,
    Text,
    Title,
    Button,
    Group,
    Center,
}                                   from '@mantine/core';
import {observer}                   from 'mobx-react-lite';
import {useEffect}                  from "react";
import {useNavigate, useRouteError} from 'react-router-dom';
import classes                      from './ErrorNotifications.module.css';
import {errorStore}                 from '@/stores/errors';
// Создаем стили для страниц ошибок


// Компонент для отображения 404 ошибки

const getErrorMessage = (error) => {
    if (error.status === 404) {
        return 'Страница не найдена';
    }
    if (error.statusText) {
        return error.statusText;
    }
    return error.message||'Произошла неизвестная ошибка';
};

const getErrorType = (error) => {
    if (error.status === 404) return 'ROUTING';
    if (error.status === 500) return 'SERVER_ERROR';
    if (error.status === 503) return 'SERVICE_UNAVAILABLE';
    return 'UNKNOWN';
};

const NotFoundError = observer(
    ({message}) => {
        const navigate = useNavigate();

        return (
            <Container className={classes.root}>
                <div className={classes.inner}>
                    <SVGIllustration404 className={classes.image} />
                    <div className={classes.content}>
                        <Title className={classes.title}>Здесь пусто</Title>
                        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                            {message||'Такой страницы не существует. Возможно Вы ввели неправильный адрес'}
                        </Text>
                        <Center>
                            <Button variant="outline" onClick={() => navigate('/')} size="xl">Домой</Button>
                        </Center>
                    </div>
                </div>
            </Container>


        );
    })

// ErrorNotifications.jsx
const SystemError = observer(({message, details}) => {
    return (
        <Container className={classes.root}>
            <div className={classes.errorCode}>⚠️</div>
            <Title className={classes.title}>System Warning</Title>
            <Text
                color="dimmed"
                size="lg"
                align="center"
                className={classes.description}
            >
                {message}
                {details&&process.env.NODE_ENV === 'development'&&(
                    <Text size="sm" color="dimmed" mt="sm">
                        {details}
                    </Text>
                )}
            </Text>
        </Container>
    );
});

// Компонент для отображения 500 ошибки
const ServerError = observer(({message, onRetry}) => {

    return (

        <Container className={classes.root}>
            <div className={classes.icon}>🛑</div>
            <div className={classes.inner}>
                <Title className={classes.title}>Something bad just happened...</Title>
                <Text
                    color="dimmed"
                    size="lg"
                    align="center"
                    className={classes.description}
                >
                    {message||"Our servers could not handle your request. Don't worry, our development team was already notified."}
                </Text>
                <Group position="center">
                    <Button
                        variant="subtle"
                        size="md"
                        onClick={onRetry}
                    >
                        Refresh the page
                    </Button>
                </Group>
            </div>
        </Container>
    );
});

// Компонент для отображения 503 ошибки
const ServiceUnavailableError = observer(({message}) => {

    return (
        <Container className={classes.root}>
            <div className={classes.errorCode}>503</div>
            <Title className={classes.title}>All of our servers are busy</Title>
            <Text
                color="dimmed"
                size="lg"
                align="center"
                className={classes.description}
            >
                {message||'We cannot handle your request right now, please wait for a couple of minutes and refresh the page. Our team is already working on this issue.'}
            </Text>
            <Group position="center">
                <Button
                    variant="subtle"
                    size="md"
                    onClick={() => window.location.reload()}
                >
                    Refresh the page
                </Button>
            </Group>
        </Container>
    );
});

// Обновляем наш ErrorBoundary компонент
const ErrorNotifications = observer(() => {
    const routeError = useRouteError();
    const navigate = useNavigate();

    useEffect(() => {
        if (routeError) {
            // Добавляем ошибку в MobX стор
            errorStore.addError({
                                    message: getErrorMessage(routeError),
                                    type: getErrorType(routeError),
                                    details: routeError.details||routeError.stack,
                                    status: routeError.status,
                                });
        }
    }, [routeError]);

    // Выбираем компонент ошибки в зависимости от статуса
    const getErrorComponent = (error) => {
        console.error(error.status)
        switch (error.status) {
            case 'SYSTEM':
                return <SystemError message={error.message} details={error.details} />;
            case 'NETWORK':
                return <ServiceUnavailableError message={error.message} />;
            case 404:
                return <NotFoundError message={error.message} />;
            case 500:
                return (
                    <ServerError
                        message={error.message}
                        onRetry={() => window.location.reload()}
                    />
                );
            case 503:
                return <ServiceUnavailableError message={error.message} />;
            default:
                return <ServerError message={error.message} />;
        }
    };

    if (!routeError) {
        return <ServerError message="Произошла неизвестная ошибка" />;
    }


    return getErrorComponent(routeError);
})

export default ErrorNotifications