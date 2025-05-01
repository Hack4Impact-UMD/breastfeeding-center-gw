import plugin from 'tailwindcss/plugin';

export default plugin(
  function({ addBase, addComponents }) {
    // Add your shadcn base styles
    addBase({
      // Base styles here
    });
    
    // Add component styles with lower specificity
    addComponents({
      // Component styles here
    }, {
      respectPrefix: true,
      respectImportant: true,
    });
  },
  {
    // Plugin configuration
    theme: {
      extend: {},
    },
  }
);