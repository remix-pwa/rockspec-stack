module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "128/85": "128 / 85",
        "128/70": "128 / 70",
        "128/55": "128 / 55",
      }
    },
    fontFamily: {
      "mokoto-0": ['mokoto-0', 'sans-serif'],
      "mokoto": ['mokoto-1', 'sans-serif'],
      "mokoto-2": ['mokoto-2', 'sans-serif'],
      "mokoto-3": ['mokoto-3', 'sans-serif'],
      "anxiety": ['Anxiety', 'sans-serif'],
      "modern-sans": ['Moderne Sans', 'sans-serif'],
    }
  },
  plugins: [],
}
