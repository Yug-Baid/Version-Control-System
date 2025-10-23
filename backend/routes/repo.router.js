const express = require('express');
const repoRouter = express.Router();
const repoController = require('../controllers/RepoController');

// Existing routes
repoRouter.post('/repo/create', repoController.createRepo);
repoRouter.get('/repo/all', repoController.getAllRepo);
repoRouter.get('/repo/:id', repoController.fetchRepoById);
repoRouter.get('/repo/name/:name', repoController.fetchRepoByName);
repoRouter.get('/repo/user/:userId', repoController.fetchRepoForCurrentUser);
repoRouter.put('/repo/update/:id', repoController.updateRepoById);
repoRouter.delete('/repo/delete/:id', repoController.deleteRepoById);
repoRouter.patch('/repo/toggle/:id', repoController.toggleVisibility);
repoRouter.get('/repo/content/:userId/:repoName', repoController.fetchRepoContent);
repoRouter.get('/repo/file/:userId/:repoName/:fileName', repoController.fetchRepoFileContent);


module.exports = repoRouter;