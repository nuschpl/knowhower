const wasmBytes = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 
  0x02, 0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 
  0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 
  0x00, 0x20, 0x01, 0x6a, 0x0b
]);

WebAssembly.instantiate(wasmBytes)
  .then(results => {
      const wynik = results.instance.exports.add(20, 26);
      
      // Zniszczenie starego DOM i stworzenie czystego, odizolowanego środowiska
      document.open();
      document.write(`
          <html>
              <head><title>Secure Wasm Workspace</title></head>
              <body style="background: #0f111a; color: #a9b7c6; font-family: monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                  <div style="background: #181a25; padding: 40px; border-radius: 12px; border: 1px solid #2f334d; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                      <h2 style="color: #00ff66; margin-top: 0;">[Środowisko Odizolowane]</h2>
                      <p>Kod Wasm działa bezpiecznie w pamięci RAM.</p>
                      <hr style="border: 0; border-top: 1px solid #2f334d; margin: 20px 0;">
                      <p style="font-size: 18px; color: #ffffff;">Wynik obliczeń: <b>${wynik}</b></p>
                  </div>
              </body>
          </html>
      `);
      document.close();
  })
  .catch(err => console.error("[-] Błąd Wasm:", err));
