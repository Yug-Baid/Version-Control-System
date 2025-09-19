const getAllUsers = (req,res)=>{
    res.send('All Users Fetched')
}

const signup = (req,res)=>{
    res.send('Sign Up')
}

const login = (req,res)=>{
    res.send('Login Success')
}

const getUserProfile = (req,res)=>{
    res.send('Enterd Repo')
}

const updateUserProfile = (req,res)=>{
    res.send('Update Success')
}

const deleteUserProfile = (req,res)=>{
    res.send('Deleted the profile')
}

module.exports = {
    getAllUsers,
    login,
    signup,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
}