
export function createScriptLoader(src: string) {
  const scriptDom = document.createElement('script');
  scriptDom.src = src;
  document.body.appendChild(scriptDom);
}