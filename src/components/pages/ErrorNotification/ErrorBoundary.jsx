import React from 'react'
import {Button, Center, Container, Text, Title,} from '@mantine/core';
import {SVGIllustration404} from "@components/pages/ErrorNotification/SVGIllustration404.jsx";
import {useNavigate} from "react-router-dom";

import classes from './ErrorBoundary.module.css';
import {logger} from "@stores/logger.js";


const NotFoundError = ({message}) => {
    const navigate = useNavigate()
    return (
        <Container className={classes.root}>
            <SVGIllustration404 className={classes.image}/>
            <div className={classes.inner}>
                <Text className={classes.title}>Здесь пусто</Text>
                <Text className={classes.description}>
                    {message || 'Такой страницы не существует. Возможно Вы ввели неправильный адрес'}
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

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {hasError: true, error};
    }

    componentDidCatch(error, info) {
        console.warn("componentDidCatchError:", error);
        console.warn("componentDidCatchInfo", JSON.stringify(info));
        console.warn("componentDidCatchInfo", JSON.stringify(error));
    }

    render() {


        // return error.status === 404 ? <NotFoundError message={this.state.error.message}/> : <DefaultError message={this.state.error.message}/>
        if (this.state.hasError) {
            if (this.state.error) {
                logger.error('Error', this.state.error)
                return <DefaultError message={this.state.error.message}/>;
            }
            return <div>An unexpected error occurred.</div>;
        }

        return this.props.children;
    }
}
