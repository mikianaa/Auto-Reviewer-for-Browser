export const Loader = ({ size = "h-5 w-5" }: { size?: string }) => (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${size}`} />
)