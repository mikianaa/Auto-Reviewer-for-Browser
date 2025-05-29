import { useEffect, useState } from "react"
import { Loader } from "../components/Loader"
import { useReview } from "../hooks/useReview"
import Detail from "../detail"

export default function Popup() {
    const { isLoading, data, runReview } = useReview()
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        void runReview("dummy text")
    }, [])

    if (expanded) {
        return <Detail onClose={() => setExpanded(false)} />
    }

    return (
        <div className="w-[250px] p-4 text-sm">
            {isLoading && (
                <div className="grid place-items-center h-32">
                    <Loader />
                </div>
            )}

            {!isLoading && data && (
                <>
                    <p className="font-medium mb-2">Score: {data.score}/5</p>
                    <p className="mb-3 text-gray-700">{data.summary}</p>
                    <button
                        className="w-full rounded bg-blue-600 text-white py-1 text-center hover:bg-blue-700"
                        onClick={() => setExpanded(true)}
                    >
                        詳細を見る
                    </button>
                </>
            )}
        </div>
    )
}