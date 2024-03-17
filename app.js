const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/predict', (req, res) => {
    // Adjust the Python command as necessary ('python3' or 'python')
    const pythonProcess = spawn('python3', ['predict.py']);

    // Example input - in a real scenario, you'd replace this with actual input, e.g., from req.body
    const input = {
        "feature1": 0,
        "feature2": 0,
        "feature3": 0,
        "feature4": 0,
        "feature5": 0,
        "feature6": 0
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
