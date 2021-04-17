import Nullables from '../../src';

const PresentValues: {[key: string]: any} = {
    number: 0,
    boolean: false,
    string: '',
    array: [],
    dictionary: {}
};

const AbsentValues: {[key: string]: any} = {
    null: null,
    undefined: undefined
}

describe('index.ts', () => {
    describe('Nullables', () => {
        describe('.isPresent()', () => {
            for (let key in PresentValues) {
                it(`returns true for ${key}`, () => {
                    expect(Nullables.isPresent(PresentValues[key])).toBe(true);
                });
            }

            for (let key in AbsentValues) {
                it(`returns false for ${key}`, () => {
                    expect(Nullables.isPresent(AbsentValues[key])).toBe(false);
                });
            }
        });
        
        describe('.isAbsent()', () => {
            for (let key in PresentValues) {
                it(`returns false for ${key}`, () => {
                    expect(Nullables.isAbsent(PresentValues[key])).toBe(false);
                });
            }

            for (let key in AbsentValues) {
                it(`returns true for ${key}`, () => {
                    expect(Nullables.isAbsent(AbsentValues[key])).toBe(true);
                });
            }
        });
        
        describe('.ifPresent()', () => {
            for (let key in PresentValues) {
                it(`calls consumer for ${key}`, () => {
                    const consumer = jest.fn();
                    const value = PresentValues[key];
                    expect(Nullables.ifPresent(value, consumer)).toBe(value);
                    expect(consumer).toHaveBeenCalledTimes(1);
                    expect(consumer).toHaveBeenCalledWith(value);
                });
            }

            for (let key in AbsentValues) {
                it(`doesn't call consumer for ${key}`, () => {
                    const consumer = jest.fn();
                    const value = PresentValues[key];
                    expect(Nullables.ifPresent(value, consumer)).toBe(value);
                    expect(consumer).toHaveBeenCalledTimes(0);
                });
            }
        });

        describe('.ifAbsent()', () => {
            for (let key in PresentValues) {
                it(`doesn't call action for ${key}`, () => {
                    const action = jest.fn();
                    const value = PresentValues[key];
                    expect(Nullables.ifAbsent(value, action)).toBe(value);
                    expect(action).toHaveBeenCalledTimes(0);
                });
            }

            for (let key in AbsentValues) {
                it(`calls action for ${key}`, () => {
                    const action = jest.fn();
                    const value = PresentValues[key];
                    expect(Nullables.ifAbsent(value, action)).toBe(value);
                    expect(action).toHaveBeenCalledTimes(1);
                });
            }
        });

        describe('.inspect()', () => {
            for (let key in PresentValues) {
                it(`calls consumer but not action for ${key}`, () => {
                    const consumer = jest.fn();
                    const action = jest.fn();
                    const value = PresentValues[key];
                    expect(Nullables.inspect(value, consumer, action)).toBe(value);
                    expect(consumer).toHaveBeenCalledTimes(1);
                    expect(consumer).toHaveBeenCalledWith(value);
                    expect(action).toHaveBeenCalledTimes(0);
                });
            }

            for (let key in AbsentValues) {
                it(`calls action but not consumer for ${key}`, () => {
                    const consumer = jest.fn();
                    const action = jest.fn();
                    const value = AbsentValues[key];
                    expect(Nullables.inspect(value, consumer, action)).toBe(value);
                    expect(consumer).toHaveBeenCalledTimes(0);
                    expect(action).toHaveBeenCalledTimes(1);
                });
            }
        });

        describe('.orElse()', () => {
            for (let key in PresentValues) {
                it(`doesn't return fallback on ${key}`, () => {
                    const value = PresentValues[key];
                    expect(Nullables.orElse(value, NaN)).toBe(value);
                });
            }

            for (let key in AbsentValues) {
                it(`returns fallback value on ${key}`, () => {
                    const fallback = {};
                    expect(Nullables.orElse(AbsentValues[key], fallback)).toBe(fallback);
                });
            }
        });

        describe('.orElseNull()', () => {
            for (let key in PresentValues) {
                it(`doesn't return null on ${key}`, () => {
                    const value = PresentValues[key];
                    expect(Nullables.orElseNull(value)).toBe(value);
                });
            }

            for (let key in AbsentValues) {
                it(`returns null on ${key}`, () => {
                    expect(Nullables.orElseNull(AbsentValues[key])).toBeNull();
                });
            }
        });

        describe('.orElseSupply()', () => {
            for (let key in PresentValues) {
                it(`doesn't call fallback factory on ${key}`, () => {
                    const value = PresentValues[key];
                    const factory = jest.fn();
                    expect(Nullables.orElseSupply(value, factory)).toBe(value);
                    expect(factory).toHaveBeenCalledTimes(0);
                });
            }

            for (let key in AbsentValues) {
                it(`returns fallback value on ${key}`, () => {
                    const fallback = {};
                    const factory = jest.fn(() => fallback);
                    expect(Nullables.orElseSupply(AbsentValues[key], factory)).toBe(fallback);
                    expect(factory).toHaveBeenCalledTimes(1);
                });
            }
        });

        describe('.orElseThrow()', () => {
            for (let key in PresentValues) {
                it(`doesn't throw on ${key}`, () => {
                    const value = PresentValues[key];
                    expect(Nullables.orElseThrow(value)).toBe(value);
                });

                it(`uses provided factory on ${key}`, () => {
                    const value = PresentValues[key];
                    const factory = jest.fn(() => new Error());
                    expect(Nullables.orElseThrow(value, factory)).toBe(value);
                    expect(factory).toHaveBeenCalledTimes(0);
                });
            }

            for (let key in AbsentValues) {
                it(`throws on ${key}`, () => {
                    expect(() => Nullables.orElseThrow(AbsentValues[key])).toThrowError();
                });

                it(`uses provided factory on ${key}`, () => {
                    const error = new Error('text');
                    const factory = jest.fn(() => error);
                    expect(() => Nullables.orElseThrow(AbsentValues[key], factory)).toThrowError(error.message);
                    expect(factory).toHaveBeenCalledTimes(1);
                });
            }
        });

        describe('.resolve()', () => {
            it('throws on empty input', () => {
                expect(() => Nullables.resolve()).toThrowError();
            });

            for (let key in PresentValues) {
                it(`doesn't throw if ${key} is one of supplied values`, () => {
                    const value = PresentValues[key];
                    expect(Nullables.resolve(value)).toBe(value);
                    expect(Nullables.resolve(value, null, undefined)).toBe(value);
                    expect(Nullables.resolve(null, value, undefined)).toBe(value);
                    expect(Nullables.resolve(null, undefined, value)).toBe(value);
                });
            }

            for (let key in AbsentValues) {
                it(`throws on ${key} as input`, () => {
                    expect(() => Nullables.resolve(AbsentValues[key])).toThrowError();
                });
            }
        });

        describe('.first()', () => {
            it('returns null on empty input', () => {
                expect(Nullables.first()).toBeNull();
            });

            for (let key in PresentValues) {
                it(`returns ${key} if it is first non-absent value`, () => {
                    const value = PresentValues[key];
                    expect(Nullables.first(value)).toBe(value);
                    expect(Nullables.first(null, undefined, value, {})).toBe(value);
                });

                it(`doesn't return ${key} if it is not first non-absent value`, () => {
                    const value = PresentValues[key];
                    const prepended = {};
                    expect(Nullables.first(prepended, value)).toBe(prepended);
                    expect(Nullables.first(null, undefined, prepended, value)).toBe(prepended);
                });
            }

            for (let key in AbsentValues) {
                it(`ignores ${key}`, () => {
                    const appended = {};
                    expect(Nullables.first(AbsentValues[key])).toBeNull();
                    expect(Nullables.first(AbsentValues[key], appended)).toBe(appended);
                });
            }
        });

        describe('.last()', () => {
            it('returns null on empty input', () => {
                expect(Nullables.last()).toBeNull();
            });

            for (let key in PresentValues) {
                it(`returns ${key} if it is last non-absent value`, () => {
                    const value = PresentValues[key];
                    expect(Nullables.last(value, undefined)).toBe(value);
                    expect(Nullables.last({}, value, null, undefined)).toBe(value);
                });

                it(`doesn't return ${key} if it is not first non-absent value`, () => {
                    const value = PresentValues[key];
                    const appended = {};
                    expect(Nullables.last(value, appended)).toBe(appended);
                    expect(Nullables.last(value, appended, undefined, null)).toBe(appended);
                });
            }

            for (let key in AbsentValues) {
                it(`ignores ${key}`, () => {
                    const prepended = {};
                    expect(Nullables.last(AbsentValues[key])).toBeNull();
                    expect(Nullables.last(prepended, AbsentValues[key])).toBe(prepended);
                });
            }
        });

        describe('.map()', () => {
            for (let key in PresentValues) {
                it(`calls transformer for ${key}`, () => {
                    const result = {};
                    const transformer = jest.fn(() => result);
                    expect(Nullables.map(PresentValues[key], transformer)).toBe(result);
                    expect(transformer).toHaveBeenCalledTimes(1);
                });
            }

            for (let key in AbsentValues) {
                it(`returns null for ${key}`, () => {
                    const transformer = jest.fn();
                    expect(Nullables.map(AbsentValues[key], transformer)).toBeNull();
                    expect(transformer).toHaveBeenCalledTimes(0);
                });
            }
        });

        describe('.filter()', () => {
            it('removes absent values from array', () => {
                const present = Object.values(PresentValues);
                const combined = present.slice().concat(Object.values(AbsentValues));

                expect(Nullables.filter(...combined)).toEqual(present);
            });
        });
    });
});