/**
 * The built-in {@link Array} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 */
export type JavascriptArray<T> = Array<T>;

/**
 * The built-in {@link Iterator} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterators
 */
export type JavascriptIterator<T> = Iterator<T>;

/**
 * The built-in {@link IteratorResult} type.
 */
export type JavascriptIteratorResult<T> = IteratorResult<T,T>;

/**
 * The built-in {@link Iterable} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterables
 */
export type JavascriptIterable<T> = Iterable<T>;

/**
 * The built-in {@link Map} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export type JavascriptMap<TKey,TValue> = Map<TKey,TValue>;