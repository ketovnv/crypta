import {useSpring} from "@react-spring/web";
import {animation} from "@stores/animation";
import {observer} from "mobx-react-lite";
import {uiStore} from "@stores/ui";
import params from './configs/pageWithNavBarMoving.json'

export const PageWithNavBarMoving = observer(() => {
    const i = uiStore.isNavbarOpened ? 0 : 1
    const {x, scale, y, config} = params
    const spring = useSpring({
        x: x[i],
        scale: scale[i],
        y: y[i],
        config
    })
    animation.setSpringAnimation({PageWithNavBarMoving: spring});
    return null
})
