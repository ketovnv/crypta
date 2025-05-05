/ File: src/hooks/useNotifications.ts
import { useCallback, useState } from "react"
import { v4 as uuid } from "uuid"

export type Notification = {
    id: string
    message: string
    type?: "success" | "error" | "info"
    duration?: number
}

export function useNotifications() {
    const [notifications, set] = useState<Notification[]>([])

    const notify = useCallback((msg: string, type?: Notification["type"], duration = 4000) => {
        const id = uuid()
        set((prev) => [...prev, { id, message: msg, type, duration }])
        setTimeout(() => set((prev) => prev.filter((n) => n.id !== id)), duration)
    }, [])

    const remove = (id: string) => set((prev) => prev.filter((n) => n.id !== id))

    return { notifications, notify, remove }
}


// File: src/components/NotificationCenter.tsx
import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"
import { Notification } from "../hooks/useNotifications"

export function NotificationCenter({ notifications, remove }: {
    notifications: Notification[]
    remove: (id: string) => void
}) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-[90vw]">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={clsx(
                            "rounded-lg px-4 py-3 text-sm shadow-lg backdrop-blur-md border border-white/10",
                            "bg-white/10 dark:bg-black/10 text-white",
                            {
                                "border-green-400/40": n.type === "success",
                                "border-red-400/40": n.type === "error",
                            }
                        )}
                    >
                        {n.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}


// File: src/App.tsx
import { useNotifications } from "./hooks/useNotifications"
import { NotificationCenter } from "./components/NotificationCenter"

export default function App() {
    const { notifications, notify, remove } = useNotifications()

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[color:var(--color-bg)]">
            <button
                onClick={() => notify("🧙‍♂️ Магия сработала!", "success")}
                className="bg-primary text-white px-6 py-2 rounded-full shadow-lg hover:bg-accent transition"
            >
                Вызвать нотификацию
            </button>
            <NotificationCenter notifications={notifications} remove={remove} />
        </div>
    )
}
