import {action, makeAutoObservable, observable} from "mobx";
import {logger} from "./logger";
import {uiStore} from "@stores/ui.js";

export const ANIMATION_DURATION = {
    VERY_SHORT: 300,
    SHORT: 500,
    MEDIUM: 800,
    LONG: 1200,
    VERY_LONG: 1700,
    EXTRA_LONG: 2500,
    EXTRA_LONG_XL: 3500,
    EXTRA_LONG_XXL: 5000,
};

const animations = {
    dark: {
        // color: "FFF"
        background: "radial-gradient(\n" +
            "          circle at -25% -270%,\n" +
            "          #888888 0%,\n" +
            "          #777777 5%,\n" +
            "          #555555 45%,\n" +
            "          #333333 60%,\n" +
            "          #222222 70%,\n" +
            "          #111111 80%,\n" +
            "          #151515 90%\n" +
            "  )",
    },
    light: {
        background: "radial-gradient(\n" +
            "          circle at 25% 270%,\n" +
            "          #FFFFFF 0%,\n" +
            "          #EEEEEE 5%,\n" +
            "          #DDDDDD 45%,\n" +
            "          #CCCCCC 60%,\n" +
            "          #BBBBBB 70%,\n" +
            "          #AAAAAA 80%,\n" +
            "          #999999 90%\n" +
            "  )",
    },
};

class AnimationStore {

    currentAnimation = null;
    optionsTransitionsTestState = 0;
    themeGradient = "linear-gradient(135deg,#111111,#222222,#333333,#444444)";
    springApi = null;
    mantineControlAnimations = {};
    springAnimations = {};

    constructor() {
        makeAutoObservable(this,
            {
                mantineControlAnimations: observable.ref,
                springAnimations: observable.ref,
                setMantineControlAnimation: action,
                setSpringAnimation: action,
            }
        )
    }

    get getThemeBackGround() {
        return uiStore.themeIsDark
            ? animations.dark.background
            : animations.light.background;
    }

    getMCAnimation = (name) => this.mantineControlAnimations[name]

    @action
    setMantineControlAnimation = (newAnimation) => this.mantineControlAnimations = {...newAnimation}

    getSpringAnimation = (name) => this.springAnimations[name]

    @action
    setSpringAnimation = (newAnimation) => this.springAnimations = newAnimation

    toggleTheme() {
        logger.logJSON("метод start?", this.springApi);
        if (this.springApi?.start) {
            // Проверяем, есть ли `start`
            this.springApi.start({
                background: this.themeGradient.includes("#222222")
                    ? "linear-gradient(135deg,#111111,#222222,#333333,#444444)"
                    : "linear-gradient(135deg,#FFFFFF,#EEEEEE,#DDDDDD,#CCCCCC)",
            });
        } else {
            console.error("springApi не содержит метод start!", this.springApi);
        }
    }

    @action
    changeOptionsTransitionsTestState() {
        logger.logRandomColors(
            "optionsTransitionsTestState до",
            this.optionsTransitionsTestState,
        );
        this.optionsTransitionsTestState =
            (this.optionsTransitionsTestState + 1) % 3;
        logger.logRandomColors(
            "optionsTransitionsTestState после",
            this.optionsTransitionsTestState,
        );
    }

    //
    // get getMCAnimationNB() {
    //     console.log('getMCAnimationNB');
    //     console.log(this.mantineControlAnimationNB.control);
    //     //Proxy(Object) {…}
    //     return this.mantineControlAnimationNB;
    // };

    // const control = useAnimation();
    // setMantineControlAnimationNB(newAnimation) {
    //     this.mantineControlAnimationNB = newAnimation;
    // }


    setCurrentAnimation(animationName) {
        this.currentAnimation = animationName;
    }

    clearCurrentAnimation() {
        this.currentAnimation = null;
    }
}

export const animation = new AnimationStore();
