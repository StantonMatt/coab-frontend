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
    xmlLinkDatesLabel,
    clearOldFilesBtn,
    generateDteXmlsBtn,
    generateSobreBtn,
    generateRcofBtn,
    downloadSobreBtn,
  } = buttons.getGenerateXmlElements();

  if (!xmlFechaFirma) console.error('xmlFechaFirma not found');
  if (!xmlFechaEmision) console.error('xmlFechaEmision not found');
  if (!xmlFechaVencimiento) console.error('xmlFechaVencimiento not found');
  if (!xmlLinkDatesCheckbox) console.error('linkDates checkbox not found');
  if (!xmlLinkDatesLabel) console.error('linkDates label not found');

  const homeChoices = document.querySelector('.home-choices');
  const xmlChoices = document.querySelector('.xml-choices');

  window.onload = function () {
    xmlLinkDatesCheckbox.checked = true;
    xmlFechaFirma.value = util.getFechaFirma(new Date());
    xmlFechaEmision.value = util.getFechaEmision(new Date());
    xmlFechaVencimiento.value = util.getFechaVencimiento(new Date());
  };

  // Helper function to get the last day of a month
  function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Helper function to adjust date to ensure it's not in the future
  function adjustToToday(date) {
    const today = new Date();
    return date > today ? today : date;
  }

  xmlFechaFirma.addEventListener('change', function () {
    if (xmlLinkDatesCheckbox.checked) {
      let fechaFirma = adjustToToday(new Date(this.value));

      let fechaEmision;
      let fechaVencimiento;

      if (fechaFirma.getDate() < 20) {
        fechaEmision = new Date(
          fechaFirma.getFullYear(),
          fechaFirma.getMonth() - 1,
          getLastDayOfMonth(fechaFirma.getFullYear(), fechaFirma.getMonth() - 1)
        );
        fechaVencimiento = new Date(fechaFirma.getFullYear(), fechaFirma.getMonth(), 20);
      } else {
        fechaEmision = new Date(
          fechaFirma.getFullYear(),
          fechaFirma.getMonth() - 1,
          getLastDayOfMonth(fechaFirma.getFullYear(), fechaFirma.getMonth() - 1)
        );
        fechaVencimiento = new Date(fechaFirma.getFullYear(), fechaFirma.getMonth() + 1, 20);
      }

      xmlFechaVencimiento.value = util.getFormattedDate(fechaVencimiento);
      xmlFechaEmision.value = util.getFormattedDate(fechaEmision);
    }
  });

  xmlFechaEmision.addEventListener('change', function () {
    if (xmlLinkDatesCheckbox.checked) {
      let fechaEmision = adjustToToday(new Date(this.value));

      let fechaFirma = new Date(fechaEmision);
      let fechaVencimiento = new Date(fechaEmision);

      if (fechaEmision.getDate() >= 8) {
        fechaFirma.setMonth(fechaEmision.getMonth() + 1, 4);
        fechaVencimiento.setMonth(fechaEmision.getMonth() + 1, 20);
      } else {
        fechaFirma.setDate(fechaEmision.getDate() + 2);
        fechaVencimiento.setMonth(fechaEmision.getMonth(), 20);
      }

      fechaFirma = adjustToToday(fechaFirma);

      xmlFechaVencimiento.value = util.getFormattedDate(fechaVencimiento);
      xmlFechaFirma.value = util.getFormattedDate(fechaFirma);
    }
  });

  xmlFechaVencimiento.addEventListener('change', function () {
    if (xmlLinkDatesCheckbox.checked) {
      let fechaVencimiento = new Date(this.value);

      let fechaEmision;
      let fechaFirma;

      if (fechaVencimiento.getDate() < 10) {
        fechaEmision = new Date(
          fechaVencimiento.getFullYear(),
          fechaVencimiento.getMonth() - 2,
          getLastDayOfMonth(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() - 2)
        );
        fechaFirma = new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() - 1, 4);
      } else {
        fechaEmision = new Date(
          fechaVencimiento.getFullYear(),
          fechaVencimiento.getMonth() - 1,
          getLastDayOfMonth(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() - 1)
        );
        fechaFirma = new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth(), 4);
      }

      xmlFechaEmision.value = util.getFormattedDate(fechaEmision);
      xmlFechaFirma.value = util.getFormattedDate(fechaFirma);
    }
  });

  xmlLinkDatesLabel.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default checkbox behavior
    xmlLinkDatesCheckbox.checked = !xmlLinkDatesCheckbox.checked;
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
