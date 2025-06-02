// // ReactiveSpringPresence.tsx
// import React, {useEffect} from "react";
// // @ts-ignore
// import {
//     // @ts-ignore
//     useTransition,
//     animated,
//     // @ts-ignore
//     config as springConfigs,
// } from "@react-spring/web";
// import {autorun} from "mobx";
// import {observer} from "mobx-react-lite";
//
// export type ReactiveSpringPresenceProps<T> = {
//     items: T[];
//     from?: (item: T) => any;
//     enter?: (item: T) => any;
//     leave?: (item: T) => any;
//     config?: any;
//     keys?: (item: T) => string | number;
//     children: (item: T, style: any, index: number) => React.ReactNode;
//     onRest?: (item: T) => void;
// };
//
// function _ReactiveSpringPresence<T>({
//                                         items,
//                                         from = () => ({opacity: 0, transform: "scale(0.9)"}),
//                                         enter = () => ({opacity: 1, transform: "scale(1)"}),
//                                         leave = () => ({opacity: 0, transform: "scale(0.9)"}),
//                                         config = springConfigs.default,
//                                         keys = (item: any) => item?.id ?? item,
//                                         children,
//                                         onRest,
//                                     }: ReactiveSpringPresenceProps<T>) {
//     const transitions = useTransition(items, {
//         from,
//         enter,
//         leave,
//         config,
//         keys,
//         onRest,
//     });
//
//     return (
//         <>
//             {transitions((style, item, _, index) => (
//                 <animated.div style={style} key={keys(item)}>
//                     {children(item, style, index)}
//                 </animated.div>
//             ))}
//         </>
//     );
// }
//
// export const ReactiveSpringPresence = observer(_ReactiveSpringPresence);
//
//
// / ReactiveSpringPresence.tsx
// import React, {useEffect} from 'react';
// import {useTransition, animated, config as springConfigs, SpringConfig, Globals} from '@react-spring/web';
// import {autorun} from 'mobx';
// import {observer} from 'mobx-react-lite';
// import {raf} from '@react-spring/rafz';
//
// // Optional global frame scheduler store
// export const schedulerStore = {
//     tasks: new Set<() => void>(),
//
//     add(task: () => void) {
//         this.tasks.add(task);
//     },
//
//     remove(task: () => void) {
//         this.tasks.delete(task);
//     },
//
//     start() {
//         raf.write(() => {
//             this.tasks.forEach(task => task());
//             this.start();
//         });
//     },
// };
//
// export type ReactiveSpringPresenceProps<T> = {
//     items: T[];
//     from?: (item: T, index: number) => any;
//     enter?: (item: T, index: number) => any;
//     leave?: (item: T, index: number) => any;
//     config?: SpringConfig | ((item: T, index: number) => SpringConfig);
//     keys?: (item: T) => string | number;
//     children: (item: T, style: any, index: number) => React.ReactNode;
//     onRest?: (item: T) => void;
//     stagger?: number; // delay between items in ms
//     useRaf?: boolean; // enables raf-based timing
// };
//
// function _ApprovedReactiveSpringPresence<T>({
//                                                 items,
//                                                 from = (_, i) => ({opacity: 0, transform: 'scale(0.9)'}),
//                                                 enter = (_, i) => ({opacity: 1, transform: 'scale(1)'}),
//                                                 leave = (_, i) => ({opacity: 0, transform: 'scale(0.9)'}),
//                                                 config = springConfigs.default,
//                                                 keys = (item: any) => item?.id ?? item,
//                                                 children,
//                                                 onRest,
//                                                 stagger = 0,
//                                                 useRaf = false,
//                                             }: ReactiveSpringPresenceProps<T>) {
//     useEffect(() => {
//         if (!useRaf) return;
//         Globals.assign({requestAnimationFrame: raf});
//         schedulerStore.start();
//         return () => {
//             Globals.assign({requestAnimationFrame: window.requestAnimationFrame});
//         };
//     }, [useRaf]);
//
//     const transitions = useTransition(items, {
//         from: (item, index) => ({
//             ...from(item, index),
//             delay: index * stagger,
//         }),
//         enter: (item, index) => ({
//             ...enter(item, index),
//             delay: index * stagger,
//         }),
//         leave: (item, index) => ({
//             ...leave(item, index),
//             delay: index * stagger,
//         }),
//         config: (item, index) =>
//             typeof config === 'function' ? config(item, index) : config,
//         keys,
//         onRest,
//     });
//
//     return (
//         <>
//             {transitions((style, item, _, index) => (
//                 <animated.div style={style} key={keys(item)}>
//                     {children(item, style, index)}
//                 </animated.div>
//             ))}
//         </>
//     );
// }
//
// export const _ApprovedReactiveSpringPresence = observer(_ApprovedReactiveSpringPresence);
