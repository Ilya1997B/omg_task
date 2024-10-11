import * as PIXI from 'pixi.js';
import { TheGame } from '../../src/game/TheGame'

const App = new PIXI.Application({ width: 640, height: 1136, backgroundColor: 0x2B344B });
const game = new TheGame();

// Устанавливаем точку поворота в центр TheGame
game.pivot.set(game.width / 2, game.height / 2);

// Размещаем TheGame в центре App
game.position.set(App.screen.width / 2, App.screen.height / 2);

App.stage.addChild(game);
document.body.appendChild(App.view as HTMLCanvasElement);
console.log('ff')

// Применяем стили для центрирования canvas
if (App.view) {
    const style = App.view.style as CSSStyleDeclaration;
    style.position = 'absolute';
    style.left = '50%';
    style.top = '50%';
    style.transform = 'translate(-50%, -50%)';
}

// Функция для изменения размера canvas и масштабирования содержимого
function resize() {
    App.renderer.resize(640, 1136);

    game.position.set(App.screen.width / 2, App.screen.height / 2);

    const scaleX = window.innerWidth / 1024;
    const scaleY = window.innerHeight / 1024;
    const scale = Math.min(scaleX, scaleY);

    game.scale.set(scale, scale);
}

// Добавляем обработчик события resize
window.addEventListener('resize', resize);

// Вызываем функцию resize при загрузке страницы
resize();
