# genbokeh

A modern web application that generates beautiful bokeh wallpapers using HTML5 Canvas and Web Workers. Built with TypeScript, Vite, and dat.GUI.

![chrome_YuiUNcBF5y](https://github.com/user-attachments/assets/0825afdd-8b53-487b-96bc-2969c261f5fe)

## Features

- 🎨 Real-time bokeh effect generation
- ⚡ Web Worker support for better performance
- 🎯 Multiple shape options (Circle, Polygon, Star, Hearts)
- 🌈 Customizable colors and effects
- 📱 Responsive design
- 💾 Save generated images
- ⚙️ Extensive customization options
- ⏱️ Performance metrics

## Customization Options

### Image Settings
- Width and Height
- Image format (PNG, JPEG, WEBP)

### Bokeh Properties
- Shape type (Circle, Polygon, Star, Hearts)
- Number of vertices
- Maximum size
- Blur effect
- Stroke options
- Rotation settings
- Particle count

### Color Settings
- Hue
- Saturation
- Lightness
- Alpha
- Random hue options
  - None
  - Rainbow
  - Random in range

## Performance

The application uses Web Workers to offload the heavy computation of bokeh generation to a separate thread, ensuring smooth UI performance. If Web Workers are not supported, it gracefully falls back to main thread processing.

## Development

### Prerequisites

- Bun (latest is recommend)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/michioxd/genbokeh.git
cd genbokeh
```

2. Install dependencies:
```bash
bun i
```

3. Start the development server:
```bash
bun dev
```

4. Build for production:
```bash
bun build
```

## Technologies Used

- TypeScript
- Vite
- dat.GUI
- HTML5 Canvas
- Web Workers
- SCSS

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [michioxd](https://github.com/michioxd)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
