// @ts-ignore
import { Component, OnDestroy } from '@angular/core';

// @ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Despedida Migue';
  isSpinning = false;
  currentRotation = 0;
  result = '🔥 ¡Haz clic para girar la ruleta y descubrir tu reto picante!';
  showOptions = false;

  // Todas las tareas para la ruleta (20 retos picantes)
  allTasks = [
    // Para Migue (14 retos)
    '🎤',  // Cantarle una serenata sexy improvisada a todas las chicas
    '🍓',  // Hacerse un striptease frente al grupo
    '💋',  // Dejar que una chica le pinte los labios con pintalabios rojo
    '👅',  // Lamerse sensualmente un dedo y decir "Esto es para ti"
    '💃',  // Bailar reguetón intenso 30 segundos
    '🔥',  // Decir tres frases muy picantes como ligando en un bar
    '🍷',  // Tomarse un shot sin usar las manos
    '📸',  // Posar como modelo erótico para fotos
    '⭐',  // RETO ESPECIAL: Las chicas deciden qué quieren que haga Migue
    '📱',  // Grabar vídeo sexy para su futura esposa
    '💪',  // Hacer flexiones besando manos de chicas
    '🔥',  // Imitar un orgasmo en voz alta
    '🍻',  // Tatuarse palabra elegida en el pecho con pintalabios
    '🩳',  // Adivinar parte del cuerpo con ojos vendados

    // Para Migue + chica (4 retos)
    '🍓',  // Bailar un perreo con chica al azar
    '💃',  // Bailar canción sensual pegados 30 segundos
    '🥂',  // Hacer fondo de alcohol juntos
    '💋',  // Recibir beso marcado con pintalabios

    // Solo chicas (2 retos)
    '🎲',  // Inventar piropo subido de tono para Migue
    '📱'   // Mandar audio sexy al grupo
  ];

  private audioContext?: AudioContext;
  private spinTimeout?: number;
  private activeAudioNodes: AudioNode[] = [];

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    // Limpiar timeout
    if (this.spinTimeout) {
      clearTimeout(this.spinTimeout);
      this.spinTimeout = undefined;
    }

    // Limpiar nodos de audio activos
    this.activeAudioNodes.forEach(node => {
      try {
        node.disconnect();
      } catch (error) {
        // Ignorar errores de desconexión
      }
    });
    this.activeAudioNodes = [];

    // Cerrar contexto de audio
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {
        // Ignorar errores de cierre
      });
      this.audioContext = undefined;
    }
  }

  private isAudioSupported(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  private async initAudioContext(): Promise<AudioContext | null> {
    if (!this.isAudioSupported()) {
      console.warn('Web Audio API no está disponible en este navegador');
      return null;
    }

    try {
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      return this.audioContext;
    } catch (error) {
      console.error('Error inicializando AudioContext:', error);
      return null;
    }
  }

  /**
   * Crea un sonido realista de ruleta física con clics mecánicos y fricción
   */
  async createRealisticWheelAudio(): Promise<void> {
    const audioContext = await this.initAudioContext();
    if (!audioContext) return;

    const duration = 10; // 10 segundos
    const currentTime = audioContext.currentTime;

    // 1. Sonido base de giro (fricción del mecanismo)
    this.createMechanicalFriction(audioContext, currentTime, duration);

    // 2. Clics de los separadores (sonido más realista)
    this.createRealisticClicks(audioContext, currentTime, duration);

    // 3. Sonido de aire/whoosh más sutil
    this.createSubtleWhoosh(audioContext, currentTime, duration);

    // 4. Resonancia de madera (simulando la estructura de la ruleta)
    this.createWoodResonance(audioContext, currentTime, duration);
  }

  private createMechanicalFriction(audioContext: AudioContext, startTime: number, duration: number): void {
    // Crear ruido de fricción más realista
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Generar ruido rosa (más natural que ruido blanco)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < noiseData.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      noiseData[i] = pink * 0.11; // Reducir volumen
    }

    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();

    // Configurar filtro pasa-bajos para sonido más grave
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, startTime + duration);

    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    // Ganancia que disminuye gradualmente
    noiseGain.gain.setValueAtTime(0.15, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);

    this.activeAudioNodes.push(noiseSource, noiseGain, noiseFilter);
  }

  private createRealisticClicks(audioContext: AudioContext, startTime: number, duration: number): void {
    // Crear clics que van desacelerando como una ruleta real, similar al video de referencia
    // Con 20 segmentos, ajustamos los clics para mayor realismo
    const totalClicks = 180; // Clics ajustados para 20 segmentos
    let clickInterval = 0.035; // Intervalo inicial ajustado para 20 segmentos
    let currentTime = startTime + 0.2; // Empezar casi inmediatamente

    for (let i = 0; i < totalClicks && currentTime < startTime + duration - 0.5; i++) {
      this.createSingleClick(audioContext, currentTime, i);

      // Desaceleración más gradual al principio, más pronunciada al final (como en el video)
      if (i < 50) {
        clickInterval *= 1.007; // Desaceleración muy gradual al inicio
      } else if (i < 100) {
        clickInterval *= 1.02; // Desaceleración moderada en el medio
      } else {
        clickInterval *= 1.045; // Desaceleración más rápida al final
      }

      currentTime += clickInterval;
    }
  }

  private createSingleClick(audioContext: AudioContext, time: number, index: number): void {
    // Crear un clic mecánico más similar al del video con sonido más seco y percusivo
    const clickDuration = 0.005; // Click más corto y seco
    const intensity = Math.max(0.3, 1 - (index / 120)); // Clics más fuertes al inicio

    // Componente principal: clic mecánico seco (similar al video)
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    const filter1 = audioContext.createBiquadFilter();

    osc1.type = 'square'; // Onda cuadrada para sonido más mecánico
    osc1.frequency.setValueAtTime(1200, time);
    osc1.frequency.exponentialRampToValueAtTime(300, time + clickDuration);

    // Filtro pasa-altos para sonido más seco
    filter1.type = 'highpass';
    filter1.frequency.setValueAtTime(600, time);

    gain1.gain.setValueAtTime(0.08 * intensity, time);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + clickDuration);

    // Componente de golpe: simula el impacto físico
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    const filter2 = audioContext.createBiquadFilter();

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(180 + (Math.random() * 50), time);

    // Filtro pasa-bajos para el componente grave
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(400, time);

    gain2.gain.setValueAtTime(0.06 * intensity, time);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + clickDuration * 1.5);

    // Ruido impulsivo para mayor realismo
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * clickDuration * 2, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseData.length * 0.1));
    }

    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();

    noiseSource.buffer = noiseBuffer;
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, time);
    noiseFilter.Q.setValueAtTime(2, time);

    noiseGain.gain.setValueAtTime(0.03 * intensity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + clickDuration * 2);

    // Conectar todo
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(audioContext.destination);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(audioContext.destination);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    // Reproducir
    osc1.start(time);
    osc1.stop(time + clickDuration);
    osc2.start(time);
    osc2.stop(time + clickDuration * 1.5);
    noiseSource.start(time);
    noiseSource.stop(time + clickDuration * 2);

    this.activeAudioNodes.push(osc1, gain1, filter1, osc2, gain2, filter2, noiseSource, noiseGain, noiseFilter);
  }

  private createSubtleWhoosh(audioContext: AudioContext, startTime: number, duration: number): void {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, startTime);
    osc.frequency.exponentialRampToValueAtTime(60, startTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, startTime);
    filter.frequency.exponentialRampToValueAtTime(100, startTime + duration);

    gain.gain.setValueAtTime(0.02, startTime);
    gain.gain.setValueAtTime(0.05, startTime + 1);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    this.activeAudioNodes.push(osc, gain, filter);
  }

  private createWoodResonance(audioContext: AudioContext, startTime: number, duration: number): void {
    // Simular la resonancia de la estructura de madera de la ruleta
    const resonanceFreq = 120; // Frecuencia de resonancia típica de madera

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(resonanceFreq, startTime);
    osc.frequency.setValueAtTime(resonanceFreq * 0.8, startTime + duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(resonanceFreq, startTime);
    filter.Q.setValueAtTime(8, startTime); // Q alto para resonancia marcada

    gain.gain.setValueAtTime(0.03, startTime);
    gain.gain.setValueAtTime(0.04, startTime + 2);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    this.activeAudioNodes.push(osc, gain, filter);
  }

  spin(): void {
    if (this.isSpinning) return;

    // Limpiar cualquier animación anterior
    this.cleanup();

    this.isSpinning = true;
    this.result = 'Girando...';

    // Crear audio realista
    this.createRealisticWheelAudio();

    // Calcular rotación
    const spins = Math.random() * 4 + 8; // Entre 8 y 12 vueltas
    const finalRotation = spins * 360;
    this.currentRotation += finalRotation;

    // Configurar timeout con limpieza adecuada
    this.spinTimeout = window.setTimeout(() => {
      this.showResult();
      this.isSpinning = false;
      this.spinTimeout = undefined;
    }, 10000);
  }

  showResult(): void {
    /**
     * Cálculo del segmento basado en la posición final de la ruleta
     * - La ruleta tiene 20 segmentos de 18° cada uno (360° / 20 = 18°)
     * - El puntero está en la posición superior (0°)
     * - Distribución: 14 para Migue + 4 para pareja + 2 para chicas
     */
    const normalizedRotation = this.currentRotation % 360;

    // Convertir la rotación a índice de segmento
    const segmentIndex = Math.floor(normalizedRotation / 18) % 20;

    // Obtener la tarea completa de la lista correspondiente
    let fullTaskDescription = '';
    if (segmentIndex < 14) {
      // Retos para Migue (índices 0-13, 14 retos)
      const migueTasksDescriptions = this.getMigueTasksList();
      fullTaskDescription = migueTasksDescriptions[segmentIndex];
    } else if (segmentIndex < 18) {
      // Retos para Migue + chica (índices 14-17, 4 retos)
      const coupleTasksDescriptions = this.getCoupleTasksList();
      fullTaskDescription = coupleTasksDescriptions[segmentIndex - 14];
    } else {
      // Retos para chicas (índices 18-19, 2 retos)
      const girlsTasksDescriptions = this.getGirlsTasksList();
      fullTaskDescription = girlsTasksDescriptions[segmentIndex - 18];
    }

    // Verificar si es el reto especial (segmento 8)
    if (segmentIndex === 8) {
      this.result = `⭐ RETO ESPECIAL: ${fullTaskDescription}`;
      // Añadir clase especial al resultado
      setTimeout(() => {
        const resultElement = document.querySelector('.result');
        if (resultElement) {
          resultElement.classList.add('special-result');
        }
      }, 100);
    } else {
      this.result = `🔥 Reto: ${fullTaskDescription}`;
      // Remover clase especial si existía
      setTimeout(() => {
        const resultElement = document.querySelector('.result');
        if (resultElement) {
          resultElement.classList.remove('special-result');
        }
      }, 100);
    }
  }

  getRotationStyle(): string {
    return `rotate(${this.currentRotation}deg)`;
  }

  spinWithSound(): void {
    this.spin();
  }

  getMigueTasksList(): string[] {
    return [
      '🎤 Cantarle una serenata sexy improvisada a todas las chicas',
      '🍓 Hacerse un striptease (aunque sea con camisa o camiseta) frente al grupo',
      '💋 Dejar que una chica al azar le pinte los labios con pintalabios rojo',
      '👅 Lamerse sensualmente un dedo y decirle a una chica: "Esto es para ti"',
      '💃 Bailar reguetón intenso en el centro, sin parar durante 30 segundos',
      '🔥 Decir tres frases muy picantes como si estuviera ligando en un bar',
      '🍷 Tomarse un shot sin usar las manos (se lo tienen que dar en la boca)',
      '📸 Posar como modelo erótico mientras las chicas le toman fotos con el móvil',
      '⭐ RETO ESPECIAL: Las chicas pueden decidir libremente qué quieren que haga Migue (¡a su elección total!)',
      '📱 Grabar un vídeo selfie mandando un mensaje sexy para su futura esposa',
      '💪 Hacer 10 flexiones, cada vez que baje debe dar un beso en la mano a una chica diferente',
      '🔥 Imitar un orgasmo en voz alta',
      '🍻 Las chicas eligen una palabra y Migue debe tatuársela en el pecho con pintalabios',
      '🩳 Dejarse vendar los ojos y adivinar qué parte del cuerpo de una chica toca (sin zonas íntimas)'
    ];
  }

  getCoupleTasksList(): string[] {
    return [
      '🍓 Bailar un perreo con una chica elegida al azar',
      '💃 Bailar una canción sensual que ponga la banda en pareja (mínimo 30 segundos pegados)',
      '🥂 Hacer un "fondo de alcohol" con una chica al mismo tiempo. El que tarde más recibe un reto extra',
      '💋 Una chica le deja un beso marcado con pintalabios en el cuello o cara, y Migue debe mantenerlo hasta el siguiente reto'
    ];
  }

  getGirlsTasksList(): string[] {
    return [
      '🎲 Inventar un piropo subido de tono y gritárselo a Migue',
      '📱 Mandar un audio sexy al grupo diciendo: "Migue es el amor de mi vida"'
    ];
  }

  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }

  /**
   * Obtiene la categoría de tarea según el índice
   */
  getTaskCategory(index: number): string {
    if (index < 14) return 'migue';      // Índices 0-13 (14 retos)
    if (index < 18) return 'couple';     // Índices 14-17 (4 retos)
    return 'girls';                      // Índices 18-19 (2 retos)
  }

  /**
   * Verifica si un segmento es el especial (estrella)
   */
  isSpecialSegment(index: number): boolean {
    return index === 8;
  }

  /**
   * Obtiene la descripción completa de una tarea según su índice
   */
  getTaskDescription(index: number): string {
    const category = this.getTaskCategory(index);
    let taskList: string[] = [];
    let adjustedIndex = index;

    switch (category) {
      case 'migue':
        taskList = this.getMigueTasksList();
        adjustedIndex = index;
        break;
      case 'couple':
        taskList = this.getCoupleTasksList();
        adjustedIndex = index - 14;
        break;
      case 'girls':
        taskList = this.getGirlsTasksList();
        adjustedIndex = index - 18;
        break;
    }

    return taskList[adjustedIndex] || 'Reto desconocido';
  }
} 