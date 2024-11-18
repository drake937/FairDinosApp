const sequelize = require('./functions/connectors/sqlite-connector'); 
const User = require('./models/user'); 
const DinoInfo = require('./models/dinoInfo'); 

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); 
        console.log('Database synced!');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        process.exit(); 
    }
};

initializeDatabase();
