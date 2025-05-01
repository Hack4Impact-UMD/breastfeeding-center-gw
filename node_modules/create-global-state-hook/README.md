# crete-global-state-hook

Creates a hook like useState but all instances will have a single shared storage

## Example

```js
import creteGlobalStateHook from 'crete-global-state-hook'

const useGlobalCounter = createGlobalStateHook(0)

export default function GlobalCounter() {
    const [count, setCount] = useGlobalCounter()
    return (
        <div>
            <input type="button" value="-" onClick={() => setCount(count - 1)} />
            {count}
            <input type="button" value="+" onClick={() => setCount(count + 1)} />
        </div>
    )
}
```
