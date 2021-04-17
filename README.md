# @ayte/nullables

![npm (scoped)](https://img.shields.io/npm/v/@ayte/nullables?style=flat-square)
![Coveralls](https://img.shields.io/coveralls/github/ayte-io/ts-nullables?style=flat-square)

I'm so damn done with values being out of range.

And no, safe navigation operators don't save you everywhere.

## Installation

```shell
yarn add @ayte/nullables
# or
npm install @ayte/nullables
```

## Motivation

Nullables (and undefinedables) are a pain. Yes, we have null-safe 
operators now, but they don't solve everything. For example, this:

```ts
const option = environmentVariablesConfiguration.getOption() || 
  fileConfiguration.getOption() ||
  defaultConfiguration.getOption();
```

What could be worse in example above is that option can be boolean, 
which makes ~~my d~~ life even harder. Another example is not "call 
something on this value if it is present" but "do something only if 
value is present/absent", and null-safe operator won't do much here. 
`if (x)` or `x && <expr>` are also good as long as value is not 
boolean - which means it can't be used in generic code.

This library is created to ease such pain (in an extent that is 
possible) with some boilerplate code. Also, it provides some nifty 
overloads that will sometimes allow one to derive actual boolean value,
not just the type (e.g. `isAbsent(null)` is always `false`).

## Usage / Contents

Default export is a namespace containing all the functions, some of them
(which won't introduce ambiguity like `.map()`) are also exported under 
their names.

```typescript
import Nullables, {isPresent, ifPresent, inspect, orElse, orElseSupply, orElseThrow} from './index';

// isAbsent is also available
if (isPresent(window)) {
    // do some browser work
}

// ifAbsent is also available
ifPresent(document, d => d.write('<div>It works!</div>'));

inspect(performance, p => console.log(p.now()), () => console.log('performance is not available'));

const failFast = orElse(configuration.failFast, true); // configuration.failFast || true wouldn't work
const value = orElseSupply(cache.get('entry'), heavyComputation());
const timeout = orElseThrow(configuration.timeout, () => new Error('you forgot to set timeout'));

const doubled = Nullables.map(someNumber, x => x * 2);
const first = Nullables.first([null, undefined, 3]); // 3
const last = Nullables.last([3, undefined, null]); // 3
const present = Nullables.filter([undefined, 3, null]); // [3]
```

## Legal

MIT / UPL-1.0

Ayte Unlimited, 2020

Use it the way you like it.