const app = require('./app');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 5000;
app.use(bodyParser.json());

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
