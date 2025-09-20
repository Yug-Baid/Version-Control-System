const express = require('express')
const repoRouter = express.Router()
const repoController = require('../controllers/RepoController')

repoRouter.post('/repo/create',repoController.createRepo)
repoRouter.get('/repo/all',repoController.getAllRepo)
repoRouter.get('/repo/:id',repoController.fetchRepoById)
repoRouter.get('/repo/:name',repoController.fetchRepoByName)
repoRouter.get('/repo/:userId',repoController.fetchRepoForCurrentUser)
repoRouter.put('/repo/update/:id',repoController.updateRepoById)
repoRouter.delete('/repo/delete/:id',repoController.deleteRepoById)
repoRouter.patch('/repo/toggle/:id',repoController.toggleVisibility)

module.exports = repoRouter