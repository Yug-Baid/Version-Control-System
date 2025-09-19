const express = require('express')
const repoRouter = express.Router()
const repoController = require('../controllers/RepoController')

repoController.post('/repo/create',repoController.createRepo)
repoController.get('/repo/all',repoController.getAllRepo)
repoController.get('/repo/:id',repoController.fetchRepoById)
repoController.get('/repo/:name',repoController.fetchRepoByName)
repoController.get('/repo/:userId',repoController.fetchRepoForCurrentUser)
repoController.put('/repo/update/:id',repoController.updateRepoById)
repoController.delete('/repo/delete/:id',repoController.deleteRepoById)
repoController.patch('/repo/toggle/:id',repoController.toggleVisibility)

module.exports = repoRouter