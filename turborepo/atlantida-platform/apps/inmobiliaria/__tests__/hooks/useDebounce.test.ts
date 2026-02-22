import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/useDebounce'

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 300))
        expect(result.current).toBe('hello')
    })

    it('should not update value before delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'hello', delay: 300 } }
        )

        rerender({ value: 'world', delay: 300 })

        // Advance time but not enough
        act(() => {
            vi.advanceTimersByTime(200)
        })

        expect(result.current).toBe('hello')
    })

    it('should update value after delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'hello', delay: 300 } }
        )

        rerender({ value: 'world', delay: 300 })

        act(() => {
            vi.advanceTimersByTime(300)
        })

        expect(result.current).toBe('world')
    })

    it('should reset timer on rapid changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'a', delay: 300 } }
        )

        // Multiple rapid changes
        rerender({ value: 'ab', delay: 300 })
        act(() => { vi.advanceTimersByTime(100) })

        rerender({ value: 'abc', delay: 300 })
        act(() => { vi.advanceTimersByTime(100) })

        rerender({ value: 'abcd', delay: 300 })
        act(() => { vi.advanceTimersByTime(100) })

        // Still shows initial value (timer kept resetting)
        expect(result.current).toBe('a')

        // Now wait for full delay after last change
        act(() => { vi.advanceTimersByTime(300) })

        expect(result.current).toBe('abcd')
    })

    it('should use default delay of 300ms', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })

        // At 299ms should still be old value
        act(() => { vi.advanceTimersByTime(299) })
        expect(result.current).toBe('initial')

        // At 300ms should be new value
        act(() => { vi.advanceTimersByTime(1) })
        expect(result.current).toBe('updated')
    })

    it('should work with number values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 42, delay: 500 } }
        )

        rerender({ value: 100, delay: 500 })

        act(() => { vi.advanceTimersByTime(500) })

        expect(result.current).toBe(100)
    })

    it('should work with object values', () => {
        const initial = { name: 'test' }
        const updated = { name: 'updated' }

        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: initial, delay: 300 } }
        )

        rerender({ value: updated, delay: 300 })

        act(() => { vi.advanceTimersByTime(300) })

        expect(result.current).toEqual(updated)
    })
})
