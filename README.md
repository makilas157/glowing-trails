# Glowing Trails

https://github.com/makilas157/tevexxo-studio-build.git   Add a new smooth glowing cursor-trail effect alongside the existing CursorSpider component (do not remove or replace CursorSpider — both effects should run together).

Create a new component `src/components/CursorTrail.tsx`:

- Only enable it on devices with a fine pointer (use `window.matchMedia("(pointer: fine)")`, same pattern as CursorSpider) and skip it entirely if the user has `prefers-reduced-motion: reduce` set.

- Render a small trail of soft glowing dots/particles that follow the mouse cursor with a fading tail effect (each particle spawns at the current pointer position, then fades out in opacity and shrinks in size over ~400-600ms before being removed).

- Use `position: fixed`, `pointer-events: none`, and a high `z-index` so it never blocks clicks, same as CursorSpider.

- Use the site's accent color (the same oklch accent color used in CursorSpider, e.g. `oklch(0.68 0.19 40)`) with a soft `box-shadow`/glow so it visually matches the spider effect and the rest of the site's theme.

- Implement it with a single `requestAnimationFrame` loop that only runs while there are active particles — stop scheduling frames when the trail is empty (mirror the "settle and stop ticking" optimization already used in CursorSpider) instead of running forever in the background.

- Throttle particle spawning on `pointermove` (e.g. spawn a new particle only every ~16-30ms of movement) so fast mouse movement doesn't create hundreds of DOM nodes at once.

- Clean up all event listeners, timers, and the animation frame properly in the effect's cleanup function.

- Keep this as a self-contained component with no external dependencies (plain React + CSS/inline styles, same style as CursorSpider.tsx).

Wire it into `src/routes/__root.tsx`: import `CursorTrail` and render it right next to the existing `<CursorSpider />` (e.g. `<CursorSpider /><CursorTrail />`), so the spider still follows the cursor with its own spring-lag movement AND the new glowing trail effect shows behind/around it.

After implementing, run `npm run build` to confirm it compiles with no errors, and verify in the browser that:

1. The spider still animates and trails the cursor as before.

2. A new soft glowing particle trail also follows the cursor and fades out smoothly.

3. Neither effect blocks clicking on links/buttons.

4. Performance stays smooth — no continuous background animation loop running when the mouse is idle.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ffca2541-e1ff-46aa-8cc5-3e76e4715395).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
