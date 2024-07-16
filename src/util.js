'use strict';

function addContentToBox(outputBox, newContent) {
  const box = document.getElementById(outputBox);
  // Convert newContent to an array if it's not already one
  const contentArray = Array.isArray(newContent) ? newContent : [newContent];

  if (box.tagName === 'TEXTAREA' || box.tagName === 'INPUT') {
    contentArray.forEach(line => (box.value += `${line}\n`));
  } else {
    contentArray.forEach(line => (box.textContent += `${line}\n`));
  }
  box.value += `------------------------------------------------\n`;
  box.scrollTop = box.scrollHeight;
}

function getFormattedDate(date) {
  return new Intl.DateTimeFormat('sv-SE', {
    dateStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(date);
}

function getExpiryDate() {
  const expiryDate = new Date();
  if (expiryDate.getDate() > 20) expiryDate.setMonth(expiryDate.getMonth() + 1);
  expiryDate.setDate(20);
  return getFormattedDate(expiryDate);
}

function getIssueDate() {
  const issueDate = new Date();
  if (issueDate.getDate() > 20) issueDate.setMonth(issueDate.getMonth() + 1);
  issueDate.setDate(1);
  return getFormattedDate(issueDate);
}

function getLecturaAnteriorDate() {
  const issueDate = new Date();
  if (issueDate.getDate() <= 20) issueDate.setMonth(issueDate.getMonth() - 2);
  else issueDate.setMonth(issueDate.getMonth() - 1);
  issueDate.setDate(26);
  return getFormattedDate(issueDate);
}

function getLecturaActualDate() {
  const issueDate = new Date();
  if (issueDate.getDate() <= 20) issueDate.setMonth(issueDate.getMonth() - 1);
  issueDate.setDate(26);
  return getFormattedDate(issueDate);
}

function getProximaLecturaDate() {
  const issueDate = new Date();
  if (issueDate.getDate() > 20) issueDate.setMonth(issueDate.getMonth() + 1);
  issueDate.setDate(26);
  return getFormattedDate(issueDate);
}

function getFechaFirma() {
  const issueDate = new Date();
  if (issueDate.getDate() >= 10 && issueDate.getDate() <= 20) issueDate.setDate(9);
  return getFormattedDate(issueDate);
}

export default {
  addContentToBox,
  getExpiryDate,
  getIssueDate,
  getLecturaAnteriorDate,
  getLecturaActualDate,
  getProximaLecturaDate,
  getFechaFirma,
};
