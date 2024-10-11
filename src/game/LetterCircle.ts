import * as PIXI from 'pixi.js';
import {WordCell} from "./WordCell";
import {TheGame} from "./TheGame";

export class LetterCircle {
    private letters: string[];
    private gameContainer: TheGame;
    private selectedLetters: PIXI.Text[] = [];
    private isSelecting: boolean = false;
    private foundWords: string[] = [];
    private validWords: string[];
    private previewText: PIXI.Text;
    private wordCells: WordCell[] = [];
    private selectionLine: PIXI.Graphics;
    private currentPointerPosition: { x: number, y: number } = { x: 0, y: 0 };

    constructor(words: string[], gameContainer: TheGame) {
        this.letters = this.getAllLetters(words);
        this.gameContainer = gameContainer;
        this.validWords = words.sort((a, b) => a.length - b.length); // Сортируем слова по длине
        this.setupLetters();
        this.setupFoundWordsDisplay();
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
        const centerY = 200;
        const radius = 200;
        const angleStep = (2 * Math.PI) / this.letters.length;

        this.letters.forEach((letter, index) => {
            const angle = index * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const letterButton = new PIXI.Text(letter, { fontSize: 24, fill: 0xffffff });
            letterButton.interactive = true;
            letterButton.x = x;
            letterButton.y = y;

            letterButton.on('pointerdown', () => this.startSelection(letterButton));
            letterButton.on('pointerover', () => this.continueSelection(letterButton));

            this.gameContainer.addChild(letterButton);
        });
    }

    private setupFoundWordsDisplay() {
        const foundWordsText = new PIXI.Text('Found Words:', { fontSize: 18, fill: 0xffffff });
        foundWordsText.x = -200;
        foundWordsText.y = -300;
        this.gameContainer.addChild(foundWordsText);
    }

    private setupPreviewText() {
        // this.previewText.x = 200;
        this.previewText.y = -200;
        this.gameContainer.addChild(this.previewText);
    }

    private updateFoundWordsDisplay() {
        const foundWordsText = this.gameContainer.children.find(child => child instanceof PIXI.Text && child.text.startsWith('Found Words:')) as PIXI.Text;
        foundWordsText.text = `Found Words: ${this.foundWords.join(', ')}`;
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
            this.updateFoundWordsDisplay();
            this.selectedLetters.forEach(letter => letter.style.fill = 0x00ff00); // Изменяем цвет на зеленый для правильного слова

            // Обновляем ячейки слова
            this.gameContainer.updateWordCells(selectedWord);

            // Возвращаем цвет обратно через некоторое время
            setTimeout(() => {
                this.selectedLetters.forEach(letter => letter.style.fill = 0xffffff); // Возвращаем цвет обратно
                this.selectedLetters = [];
                this.updateSelectionLine();
            }, 1000); // 1 секунда задержки
        } else {
            console.log(`Invalid word: ${selectedWord}`);
            this.selectedLetters.forEach(letter => letter.style.fill = 0xffffff); // Возвращаем цвет обратно
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
