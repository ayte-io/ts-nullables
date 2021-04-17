// noinspection JSUnusedGlobalSymbols

type Absent = undefined | null;
type Materialized<T> = NonNullable<T>;
type Indeterminate<T> = Materialized<T> | Absent;
type throws = never;
type Nullable<T> = T | null;

type PresentOrElse<T, E> = Materialized<T> | E;
type PresentOrNull<T> = PresentOrElse<T, null>;
type PresentOrThrows<T> = PresentOrElse<T, throws>;

namespace Nullables {
    /**
     * Returns true if value is null or undefined.
     *
     * @param value Subject tested for presence.
     */
    export function isAbsent<T>(value: Indeterminate<T>): value is Absent;
    export function isAbsent<T>(value: Indeterminate<T>): value is Absent {
        return value === null || typeof value === 'undefined';
    }

    /**
     * Returns true if value is not null and is not undefined.
     *
     * @param value Subject tested for presence.
     */
    export function isPresent<T>(value: Indeterminate<T>): value is Materialized<T>;
    export function isPresent<T>(value: Indeterminate<T>): value is Materialized<T> {
        return !isAbsent(value);
    }

    export function ifPresent<T extends Absent>(value: T, consumer: (value: T) => void): T;
    export function ifPresent<T>(value: Materialized<T>, consumer: (value: T) => void): Materialized<T>;
    /**
     * Calls consumer with value as argument if value is present.
     *
     * @param value Argument passed to consumer.
     * @param consumer Function that is called if value is present.
     *
     * @return Indeterminate<T> Unmodified value that has been passed.
     */
    export function ifPresent<T>(value: Indeterminate<T>, consumer: (value: Materialized<T>) => void): Indeterminate<T>;
    export function ifPresent<T>(value: Indeterminate<T>, consumer: (value: Materialized<T>) => void): Indeterminate<T> {
        if (isPresent(value)) {
            consumer(value);
        }

        return value;
    }

    export function ifAbsent<T extends Absent>(value: T, action: () => void): T;
    export function ifAbsent<T>(value: Materialized<T>, action: () => void): Materialized<T>;
    /**
     * Calls provided action if value isn't present
     *
     * @param value Value to be tested for presence.
     * @param action Function to be called if value is absent.
     *
     * @return Indeterminate<T> Unmodified value.
     */
    export function ifAbsent<T>(value: Indeterminate<T>, action: () => void): Indeterminate<T>;
    export function ifAbsent<T>(value: Indeterminate<T>, action: () => void): Indeterminate<T> {
        if (isAbsent(value)) {
            action();
        }

        return value;
    }

    export function inspect<T extends Absent>(value: T, onPresent: (value: Materialized<T>) => void, onAbsent: () => void): T;
    export function inspect<T>(value: Materialized<T>, onPresent: (value: Materialized<T>) => void, onAbsent: () => void): Materialized<T>;
    /**
     * Combination of {@link isPresent()} and {@link isAbsent()}.
     *
     * @param value Value tested for presence.
     * @param onPresent Function to be called with value as argument
     * if latter is present.
     * @param onAbsent Function to be called if value is absent.
     */
    export function inspect<T>(value: Indeterminate<T>, onPresent: (value: Materialized<T>) => void, onAbsent: () => void): Indeterminate<T>;
    export function inspect<T>(value: Indeterminate<T>, onPresent: (value: Materialized<T>) => void, onAbsent: () => void): Indeterminate<T> {
        if (isPresent(value)) {
            onPresent(value);
        } else {
            onAbsent();
        }

        return value;
    }

    export function orElse<T, V = Indeterminate<T>>(value: Materialized<T>, fallback: V): Materialized<T>;
    export function orElse<T extends Absent, V extends T>(value: Absent, fallback: V): V;
    /**
     * Returns either provided value if it is present or fallback
     * argument otherwise.
     *
     * @param value Subject tested for presence.
     * @param fallback Value to return in case main value is absent.
     */
    export function orElse<T, V = Indeterminate<T>>(value: Indeterminate<T>, fallback: V): PresentOrElse<T, V>;
    export function orElse<T, V = Indeterminate<T>>(value: Indeterminate<T>, fallback: V): PresentOrElse<T, V> {
        if (isPresent(value)) {
            return value;
        }

        return fallback;
    }

    export function orElseNull(value: Absent): null;
    export function orElseNull<T>(value: Materialized<T>): Materialized<T>;
    /**
     * Returns provided value if it is present, null otherwise.
     *
     * @param value Subject being checked.
     */
    export function orElseNull<T>(value: Indeterminate<T>): PresentOrNull<T>;
    export function orElseNull<T>(value: Indeterminate<T>): PresentOrNull<T> {
        return isPresent(value) ? value : null;
    }

