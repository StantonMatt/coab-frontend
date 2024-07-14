'use strict';

const getHomePage = () => {
  return `
<div class="main-choices">
  <button id="generatePdfBtn" class="btn">Generar PDF</button>
  <button id="generateXmlBtn" class="btn">Generar XML</button>
</div>`;
};

const getGenerateXmlPage = () => {
  return `
<div>
<button id="backToMainMenuBtn" class="btn">Back to Main Menu</button>
</div>
<div class="main-choices">
  <div class="token">
    <button id="getTokenBtn" class="btn">Get Token</button>
    <p id="tokenOutputBox">Token will be displayed here.</p>
    <div class="actions">
      <button id="copyToClipboardBtn">Copy to Clipboard</button>
      <span id="feedback"></span>
    </div>
  </div>
  <div class="buttons">
    <button id="clearOldFiles" class="btn">Clear Old Files</button>
    <button id="generateDteXmls" class="btn">Generate DTE's</button>
    <button id="generateSobre" class="btn">Generate Sobre</button>
    <button id="generateRcof" class="btn">Generate RCOF</button>
    <button id="generateBarcodes" class="btn">Generate Barcodes</button>
  </div>
  <button id="downloadSobre" class="btn">Download</button>
</div>`;
};

const getGeneratePdfPage = () => {};

export default { getHomePage, getGenerateXmlPage, getGeneratePdfPage };
