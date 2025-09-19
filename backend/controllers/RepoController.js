const createRepo = (req,res)=>{
    res.send('Repo Created')
}

const getAllRepo = (req,res)=>{
    res.send('All Repo')
}

const fetchRepoById = (req,res)=>{
    res.send('Repo as per ID')
}

const fetchRepoByName = (req,res)=>{
    res.send('Repo By Name')
}

const fetchRepoForCurrentUser = (req,res)=>{
    res.send('Repo of current User')
}

const updateRepoById = (req,res)=>{
    res.send('Repo Updated')
}

const deleteRepoById = (req,res)=>{
    res.send('Repo Deleted')
}

const toggleVisibility = (req,res)=>{
    res.send('Repo Visibility Changed')
}

module.exports = {
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForCurrentUser,
    updateRepoById,
    deleteRepoById,
    toggleVisibility
}