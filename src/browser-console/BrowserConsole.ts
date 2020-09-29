export function initConsoleCLI(): void {
  Object.defineProperty(window, `help`, {
    get: () => console.log(`Welcome to Steakeye Browser Console`),
  });
  Object.defineProperty(window, `cv`, { get: () => console.log(`http://google.com`) });

  console.log(`TODO: Steakeye console welcome message`);

  // TODO consider using a window event that will happen when DevTools are invoked:
  // window.resize works
}
