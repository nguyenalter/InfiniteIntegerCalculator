# Infinite Integer Calculator

Infinite Integer Calculator that using both BigInt and Mathematics approaches.

## What is BigInt type?

The build-in object to represent number larger than [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER).

## What is Mathematics Approach?

School Mathematics teaches us how to adding, subtracting or multiplying by traversing both strings from end, one by one in order to add/subtract/multiply digits and keep track of carry.
With this method, it is effective to calculate because we only have to handle operations in a single digit. The real problems is the computation time.

## Validate Input

Input may start with an unary op like "+" or "-" and following by many digits. Any leading zeros will be remove.

## Features

The calculator can calculate a very large number. In addition, it has some utilities to view calculation history, delete it or even save it locally.

## Demo

Demo version of the calculator can be found [here](https://infinite-calculator.herokuapp.com)

## Tech

Calculator uses a number of open source projects:

- [Bootstrap] - great UI boilerplate for modern web apps
- [Node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [StreamSaver] - the stream saver for saving local file
- [jQuery] - JS frameworks for DOM events
- [fontAwesome] - web's most popular icon set and toolkit
- [custom Blob] - a custom Blob instead of default one


**  Reference Links **
   [Bootstrap]: <https://getbootstrap.com/docs/4.6>
   [Node.js]: <https://nodejs.org>
   [Express]: <http://daringfireball.net>
   [StreamSaver]: <https://www.npmjs.com/package/streamsaver>
   [jQuery]: <https://jquery.com/>
   [fontAwesome]: <https://fontawesome.com/v4.7.0/>
   [custom Blob]: <https://cdn.jsdelivr.net/gh/eligrey/Blob.js/Blob.js>
