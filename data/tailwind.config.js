/** @type {import('tailwindcss').Config} */
export default {
	content: [
    './public/**/*.{html,jsx,js}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
				primary: {
    '50': '#fef2f2',
    '100': '#fee5e6',
    '200': '#fccfd3',
    '300': '#f9a8ae',
    '400': '#f57783',
    '500': '#ec475b',
    '600': '#dc3954',
    '700': '#b61a38',
    '800': '#981935',
    '900': '#831833',
    '950': '#490817',
},
	tuna: {
    '50': '#f6f7f9',
    '100': '#edeef1',
    '200': '#d7dae0',
    '300': '#b4bac5',
    '400': '#8a94a6',
    '500': '#6c778b',
    '600': '#576072',
    '700': '#474e5d',
    '800': '#3d434f',
    '900': '#333740',
    '950': '#24262d',
},

				'red': '#dc3954'
      }
    },
    fontFamily: {
      'body': [
    'Inter', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ],
      'sans': [
    'Inter', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ]
    }
  }

}

