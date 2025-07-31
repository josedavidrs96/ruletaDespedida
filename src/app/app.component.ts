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

  tasks = [
    'Cantar una canción de amor',
    'Bailar salsa por 2 minutos',
    'Contar el chiste más malo',
    'Hacer 15 flexiones',
    'Imitar un animal por 1 minuto',
    'Decir 3 cumplidos a cada amigo',
    'Hacer una declaración de amor épica',
    'Shot de tequila'
  ];

  spin() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.result = 'Girando...';
    
    const spins = Math.random() * 4 + 4;
    const finalRotation = spins * 360;
    this.currentRotation += finalRotation;
    
    setTimeout(() => {
      this.showResult();
      this.isSpinning = false;
    }, 4000);
  }

  showResult() {
    const normalizedRotation = (360 - (this.currentRotation % 360)) % 360;
    const segmentIndex = Math.floor(normalizedRotation / 45) % 8;
    
    this.result = this.tasks[segmentIndex];
  }

  getRotationStyle() {
    return `rotate(${this.currentRotation}deg)`;
  }
} 