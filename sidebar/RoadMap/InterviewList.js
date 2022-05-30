module.exports = {
  type: 'category',
  label: 'Interview Questions',
  items: [
    {
      CSS: ['RoadMap/Interview/CSS/css-questions'],
      JavaScript: [
        {
          Scope: [
            'RoadMap/Interview/JavaScript/Scope-Variables/scope-of-variables',
          ],
          Hoisting: [
            'RoadMap/Interview/JavaScript/Hoisting/hoisting-basic',
            'RoadMap/Interview/JavaScript/Hoisting/hoisting-questions-01',
          ],
          Closure: ['RoadMap/Interview/JavaScript/Closure/closure-basic'],
          IIFE: ['RoadMap/Interview/JavaScript/IIFE/IIFE-basic'],
        },
      ],
      ES6Plus: [
        'RoadMap/Interview/ES6Plus/es6-arrow-function',
        'RoadMap/Interview/ES6Plus/es6-template-literals',
      ],
      Frameworks: [
        'RoadMap/Interview/JS-Frameworks/js-frameworks-general-basic',
        'RoadMap/Interview/JS-Frameworks/lifecycle-basic',
        'RoadMap/Interview/JS-Frameworks/props-basic',
        {
          Router: ['RoadMap/Interview/JS-Frameworks/Router/vue-router'],
        },
      ],
    },
  ],
};
