import classes from "./PageTransition.module.css"
import React, {useEffect, FC, PropsWithChildren, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {routerStore} from "../../stores/router.ts";
import {useLocation} from 'react-router-dom'
import {Center, Transition} from "@mantine/core";

const transitions = {
    'slide-right': {
        transitionProperty: 'transform, opacity',
        in: {transform: 'translateX(0)', opacity: 1},
        out: {transform: 'translateX(-100%)', opacity: 0},
    },
    'slide-left': {
        transitionProperty: 'transform, opacity',
        in: {transform: 'translateX(0)', opacity: 1},
        out: {transform: 'translateX(100%)', opacity: 0},
    },
    'slide-up': {
        transitionProperty: 'transform, opacity',
        in: {transform: 'translateY(0)', opacity: 1},
        out: {transform: 'translateY(100%)', opacity: 0},
    },
    'slide-down': {
        transitionProperty: 'transform, opacity',
        in: {transform: 'translateY(0)', opacity: 1},
        out: {transform: 'translateY(-100%)', opacity: 0},
    },
    'fade': {
        transitionProperty: 'opacity',
        in: {opacity: 1},
        out: {opacity: 0},
    },
}


const reverseTransition = (transition) => {
    if (!transitions[transition]) {
        console.warn(`Transition "${transition}" not found, falling back to "fade"`);
        transition = 'fade';
    }

    const { in: inStyles, out: outStyles } = transitions[transition];

    return {
        ...transitions[transition],
        in: outStyles,
        out: inStyles
    }
}


interface PageTransitionProps extends PropsWithChildren {
}

const BasePageTransition: FC<PageTransitionProps> = ({children}): JSX.Element => {

    const [isVisible, setIsVisible] = useState(true)
    const location = useLocation()['pathname']


    useEffect(() => {
        setIsVisible(false)
        setTimeout(() => {
            routerStore.setLocationInitialized()
            console.warn('Location Initialized')
            setIsVisible(true)
        }, 50)
    }, [])


    // useEffect(() => {
    //     setIsVisible(!routerStore.isAnimating)
    //     console.warn('isAnimating', routerStore.isAnimating)
    //
    //
    // }, [routerStore.isAnimating])

    useEffect(() => {
        console.warn('Location Changed', location)
        setIsVisible(false)
        setTimeout(() => {
            routerStore.setLocationInitialized()
            console.warn('Location Initialized')
            setIsVisible(true)
        }, 50)
        // if (location !== routerStore.currentChildrenPath) {
        //   routerStore.setCurrentChildren(children, location)
        // }


    }, [location])

    const baseStyles = {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
    }

    return (

        <div>
            <h1>{routerStore.isAnimatingLong}</h1>
            <h1>{JSON.stringify(routerStore.currentRoute)}</h1>
            <h1>{isVisible}</h1>

            {routerStore.previousChildren && (
                <Transition
                    mounted={isVisible}
                    transition={reverseTransition(transitions[routerStore.currentRoute.animation])}
                    duration={routerStore.isAnimatingLong}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <div style={{ ...styles}}>
                            {routerStore.previousChildren}
                        </div>
                    )}
                </Transition>
            )}

             Текущая страница появляется с анимацией
            <Transition
                mounted={isVisible} // показываем когда анимация закончена
                transition={{
                    transitionProperty: 'opacity',
                    in: {opacity: 1},
                    out: {opacity: 0},
                }}
                duration={1500}
                timingFunction="ease"
            >
                {(styles) => (

                        {children}

                {/*)}*/}
            {/*</Transition>*/}
            
        </div>
    )
}

export const PageTransition = observer(BasePageTransition);





