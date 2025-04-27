const { useState, useCallback, useEffect } = require('react')

module.exports = function createGlobalStateHook(initialState) {
    const rerenders = []
    const rerenderAll = () => rerenders.forEach(rerender => rerender())
    let state = initialState instanceof Function ? initialState() : initialState

    return function useGlobalState() {
        const setRerenderState = useState({})[1]
        const rerender = useCallback(() => setRerenderState({}), [setRerenderState])

        useEffect(() => {
            rerenders.push(rerender)
            return () => {
                rerenders.splice(rerenders.findIndex(rerender), 1)
            }
        }, [rerender])

        const setState = useCallback(
            newState => {
                if (newState instanceof Function) state = newState(state)
                else state = newState
                rerenderAll()
            },
            [rerender]
        )

        return [state, setState]
    }
}
