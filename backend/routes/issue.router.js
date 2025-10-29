const express = require('express');
const issueRouter = express.Router();
const issueController = require('../controllers/IssueController');

// --- Routes for Issues related to a specific Repository ---
issueRouter.get('/repo/:repoId/issues', issueController.getAllIssuesForRepo);
issueRouter.post('/repo/:repoId/issues', issueController.createIssue);

// --- Routes for specific Issues (identified by their own ID) ---
issueRouter.get('/issues/:issueId', issueController.getIssueById);
issueRouter.put('/issues/:issueId', issueController.updateIssueById);
issueRouter.delete('/issues/:issueId', issueController.deleteIssueById);

module.exports = issueRouter;