/ types/animations.ts
import {useNavigate, useNavigation} from "react-router-dom";
import {NavigateFunction} from "react-router";


export

// navigation/NavigationService.ts
class NavigationService {

    private static AnimationTypes: {
        PAGE_TRANSITION: 1,
        MODAL: 2,
        TOAST: 3,
    }

    private static ProcessType: {
        NAVIGATION: 1,
        USER_ACTION: 2,
        SYSTEM: 3,
    }


    private static navigation = null;


    static getNavigation = function () {
        if (NavigationService.navigation) {
            return NavigationService.navigation
        } else {
            NavigationService.navigation = useNavigate();
            return NavigationService.navigation
        }
    }


//
//
// handleTransition() {
//     this.isTransitioning = true
//
//     // Можно добавить yield для асинхронных операций
//     yield new Promise(resolve => setTimeout(resolve, 300))
//
//     this.isTransitioning = false
// }

    // private static activeProcesses: number[] = []

    // Создаем ID процесса из типа анимации и типа процесса
    // private static createProcessId(animationType: AnimationType, processType: ProcessType): number {
    //     return animationType * 1000 + processType
    // }

    // static async navigate(path: string) {
    //     let animationType: AnimationType
    //
    //     // Определяем тип анимации на основе пути
    //     switch(path) {
    //         case '/wallet':
    //             animationType = AnimationType.PAGE_TRANSITION
    //             break
    //         // другие пути...
    //         default:
    //             return
    //     }
    //
    //     const processId = this.createProcessId(animationType, ProcessType.NAVIGATION)
    //     this.activeProcesses.push(processId)
    //
    //     try {
    //         await AnimationFactory.process(processId)
    //     } finally {
    //         // Удаляем процесс после завершения
    //         this.activeProcesses = this.activeProcesses.filter(id => id !== processId)
    //     }
    // }
    //
    // static isProcessActive(processId: number): boolean {
    //     return this.activeProcesses.includes(processId)
    // }
    //
    // // Получить тип анимации из ID процесса
    // static getAnimationType(processId: number): AnimationType {
    //     return Math.floor(processId / 1000)
    // }
    //
    // // Получить тип процесса из ID
    // static getProcessType(processId: number): ProcessType {
    //     return processId % 1000
    // }
}