import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Despedida de Soltero - Migue';
  isSpinning = false;
  currentRotation = 0;
  result = 'Haz clic para girar la ruleta';

  createSpinAudio() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const frequencies = [120, 180, 240, 300, 360, 420, 480, 540];

    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain).connect(audioContext.destination);
      osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.1, audioContext.currentTime + 10);
      gain.gain.setValueAtTime(0.06, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 10);
    });

    // Ruido blanco dinámico para fricción
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 10, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    noiseGain.gain.setValueAtTime(0.04, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 10);

    // Múltiples clics dinámicos
    for (let i = 0; i < 5; i++) {
      const clickOscillator = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      clickOscillator.connect(clickGain);
      clickGain.connect(audioContext.destination);
      clickOscillator.type = 'triangle';
      clickOscillator.frequency.setValueAtTime(1500 + (i * 200), audioContext.currentTime);
      clickOscillator.frequency.exponentialRampToValueAtTime(300 + (i * 100), audioContext.currentTime + 10);
      clickGain.gain.setValueAtTime(0.03, audioContext.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
      clickOscillator.start(audioContext.currentTime + (i * 0.5));
      clickOscillator.stop(audioContext.currentTime + 10);
    }

    // Efecto whoosh
    const whooshOscillator = audioContext.createOscillator();
    const whooshGain = audioContext.createGain();
    whooshOscillator.connect(whooshGain);
    whooshGain.connect(audioContext.destination);
    whooshOscillator.type = 'sine';
    whooshOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    whooshOscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 10);
    whooshGain.gain.setValueAtTime(0.02, audioContext.currentTime);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
    whooshOscillator.start(audioContext.currentTime);
    whooshOscillator.stop(audioContext.currentTime + 10);
  }

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.result = 'Girando...';
    this.createSpinAudio();

    const spins = Math.random() * 4 + 8;
    const finalRotation = spins * 360;
    this.currentRotation += finalRotation;

    setTimeout(() => {
      this.showResult();
      this.isSpinning = false;
    }, 10000);
  }

  showResult() {
    const tasks = [
      'Cantar una canción de amor',
      'Bailar salsa por 2 minutos',
      'Contar el chiste más malo',
      'Hacer 15 flexiones',
      'Imitar un animal por 1 minuto',
      'Decir 3 cumplidos a cada amigo',
      'Hacer una declaración de amor épica',
      'Shot de tequila'
    ];
    const normalizedRotation = (360 - (this.currentRotation % 360)) % 360;
    const segmentIndex = Math.floor(normalizedRotation / 45) % 8;
    this.result = tasks[segmentIndex];
  }

  getRotationStyle() {
    return `rotate(${this.currentRotation}deg)`;
  }

  spinWithSound() {
    this.spin();
  }
} 