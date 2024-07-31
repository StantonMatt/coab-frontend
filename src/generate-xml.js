'use strict';

import util from './util.js';
import buttons from './elements.js';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const config = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
};

// API Service Module
const apiService = (() => {
  const request = async (url, method = 'GET', data = null, customConfig = {}) => {
    try {
      const response = await axios({
        method,
        url: `${API_BASE_URL}${url}`,
        data,
        ...config,
        ...customConfig,
      });
      return response;
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  };

  return {
    getToken: () => request('/get-token'),
    deleteFiles: () => request('/delete-files'),
    generateDtes: () => request('/generate-dtes'),
    generateSobre: () => request('/generate-sobre'),
    generateRcof: () => request('/generate-rcof'),
    downloadSobre: () =>
      request('/download-sobre', 'GET', null, {
        responseType: 'blob',
        headers: { Accept: 'application/zip, application/xml' },
      }),
    uploadExcel: formData => request('/upload-excel', 'POST', formData),
    getDropdownOptions: fieldName => request(`/get-dropdown-options/${fieldName}`),
  };
})();

// UI Manager Module
const uiManager = (() => {
  const elements = buttons.getGenerateXmlElements();

  const setButtonState = (button, enabled) => {
    button.disabled = !enabled;
  };

  const toggleMenuVisibility = () => {
    document.querySelector('.home-choices').classList.toggle('hidden');
    document.querySelector('.xml-choices').classList.toggle('hidden');
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(elements.tokenOutput.textContent);
  };

  const triggerFileInput = () => {
    elements.xmlFileInput.click();
  };

  const clearFileInput = () => {
    elements.xmlFileInput.value = '';
  };

  const populateSheetList = sheetNames => {
    elements.xmlSheetList.innerHTML = '';
    sheetNames.forEach(sheetName => {
      const option = document.createElement('option');
      option.value = sheetName;
      option.textContent = sheetName;
      elements.xmlSheetList.appendChild(option);
    });
  };

  const enableFileConfirmation = () => {
    elements.xmlSheetList.classList.remove('hidden');
    elements.xmlConfirmFileBtn.classList.remove('hidden');
    setButtonState(elements.xmlConfirmFileBtn, true);
    setButtonState(elements.xmlSheetList, true);
  };

  const resetFileSelection = () => {
    setButtonState(elements.xmlConfirmFileBtn, false);
    setButtonState(elements.xmlSheetList, false);
    elements.xmlSheetList.classList.add('hidden');
    elements.xmlConfirmFileBtn.classList.add('hidden');
  };

  const processExcelFile = file => {
    const reader = new FileReader();
    reader.onload = async e => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      populateSheetList(workbook.SheetNames);
      enableFileConfirmation();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelection = event => {
    const file = event.target.files[0];
    if (file) {
      util.addContentToBox('logOutput', `File Selected: ${file.name}`);
      processExcelFile(file);
    } else {
      util.addContentToBox('logOutput', 'No file selected or file selection cancelled');
      resetFileSelection();
    }
  };

  const adjustToToday = date => {
    const today = new Date();
    return date > today ? today : date;
  };

  const updateLinkedDates = () => {
    if (!elements.xmlLinkDatesCheckbox.checked) return;

    let fechaFirma = adjustToToday(new Date(elements.xmlFechaFirma.value));
    let fechaEmision = adjustToToday(new Date(elements.xmlFechaEmision.value));
    let fechaVencimiento = new Date(elements.xmlFechaVencimiento.value);

    // Implement date calculation logic here

    elements.xmlFechaVencimiento.value = util.getFormattedDate(fechaVencimiento);
    elements.xmlFechaEmision.value = util.getFormattedDate(fechaEmision);
    // Uncomment if you want to update xmlFechaFirma
    // elements.xmlFechaFirma.value = util.getFormattedDate(fechaFirma);
  };

  const toggleLinkedDates = e => {
    e.preventDefault();
    elements.xmlLinkDatesCheckbox.checked = !elements.xmlLinkDatesCheckbox.checked;
  };

  const uploadExcelFile = async () => {
    try {
      const file = elements.xmlFileInput.files[0];
      const selectedSheet = elements.xmlSheetList.value;

      if (!file || !selectedSheet) {
        throw new Error('Please select a file and a sheet.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('sheet', selectedSheet);
      formData.append('fechaFirma', elements.xmlFechaFirma.value);
      formData.append('fechaEmision', elements.xmlFechaEmision.value);
      formData.append('fechaVencimiento', elements.xmlFechaVencimiento.value);
      formData.append('fechaDesde', elements.xmlFechaDesde.value);
      formData.append('fechaHasta', elements.xmlFechaHasta.value);

      const response = await apiService.uploadExcel(formData);
      util.addContentToBox('logOutput', response.data.message || `${selectedSheet} sheet processed successfully`);
      setButtonState(elements.xmlConfirmFileBtn, false);
      setButtonState(elements.xmlSheetList, false);
      setButtonState(elements.generateDteXmlsBtn, true);
    } catch (error) {
      util.addContentToBox('logOutput', `Failed to upload Excel file: ${error.message}`);
    }
  };

  const handleApiRequest = async (apiCall, errorMessage) => {
    try {
      const response = await apiCall();
      const data = response.data;
      if (Array.isArray(data)) {
        util.addContentToBox('logOutput', data);
      } else if (typeof data === 'object' && data.logOutput) {
        util.addContentToBox('logOutput', data.logOutput);
      } else {
        util.addContentToBox('logOutput', data);
      }
      return data;
    } catch (error) {
      console.error(`ERROR: ${errorMessage}: ${error}`);
      util.addContentToBox('logOutput', `${errorMessage}: ${error.message}`);
      throw error;
    }
  };

  const getToken = async () => {
    try {
      const data = await handleApiRequest(apiService.getToken, 'Failed to get token');
      if (data && data.token) {
        elements.tokenOutput.textContent = data.token;
      }
    } catch (error) {
      // Error already logged in handleApiRequest
    }
  };

  const clearOldFiles = async () => {
    await handleApiRequest(apiService.deleteFiles, 'Failed to delete files');
  };

  const generateDteXmls = async () => {
    try {
      await handleApiRequest(apiService.generateDtes, 'Failed to generate DTE files');
      setButtonState(elements.generateSobreBtn, true);
    } catch (error) {
      // Error already logged in handleApiRequest
    }
  };

  const generateSobre = async () => {
    try {
      const data = await handleApiRequest(apiService.generateSobre, 'Failed to generate DTE sobre');
      handleSobreGeneration(data);
    } catch (error) {
      // Error already logged in handleApiRequest
    }
  };

  const generateRcof = async () => {
    await handleApiRequest(apiService.generateRcof, 'Failed to generate RCOF');
  };

  const handleSobreGeneration = data => {
    if (data && typeof data === 'object') {
      if (data.success) {
        setButtonState(elements.downloadSobreBtn, true);
        util.addContentToBox('logOutput', 'Sobre generated successfully. Download button is now active.');
      } else {
        setButtonState(elements.downloadSobreBtn, false);
        util.addContentToBox('logOutput', 'Failed to generate sobre. Download button remains inactive.');
      }
    } else {
      setButtonState(elements.downloadSobreBtn, false);
      util.addContentToBox('logOutput', "Unexpected error. Make sure DTE's have been generated correctly.");
    }
  };

  const downloadSobre = async () => {
    if (elements.downloadSobreBtn.disabled) {
      util.addContentToBox('logOutput', 'Please generate the sobre first before downloading.');
      return;
    }

    try {
      const response = await apiService.downloadSobre();

      const contentType = response.headers['content-type'];
      const filename = contentType === 'application/zip' ? 'sobre_COAB.zip' : 'sobre_COAB.xml';

      const blob = new Blob([response.data], { type: contentType });
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);

      util.addContentToBox('logOutput', `File downloaded: ${filename}`);
    } catch (error) {
      console.error(`ERROR: Failed to download file: ${error}`);
      util.addContentToBox('logOutput', 'Failed to download file. Please try generating the sobre again.');
      setButtonState(elements.downloadSobreBtn, false);
    }
  };

  const populateDropdown = async (selectElementId, fieldName) => {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) {
      console.error(`Element with id '${selectElementId}' not found in the DOM`);
      util.addContentToBox('logOutput', `Failed to load options for ${fieldName}: Element not found`);
      return;
    }

    try {
      const response = await apiService.getDropdownOptions(fieldName);
      const options = response.data;
      selectElement.innerHTML = '';
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
      });
    } catch (error) {
      console.error(`Error populating dropdown for ${fieldName}:`, error);
      util.addContentToBox('logOutput', `Failed to load options for ${fieldName}: ${error.message}`);
    }
  };

  const initializeDropdowns = () => {
    const dropdowns = [
      { id: 'xmlRznSocEmisor', field: 'xmlRznSocEmisor' },
      { id: 'xmlGiroEmisor', field: 'xmlGiroEmisor' },
      { id: 'xmlRutEmisor', field: 'xmlRutEmisor' },
      { id: 'xmlRutEnvia', field: 'xmlRutEnvia' },
      { id: 'xmlRutReceptor', field: 'xmlRutReceptor' },
      { id: 'xmlFchResol', field: 'xmlFchResol' },
      { id: 'xmlNroResol', field: 'xmlNroResol' },
      { id: 'xmlTipoDte', field: 'xmlTipoDte' },
      { id: 'xmlIndServicio', field: 'xmlIndServicio' },
    ];

    dropdowns.forEach(dropdown => {
      populateDropdown(dropdown.id, dropdown.field);
    });
  };

  const initializeUI = () => {
    elements.xmlLinkDatesCheckbox.checked = true;
    [
      { elem: elements.xmlFechaFirma, func: util.getFechaFirma },
      { elem: elements.xmlFechaEmision, func: util.getFechaEmision },
      { elem: elements.xmlFechaVencimiento, func: util.getFechaVencimiento },
      { elem: elements.xmlFechaDesde, func: util.getFechaDesde },
      { elem: elements.xmlFechaHasta, func: util.getFechaHasta },
    ].forEach(({ elem, func }) => {
      elem.value = func(new Date());
    });
    setButtonState(elements.downloadSobreBtn, false);
    setButtonState(elements.generateSobreBtn, false);
    setButtonState(elements.generateDteXmlsBtn, false);

    initializeDropdowns();
  };

  const initializeEventListeners = () => {
    elements.xmlReturnToMainMenuBtn.addEventListener('click', toggleMenuVisibility);
    elements.copyToClipboardBtn.addEventListener('click', copyTokenToClipboard);
    elements.xmlFileInputBtn.addEventListener('click', triggerFileInput);
    elements.xmlFileInput.addEventListener('change', handleFileSelection);
    elements.xmlFileInput.addEventListener('click', clearFileInput);
    elements.xmlConfirmFileBtn.addEventListener('click', uploadExcelFile);
    elements.xmlLinkDatesLabel.addEventListener('click', toggleLinkedDates);
    elements.xmlFechaFirma.addEventListener('change', updateLinkedDates);
    elements.xmlFechaEmision.addEventListener('change', updateLinkedDates);
    elements.xmlFechaVencimiento.addEventListener('change', updateLinkedDates);

    elements.getTokenBtn.addEventListener('click', getToken);
    elements.clearOldFilesBtn.addEventListener('click', clearOldFiles);
    elements.generateDteXmlsBtn.addEventListener('click', generateDteXmls);
    elements.generateSobreBtn.addEventListener('click', generateSobre);
    elements.generateRcofBtn.addEventListener('click', generateRcof);
    elements.downloadSobreBtn.addEventListener('click', downloadSobre);
  };

  return {
    initializeEventListeners,
    initializeUI,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  uiManager.initializeUI();
  uiManager.initializeEventListeners();
});
