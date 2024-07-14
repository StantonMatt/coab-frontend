'use strict';

import buttons from './elements.js';
import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const { generateXmlBtn, generatePdfBtn } = buttons.getHomeButtons();

  const homeChoices = document.querySelector('.home-choices');
  const xmlChoices = document.querySelector('.xml-choices');
  const pdfChoices = document.querySelector('.pdf-choices');

  generateXmlBtn.addEventListener('click', () => {
    homeChoices.classList.toggle('hidden');
    xmlChoices.classList.toggle('hidden');
  });

  generatePdfBtn.addEventListener('click', () => {
    homeChoices.classList.toggle('hidden');
    pdfChoices.classList.toggle('hidden');
  });
});
