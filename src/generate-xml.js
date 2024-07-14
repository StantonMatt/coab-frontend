'use strict';

import util from './util.js';
import buttons from './elements.js';
import axios from 'axios';

const config = {
  headers: {
    Accept: 'application/json',
  },
};

document.addEventListener('DOMContentLoaded', function () {
  const {
    logOutput,
    tokenOutput,
    xmlReturnToMainMenuBtn,
    copyToClipboardBtn,
    getTokenBtn,
    xmlFileInput,
    xmlFileInputBtn,
    xmlSheetList,
    xmlConfirmFileBtn,
    clearOldFilesBtn,
    generateDteXmlsBtn,
    generateSobreBtn,
    generateRcofBtn,
    generateBarcodesBtn,
    downloadSobreBtn,
  } = buttons.getGenerateXmlElements();

  const homeChoices = document.querySelector('.home-choices');
  const xmlChoices = document.querySelector('.xml-choices');

  xmlReturnToMainMenuBtn.addEventListener('click', () => {
    homeChoices.classList.toggle('hidden');
    xmlChoices.classList.toggle('hidden');
  });

  copyToClipboardBtn.addEventListener('click', () => {
    const tokenValue = tokenOutput.textContent;
    navigator.clipboard.writeText(tokenValue);
  });

  xmlFileInputBtn.addEventListener('click', () => {
    xmlFileInput.click();
  });

  xmlFileInput.addEventListener('change', () => {
    xmlSheetList.classList.toggle('hidden');
    xmlConfirmFileBtn.classList.toggle('hidden');
  });
  xmlFileInput.addEventListener('cancel', () => {});

  xmlConfirmFileBtn.addEventListener('click', () => {
    try {
      // Upload Excel File to backend
    } catch (error) {
      console.log(`ERROR: Failed to upload Excel file: ${error}`);
    }
  });

  getTokenBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/get-token', config);
      const data = response.data;
      util.addContentToBox('logOutput', data.logOutput);
      tokenOutput.textContent = data.token;
    } catch (error) {
      console.log(`ERROR: Failed to delete files: ${error}`);
    }
  });

  clearOldFilesBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/delete-files', config);
      const data = response.data;
      util.addContentToBox('logOutput', data);
    } catch (error) {
      console.log(`ERROR: Failed to delete files: ${error}`);
    }
  });

  generateDteXmlsBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/generate-dtes', config);
      const data = response.data;
      util.addContentToBox('logOutput', data);
    } catch (error) {
      console.log(`ERROR: Failed to generate DTE files: ${error}`);
    }
  });

  generateSobreBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/generate-sobre', config);
      const data = response.data;
      util.addContentToBox('logOutput', data);
    } catch (error) {
      console.log(`ERROR: Failed to generate DTE sobre: ${error}`);
    }
  });

  generateRcofBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/generate-rcof', config);
      const data = response.data;
      util.addContentToBox('logOutput', [data]);
    } catch (error) {
      console.log(`ERROR: Failed to generate RCOF: ${error}`);
    }
  });

  generateBarcodesBtn.addEventListener('click', async () => {
    try {
      const logStartBarcodeGen = 'Creating barcodes, this may take a while...';
      util.addContentToBox('logOutput', [logStartBarcodeGen]);
      const response = await axios.get('http://127.0.0.1:5000/api/generate-barcodes', config);
      const data = response.data;
      util.addContentToBox('logOutput', [data]);
    } catch (error) {
      console.log(`ERROR: Failed to generate Bar Codes: ${error}`);
    }
  });

  downloadSobreBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/download-sobre', { responseType: 'blob' });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'sobre_COAB.xml'); // Assuming PDF, adjust the extension as necessary
      document.body.appendChild(link);
      link.click(); // Corrected this line

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error(`ERROR: Failed to download file: ${error}`);
    }
  });
});

// export default returnToMainMenu;
