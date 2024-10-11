// TheGame.ts
import * as PIXI from 'pixi.js';
import {Sprite} from 'pixi.js';
import {LetterCircle} from "./LetterCircle";
import {images} from "./images";
import {createSprite} from "../utils/createSprite";

const words = ["брат","араб","тара","бар","раб","бра"];

export class TheGame extends PIXI.Container {
    private wordCells: Sprite[][] = [];

    constructor() {
        super();
        const background = createSprite(images.background);
        this.addChild(background);

        new LetterCircle(words, this);

        this.createWordCells();
    }

    private createWordCells() {
        let yPosition = -420; // Начальная позиция по Y
        const offsetX = [0, 0, 95, 55, 20, -15]
        words.forEach(word => {
            const wordContainer: Sprite[] = [];
            let xPosition = offsetX[word.length] - 120; // Начальная позиция по X
            for (let i = 0; i < word.length; i++) {
                const cell = createSprite(images.cell);
                cell.width = 72;
                cell.height = 72;// Используем изображение ячейки
                cell.x = xPosition;
                cell.y = yPosition;
                this.addChild(cell);
                wordContainer.push(cell);
                xPosition += cell.width + 5; // Расстояние между ячейками
            }
            this.wordCells.push(wordContainer);
            yPosition += 80; // Расстояние между строками слов
        });
    }

    public updateWordCells(foundWord: string) {
        const wordIndex = words.indexOf(foundWord);
        if (wordIndex !== -1) {
            const wordContainer = this.wordCells[wordIndex];
            for (let i = 0; i < foundWord.length; i++) {
                const letter = new PIXI.Text(foundWord[i], {fontSize: 42, fill: 0xffffff}); // Фиолетовый цвет текста
                letter.pivot.set(wordContainer[i].width / 2, wordContainer[i].height / 2)
                letter.x += wordContainer[i].width / 2 - 12;
                letter.y += wordContainer[i].height / 2 - 24;
                wordContainer[i].texture = PIXI.Texture.from(images.ballGreen);
                wordContainer[i].addChild(letter);
            }
        }
    }
}
