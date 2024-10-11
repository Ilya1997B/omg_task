import * as PIXI from 'pixi.js';
import {TheGame} from "./TheGame";
import {createSprite} from "../utils/createSprite";
import {images} from "./images";

export class LetterCircle {
    private letters: string[];
    private gameContainer: TheGame;
    private selectedLetters: PIXI.Text[] = [];
    private isSelecting: boolean = false;
    private foundWords: string[] = [];
    private validWords: string[];
    private previewText: PIXI.Text;
    private selectionLine: PIXI.Graphics;
    private currentPointerPosition: { x: number, y: number } = { x: 0, y: 0 };

    constructor(words: string[], gameContainer: TheGame) {
        this.letters = this.getAllLetters(words);
        this.gameContainer = gameContainer;
        this.validWords = words.sort((a, b) => a.length - b.length); // Сортируем слова по длине
        this.setupLetters();
        this.previewText = new PIXI.Text('', { fontSize: 24, fill: 0xffffff });
        this.setupPreviewText();
        this.selectionLine = new PIXI.Graphics();
        this.gameContainer.addChild(this.selectionLine);

        // Добавляем глобальные обработчики событий
        document.addEventListener('pointerup', () => this.endSelection());
        document.addEventListener('pointerout', () => this.endSelection());
        document.addEventListener('pointermove', (event) => this.updatePointerPosition(event));
    }

    private getAllLetters(words: string[]): string[] {
        const letterCount: { [key: string]: number } = {};

        words.forEach(word => {
            word.split('').forEach(letter => {
                if (letterCount[letter]) {
                    letterCount[letter]++;
                } else {
                    letterCount[letter] = 1;
                }
            });
        });

        const maxLetterCount: { [key: string]: number } = {};

        words.forEach(word => {
            const wordLetterCount: { [key: string]: number } = {};
            word.split('').forEach(letter => {
                if (wordLetterCount[letter]) {
                    wordLetterCount[letter]++;
                } else {
                    wordLetterCount[letter] = 1;
                }
            });

            Object.keys(wordLetterCount).forEach(letter => {
                if (!maxLetterCount[letter] || wordLetterCount[letter] > maxLetterCount[letter]) {
                    maxLetterCount[letter] = wordLetterCount[letter];
                }
            });
        });

        const letters: string[] = [];
        Object.keys(maxLetterCount).forEach(letter => {
            for (let i = 0; i < maxLetterCount[letter]; i++) {
                letters.push(letter);
            }
        });

        return letters;
    }

    private setupLetters() {
        const centerX = this.gameContainer.width / 2;
        const centerY = 250;
        const radius = 120;
        const angleStep = (2 * Math.PI) / this.letters.length;

        // Создаем графику для окружности
        const circle = new PIXI.Graphics();
        circle.lineStyle(20, 0x3E4A68); // Толщина и цвет линии
        circle.drawCircle(centerX, centerY, radius);
        this.gameContainer.addChild(circle);

        this.letters.forEach((letter, index) => {
            const angle = index * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const cell = createSprite(images.ball);

            const letterButton = new PIXI.Text(letter, { fontSize: 57, fill: 0x58595B });
            letterButton.interactive = true;
            cell.x = x - cell.width / 2; // Центрируем ячейку по X
            cell.y = y - cell.height / 2; // Центрируем ячейку по Y
            letterButton.x = cell.width / 2 - letterButton.width / 2;
            letterButton.y = cell.height / 2 - letterButton.height / 2 - 4;

            letterButton.on('pointerdown', () => this.startSelection(letterButton));
            letterButton.on('pointerover', () => this.continueSelection(letterButton));

            cell.addChild(letterButton);
            this.gameContainer.addChild(cell);
        });
    }


    private setupPreviewText() {
        // this.previewText.x = 200;
        this.previewText.y = -200;
        this.gameContainer.addChild(this.previewText);
    }


    private updatePreviewText() {
        const selectedWord = this.selectedLetters.map(letter => letter.text).join('');
        this.previewText.text = `Preview: ${selectedWord}`;
    }

    private startSelection(letterButton: PIXI.Text) {
        this.isSelecting = true;
        this.selectedLetters = [letterButton];
        letterButton.style.fill = 0xff0000; // Изменяем цвет выбранной буквы
        this.updatePreviewText();
        this.updateSelectionLine();
    }

    private continueSelection(letterButton: PIXI.Text) {
        if (this.isSelecting) {
            const index = this.selectedLetters.indexOf(letterButton);
            if (index !== -1) {
                // Если буква уже выбрана, сбрасываем выделение до этой буквы
                this.selectedLetters.slice(index + 1).forEach(letter => letter.style.fill = 0xffffff);
                this.selectedLetters = this.selectedLetters.slice(0, index + 1);
            } else {
                // Если буква еще не выбрана, добавляем ее в выделение
                this.selectedLetters.push(letterButton);
                letterButton.style.fill = 0xff0000; // Изменяем цвет выбранной буквы
            }
            this.updatePreviewText();
            this.updateSelectionLine();
        }
    }

    private endSelection() {
        if (!this.isSelecting) return;

        this.isSelecting = false;
        const selectedWord = this.selectedLetters.map(letter => letter.text).join('');
        console.log(`Selected word: ${selectedWord}`);

        // Проверка слова
        if (this.isValidWord(selectedWord)) {
            console.log(`Valid word: ${selectedWord}`);
            this.foundWords.push(selectedWord);
            this.selectedLetters.forEach(letter => letter.style.fill = 0x00ff00); // Изменяем цвет на зеленый для правильного слова

            // Обновляем ячейки слова
            this.gameContainer.updateWordCells(selectedWord);

            // Возвращаем цвет обратно через некоторое время
            setTimeout(() => {
                this.selectedLetters.forEach(letter => letter.style.fill = 0x58595B); // Возвращаем цвет обратно
                this.selectedLetters = [];
                this.updateSelectionLine();
            }, 1000); // 1 секунда задержки
        } else {
            console.log(`Invalid word: ${selectedWord}`);
            this.selectedLetters.forEach(letter => letter.style.fill = 0x58595B); // Возвращаем цвет обратно
            this.selectedLetters = [];
            this.updateSelectionLine();
        }

        this.previewText.text = ''; // Очищаем превью
    }


    private updateSelectionLine() {
        this.selectionLine.clear();
        if (this.selectedLetters.length > 0) {
            this.selectionLine.lineStyle(2, 0xff0000, 1);
            this.selectionLine.moveTo(this.selectedLetters[0].x, this.selectedLetters[0].y);
            for (let i = 1; i < this.selectedLetters.length; i++) {
                this.selectionLine.lineTo(this.selectedLetters[i].x, this.selectedLetters[i].y);
            }
            // Линия тянется за курсором
            this.selectionLine.lineTo(this.currentPointerPosition.x, this.currentPointerPosition.y);
        }
    }

    private updatePointerPosition(event: PointerEvent) {
        const rect = this.gameContainer.getBounds();
        this.currentPointerPosition.x = event.clientX - rect.left;
        this.currentPointerPosition.y = event.clientY - rect.top;
        if (this.isSelecting) {
            this.updateSelectionLine();
        }
    }

    private isValidWord(word: string): boolean {
        return this.validWords.includes(word) && !this.foundWords.includes(word);
    }
}
