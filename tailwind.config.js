/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xs-start': '390px',
      'xs-mid': '420px',
      'xs-end': '470px',
      'sm-start': '479px',
      'sm-mid': '520px',
      'sm-end': '580px',
      'md-start': '620px',
      'md-mid': '680px',
      'md-end': '740px',
      'lg-start': '870px',
      'lg-mid': '980px',
      'lg-end': '1120px',
      'xl-start': '1200px',
      'xl-mid': '1279px',
      'xl-end': '1380px',
      '2xl': '1536px',
    },
    extend: {
      boxShadow: {
        navbar: "0px 4px 30px rgba(0, 0, 0, 0.16)",
      },
      animation: {
        'flip': 'flipY 0.8s ease-in-out',
        'shine': 'shine 1.2s ease-in-out',
        'shine-loop': 'shineLoop 5s ease-in-out infinite',
        'shine-mask': 'shineMask 5s ease-in-out infinite',
      },
      keyframes: {
        flipY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        shineMask: {
          '0%': { 
            '-webkit-mask-position': '250%',
            'mask-position': '250%'
          },
          '100%': { 
            '-webkit-mask-position': '-150%',
            'mask-position': '-150%'
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    function({ addUtilities }) {
      const newUtilities = {
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.perspective-100': {
          perspective: '100px',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.transform-gpu': {
          transform: 'translateZ(0)',
        },
        '.shine-mask': {
          '-webkit-mask-image': 'linear-gradient(-75deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.92) 30%, #000 40%, #000 60%, rgba(0,0,0,.92) 70%, rgba(0,0,0,.88) 100%)',
          'mask-image': 'linear-gradient(-75deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.92) 30%, #000 40%, #000 60%, rgba(0,0,0,.92) 70%, rgba(0,0,0,.88) 100%)',
          '-webkit-mask-size': '400%',
          'mask-size': '400%',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
