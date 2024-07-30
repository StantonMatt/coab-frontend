'use strict';

const getHomeButtons = () => {
  return {
    generatePdfBtn: document.getElementById('generatePdfBtn'),
    generateXmlBtn: document.getElementById('generateXmlBtn'),
  };
};

const getGenerateXmlElements = () => {
  return {
    logOutput: document.getElementById('logOutput'),
    tokenOutput: document.getElementById('tokenOutput'),
    xmlReturnToMainMenuBtn: document.getElementById('xmlReturnToMainMenuBtn'),
    getTokenBtn: document.getElementById('getTokenBtn'),
    xmlFileInput: document.getElementById('xmlFileInput'),
    xmlFileInputBtn: document.getElementById('xmlFileInputBtn'),
    xmlSheetList: document.getElementById('xmlSheetList'),
    xmlConfirmFileBtn: document.getElementById('xmlConfirmFileBtn'),
    xmlFechaFirma: document.getElementById('xmlFechaFirma'),
    xmlFechaEmision: document.getElementById('xmlFechaEmision'),
    xmlFechaVencimiento: document.getElementById('xmlFechaVencimiento'),
    xmlFechaDesde: document.getElementById('xmlFechaDesde'),
    xmlFechaHasta: document.getElementById('xmlFechaHasta'),
    xmlLinkDatesCheckbox: document.getElementById('xmlLinkDatesCheckBox'),
    xmlLinkDatesLabel: document.getElementById('xmlLinkDatesLabel'),
    clearOldFilesBtn: document.getElementById('clearOldFilesBtn'),
    generateDteXmlsBtn: document.getElementById('generateDteXmlsBtn'),
    generateSobreBtn: document.getElementById('generateSobreBtn'),
    generateRcofBtn: document.getElementById('generateRcofBtn'),
    generateBarcodesBtn: document.getElementById('generateBarcodesBtn'),
    submitBtn: document.getElementById('submitBtn'),
    copyToClipboardBtn: document.getElementById('copyToClipboardBtn'),
    dataInputBtn: document.getElementById('dataInputBtn'),
    tokenOutputBoxBtn: document.getElementById('tokenOutputBoxBtn'),
    downloadSobreBtn: document.getElementById('downloadSobreBtn'),
  };
};

const getGeneratePdfElements = () => {
  return {
    pdfReturnToMainMenuBtn: document.getElementById('pdfReturnToMainMenuBtn'),
    fileInput: document.getElementById('fileInput'),
    fileInputBtn: document.getElementById('fileInputBtn'),
    sheetList: document.getElementById('sheetList'),
    processDataBtn: document.getElementById('processDataBtn'),
    generateBarCodesBtn: document.getElementById('generateBarCodesBtn'),
    generateBoletasBtn: document.getElementById('generateBoletasBtn'),
    pdfIframe: document.getElementById('pdfIframe'),
    fechaEmision: document.getElementById('fechaEmision'),
    fechaVencimiento: document.getElementById('fechaVencimiento'),
    fechaLecturaAnterior: document.getElementById('fechaLecturaAnterior'),
    fechaLecturaActual: document.getElementById('fechaLecturaActual'),
    fechaProximaLectura: document.getElementById('fechaProximaLectura'),
  };
};

export default { getHomeButtons, getGenerateXmlElements, getGeneratePdfElements };
