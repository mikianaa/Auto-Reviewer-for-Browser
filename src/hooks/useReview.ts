import { useEffect, useState } from "react"
import type { Review } from "../types/review"
import type { Persona } from "~src/types/persona"
import { getReviews, addReview, removeReview, clearAllReviews } from "~src/services/reviewService"

export const useReview = () => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoadingReviews, setIsLoadingReviews] = useState(false)
    const [isAddingReview, setIsAddingReview] = useState(false)
    const [isRemovingReview, setIsRemovingReview] = useState(false)
    const [isClearingReviews, setIsClearingReviews] = useState(false)
    const latestReview = reviews[0] || null

    const loadReviewsWithErrorHandling = async () => {
        setError(null)
        setIsLoadingReviews(true)
        try {
            const loadedReviews = await getReviews()
            setReviews(loadedReviews)
            console.log('Reviews loaded successfully')
            return loadedReviews
        } catch (e: any) {
            const errorMessage = e.message || 'レビューの読み込みに失敗しました'
            setError(errorMessage)
            console.error('Failed to load reviews:', e)
            throw e
        } finally {
            setIsLoadingReviews(false)
        }
    }

    const addReviewWithErrorHandling = async (selectedText: string, persona: Persona): Promise<Review> => {
        setError(null)
        setIsAddingReview(true)
        try {
            const result = await addReview(selectedText, persona)
            setReviews(prevReviews => [result, ...prevReviews])
            console.log('Review added successfully')
            return result
        } catch (e: any) {
            const errorMessage = e.message || "API error"
            setError(errorMessage)
            console.error('Failed to add review:', e)
            throw e
        } finally {
            setIsAddingReview(false)
        }
    }

    const removeReviewWithErrorHandling = async (id: string) => {
        setIsRemovingReview(true)
        try {
            await removeReview(id)
            setReviews(prevReviews => prevReviews.filter(review => review.id !== id))
            console.log('Review removed successfully')
        } catch (error) {
            console.error('Failed to remove review:', error)
            setError('レビューの削除に失敗しました')
            throw error
        } finally {
            setIsRemovingReview(false)
        }
    }

    const clearAllReviewsWithErrorHandling = async () => {
        setIsClearingReviews(true)
        try {
            await clearAllReviews()
            setReviews([])
            console.log('All reviews cleared successfully')
        } catch (error) {
            console.error('Failed to clear reviews:', error)
            setError('全レビューの削除に失敗しました')
            throw error
        } finally {
            setIsClearingReviews(false)
        }
    }

    return {
        reviews,
        latestReview,
        isLoadingReviews,
        isAddingReview,
        isRemovingReview,
        isClearingReviews,
        error,
        addReview: addReviewWithErrorHandling,
        removeReview: removeReviewWithErrorHandling,
        clearAllReviews: clearAllReviewsWithErrorHandling,
        loadReviews: loadReviewsWithErrorHandling,
    }
}
