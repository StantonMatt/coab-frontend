'use strict';

import util from './util.js';
import buttons from './elements.js';
import axios from 'axios';
import * as XLSX from 'xlsx';

const config = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
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
    xmlFechaFirma,
    xmlFechaEmision,
    xmlFechaVencimiento,
    xmlLinkDatesCheckbox,
    clearOldFilesBtn,
    generateDteXmlsBtn,
    generateSobreBtn,
    generateRcofBtn,
    downloadSobreBtn,
  } = buttons.getGenerateXmlElements();

  const homeChoices = document.querySelector('.home-choices');
  const xmlChoices = document.querySelector('.xml-choices');

  window.onload = function () {
    xmlLinkDatesCheckbox.checked = true;
    xmlFechaFirma.value = util.getFechaFirma();
    xmlFechaEmision.value = util.getFechaEmision();
    xmlFechaVencimiento.value = util.getFechaVencimiento();
  };

  function updateLinkedDates(sourceDate) {
    if (xmlLinkDatesCheckbox.checked) {
      const date = new Date(sourceDate.value);

      // Set Fecha Emision to the same date as Fecha Firma
      xmlFechaEmision.value = sourceDate.value;

      // Set Fecha Vencimiento to the last day of the next month
      date.setMonth(date.getMonth() + 1);
      date.setDate(0); // This sets it to the last day of the month
      xmlFechaVencimiento.value = date.toISOString().split('T')[0];
    }
  }

  xmlFechaFirma.addEventListener('change', function () {
    updateLinkedDates(this);
  });

  xmlFechaEmision.addEventListener('change', function () {
    if (xmlLinkDatesCheckbox.checked) {
      xmlFechaFirma.value = this.value;
      updateLinkedDates(this);
    }
  });

  xmlFechaVencimiento.addEventListener('change', function () {
    if (xmlLinkDatesCheckbox.checked) {
      // If Fecha Vencimiento is changed, we'll set Fecha Firma and Fecha Emision
      // to the first day of the previous month
      const date = new Date(this.value);
      date.setDate(1);
      date.setMonth(date.getMonth() - 1);
      const newDate = date.toISOString().split('T')[0];
      xmlFechaFirma.value = newDate;
      xmlFechaEmision.value = newDate;
    }
  });

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

  xmlFileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
      // Read the Excel file to get sheet names
      const reader = new FileReader();
      reader.onload = async e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Clear previous options
        xmlSheetList.innerHTML = '';

        // Add sheet names as options
        workbook.SheetNames.forEach(sheetName => {
          const option = document.createElement('option');
          option.value = sheetName;
          option.textContent = sheetName;
          xmlSheetList.appendChild(option);
        });

        xmlSheetList.classList.remove('hidden');
        xmlConfirmFileBtn.classList.remove('hidden');
      };
      reader.readAsArrayBuffer(file);
    }
  });

  xmlConfirmFileBtn.addEventListener('click', async () => {
    try {
      const file = xmlFileInput.files[0];
      const selectedSheet = xmlSheetList.value;

      if (!file || !selectedSheet) {
        throw new Error('Please select a file and a sheet.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('sheet', selectedSheet);
      formData.append('fechaFirma', xmlFechaFirma.value);
      formData.append('fechaEmision', xmlFechaEmision.value);
      formData.append('fechaVencimiento', xmlFechaVencimiento.value);

      const response = await axios.post('http://127.0.0.1:5000/api/upload-excel', formData, config);
      const data = response.data;
      util.addContentToBox('logOutput', data.message || 'File processed successfully');
    } catch (error) {
      console.error(`ERROR: Failed to upload Excel file: ${error}`);
      util.addContentToBox('logOutput', `Failed to upload Excel file: ${error.message}`);
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

  // generateBarcodesBtn.addEventListener('click', async () => {
  //   try {
  //     const logStartBarcodeGen = 'Creating barcodes, this may take a while...';
  //     util.addContentToBox('logOutput', [logStartBarcodeGen]);
  //     const response = await axios.get('http://127.0.0.1:5000/api/generate-barcodes', config);
  //     const data = response.data;
  //     util.addContentToBox('logOutput', [data]);
  //   } catch (error) {
  //     console.log(`ERROR: Failed to generate Bar Codes: ${error}`);
  //   }
  // });

  downloadSobreBtn.addEventListener('click', async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/download-sobre', {
        responseType: 'blob',
        headers: { Accept: 'application/zip, application/xml' },
      });

      const data = response.data;

      const contentType = response.headers['content-type'];
      let filename = 'sobre_COAB.xml';
      let extension = '.xml';

      if (contentType === 'application/zip') {
        filename = 'sobre_COAB.zip';
        extension = '.zip';
      }

      const blob = new Blob([response.data], { type: contentType });
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);

      util.addContentToBox('logOutput', data.message || `File downloaded: ${filename}`);
    } catch (error) {
      console.error(`ERROR: Failed to download file: ${error}`);
    }
  });
});

// export default returnToMainMenu;
