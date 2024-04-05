const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) =>{

        var user = await getUserByEmail(email)

        if(user.length == 0){
            return done(null, false, {message: "Error: User does not exist"})
        }
        
        try{

            if(await bcrypt.compare(password, user[0].password)){
                return done(null, user)
            }
            else{
                return done(null, false, {message: "Error: incorrect password"})
            }

        }
        catch(err)
        {
            return done(err)
        }

    }

    passport.use(new localStrategy({ username: 'mail' }, authenticateUser))

    passport.serializeUser((user, done) => done(null, user[0].id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
     })
}

module.exports = initialize; 