    /**
     * Same as {@link orElse()}, but instead of providing ready value it
     * accepts factory function that is used to provide fallback value
     * in case main value is absent.
     *
     * This may be useful if fallback value computation is heavy and
     * should be avoided.
     *
     * @param value Value that is returned if it is present.
     * @param factory Fallback value factory that is called if main
     * value is absent.
     */
    export function orElseSupply<T, V = Indeterminate<T>>(value: Indeterminate<T>, factory: () => V): PresentOrElse<T, V>;
    export function orElseSupply<T, V = Indeterminate<T>>(value: Indeterminate<T>, factory: () => V): PresentOrElse<T, V> {
        return isPresent(value) ? value : factory();
    }

    export function orElseThrow<T, E = Error>(value: Materialized<T>, factory?: () => E): Materialized<T>;
    export function orElseThrow<T extends Absent, E = Error>(value: T, factory?: () => E): throws;
    /**
     * Returns provided value or throws an error.
     *
     * @param value Value to be checked and returned in case of
     * presence.
     * @param factory Error factory to provide error if main value is
     * absent.
     */
    export function orElseThrow<T, E = Error>(value: Indeterminate<T>, factory?: () => E): PresentOrThrows<T>;
    export function orElseThrow<T, E = Error>(value: Indeterminate<T>, factory?: () => E): PresentOrThrows<T> {
        if (isPresent(value)) {
            return value as Materialized<T>;
        }

        throw isPresent(factory) ? factory() : new Error('Absent value passed');
    }

    export function first<T extends Absent>(...values: Array<T>): T;
    export function first<T>(...values: Array<Materialized<T>>) : PresentOrNull<T>;
    /**
     * Returns first non-absent element of array, null if such doesn't
     * exist.
     *
     * @param values Input array.
     */
    export function first<T>(...values: Array<Indeterminate<T>>): PresentOrNull<T>;
    export function first<T>(...values: Array<Indeterminate<T>>): PresentOrNull<T> {
        for (const value of values) {
            if (isPresent(value)) {
                return value;
            }
        }

        return null;
    }

    export function last<T extends Absent>(...values: Array<T>): null;
    export function last<T>(...values: Array<Materialized<T>>): PresentOrNull<T>;
    /**
     * Returns last non-absent element of array, null if such doesn't
     * exist.
     *
     * @param values Input array.
     */
    export function last<T>(...values: Array<Indeterminate<T>>): PresentOrNull<T>;
    export function last<T>(...values: Array<Indeterminate<T>>): PresentOrNull<T> {
        for (let i = values.length - 1; i >= 0; i--) {
            const element = values[i];
            if (isPresent(element)) {
                return element;
            }
        }

        return null;
    }

    export function resolve(...values: Array<Absent>): throws;
    export function resolve<T>(...values: Array<Indeterminate<T>>): PresentOrThrows<T>;
    /**
     * Returns first non-absent value of array or throws an error. This
     * may be useful when resolving configuration option:
     *
     * {@code
     * const flag = Nullables.resolve(cli.getFlag(), environment.getFlag(), file.getFlag());
     * }
     *
     * @param values Input values.
     */
    export function resolve<T>(...values: Array<Indeterminate<T>>): PresentOrThrows<T> {
        return orElseThrow(first(...values), () => {
            const message = 'Provided argument list doesn\'t have any non-absent values';
            return new Error(message);
        });
    }

    export function map(value: Absent, transformer: () => void): null;
    export function map<T, V>(value: Materialized<T>, transformer: (value: Materialized<T>) => V): V;
    /**
     * If value is not absent, calls transformer on that value and
     * returns result, otherwise returns null.
     *
     * @param value Possibly absent value.
     * @param transformer Transformer function to call on present value.
     */
    export function map<T, V>(value: Indeterminate<T>, transformer: (value: Materialized<T>) => V): Nullable<V>;
    export function map<T, V>(value: Indeterminate<T>, transformer: (value: Materialized<T>) => V): Nullable<V> {
        return isPresent(value) ? transformer(value) : null;
    }

    /**
     * Filters passed array, returning new array with only non-absent
     * values.
     *
     * @param values Array with possibly absent values.
     */
    export function filter<T>(...values: Array<Indeterminate<T>>): Array<Materialized<T>> {
        // not using .filter() just for type safety

        const accumulator: Array<Materialized<T>> = [];

        for (const value of values) {
            if (isPresent(value)) {
                accumulator.push(value);
            }
        }

        return accumulator;
    }
}

export default Nullables;

export const isPresent = Nullables.isPresent;
export const isAbsent = Nullables.isAbsent;
export const ifPresent = Nullables.ifPresent;
export const ifAbsent = Nullables.ifAbsent;
export const inspect = Nullables.inspect;
export const orElse = Nullables.orElse;
export const orElseNull = Nullables.orElseNull;
export const orElseSupply = Nullables.orElseSupply;
export const orElseThrow = Nullables.orElseThrow;