import { usePersonaStore } from "../store/personaStore"
import { Loader } from "../components/Loader"
import { useReview } from "../hooks/useReview"

export default function Detail({ onClose }: { onClose?: () => void }) {
    const persona = usePersonaStore((s) =>
        s.personas.find((p) => p.id === s.currentId)
    )
    const { data, isLoading, runReview } = useReview();

    return (
        <div className="w-[600px] h-[400px] p-6 overflow-y-auto space-y-4 bg-white shadow-xl" >
            <header className="flex items-center justify-between mb-2" >
                <h1 className="font-semibold text-lg" > {persona?.name} – Review </h1>
                < div className="space-x-2" >
                    <button
                        className="text-sm text-blue-600"
                        onClick={() => runReview("dummy text")
                        }
                    >
                        再レビュー
                    </button>
                    {
                        onClose && (
                            <button
                                className="text-sm text-gray-500"
                                onClick={onClose}
                            >
                                ✕
                            </button>
                        )
                    }
                </div>
            </header>

            {
                isLoading && (
                    <div className="grid place-items-center h-48" >
                        <Loader size="h-8 w-8" />
                    </div>
                )
            }

            {
                !isLoading && data && (
                    <section>
                        <p className="mb-2 font-medium" > Summary </p>
                        < p className="mb-4 text-gray-700" > {data.summary} </p>

                        < p className="mb-2 font-medium" > Comments </p>
                        < ul className="list-disc pl-5 space-y-1 text-gray-700" >
                            <li>Line 12 – 冗長です …</li>
                            < li > Line 27 – 明確です …</li>
                        </ul>
                    </section>
                )
            }
        </div>
    )
}