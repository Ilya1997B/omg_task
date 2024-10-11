import { Sprite, Container, Texture  } from 'pixi.js';

export function createSprite(spriteName: string): Sprite {
    const texture = Texture.from(spriteName);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    return sprite;
}

/**
 * Resizes PIXI container to specified width and/or height. Side ratio is kept.
 * If both width and height provided takes the lowest limit.
 *
 * @param container pixi container to resize
 * @param width limit of width
 * @param height limit of height
 */
export function scaleTo(container: Container, width?: number, height?: number) {
    let scaleX = 1;
    let scaleY = 1;
    if (width && container.width >= width) {
        scaleX = width / container.width;
    }
    if (height && container.height > height) {
        scaleY = height / container.height;
    }
    const scale = Math.min(scaleX, scaleY);
    if (scale !== 1) {
        container.scale.set(container.scale.x * scale);
    }
}

interface IConfig {
    width: number;
    height: number;
    alpha: number;
    scale: number;
    x: number;
    y: number;
}