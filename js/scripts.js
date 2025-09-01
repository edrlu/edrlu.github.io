class PerpetualNeuralWaves {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.size = 200;
        this.gridSize = 20;
        this.cellSize = this.size / this.gridSize;
        this.grid = [];
        this.running = true;
        this.speed = 120;
        
        // Wave cycle parameters
        this.cycleLength = 400; // frames per complete cycle
        this.frame = 0;
        this.phase = 0; // 0-1 representing cycle position
        
        // Wave sources and patterns
        this.waveSources = [];
        this.basePattern = [];
        
        this.initializeSystem();
        this.start();
    }

    initializeSystem() {
        // Initialize grid
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        
        // Create wave sources that move in patterns
        this.waveSources = [
            { x: 0.3, y: 0.3, phase: 0, amplitude: 1, frequency: 0.02 },
            { x: 0.7, y: 0.7, phase: Math.PI, amplitude: 0.8, frequency: 0.025 },
            { x: 0.2, y: 0.8, phase: Math.PI/2, amplitude: 0.9, frequency: 0.018 },
            { x: 0.8, y: 0.2, phase: 3*Math.PI/2, amplitude: 0.7, frequency: 0.022 }
        ];
        
        // Create base interference pattern
        this.generateBasePattern();
    }

    generateBasePattern() {
        this.basePattern = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.basePattern[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                // Create a subtle base interference pattern
                const nx = x / this.gridSize;
                const ny = y / this.gridSize;
                const distance = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
                this.basePattern[y][x] = Math.sin(distance * 8) * 0.1;
            }
        }
    }

    updateWaveSources() {
        // Move wave sources in smooth patterns
        this.waveSources.forEach((source, index) => {
            const t = this.frame * 0.01 + index * Math.PI / 2;
            
            // Circular motion with some variation
            const radius = 0.2 + 0.1 * Math.sin(t * 0.7);
            const centerX = 0.5 + 0.2 * Math.sin(t * 0.3);
            const centerY = 0.5 + 0.2 * Math.cos(t * 0.2);
            
            source.x = centerX + radius * Math.cos(t + source.phase);
            source.y = centerY + radius * Math.sin(t + source.phase);
            
            // Vary amplitude smoothly
            source.amplitude = 0.5 + 0.5 * Math.sin(t * source.frequency * 10);
        });
    }

    calculateWaveValue(x, y) {
        const nx = x / this.gridSize;
        const ny = y / this.gridSize;
        let value = this.basePattern[y][x];
        
        // Add waves from each source
        this.waveSources.forEach(source => {
            const dx = nx - source.x;
            const dy = ny - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Wave equation with time evolution
            const wavePhase = distance * 15 - this.frame * source.frequency * 2;
            const wave = Math.sin(wavePhase + source.phase) * source.amplitude;
            
            // Distance attenuation
            const attenuation = Math.exp(-distance * 3);
            value += wave * attenuation;
        });
        
        // Add some neural-like activation
        const activation = 1 / (1 + Math.exp(-value * 3)); // sigmoid
        
        // Add temporal modulation for smooth cycling
        const temporalMod = 0.5 + 0.5 * Math.sin(this.frame * 0.005 + x * 0.1 + y * 0.1);
        
        return activation * temporalMod;
    }

    update() {
        if (!this.running) return;
        
        this.updateWaveSources();
        
        // Update grid based on wave interference
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const newValue = this.calculateWaveValue(x, y);
                
                // Smooth transition
                this.grid[y][x] = this.grid[y][x] * 0.7 + newValue * 0.3;
            }
        }
        
        this.frame++;
        this.phase = (this.frame % this.cycleLength) / this.cycleLength;                
    }

    render() {
        this.container.querySelectorAll('.cell').forEach(cell => cell.remove());
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const value = this.grid[y][x];
                
                if (value > 0.15) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    
                    const size = this.cellSize * (0.3 + value * 0.7);
                    const offset = (this.cellSize - size) / 2;
                    
                    cell.style.left = `${x * this.cellSize + offset}px`;
                    cell.style.top = `${y * this.cellSize + offset}px`;
                    cell.style.width = `${size}px`;
                    cell.style.height = `${size}px`;
                    
                    // Color gradient based on value
                    const intensity = Math.min(1, value);
                    const hue = 270 + intensity * 30; // Purple to pink
                    const saturation = 70 + intensity * 30;
                    const lightness = 30 + intensity * 50;
                    
                    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                    cell.style.backgroundColor = color;
                    cell.style.opacity = intensity * 0.9 + 0.1;
                    
                    // Add glow for high values
                    if (intensity > 0.6) {
                        cell.style.boxShadow = `
                            0 0 ${intensity * 15}px ${color},
                            0 0 ${intensity * 25}px ${color}66
                        `;
                        cell.style.animation = 'glow-pulse 2s ease-in-out infinite';
                    }
                    
                    // Subtle rotation based on position and time
                    const rotation = (x + y + this.frame * 0.1) * 5;
                    cell.style.transform = `rotate(${rotation}deg)`;
                    
                    this.container.appendChild(cell);
                }
            }
        }
    }

    start() {
        const loop = () => {
            this.update();
            this.render();
            setTimeout(() => requestAnimationFrame(loop), this.speed);
        };
        loop();
    }
}

// Initialize the neural wave system
const neuralSystem = new PerpetualNeuralWaves('neuralWave');
