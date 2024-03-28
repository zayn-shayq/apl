const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 5001

app.use(express.json());

app.get('/predict', (req, res) => {
    // Adjust the Python command as necessary ('python' or 'python3')
    const pythonProcess = spawn('python', ['predict.py']);

    // Construct the input object with the correct keys as expected by the Python script
    const input = {
        "feature1": Number(req.query.f1),
        "feature2": Number(req.query.f2),
        "feature3": Number(req.query.f3),
        "feature4": Number(req.query.f4),
        "feature5": Number(req.query.f5),
        "feature6": Number(req.query.f6)
    };

    let stdoutData = '';
    let stderrData = '';

    // Sending JSON data to the Python script via stdin
    pythonProcess.stdin.write(JSON.stringify(input));
    pythonProcess.stdin.end();

    // Capturing stdout data (Python script output)
    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    // Capturing stderr data (Python script errors)
    pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    // Error handling for the spawn process
    pythonProcess.on('error', (err) => {
        console.error('Failed to start subprocess:', err);
    });

    // Handling script execution closure
    pythonProcess.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        if (code !== 0) {
            console.error(`stderr: ${stderrData}`);
            return res.status(500).send({error: 'Failed to get prediction', code, stdoutData, stderrData});
        }
        res.send(stdoutData);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);    
});
