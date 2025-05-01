import { Dispatch, SetStateAction } from 'react'
export interface GlobalStateHook<State> {
    (): [State, Dispatch<SetStateAction<State>>]
}
declare function createGlobalStateHook<State = undefined>(initialState: State | (() => State)): GlobalStateHook<State>
export default createGlobalStateHook;
