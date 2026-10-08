const wasmBytes = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 
  0x02, 0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 
  0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 
  0x00, 0x20, 0x01, 0x6a, 0x0b
]);

WebAssembly.instantiate(wasmBytes)
  .then(results => {
      const wynik = results.instance.exports.add(20, 26);
      
      // Tworzenie wizualnego powiadomienia na stronie (bez konsoli!)
      const banner = document.createElement('div');
      banner.style.cssText = 'position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:15px 25px;border-radius:8px;z-index:999999;font-family:sans-serif;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
      banner.innerText = `[WASM Sukces] Wynik 20 + 26 = ${wynik}`;
      document.body.appendChild(banner);
      
      // Automatyczne ukrycie banera po 5 sekundach
      setTimeout(() => banner.remove(), 5000);
  })
  .catch(err => {
      alert("[-] Błąd Wasm: " + err);
  });
