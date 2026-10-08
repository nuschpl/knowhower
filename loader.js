async function loadAndRunWasm(targetSource) {
    let wasmBytes;
    
    try {
        // Sprawdzenie, czy podano pełny URL, czy nazwę pliku lokalnego w repo
        if (targetSource.startsWith('http://') || targetSource.startsWith('https://')) {
            // Wariant A: Pełny URL (pobieranie binarne)
            const response = await fetch(targetSource);
            const buffer = await response.arrayBuffer();
            wasmBytes = new Uint8Array(buffer);
        } else {
            // Wariant B: Plik lokalny w repozytorium nuschpl/knowhower (przez GitHub API)
            const apiURL = `https://api.github.com/repos/nuschpl/knowhower/contents/${targetSource}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            
            // Konwersja base64 z GitHub API na surowe bajty Uint8Array dla WebAssembly
            const binaryString = atob(data.content);
            wasmBytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                wasmBytes[i] = binaryString.charCodeAt(i);
            }
        }
        
        // Kompilacja i instancjonowanie modułu Wasm w pamięci RAM
        const results = await WebAssembly.instantiate(wasmBytes);
        const exports = results.instance.exports;
        
        // Uniwersalna próba uruchomienia funkcji 'add' lub pierwszej dostępnej funkcji eksportowanej
        let wynik = "Moduł załadowany pomyślnie (brak funkcji add)";
        if (typeof exports.add === 'function') {
            wynik = exports.add(20, 26);
        } else {
            const firstFunc = Object.keys(exports).find(k => typeof exports[k] === 'function');
            if (firstFunc) {
                wynik = `Wywołano eksport [${firstFunc}]: ${exports[firstFunc]()}`;
            }
        }
        
        // Renderowanie czystego, odizolowanego środowiska z wynikiem
        document.open();
        document.write(`
            <html>
                <head><meta charset="utf-8"><title>Arbitrary Wasm Loader</title></head>
                <body style="background: #0f111a; color: #a9b7c6; font-family: monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                    <div style="background: #181a25; padding: 40px; border-radius: 12px; border: 1px solid #2f334d; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 600px;">
                        <h2 style="color: #00ff66; margin-top: 0;">[&#321;adowanie Wasm Zakończone Sukcesem]</h2>
                        <p>&#379;r&oacute;d&#322;o: <b>${targetSource}</b></p>
                        <hr style="border: 0; border-top: 1px solid #2f334d; margin: 20px 0;">
                        <p style="font-size: 18px; color: #ffffff;">Wynik / Status: <b>${wynik}</b></p>
                    </div>
                </body>
            </html>
        `);
        document.close();
        
    } catch (err) {
        console.error("[-] B&#322;&#261;d &#322;adowania Wasm:", err);
        alert("B&#322;&#261;d &#322;adowania Wasm: " + err.message);
    }
}

// TUTAJ WSKAZUJESZ PLIK: wpisz nazwę pliku z repo (np. 'modul.wasm') LUB pełny adres URL https://...
loadAndRunWasm('modul.wasm');
