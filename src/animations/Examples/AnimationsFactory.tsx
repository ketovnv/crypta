 import {observer} from "mobx-react-lite";

 class animation {
     activeAnimationIds = new Set<string>()

     constructor() {
         makeAutoObservable(this)
     }

     *startAnimation(id: string) {
         this.activeAnimationIds.add(id)
          // Запускаем анимацию через фабрику
         yield AnimationFactory.process(id)
         this.activeAnimationIds.delete(id)
     }

     isAnimationActive(id: string) {
         return this.activeAnimationIds.has(id)
     }
 }

  animations/AnimationFactory.ts



  Использование:
 const Navigation = observer(() => {
     useEffect(() => {
         animation.startAnimation('pageTransition')
     }, [location.pathname])

     return (
          <div className={
             animation.isAnimationActive('pageTransition') ? 'animating' : ''
//         // }>
//             {/* контент */}
//             </div>
//     )
// })
