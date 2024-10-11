// TheGame.ts
import * as PIXI from 'pixi.js';
import { LetterCircle } from "./LetterCircle";
import { images } from "./images";
import { createSprite } from "../utils/createSprite";
import { Sprite } from "pixi.js";

const words = ["брат","араб","тара","бар","раб","бра"];

export class TheGame extends PIXI.Container {
    private wordCells: Sprite[][] = [];

    constructor() {
        super();
        const background = createSprite(images.background);
        this.addChild(background);

        const letterCircle = new LetterCircle(words, this);

        this.createWordCells();
    }

    private createWordCells() {
        let yPosition = -300; // Начальная позиция по Y
        words.forEach(word => {
            const wordContainer: Sprite[] = [];
            let xPosition = 10; // Начальная позиция по X
            for (let i = 0; i < word.length; i++) {
                const cell = createSprite(images.cell);
                cell.width = 20;
                cell.height = 20;// Используем изображение ячейки
                cell.x = xPosition;
                cell.y = yPosition;
                this.addChild(cell);
                wordContainer.push(cell);
                xPosition += cell.width + 5; // Расстояние между ячейками
            }
            this.wordCells.push(wordContainer);
            yPosition += 50; // Расстояние между строками слов
        });
    }

    public updateWordCells(foundWord: string) {
        const wordIndex = words.indexOf(foundWord);
        if (wordIndex !== -1) {
            const wordContainer = this.wordCells[wordIndex];
            for (let i = 0; i < foundWord.length; i++) {
                const letter = new PIXI.Text(foundWord[i], { fontSize: 24, fill: 0x000000 }); // Фиолетовый цвет текста
                letter.pivot.set(wordContainer[i].width / 2, wordContainer[i].height / 2)
                letter.x = wordContainer[i].x;
                letter.y = wordContainer[i].y;
                this.addChild(letter);
            }
        }
    }
}
