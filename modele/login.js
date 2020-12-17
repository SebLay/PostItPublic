const {getUserRole} =require('./userDB');
const {getConnectionInfo} = require('./connectionInfo')
const {compareHash} =require('../utils/utils');

module.exports.getUserLog = async (pseudo, password, client) =>{
    const promises = [];
    const promisesUser = getConnectionInfo(pseudo, client);
    promises.push(promisesUser);
    const values = await Promise.all(promises);
    const userRow = values[0];
    if(userRow.rows[0]!== undefined && await compareHash(password, userRow.rows[0].passworduser)){
        const userId = userRow.rows[0].userid;
        const role = (await getUserRole(userId, client)).rows[0].userrole;
        if(role === "user"){
            return {userType:"user", value: userRow.rows[0]}
        }
        else if(role ==="admin"){
            return {userType:"admin", value : userRow.rows[0]}
        }
        else {
            return {userType:"inconnu", value: null};
        }
    }
    else{
        return {userType:"inconnu", value: null};
    }
}