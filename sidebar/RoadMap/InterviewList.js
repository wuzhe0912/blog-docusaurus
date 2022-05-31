module.exports = {
  type: 'category',
  label: 'Interview Questions',
  items: [
    {
      Review: ['RoadMap/Interview/Review/review-list'],
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
        {
          React: ['RoadMap/Interview/JS-Frameworks/React/react-common'],
          Vue: [
            'RoadMap/Interview/JS-Frameworks/Vue/vue-common',
            'RoadMap/Interview/JS-Frameworks/Vue/vue-api',
          ],
          Lifecycle: [
            'RoadMap/Interview/JS-Frameworks/Lifecycle/vue-lifecycle',
            'RoadMap/Interview/JS-Frameworks/Lifecycle/react-lifecycle',
          ],
          Props: [
            'RoadMap/Interview/JS-Frameworks/Props/vue-props',
            'RoadMap/Interview/JS-Frameworks/Props/react-props',
          ],
          Router: ['RoadMap/Interview/JS-Frameworks/Router/vue-router'],
          Store: [
            'RoadMap/Interview/JS-Frameworks/Store/vuex',
            'RoadMap/Interview/JS-Frameworks/Store/redux',
          ],
        },
      ],
    },
  ],
};
