import * as PIXI from 'pixi.js';

export class WordCell {
    private word: string;
    private text: PIXI.Text;

    constructor(word: string, x: number, y: number, container: PIXI.Container) {
        this.word = word;
        this.text = new PIXI.Text('_'.repeat(word.length), { fontSize: 24, fill: 0xffffff });
        this.text.x = x;
        this.text.y = y;
        container.addChild(this.text);
    }

    updateText(foundWord: string) {
        this.text.text = foundWord;
    }

    getWord() {
        return this.word;
    }
}
